import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import Webcam from "react-webcam";
import { TEACHABLE_COLOR_LIST } from 'constants/common';

const WebcamComponent = () => <Webcam />;

const webcamSize = 225;

const videoConstraints = {
    width: webcamSize,
    height: webcamSize,
    facingMode: "user"
};


const DeployWebcamUploaderComponent = (props) => {
    
    const { inferenceFile, inputType, setInferenceFile, setIsInferenceOpen, isDeloyWebcamAvailabel, setIsDeloyWebcamAvailabel } = props; 
    
    // // webcam
    useEffect(() => {
        const constraints = {
            'video': true,
        }
        if (window.navigator.mediaDevices && inputType == 'Webcam') {
            window.navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                setIsDeloyWebcamAvailabel(true);
            })
            .catch(error => {
                console.error('Error accessing media devices.', error);
            });
        }  
    }, [inputType]);

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
                inference_url: imageSrc
            }
            setInferenceFile(data);
            setIsInferenceOpen(true);
        },
        [inferenceFile]
    );

	return (
        <WebcamUploader>
            {
                isDeloyWebcamAvailabel
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

export default DeployWebcamUploaderComponent;

const WebcamUploader = styled.div`
    width: 100%;
    height: 340px;
`;

const ScreenArea = styled.div`
    width: 100%;
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const SaveArea = styled.div`
    width: 100%;
    height: 38px;
    display: flex;
    justify-content: center;
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
        cursor: pointer;

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


