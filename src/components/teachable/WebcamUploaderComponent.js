import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Webcam from "react-webcam";
import { TEACHABLE_COLOR_LIST } from 'constants/common';

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
                        <div className='saveButton' onClick={capture}>Record</div>
                        <SettingsOutlinedIcon className='icon'/>
                    </SaveArea>
                </>
                :
                <ErrorMessageArea>
                    <div className='message'>
                        An error occurres. Please check your device.
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
        background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        border-radius: 2px;
        color: white;
        font-size: 12px;
        font-weight: 600;
        text-align: center;

        :hover {
            background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
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
        color: white;
    }
`;


