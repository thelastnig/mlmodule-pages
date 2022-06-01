import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import GetAppIcon from '@material-ui/icons/GetApp';
import TeachableSelect from './TeachableSelect';
import DeployFileUploaderComponent from './DeployFileUploaderComponent';
import DeployWebcamUploaderComponent from './DeployWebcamUploaderComponent';
import DeployFileViewerComponent from './DeployFileViewerComponent';
import DeployAudioRecorderComponent from './DeployAudioRecorderComponent';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Item } from 'semantic-ui-react';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import * as cocoSsd from '@tensorflow-models/coco-ssd';


const inputTypeList = ['File', 'Webcam'];
const colorList = [ 
    {'name': 'orange', 'valueColor': '#E67701', 'wrapperColor': '#FFECE2'},
    {'name': 'pink', 'valueColor': '#D84C6F', 'wrapperColor': '#FFE9EC'},
    {'name': 'purple', 'valueColor': '#794AEF', 'wrapperColor': '#F1F0FF'},
    {'name': 'blue', 'valueColor': '#1967D2', 'wrapperColor': '#D2E3FC'},
];


const DeployComponent = (props) => {
    
    // const { taskType, model, isTrained } = useHandleState();
    const { taskType, model, taskSubType } = useHandleState();
    const isTrained = true;
    
    const [ inputType, setInputType ] = useState('File');
    const [ inferenceFile, setInferenceFile ] = useState(null);
    const [ isInferenceOpen, setIsInferenceOpen ] = useState(false);
    const [ inferenceResult, setInferenceResult ] = useState([]);
    const [ isDeloyWebcamAvailabel, setIsDeloyWebcamAvailabel ] = useState(false);
    const [ detectionInferenceModel, setDetectionInferenceModel ] = useState(null);
    const [ detectionInferenceResult, setDetectionInferenceResult ] = useState([]);
    const [ detectionResultFile, setDetectionResultFile ] = useState([]);

    const setDetectionModel = async () => {
        try {
            const detectionModel = await cocoSsd.load();
            setDetectionInferenceModel(detectionModel);
        } catch (error) {
            console.log(error);
        }
    }

	useEffect(() => {
        if (taskType === 'image' && taskSubType === 'detection') {
            setDetectionModel();
        }
	}, [taskType, taskSubType]);

	useEffect(() => {
		if (inferenceFile !== null) {
            const imageUrl = inferenceFile.inference_url;           
            let tempImage = new Image();
            tempImage.onload = function () {
                if (taskSubType === 'classification') {
                    model.predict(tempImage)
                    .then(result => {  
                        if (Array.isArray(result) && result.length > 0) {
                            setInferenceResult(result);    
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });     
                } else {
                    detectionInferenceModel.detect(tempImage)
                    .then(predictions => {
                        setDetectionInferenceResult(predictions);
                        drawBoundingBoxes(predictions);
                    })
                }
           }
           tempImage.src = imageUrl;
		}
	}, [inferenceFile]);

    const resultItemList = inferenceResult.map((item, index) => {
        const colorIndex = index % colorList.length;
        const colorClass =  colorList[colorIndex].name;
        const intValue = Math.round(item.probability * 100);
        const value = String(intValue) + '%';
        return (
            <ResultItem key={index}>
                <div className={'classText ' + colorClass}>{item.className}</div>
                <div className={'classValueWrapper ' +  colorClass}>
                    {
                    intValue == 0
                    ?
                    <div style={{width: value}} className={'classValue ' + colorClass}></div>
                    :
                        intValue <= 12
                        ?
                        <div style={{width: value}} className={'classValueNarrow ' + colorClass}><div className={'text ' + colorClass}>{value}</div></div>
                        :
                        <div style={{width: value}} className={'classValue ' + colorClass}><div>{value}</div></div>
                    }
                </div>
            </ResultItem>
        );
    });

    const drawBoundingBoxes = (predictions) => {
        let imageObj = new Image();
        imageObj.onload = function () {
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');
            canvas.width = imageObj.width;
            canvas.height = imageObj.height;
            ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
            
            predictions.map((prediction, index) => {
                const bbox = prediction.bbox;
                const score = (prediction.score * 100).toFixed(2);
                ctx.strokeStyle = 'orange';
                ctx.lineWidth = 3;
                ctx.strokeRect(Number(bbox[0].toFixed()), Number(bbox[1].toFixed()), Number(bbox[2].toFixed()), Number(bbox[3].toFixed()));

                ctx.textBaseline = 'top';
                ctx.font="14px Verdana";
                ctx.fillStyle = 'orange';
                ctx.fillText(prediction.class, Number(bbox[0].toFixed()) + 5, Number(bbox[1].toFixed()) + 5);
                ctx.fill();
            })
            setDetectionResultFile(canvas.toDataURL());
        };
        imageObj.src = inferenceFile.inference_url;
        
    };

    const handleChange = (e) => {
        setIsDeloyWebcamAvailabel(false);
        setInputType(e.target.value);
    };

	return (
        <DeployItem>
            <ItemHeader isTrained={isTrained}>
                <HeaderText>
                    <GetAppIcon className='headerIcon'></GetAppIcon>
                    <div className='headerText'>Deploy</div>
                </HeaderText>
                <HeaderContent onClick={props.handleToggleDeployModal}>
                    <SaveAltOutlinedIcon className='headerContentIcon'/>
                    <div className='headerContentText'>Deploy Model</div>
                </HeaderContent>
            </ItemHeader>
            {
            isTrained
            ?
            <ItemContent>
                {
                taskType === 'image'
                ?
                <SelectArea>
                    <div className='selectText'>Input Type</div>
                    <div className='selectComponent'>            
                        <TeachableSelect 
                            options={inputTypeList} 
                            width={110} 
                            name='inputType'
                            value={inputType}
                            handleChange={handleChange}
                        />         
                    </div>
                </SelectArea>
                :
                null
                }
                {
                taskType === 'image'
                ?
                <UploadArea>
                    <FileUploadArea isOpen={inputType === 'File' ? true : false}>
                        <DeployFileUploaderComponent inferenceFile={inferenceFile} setInferenceFile={setInferenceFile} setIsInferenceOpen={setIsInferenceOpen} />
                    </FileUploadArea>
                    <WebcamArea isOpen={inputType === 'File' ? false : true}>
                        <DeployWebcamUploaderComponent 
                            inferenceFile={inferenceFile}
                            inputType={inputType} 
                            setInferenceFile={setInferenceFile} 
                            setIsInferenceOpen={setIsInferenceOpen}
                            isDeloyWebcamAvailabel={isDeloyWebcamAvailabel}
                            setIsDeloyWebcamAvailabel={setIsDeloyWebcamAvailabel}/>
                    </WebcamArea>
                </UploadArea>
                :
                <SoundArea>
                    <RecorderArea>
                        <DeployAudioRecorderComponent
                            transferRecognizer={props.transferRecognizer}
                            setIsInferenceOpen={setIsInferenceOpen}
                            setInferenceResult={setInferenceResult}
                        />
                    </RecorderArea>   
                </SoundArea>
                }
                {
                taskType === 'image'
                ?
                <ViewArea isInferenceOpen={isInferenceOpen}>
                    <DeployFileViewerComponent inferenceFile={inferenceFile} type="inferenceFile"/>
                </ViewArea>
                :
                null    
                }
                {
                taskSubType === 'classification'
                ?
                <ResultArea isInferenceOpen={isInferenceOpen}>
                    <div className='resultIcon'>
                        <ArrowDownwardIcon className='icon'/>
                    </div>
                    <div className='resultInfoText'>Result</div>
                    {resultItemList}
                </ResultArea>
                :
                <DetectionResultArea isInferenceOpen={isInferenceOpen}>
                    <DeployFileViewerComponent inferenceFile={detectionResultFile} type="detectionResult"/>
                </DetectionResultArea>
                }
            </ItemContent>
            :
            null
            } 
        </DeployItem>
    );                                  
};

export default DeployComponent;

const DeployItem = styled.div`
    width: 300px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const ItemHeader = styled.div`
    width: 100%;
    height: 115px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-cotent: space-between;
    ${props => props.isTrained && `
        border-bottom: 1px solid ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    `}
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

const HeaderContent = styled.div`
    height: 42px;
    background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    color: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
    }

    .headerContentText {
        margin-left: 10px;
        text-align: center;
    }
`;

const ItemContent = styled.div`
    width: 100%;
`;

const SelectArea = styled.div`
    width: 100%;
    height: 60px;
    padding-left: 15px;
    padding-right: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .selectText {
        color: ${TEACHABLE_COLOR_LIST.GRAY};
        font-size: 12px;
        font-weight: 600;
    }
    .selectComponent {
    }
`;

const UploadArea = styled.div`
    width: 100%;
    height: 340px;
`;

const SoundArea = styled.div`
    width: 100%;
    height: 280px;
`;

const ViewArea = styled.div`
    width: 100%;
    display: none;

    ${props => props.isInferenceOpen && `
        display: block;
    `}

    ${props => !props.isInferenceOpen && `
        display: none;
    `}
`;

const ResultArea = styled.div`
    width: 100%;
    padding: 15px;
    display: none;

    ${props => props.isInferenceOpen && `
        display: block;
    `}

    ${props => !props.isInferenceOpen && `
        display: none;
    `}

    .resultIcon {
        width: 100%;
        height: 30px;
        display: flex;
        justify-content: center;
        align-items: center;

        .icon {
            font-size: 24px;
            color: #1967D2;
        }
    }

    .resultInfoText {
        font-weight: 600;
        color: white;
        font-size: 12px;        
    }
`;

const ResultItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 15px;
    padding-bottom: 15px;

    .classText {
        width: 25%;
        font-size: 14px;
        font-weight: 600;
        word-break: break-all;

        &.orange {
            color: ${colorList[0].valueColor};
        }
        &.pink {
            color: ${colorList[1].valueColor};
        }
        &.purple {
            color: ${colorList[2].valueColor};
        }
        &.blue {
            color: ${colorList[3].valueColor};
        }
    }

    .classValueWrapper {
        width: 75%;
        height: 30px;

        &.orange {
            background: ${colorList[0].wrapperColor};
        }
        &.pink {
            background: ${colorList[1].wrapperColor};
        }
        &.purple {
            background: ${colorList[2].wrapperColor};
        }
        &.blue {
            background: ${colorList[3].wrapperColor};
        }
    }

    .classValue {
        height: 30px;
        display: flex;
        justify-content: flex-end;
        align-items: center;


        &.orange {
            background: ${colorList[0].valueColor};
        }
        &.pink {
            background: ${colorList[1].valueColor};
        }
        &.purple {
            background: ${colorList[2].valueColor};
        }
        &.blue {
            background: ${colorList[3].valueColor};
        }

        div {
            font-size: 11px;
            color: white;
            margin-right: 2px;
        }
    }

    .classValueNarrow {
        height: 30px;
        position: relative;

        &.orange {
            background: ${colorList[0].valueColor};
        }
        &.pink {
            background: ${colorList[1].valueColor};
        }
        &.purple {
            background: ${colorList[2].valueColor};
        }
        &.blue {
            background: ${colorList[3].valueColor};
        }

        .text {
            font-size: 11px;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: calc(100% + 2px);

            &.orange {
                color: ${colorList[0].valueColor};
            }
            &.pink {
                color: ${colorList[1].valueColor};
            }
            &.purple {
                color: ${colorList[2].valueColor};
            }
            &.blue {
                color: ${colorList[3].valueColor};
            }
        }
    }
`;

const DetectionResultArea = styled.div`
    width: 100%;
    display: none;

    ${props => props.isInferenceOpen && `
        display: block;
    `}

    ${props => !props.isInferenceOpen && `
        display: none;
    `}
`;

const FileUploadArea = styled.div`
    width: 100%;
    display: block;
    

    ${props => props.isOpen && `
        display: block;
    `}

    ${props => !props.isOpen && `
        display: none;
    `}
`;

const WebcamArea = styled.div`
    width: 100%;
    display: none;
    

    ${props => props.isOpen && `
        display: block;
    `}

    ${props => !props.isOpen && `
        display: none;
    `}
`;

const RecorderArea = styled.div`
    width: 100%;
    padding: 15px;
`;