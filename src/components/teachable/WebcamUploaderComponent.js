import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Webcam from "react-webcam";

const WebcamComponent = () => <Webcam />;

const webcamSize = 270;

const videoConstraints = {
    width: webcamSize,
    height: webcamSize,
    facingMode: "user"
};


const WebcamUploaderComponent = (props) => {
    
    const { list } = useHandleState();
    const { uploadImage } = useStateActionHandler();
    const { id, isWebcamAvailable, isUploadOpen, clickUploadOpen, setWebcamAvailable } = props;

    const handleClick = (id, type) => {
        clickUploadOpen(id, type, false, false);
    }
    
    // webcam
    // const [devices, setDevices] = useState([]);

    // const handleDevices = useCallback(
    //     mediaDevices =>
    //         setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    //     [setDevices]
    // );
    
    // useEffect(
    //         () => {
    //             navigator.mediaDevices.enumerateDevices().then(handleDevices);
    //         },
    //     [handleDevices]
    // );

    useEffect(() => {
        const constraints = {
            'video': true,
        }
        if (window.navigator.mediaDevices) {
            window.navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                setWebcamAvailable(id, true);
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
        }  
            // console.log('here---------------')
            // console.log(window.navigator.mediaDevices)
            // console.log(window.navigator.mediaDevices.getUserMedia)
            // if (!window.navigator.mediaDevices || !window.navigator.mediaDevices.getUserMedia) {
            //     // return Promise.reject('Your browser does not support WebRTC. Please try another one.');
            //     setWebcamAvailable(id, false);
            // } 
        // } 
    }, [isUploadOpen]);

    const webcamRef = useRef(null);

    const capture = useCallback(
        () => {
            const imageSrc = webcamRef.current.getScreenshot();
            const timestamp = new Date().getTime();
            const fileName = String(timestamp) + '.jpg';
            const data = {
                data_type: 'webcam',
                file_id: String(timestamp),
                file_name: fileName,
                base64: imageSrc
            }
            const changedList = list.map((item) => {
                if (item.id === id) {
                    const new_data = item.data.concat([data]);
                    return {
                        ...item,
                        data: new_data
                    };
                } else {
                    return item;
                }
            })
            uploadImage({
                list: changedList
            });
        },
        [webcamRef, list]
    );

	return (
        <WebcamUploader>
            <InfoArea>
                <div className='infoText'>Webcam</div>
                <CloseOutlinedIcon className='icon' onClick={() => handleClick(id, 'local')}/>
            </InfoArea>
            {
                // devices.length !== 0
                isWebcamAvailable
                ?
                <>
                    <ScreenArea>
                        <Webcam
                            audio={false}
                            height={webcamSize}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            width={webcamSize}
                            videoConstraints={videoConstraints}
                        />
                    </ScreenArea>
                    <SaveArea>
                        <div className='saveButton' onClick={capture}>녹화하기</div>
                        <SettingsOutlinedIcon className='icon'/>
                    </SaveArea>
                </>
                :
                <ErrorMessageArea>
                    <div className='message'>
                        웹캠을 여는 중에 오류가 발생했습니다. 웹캠을 연결했는지 또는 이미지 업로드로 전환했는지 확인하세요.
                    </div>
                </ErrorMessageArea>
            }
        </WebcamUploader>
	);
};

export default WebcamUploaderComponent;

const WebcamUploader = styled.div`
    width: 100%;
    height: 100%;

    .icon {
        font-size: 26px;
        color: #1967D2;

        :hover {
            color: #185ABC;
        }
    }
`;

const InfoArea = styled.div`
    width: 100%;
    height: 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .infoText {
        font-size: 14px;
        font-weight: 600;
        color: #1967D2;
    }
`;

const ScreenArea = styled.div`
    width: 100%;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 10px;
`;

const SaveArea = styled.div`
    width: 100%;
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .saveButton {
        width: 200px;
        padding: 8px 0px;
        background: #1967D2;
        border-radius: 5px;
        color: white;
        text-align: center;

        :hover {
            background: #185ABC;
        }
    }
`;

const ErrorMessageArea = styled.div`
    width: 100%;
    margin-top: 15px;
    height: calc(100% - 25px);
    display: flex;
    justify-content: center;
    align-items: center;

    .message {
        font-size: 12px;
        font-weight: 600;
        color: #1967D2;
    }
`;


