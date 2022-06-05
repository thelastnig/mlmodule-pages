import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
// sound visualization
import Spectrogram from 'spectrogram';
import chroma from 'chroma-js';
import FileSaver from 'file-saver';
import JSZip from "jszip";

// audio file split
import  { AviatoAudio }  from  'aviatojs';


const DeployAudioRecorderComponent = (props) => {
    const { list } = useHandleState();
    const { transferRecognizer, setIsInferenceOpen, setInferenceResult } = props;

    // Audio Recorder
    const [ isAudioAvailable, setIsAudioAvailable ] = useState(false);
    const [ audioURL, setAudioURL ] = useState("");
    const [ isRecording, setIsRecording ] = useState(false);
    const [ recorder, setRecorder ] = useState(null);
    const [ spectro, setSpectro ] = useState(null);

    const handleClick = (id, type) => {
        setIsRecording(false);
        if (recorder !== null) {
            if (recorder.state === 'recording') {
                recorder.stop();
            }
            recorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    useEffect(() => {
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
                //   var baseColors = [[0, 1, 55, 1], [2, 5, 90, 1], [2, 25, 139, 1], [37, 61, 161, 1], [176, 219, 241, 1]]; 
                  var baseColors = [[1, 0, 5, 1], [79, 17, 123, 1], [179, 54, 122, 1], [251, 134, 96, 1], [247, 242, 181, 1]]; 

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
    }, [recorder, isRecording, isAudioAvailable]);

    const startRecording = () => {
        if (transferRecognizer === null) {
            console.log("no trained model!!!");
            return;
        }
        setIsRecording(true);
        setIsInferenceOpen(true);
        console.log(transferRecognizer.wordLabels());
        // `listen()` takes two arguments:
        // 1. A callback function that is invoked anytime a word is recognized.
        // 2. A configuration object with adjustable fields such a
        //    - includeSpectrogram
        //    - probabilityThreshold
        //    - includeEmbedding
        transferRecognizer.listen(result => {
            if (result !== null && result.hasOwnProperty('scores')) {
                const scores = result['scores'];
                let inferenceResult = []; 
                scores.map((item, index) => {
                    const resultItem = {
                        'probability': item,
                        'className': list[index].class_name
                    }
                    inferenceResult.push(resultItem);
                });
                setInferenceResult(inferenceResult);    
            }
        }, {
          includeSpectrogram: true,
          probabilityThreshold: 0.50
        });
    }

    const stopRecording = () => {
        setIsRecording(false);
        setIsInferenceOpen(false);
        if (transferRecognizer === null) {
            console.log("no trained model!!!");
            return;
        }
        transferRecognizer.stopListening();
    };

    async function requestRecorder() {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        return new MediaRecorder(stream);
    }

    const clickDownload = () => {
        // const SAVED_MODEL_METADATA_KEY = 'tfjs-speech-commands-saved-model-metadata';
        // const SAVE_PATH_PREFIX = 'indexeddb://tfjs-speech-commands-model/';
        // // const SAVE_PATH_PREFIX = 'localstorage://tfjs-speech-commands-model';
        // const metadataMapStr  = localStorage.getItem(SAVED_MODEL_METADATA_KEY);
        // const metadata = JSON.parse(metadataMapStr);
        // console.log(metadata)
        // transferRecognizer.save(SAVE_PATH_PREFIX)
        // .then(result => {
        //     const request = window.indexedDB.open("tensorflowjs", 1);
        //     request.onerror = function(event) {
        //         console.log("cannot access to indexeddb");
        //     };
        //     request.onsuccess = function(event) {
        //         const db = request.result;
        //         db.transaction("models_store").objectStore("models_store").get("tfjs-speech-commands-model/sound").onsuccess = event => {
        //             const modelResult = event.target.result;
        //             const modelArtifacts = modelResult["modelArtifacts"];
        //             let zip = new JSZip();      
        //             const modelInfo = {
        //                 'modelTopology': modelArtifacts["modelTopology"],
        //                 'weightsManifest': [{
        //                     'paths': [
        //                        'weights.bin'
        //                     ],
        //                     'weights': modelArtifacts["weightSpecs"]
        //                 }]
        //             };
        //             zip.file('model.json', JSON.stringify(modelInfo));
        //             zip.file('metadata.json', JSON.stringify(metadata['sound']));
        //             zip.file('weights.bin', modelArtifacts["weightData"], {binary: true}); 
        //             zip.generateAsync({type: 'blob'})
        //             .then(content => {
        //                 FileSaver.saveAs(content, 'model.zip');           
        //             });    
        //         };
        //     }
        // })
        transferRecognizer.save('downloads://my-sound-model');

    }

	return (
        <MediaUploader>
            <InfoArea>
                <div className='infoText'>Mike</div>
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
                    <SaveArea isRecording={isRecording}>
                        {
                        isRecording
                        ?
                        <div className='saveButton' onClick={stopRecording}>Recording...</div>
                        :
                        <div className='saveButton' onClick={startRecording}>Record</div>
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

export default DeployAudioRecorderComponent;

const MediaUploader = styled.div`
    width: 100%;
    height: 100%;

    .icon {
        font-size: 26px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
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
    height: 75px;
    margin-top: 15px;
    margin-bottom: 70px;
    overflow-x: hidden;
    overflow-y: hidden;
    display: flex;
    flex-direction: row-reverse;

    .canvasWrapper {
        background: #000137;
        width: 1160px;
        height: 58px;
    }
    .soundCanvas {
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
        background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        color: white;
        text-align: center;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;

        ${props => props.isRecording && `
            border: 2px solid black;
        `}

        :hover {
            background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
        }

        &.ing {
            cursor: default;
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


