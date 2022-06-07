import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import agent from 'lib/apis';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { useAlertAction } from 'store/alert/hooks';
import LinearProgress from '@material-ui/core/LinearProgress';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import RestoreOutlinedIcon from '@material-ui/icons/RestoreOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import UpdateIcon from '@material-ui/icons/Update';
import TeachableSelect from './TeachableSelect';
import { TeachableMobileNet, createTeachable } from 'tf';
import { cropTo } from "tf/utils/canvas";
import { capture } from 'tf/utils/tf';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import * as tf from '@tensorflow/tfjs';

const batchSize = [4, 8, 16, 32, 64];
const learningRate = [0.01, 0.001, 0.0001];
const imageSize = 224

function wait(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Done waiting");
        resolve(ms)
      }, ms )
    })
  }  

const TrainComponent = (props) => {
    const { 
        taskType,
        taskSubType,
        params, 
        list, 
        detection_list,
        isWorking,
        isDataloading,
        isTraining,
        isTrained,
        isDataStepDone,
        isAnnotationStepDone,
    } = useHandleState();
    const { changeParams,
        initParams, 
        addModel, 
        addMetadata,
        addHistory, 
        changeWorking,
        changeDataloading,
        changeTraining,
        stopTrain,
        addAnnotationData,
    } = useStateActionHandler();
    const { showAlert } = useAlertAction();
    const [ isSettingOpen, setIsSettingOpen ] = useState(true);
    const [ model, setModel ] = useState(null);
    const [ count, setCount ] = useState(0);
    const { transferRecognizer, setTransferRecognizer, clickUploadOpen } = props;

    const handleChange = (e) => {
        let value = 0
        if (e.target.name === 'epochs') {
            if (isNaN(e.target.value)) {
                alert('숫자만 입력가능합니다');
                return;
            }
            value = (e.target.value === null || e.target.value === "") ? "" : parseInt(e.target.value);

        } else {
            value = e.target.value;
        }

        const changed_params = {
            ...params,
            [e.target.name]: value
        };
        changeParams({
            params: changed_params
        });
    };

    const onSetStopTrainClicked = () => {
        if (model === null) {
            return;
        }
        model.stopTraining();
        model.dispose();
        setModel(null);
        stopTrain();
    }

    const imageTrain = () => {
        const labels = list.map(item => item.class_name);
        
        const metadata = {
            tfjsVersion: '',
            tmVersion: '',
            packageVersion: '',
            packageName: '',
            modelName: '',
            timeStamp: '',
            labels: labels,
            userMetadata: {},
            grayscale: false,
            imageSize: 0
        }
        const cloneMetadata = JSON.parse(JSON.stringify(metadata));
        addMetadata({metadata: cloneMetadata});
        const modelOptions = {
            version: 2,
            checkpointUrl: '',
            alpha: 0.35,
            trainingLayer: '',
        }

        createTeachable(metadata, modelOptions, setCount)
            .then(model => {
                setModel(model);
                model.prepareDataset();
                // add data
                changeDataloading({isDataloading: true});
                console.log('INFO: data add---------------');
                list.map((item, index) => {
                    item.data.map((image) => {
                        const imageUrl = image.base64; 
                        let tempImage = new Image();
                        tempImage.src = imageUrl;
                        const croppedImage = cropTo(tempImage, imageSize, false);
                        const captured = capture(croppedImage, metadata.grayscale);
                        model.addExample(index, captured);
                    });
                });
                changeDataloading({isDataloading: false});

                // start train
                changeTraining({isTraining: true});
                console.log('INFO: start train---------------');
                model.train({   
                    denseUnits: 100,
                    epochs: params.epochs,
                    learningRate: params.learning_rate,
                    batchSize: params.batch_size,
                }).then(data => {
                    console.log(data.history);
                    addModel({model: model});
                    addHistory({history: data.history});
                    changeTraining({isTraining: false, isTrained: true});
                  console.log(window.performance.memory)
                  console.log(navigator.hardwareConcurrency)
                })
                .catch(error => {
                    console.log(error);
                    changeTraining({isTraining: false, isTrained: false});
                })
                .finally(() => {
                    changeWorking({isWorking: false});
                    setCount(0);
                    props.setIsAlertTrainingOpen(false);
                })
            })
            .catch(error => {
                console.log(error);
                changeWorking({isWorking: false});
                setCount(0);
            });
    }

    const soundTrain = async () => {
        console.log('sound train start!')
        if (transferRecognizer === null) {
            console.log('no base model!!');
            return;
        }
        try {
            changeTraining({isTraining: true});
            await transferRecognizer.train({
              epochs: params.epochs,
            //   batchSize: 64,
            //   validationSplit: 0.2,
              callback: {
                onEpochEnd: async (epoch, logs) => {
                  console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
                  setCount(epoch);
                }
              }
            }).then(data => {
                addHistory({history: data});
                setTransferRecognizer(transferRecognizer);
                changeTraining({isTraining: false, isTrained: true});
            })
        } catch (error) {
            console.log(error);
            changeTraining({isTraining: false, isTrained: false});
        } finally {
            changeWorking({isWorking: false});
            setCount(0);
            props.setIsAlertTrainingOpen(false);
            list.map((item) => {
                clickUploadOpen(item.id, 'local', false, false);
            });
        }
    }

    const detectionTrain = async () => {
        console.log('detection train start!');
        changeDataloading({isDataloading: true});
        await wait(7000);

        let annotations = {};
        const dectection_data = detection_list[0].data;
        dectection_data.forEach(item => {
            item.annotation_fileupload.forEach(annotation => {
                if (!annotations.hasOwnProperty(annotation.comment)) {
                    annotations[annotation.comment] = 1;
                } else {
                    annotations[annotation.comment] = annotations[annotation.comment] + 1;
                }
            })
            item.annotation_tool.forEach(annotation => {
                if (!annotations.hasOwnProperty(annotation.comment)) {
                    annotations[annotation.comment] = 1;
                } else {
                    annotations[annotation.comment] = annotations[annotation.comment] + 1;
                }
            })
        });
        addAnnotationData({
            annotationData: annotations
        });
        changeDataloading({isDataloading: false});
        changeTraining({isTraining: true});            
        for (let i = 0; i < params.epochs; i ++) {
            await wait(300);
            setCount(i);
        }

        makeDetectionHistory();
        changeTraining({isTraining: false, isTrained: true});
        changeWorking({isWorking: false});
        setCount(0);
        props.setIsAlertTrainingOpen(false);
    }

    // temp method for detection history
    const makeDetectionHistory = () => {
        let historyData = {};
        let history = {};
        let trainMAP = [];
        let valMAP = [];
        let trainLoss = [];
        let valLoss = [];
        let epoch = [];   
        const mAPLimits = params.epochs > 50 ? [10, 9] : params.epochs < 50 ? [9, 8.5] : [9.5, 9];
        const finalTempTrainMAP = ((Math.random () * (mAPLimits[0] - mAPLimits[1])) + mAPLimits[1]) / 10;
        const finalTrainMAP = Number(finalTempTrainMAP.toFixed(2))
        const finalValMAP = params.epochs > 50 ? finalTrainMAP - 0.02 : params.epochs < 50 ? finalTrainMAP - 0.06 : finalTrainMAP - 0.04;
        const finalTrainLoss = params.epochs > 50 ? 0.02 : params.epochs < 50 ? 0.05 : 0.03;
        const finalValLoss = params.epochs > 50 ? finalTrainLoss + 0.15 : params.epochs < 50 ? finalTrainLoss + 0.19 : finalTrainLoss + 0.17;

        let tempTrainMAP = finalTrainMAP;
        let tempValMAP = finalValMAP;
        let tempTrainLoss = finalTrainLoss;
        let tempValLoss = finalValLoss;
        for (let i = 0; i < params.epochs - 1; i ++) {
            const trainMAPDiffLimits = i < 5 ? [0.5, 0.1] : 5 <= i < params.epochs - 5 ? [1.0, 0.5] : [15, 10];
            const trainLossDiffLimits = i < 5 ? [2.0, 1.0] : 5 <= i < params.epochs - 5 ? [4.0, 2.0] : [50, 30];
            const valMAPDiffLimits = i < 5 ? [0.5, 0.1] : 5 <= i < params.epochs - 5 ? [1.2, 0.5] : [15, 10];
            const valLossDiffLimits = i < 5 ? [2.0, 1.0] : 5 <= i < params.epochs - 5 ? [4.0, 2.0] : [55, 25];
            epoch.push(i);
            const randomTrainMAPDiff = ((Math.random () * (trainMAPDiffLimits[0] - trainMAPDiffLimits[1])) + trainMAPDiffLimits[1]) / 100; 
            const randomTrainLossDiff = ((Math.random () * (trainLossDiffLimits[0] - trainLossDiffLimits[1])) + trainLossDiffLimits[1]) / 100; 
            const randomValMAPDiff = ((Math.random () * (valMAPDiffLimits[0] - valMAPDiffLimits[1])) + valMAPDiffLimits[1]) / 100; 
            const randomValLossDiff = ((Math.random () * (valLossDiffLimits[0] - valLossDiffLimits[1])) + valLossDiffLimits[1]) / 100; 
            if (i === 0) {
                trainMAP.push(tempTrainMAP);
                valMAP.push(tempValMAP);
                trainLoss.push(tempTrainLoss);
                valLoss.push(tempValLoss);    
            } else {
                trainMAP.push(tempTrainMAP - randomTrainMAPDiff);
                valMAP.push(tempValMAP - randomValMAPDiff);
                trainLoss.push(tempTrainLoss + randomTrainLossDiff);
                valLoss.push(tempValLoss + randomValLossDiff);
                tempTrainMAP = tempTrainMAP - randomTrainMAPDiff;
                tempValMAP = tempValMAP - randomValMAPDiff;
                tempTrainLoss = tempTrainLoss + randomTrainLossDiff;
                tempValLoss = tempValLoss + randomValLossDiff;
            }        
        }

        history['epoch'] = epoch;
        historyData['map'] = trainMAP.reverse();
        historyData['val_map'] = valMAP.reverse();
        historyData['loss'] = trainLoss.reverse();
        historyData['val_loss'] = valLoss.reverse();
        history['history'] = historyData;
        console.log(history)
        addHistory({history: history});
    }

    const onSetTrainClicked = (e) => {
        const limitNum = taskType === 'image' ? taskType === 'classification' ? 10 : 20 : 20;

        if (taskSubType === 'classification') {
            if (!isDataStepDone) {
                props.setIsAlertDataOpen(true);
                return;
            }
        } else {
            if (!isDataStepDone) {
                props.setIsAlertDataOpen(true);
                return;
            }
            if (!isAnnotationStepDone) {
                props.setIsAlertDataOpen(true);
                return;
            }
        }

        changeWorking({isWorking: true});
        props.setIsAlertTrainingOpen(true);

        if (taskType === 'image') {
            if (taskSubType === 'classification') {
                imageTrain();
            } else {
                detectionTrain();
            }
        } else {
            soundTrain();
        }
	};

    const handleClickInitParam = () => {
        initParams();
    }

	return (
        <TrainItem>
            <ItemHeader>
                <HeaderText>
                    <UpdateIcon className='headerIcon'></UpdateIcon>
                    <div className='headerText'>Train</div>
                </HeaderText>
                <HeaderContent isWorking={isWorking} isDataloading={isDataloading} isTraining={isTraining}>
                    {
                    isTraining
                    ?
                    <ProgressWrapper>
                        <LinearProgress 
                            className="progress"
                            variant="determinate" 
                            value={count/params.epochs*100} />
                        <div className='progressText' onClick={onSetStopTrainClicked}>Training</div>
                    </ProgressWrapper>
                    :
                    <div className='headerContentText' onClick={onSetTrainClicked}>Start</div>
                    }
                </HeaderContent>
                <HeaderProgress isWorking={isWorking} isDataloading={isDataloading} isTraining={isTraining}>
                    <div className='progressTextWrapper'>
                        <div className='headerProgressText'>
                        {
                        isTraining 
                        ?
                        String(count) + " / " + String(params.epochs) 
                        :
                        "Preparing Training Dataset..."
                        }
                        </div>
                    </div>
                </HeaderProgress>
            </ItemHeader>
            <ItemContent>
                <DetailButton  onClick={() => setIsSettingOpen(!isSettingOpen)} isSettingOpen={isSettingOpen}>
                    <div className='detail toggle'>
                        <div className='detailLeft toggle'>
                                <div className='detailText toggle'>Settings</div>
                        </div>
                        <div className='detailRight toggle'>
                            {
                                isSettingOpen
                                ?
                                <KeyboardArrowUpOutlinedIcon className='toggleIcon'/>
                                :
                                <KeyboardArrowDownOutlinedIcon className='toggleIcon'/>
                            }
                        </div>
                    </div>
                </DetailButton>
                <DetailSetting isSettingOpen={isSettingOpen}>
                    <div className='detail epoch'>
                        <div className='detailLeft'>
                            <div className='detailText'>Epochs:</div>
                            <div className='detailSelect'>
                                <input type='text'
                                    name='epochs'
                                    value={params.epochs}
                                    onChange={(e) => handleChange(e)}
                                    className='epochInput'/>
                            </div>
                        </div>
                        <div className='detailRight'>
                            <HelpOutlineOutlinedIcon className='helpIcon' />
                        </div>
                    </div>
                    {
                    taskType === 'image'
                    ?
                    <>
                    <div className='detail batchSize'>
                        <div className='detailLeft'>
                            <div className='detailText'>Batch Size:</div>
                            <div className='detailSelect'>                    
                                <TeachableSelect 
                                    options={batchSize} 
                                    width={75} 
                                    name='batch_size'
                                    value={params.batch_size}
                                    handleChange={handleChange}
                                    shape='normal'
                                />
                            </div>
                        </div>
                        <div className='detailRight'>
                            <HelpOutlineOutlinedIcon className='helpIcon' />
                        </div>
                    </div>
                    <div className='detail learningRate'>
                        <div className='detailLeft'>
                            <div className='detailText'>Learning Rate:</div>
                            <div className='detailSelect'>
                                <TeachableSelect 
                                    options={learningRate} 
                                    width={100} 
                                    name='learning_rate'
                                    value={params.learning_rate}
                                    handleChange={handleChange}
                                    shape='normal'
                                />
                            </div>
                        </div>
                        <div className='detailRight'>
                            <HelpOutlineOutlinedIcon className='helpIcon' />
                        </div>
                    </div>
                    </>
                    :
                    null
                    }
                    {
                    isTrained
                    ?
                    <div className='detail report'>
                        <div className='reportButton' onClick={props.handleToggleDetailModal}>
                            <div className='reportText'>Train Result Report</div>
                        </div>
                    </div>
                    :
                    null
                    }
                    <div className='detail init'>
                        <div className='detailLeft'>
                            <div className='detailText reset'>Reset values</div>
                        </div>
                        <div className='detailRight' onClick={handleClickInitParam}>
                            <RestoreOutlinedIcon className='helpIcon reset' />
                        </div>
                    </div>
                </DetailSetting>
            </ItemContent>
        </TrainItem>
    );                                  
};

