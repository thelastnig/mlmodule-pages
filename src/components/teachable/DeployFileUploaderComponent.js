import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import AddPhotoAlternateOutlinedIcon from '@material-ui/icons/AddPhotoAlternateOutlined';
import BackupOutlinedIcon from '@material-ui/icons/BackupOutlined';
import useDrivePicker from 'react-google-drive-picker';
import axios from 'axios';
import { useHandleState } from 'store/teachable/hooks';


const DeployFileUploaderComponent = (props) => {
    
    const { setInferenceFile, setIsInferenceOpen } = props;
    const [ googleAccessToken, setGoogleAccessToken ] = useState(null);

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
    const onDrop = useCallback((acceptedFiles, rejected, e) => {
        if (acceptedFiles) {
            const acceptedFile = acceptedFiles[0];
            const url = URL.createObjectURL(acceptedFile);
            acceptedFile['inference_url'] = url;
            acceptedFile['data_type'] = 'local';
            setInferenceFile(acceptedFile);
            setIsInferenceOpen(true);
        }
    }, [])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop: (acceptedFiles, rejected, e) => onDrop(acceptedFiles, rejected, e), multiple: false});


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
            multiselect: false,
        });
    };

    useEffect(() => {
        if (data) {
            const driveDataFile = data.docs[0];
            downloadFile(driveDataFile);
        }
    }, [data]);

    const downloadFile = (file) => {
        const url = 'https://lh3.googleusercontent.com/d/' + file.id + '?access_token=' + googleAccessToken;

        axios.get(url, {
            responseType: 'arraybuffer'
        })
        .then(response => {
            try { 
                const b64encoded = btoa([].reduce.call(new Uint8Array(response.data),function(p,c){return p+String.fromCharCode(c)},''))
                const mimetype="image/jpeg"
                const newFile = {             
                    data_type: 'drive',
                    file_name: file.name,
                    file_id: file.id,
                    inference_url: "data:" + mimetype + ";base64," + b64encoded
                };
                setInferenceFile(newFile);
                setIsInferenceOpen(true);
            } catch(e) {
                console.log(e);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

	return (
        <FileUploader>
            <DropZone>
                <div {...getRootProps()} className='uploadClickArea'>
                    <input name={props.id} {...getInputProps()}/>
                    <AddPhotoAlternateOutlinedIcon className='uploadIcon'/>
                    {
                        isDragActive 
                        ?
                        <div className='uploadInfoText'>파일에서 이미지를 선택하거나 여기로 드래그 앤 드롭하세요.</div> 
                        :
                        <div className='uploadInfoText'>파일에서 이미지를 선택하거나 여기로 드래그 앤 드롭하세요.</div> 
                    }
                </div>
            </DropZone>
            <GoogleDriveZone>
                <div className='uploadClickArea' onClick={() => handleOpenPicker()}>
                    <BackupOutlinedIcon className='uploadIcon'/>
                    <div className='uploadInfoText'>Google Drive에서 이미지 가져오기</div> 
                </div>    
            </GoogleDriveZone>
        </FileUploader>
	);
};

export default DeployFileUploaderComponent;

const FileUploader = styled.div`
    width: 100%;
    height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .icon {
        font-size: 26px;
        color: #1967D2;

        :hover {
            color: #185ABC;
        }
    }
`;


const DropZone = styled.div`
    width: 90%;
    height: 120px;
    margin-bottom: 30px;
    background: #D2E3FC;
    border-radius: 5px;
    &:hover {
        background: #AECBFA;
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
        font-weight: 600;
        color: #1967D2;
    }

    .uploadIcon {
        font-size: 30px;
        color: #1967D2;
    }
`;

const GoogleDriveZone = styled.div`
    width: 90%;
    height: 120px;
    background: #D2E3FC;
    border-radius: 5px;
    &:hover {
        background: #AECBFA;
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
        font-weight: 600;
        color: #1967D2;
    }

    .uploadIcon {
        font-size: 30px;
        color: #1967D2;
    }
;`


