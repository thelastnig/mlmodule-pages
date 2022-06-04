import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { useDropzone } from 'react-dropzone';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import LibraryMusicOutlinedIcon from '@material-ui/icons/LibraryMusicOutlined';
import useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const FileUploaderComponent = (props) => {
    
    const { taskSubType, list, detection_list, gapiAccessToken } = useHandleState();
    const { changeList, changeDetectionList } = useStateActionHandler();
    const { id, class_name, taskType, clickUploadOpen, showDataUploadAlert, hideDataUploadAlert } = props; 
    const [ googleAccessToken, setGoogleAccessToken ] = useState(null);

    const raw_list = taskSubType === 'classification' ? list : detection_list;

    // Google Drive
    useEffect(() => {
        const script = document.createElement("script"); 
        script.src = "https://apis.google.com/js/client.js";
        document.body.appendChild(script);
        script.addEventListener('load', function() {
            window.gapi.load('client', () => {
                window.gapi.client.init({
                    apiKey: process.env.REACT_APP_API_KEY,
                    clientId: process.env.REACT_APP_CLIENT_ID,
                    discoveryDocs: [process.env.REACT_APP_DISCOVERY_DOCS],
                    scope: process.env.REACT_APP_SCOPES,
                }).then(function () {
                    const accessToken = window.gapi.auth.getToken().access_token;
                    setGoogleAccessToken(accessToken);
                }, function(error) {
                    console.log(error);
                });
            });
        });
    }, []);
 
    // file upload
    const onDrop = useCallback((acceptedFiles, rejected, e, id, class_name) => {
        if (acceptedFiles) {
            showDataUploadAlert();
            uploadLocalFiles(acceptedFiles);
        }
    }, [raw_list])

    const uploadLocalFiles = async (acceptedFiles) => {
        const filePromises = acceptedFiles.map((item, index) => {
            return new Promise((resolve, reject) => {
                var reader = new FileReader();
                reader.readAsDataURL(item);
                reader.onloadend = () => {
                    try {
                        item['base64']= reader.result;
                        item['data_type'] = 'local';
                        item['annotation_fileupload'] = [];
                        item['annotation_tool'] = [];
                        item['annotation_type'] = 'tool';
                        resolve(item);
                    } catch (error) {
                        reject(error);
                    }
                }
                reader.onerror = (error) => {
                  reject(error);
                };
            })
        });
        const newFiles = await Promise.all(filePromises);
        uploadImageToRedux(newFiles);
        hideDataUploadAlert();
    }

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: (acceptedFiles, rejected, e) => onDrop(acceptedFiles, rejected, e, id, class_name)});


    // google Driver
    const [openPicker, data, authResponse] = useDrivePicker();  
    const handleOpenPicker = () => {
        openPicker({
            clientId: process.env.REACT_APP_CLIENT_ID,
            developerKey: process.env.REACT_APP_API_KEY,
            viewId: "DOCS_IMAGES",
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
        });
    };

    useEffect(() => {
        if (data) {
            showDataUploadAlert();
            downloadFiles(data.docs);
        }
    }, [data]);

    const uploadImageToRedux = (newFiles) => {
        const changed_list = raw_list.map((item) => {
            if (item.id === id) {
                const new_data = item.data.concat(newFiles);
                return {
                    ...item,
                    data: new_data
                };
            } else {
                return item;
            }
        })
        if (taskSubType === 'classification') {
            changeList({
                list: changed_list
            });
        } else {
            changeDetectionList({
                detection_list: changed_list
            });
        }
    };

    const downloadFiles = async (data) => {
        const newFiles = await Promise.all(
            data.map((file, index) => {
                const url = 'https://lh3.googleusercontent.com/d/' + file.id + '?access_token=' + googleAccessToken;
                return axios.get(url, {
                    responseType: 'arraybuffer'
                })
                .then(response => {
                    const b64encoded = btoa([].reduce.call(new Uint8Array(response.data),function(p,c){return p+String.fromCharCode(c)},''))
                    const mimetype="image/jpeg"
                    const newFile = {             
                        data_type: 'drive',
                        file_name: file.name,
                        file_id: file.id,
                        base64: "data:" + mimetype + ";base64," + b64encoded
                    };
                    return newFile;
                })
                .catch(error => {
                    console.log(error);
                });
            })
        );
        uploadImageToRedux(newFiles);
        hideDataUploadAlert();
    }

	return (
        <FileUploader>
            <InfoArea>
                <div className='infoText'>File</div>
                <CloseOutlinedIcon className='icon' onClick={() => clickUploadOpen(id, 'local')}/>
            </InfoArea>
            <DropZone>
                <div {...getRootProps()} className='uploadClickArea'>
                    <input name={props.id} {...getInputProps()}/>
                    {
                        taskType === 'image'
                        ?
                        <AddPhotoAlternateOutlinedIcon className='uploadIcon'/>
                        :
                        <LibraryMusicOutlinedIcon className='uploadIcon'/>
                    }
                    {
                        isDragActive 
                        ?
                            taskType === 'image'
                            ?
                            <div className='uploadInfoText'>Select or Drag &#38; Drop</div> 
                            :
                            <div className='uploadInfoText'>Select zip file or Drag &#38; Drop</div> 
                        :
                            taskType === 'image'
                            ?
                            <div className='uploadInfoText'>Select or Drag &#38; Drop</div> 
                            :
                            <div className='uploadInfoText'>Select zip file or Drag &#38; Drop</div> 
                    }
                </div>
            </DropZone>
            <GoogleDriveZone>
                <div className='uploadClickArea' onClick={() => handleOpenPicker()}>
                    <BackupOutlinedIcon className='uploadIcon'/>
                    <div className='uploadInfoText'>
                        {
                            taskType === 'image'
                            ?
                            <p>Google Drive</p>
                            :
                            <p>Google Drive</p>
                        }
                    </div> 
                </div>    
            </GoogleDriveZone>
        </FileUploader>
	);
};

export default FileUploaderComponent;

const FileUploader = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .icon {
        font-size: 24px;
        color: white;
    }
`;

const InfoArea = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .infoText {
        font-size: 12px;
        font-weight: 600;
        color: white;
    }
`;

const DropZone = styled.div`
    width: 100%;
    height: 170px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    &:hover {
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
    }

    .uploadClickArea {
        width: 100%;
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .uploadInfoText {
        margin-top: 5px;
        font-size: 12px;
        color: white;
    }

    .uploadIcon {
        font-size: 30px;
        color: #1967D2;
    }
`;

const GoogleDriveZone = styled.div`
    width: 100%;
    height: 170px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    &:hover {
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
    }

    .uploadClickArea {
        width: 100%;
        height: 100%;
        padding: 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .uploadInfoText {
        margin-top: 5px;
        font-size: 12px;
        color: white;
    }

    .uploadIcon {
        font-size: 30px;
        color: #1967D2;
    }
;`