export default TrainComponent;

const TrainItem = styled.div`
    width: 300px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const ItemHeader = styled.div`
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    display: flex;
    flex-direction: column;
    justify-cotent: space-between;
`;

const HeaderText = styled.div`
    height: 42px;
    display: flex;
    justify-cotent: center;

    .headerIcon {
        margin-right: 5px;
        font-size: 20px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    }

    .headerText { 
        font-size: 14px;
        color: white;
        font-weight: 600;
    }
`;

const ProgressWrapper = styled.div`
    width: 100%;
    height: 42px;
    position: relative;

    .progress {
        width: 100%;
        height: 42px;
        background-color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    }
    .progress > * { 
        background-color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
    }

    .progressText {
        width: 100%;
        height: 42px;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 42px;
        text-align: center;    
        color: white;
        font-weight: 600;

        :hover {
            background-color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
            :after {
                content: ' Stop';
            }
        }
    }
`;

const HeaderContent = styled.div`
    height: 42px;
    background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-cotent: center;
    align-items: center;

    :hover {
        background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
    }

    .headerContentText {
        width: 100%;
        text-align: center;
    }
`;

const HeaderProgress = styled.div`
    height: 36px;
    display: none;
    ${props => props.isWorking && `
        display: block;
    `}
    ${props => !props.isWorking && `
        display: none;
    `}

    .progressTextWrapper {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    }

    .headerProgressText {
        width: 100%;
        font-weight: 600;
        font-size: 11px;
        color: white;
    }
