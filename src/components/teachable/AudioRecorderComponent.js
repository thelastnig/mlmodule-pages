import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
// sound visualization
import Spectrogram from 'spectrogram';
import chroma from 'chroma-js';

// audio file split
import  { AviatoAudio }  from  'aviatojs';

const RECORDTIME = 20500;

const useInterval = (callback, delay) => {
    const savedCallback = useRef(); // 최근에 들어온 callback을 저장할 ref를 하나 만든다.
  
    useEffect(() => {
        savedCallback.current = callback; // callback이 바뀔 때마다 ref를 업데이트 해준다.
    }, [callback]);
  
    useEffect(() => {
        function tick() {
            savedCallback.current(); // tick이 실행되면 callback 함수를 실행시킨다.
      }
      if (delay !== null) { // 만약 delay가 null이 아니라면 
            let id = setInterval(tick, delay); // delay에 맞추어 interval을 새로 실행시킨다.
            return () => clearInterval(id); // unmount될 때 clearInterval을 해준다.
      }
    }, [delay]); // delay가 바뀔 때마다 새로 실행된다.
}

const AudioRecorderComponent = (props) => {
    const { list } = useHandleState();
    const { changeList } = useStateActionHandler();
    const { id, isUploadOpen, clickUploadOpen, setAudioAvailable, transferRecognizer } = props;

    // Audio Recorder
    const [ isAudioAvailable, setIsAudioAvailable ] = useState(false);
    const [ audioURL, setAudioURL ] = useState("");
    const [ isRecording, setIsRecording ] = useState(false);
    const [ recorder, setRecorder ] = useState(null);
    const [ spectro, setSpectro ] = useState(null);
    const [ timePassed, setTimePassed ] = useState(0);
    const [ recordStartTimeStamp, setRecordStartTimeStamp ] = useState(null);

    const handleClick = (id, type) => {
        setIsRecording(false);
        if (recorder !== null) {
            if (recorder.state === 'recording') {
                recorder.stop();
            }
            recorder.stream.getTracks().forEach(track => track.stop());
        }
        clickUploadOpen(id, type, false, false);
    }

    useEffect(() => {
        // Lazily obtain recorder first time we're recording.
        if (isUploadOpen) {
            const constraints = {
            'audio': true,
            };
            if (window.navigator.mediaDevices) {
                window.navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    setIsAudioAvailable(true);
                })
                .catch(error => {
                    console.error('Error accessing media devices.', error);
                });
            }  
        }
        
        if (recorder === null) {
            if (isRecording) {
                requestRecorder().then(setRecorder, console.error);
            }
            return;
        } 

        // Manage recorder state.
        if (isRecording) {
            recorder.start();
            let initSpectro = Spectrogram(document.getElementById('canvas'), {
                audio: {
                  enable: false
                },
                colors: function(steps) {
                  var baseColors = [[0, 1, 55, 1], [2, 5, 90, 1], [2, 25, 139, 1], [37, 61, 161, 1], [176, 219, 241, 1]]; 

                  var positions = [0, 0.15, 0.30, 0.50, 0.75];
               
                  var scale = new chroma.scale(baseColors, positions)
                  .domain([0, steps]);
               
                  var colors = [];
               
                  for (var i = 0; i < steps; ++i) {
                    var color = scale(i);
                    colors.push(color.hex());
                  }
               
                  return colors;
                }
              });
            let audioContext = new AudioContext();
            let input = audioContext.createMediaStreamSource(recorder.stream);
            let analyser = audioContext.createAnalyser();
            
            analyser.smoothingTimeConstant = 0;
            analyser.fftSize = 2048;

            input.connect(analyser);
            initSpectro.connectSource(analyser, audioContext);
            setSpectro(initSpectro);
            initSpectro.start();
            
        } else {
            if (recorder.state !== 'inactive') {
                recorder.stop();
                if (spectro !== null) {
                    spectro.pause();
                    spectro.stop();        
                }
            }
        }

        // Obtain the audio when ready.
        const handleData = e => {
            setAudioURL(URL.createObjectURL(e.data));
        };

        recorder.addEventListener("dataavailable", handleData);
        return () => recorder.removeEventListener("dataavailable", handleData);
    }, [isUploadOpen, recorder, isRecording, isAudioAvailable]);

    const startRecording = () => {
        setIsRecording(true);
        setRecordStartTimeStamp(new Date());
        setTimeout(async () => {
            setTimePassed(0);
            setIsRecording(false);
            try {
                await transferRecognizer.collectExample(id);
            } catch (error) {
                console.log(error);
            }
        }, RECORDTIME);
    };

    const stopRecording = () => {
        const endDate = new Date();
        const elapsedMSec = (endDate.getTime() - recordStartTimeStamp.getTime()) / 1000;
        const waitTime = parseFloat(Math.ceil(elapsedMSec)) - elapsedMSec;
        if (waitTime != 0) {
            setTimeout(() => {
                setIsRecording(false);
                setTimePassed(0);
            }, Math.ceil((waitTime + 0.1) * 1000));
        } else {
            setIsRecording(false);
            setTimePassed(0);
        }
    };

    const extractSamples = () => {
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        let image = new Image();
        image.id = "pic";
        image.src = canvas.toDataURL();
        cropImageAndAudio(image, audioURL, 20);

        const audio1  =  new  AviatoAudio((document.getElementById('audio1')));
        console.log(audio1);
    };

    async function requestRecorder() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return new MediaRecorder(stream);
    }

    const recordingInterval = useInterval(() => {
        setTimePassed(timePassed + 1);
    }, isRecording ? 1000 : null);

    const cropImageAndAudio = (image, audioURL, arrayNum) => {
        image.onload = () => {
            let arr = [];
            for (let i = 0; i < arrayNum; i++) {
                arr.push(i);
            }
            let newFiles = [];
            arr.map((itemIndex) => {
                // Clip Image
                const canvas = document.createElement('canvas');
                canvas.width = 58;
                canvas.height = 58;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 58 * itemIndex, 0, 58, 58, 0, 0, 58, 58);
                canvas.toDataURL();
                const timestamp = new Date().getTime();
                const fileName = String(timestamp) + '.jpg';
                // Clip Audio
                const URLSuffix = '#t=' + String(itemIndex) + ',' +  String(itemIndex + 1);
                const newFile = {             
                    data_type: 'recorder',
                    file_name: fileName,
                    file_id: timestamp,
                    base64: canvas.toDataURL(),
                    audioURL: audioURL + URLSuffix
                };
                newFiles.push(newFile);
                uploadImageToRedux(newFiles);
            });
        }
    }

    const uploadImageToRedux = (newFiles) => {
        const changedList = list.map((item) => {
            if (item.id === id) {
                const new_data = item.data.concat(newFiles);
                return {
                    ...item,
                    audioFullData: audioURL, 
                    data: new_data
                };
            } else {
                return item;
            }
        })
        changeList({
            list: changedList
        });
    };

	return (
        <MediaUploader>
            <InfoArea>
                <div className='infoText'>마이크</div>
                <CloseOutlinedIcon className='icon' onClick={() => handleClick(id, 'local')}/>
            </InfoArea>
            {
                isAudioAvailable
                ?
                <>
                    <ScreenArea>
                        {/* <div className='screenWrapper'> */}
                            <div className='canvasWrapper'>
                                <canvas id="canvas" className='soundCanvas' width="1160" height="58"></canvas>
                            </div>
                        {/* </div> */}
                    </ScreenArea>
                    <PlayArea>
                        {
                            !isRecording && audioURL
                            ?
                            <>
                            <div className='playDevice'>
                                <audio src={audioURL} controls controlsList='nodownload' id='audio1' />              
                            </div>
                            <div className='extractButton' onClick={extractSamples}>샘플 추출</div>
                            <div id='result'></div>
                            </>
                            :
                            null
                        }
                    </PlayArea>
                    <SaveArea isRecording={isRecording}>
                        {
                        isRecording
                        ?
                        <div className='saveButton' onClick={stopRecording}>{String(timePassed)}초 녹음 중...</div>
                        :
                        <div className='saveButton' onClick={startRecording}>20초 녹화하기</div>
                        }
                        <SettingsOutlinedIcon className='icon'/>
                    </SaveArea>
                </>
                :
                <ErrorMessageArea>
                    <div className='message'>
                        마이크 연결 중 오류가 발생했습니다. 마이크가 제대로 연결되어 있는지 확인하세요.
                    </div>
                </ErrorMessageArea>
            }
        </MediaUploader>
	);
};

