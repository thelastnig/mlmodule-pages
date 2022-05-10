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


const TrainComponent = (props) => {
    const { 
        taskType,
        params, 
        list, 
        isWorking,
        isDataloading,
        isTraining,
        isTrained,
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
    } = useStateActionHandler();
    const { showAlert } = useAlertAction();
    const [ isSettingOpen, setIsSettingOpen ] = useState(false);
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
            console.log(transferRecognizer.countExamples());
            changeTraining({isTraining: true});
            await transferRecognizer.train({
              epochs: params.epochs,
              callback: {
                onEpochEnd: async (epoch, logs) => {
                  console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`);
                  setCount(epoch);
                }
              }
            });
            setTransferRecognizer(transferRecognizer);
            changeTraining({isTraining: false, isTrained: true});
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

    const onSetTrainClicked = (e) => {
        if (list.length < 2) {
            props.setIsAlertDataOpen(true);
            return;
        }

        for (let i = 0; i < list.length; i++) {
            const limitNum = taskType === 'image' ? 10 : 20
            if (list[i].data.length < limitNum) {
                props.setIsAlertDataOpen(true);
                return;
            }
        }

        changeWorking({isWorking: true});
        props.setIsAlertTrainingOpen(true);

        if (taskType === 'image') {
            imageTrain();
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
                        <div className='progressText' onClick={onSetStopTrainClicked}>Training...</div>
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
                        "학습 데이터 준비중..."
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
                            <div className='reportText'>학습 결과 보고서</div>
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
        background-color: ${TEACHABLE_COLOR_LIST.MIDDLE_LIGHT_MAIN_COLOR};
    }
    .progress > * { 
        background-color: ${TEACHABLE_COLOR_LIST.MIDDLE_MAIN_COLOR};
    }

    .progressText {
        width: 100%;
        height: 42px;
        position: absolute;
        top: 0;
        left: 0;
        line-height: 42px;
        text-align: center;    
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        font-weight: 600;

        ::after {
            content: '중...';
        }

        :hover {
            background-color: ${TEACHABLE_COLOR_LIST.MIDDLE_MAIN_COLOR};

            ::after {
                content: '중지';
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
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
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
        background: ${TEACHABLE_COLOR_LIST.LIGHT_GRAY};
        color: ${TEACHABLE_COLOR_LIST.HEAVY_GRAY};
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        justify-cotent: center;
        align-items: center;
        background: ${TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR};
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        font-weight: 600;

        :hover {
            background: ${TEACHABLE_COLOR_LIST.MIDDLE_MAIN_COLOR};
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
        color: #adb5bd;
        font-size: 24px;
        cursor: pointer;

        &.reset {
            font-size: 26px;
        }

        :hover {
            color: ${TEACHABLE_COLOR_LIST.HEAVY_GRAY};
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
        background: ${TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR};
        padding-left: 10px;
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        font-weight: 600;

        &:focus {
            border: 1px solid ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOOR};
        }
    }
`;