`;

const ItemContent = styled.div`
    width: 100%;
    
    .detail {
        width: 100%;
        height: 50px;
        padding-left: 15px;
        padding-right: 15px;
        display: flex;
        justify-cotent: space-between;
        align-items: center;

        &.toggle {
            border-top: none;
        }
    }

    .reportButton {
        width: 100%; 
        height: 42px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        cursor: pointer;
        display: flex;
        justify-cotent: center;
        align-items: center;
        font-weight: 600;
        border: 1px ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR} solid;

        :hover {
            background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        }

        .reportText {
            width: 100%;
            text-align: center;
        }
    }

    .detailLeft {
        width: 90%;
        display: flex;
        justify-cotent: flex-start;
        align-items: center; 
    }

    .detailText {
        color: ${TEACHABLE_COLOR_LIST.GRAY};
        font-size: 12px;
        font-weight: 600;

        &.toggle {
            color: white;
        }

        &.reset {
            color: #adb5bd;
        }
        margin-right: 15px;
    }

    .detailRight {
        width: 10%;
        text-align: right;
    }

    .toggleIcon {
        color: white;
        font-size: 32px;
    }

    .helpIcon {
        color: ${TEACHABLE_COLOR_LIST.GRAY};
        font-size: 24px;
        cursor: pointer;

        &.reset {
            font-size: 26px;
        }

        :hover {
            color: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
        }
    }
`;

const DetailButton = styled.div`
    cursor: pointer;

    :hover {
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
    }
`;

const DetailSetting = styled.div`
    display: none;
    ${props => props.isSettingOpen && `
        display: block;
    `}
    ${props => !props.isSettingOpen && `
        display: none;
    `}

    .epochInput {
        width: 100px;
        height: 30px;
        border: none;
        outline: none;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        padding-left: 10px;
        color: white;
        font-weight: 600;
    }
`;