export default AudioRecorderComponent;

const MediaUploader = styled.div`
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
    height: 75px;
    margin-top: 15px;
    margin-bottom: 15px;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    flex-direction: row-reverse;

    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #AECBFA;
        border-radius: 5px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: ${TEACHABLE_COLOR_LIST.MIDDLE_LIGHT_MAIN_COLOR};
        border-radius: 3px;
    }

    .canvasWrapper {
        background: #000137;
        width: 1160px;
        height: 58px;
    }
    .soundCanvas {
    }
`;

const PlayArea = styled.div`
    width: 100%;
    height: 78px;
    margin-bottom: 120px;
    display: flex;
    flex-direction column;
    align-items: flex-end;
    justify-content: space-between;

    .extractButton {
        width: 130px;
        padding: 8px 0px;
        background: ${TEACHABLE_COLOR_LIST.MIDDLE_LIGHT_MAIN_COLOR};
        border-radius: 5px;
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        text-align: center;

        :hover {
            background: ${TEACHABLE_COLOR_LIST.MIDDLE_MAIN_COLOR};
        }
    }

    .playDevice {
        width: 100%;

        audio {
            width: 100%;
            height: 30px;
        }
    }
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
        background: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        border-radius: 5px;
        color: white;
        text-align: center;

        ${props => props.isRecording && `
            border: 2px solid black;
        `}

        :hover {
            background: ${TEACHABLE_COLOR_LIST.HEAVY_STRONG_MAIN_COLOR};
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


