import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import SaveAltOutlinedIcon from '@material-ui/icons/SaveAltOutlined';
import TeachableSelect from './TeachableSelect';
import DeployFileUploaderComponent from './DeployFileUploaderComponent';
import DeployWebcamUploaderComponent from './DeployWebcamUploaderComponent';
import DeployFileViewerComponent from './DeployFileViewerComponent';
import DeployAudioRecorderComponent from './DeployAudioRecorderComponent';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import { Item } from 'semantic-ui-react';


const inputTypeList = ['파일', 'Webcam'];
const colorList = [ 
    {'name': 'orange', 'valueColor': '#E67701', 'wrapperColor': '#FFECE2'},
    {'name': 'pink', 'valueColor': '#D84C6F', 'wrapperColor': '#FFE9EC'},
    {'name': 'purple', 'valueColor': '#794AEF', 'wrapperColor': '#F1F0FF'},
    {'name': 'blue', 'valueColor': '#1967D2', 'wrapperColor': '#D2E3FC'},
];


const DeployComponent = (props) => {
    
    const { taskType, model, list, isTrained } = useHandleState();
    
    const [ inputType, setInputType ] = useState('파일');
    const [ inferenceFile, setInferenceFile ] = useState(null);
    const [ isInferenceOpen, setIsInferenceOpen ] = useState(false);
    const [ inferenceResult, setInferenceResult ] = useState([]);
    const [ isDeloyWebcamAvailabel, setIsDeloyWebcamAvailabel ] = useState(false);

	useEffect(() => {
		if (inferenceFile !== null) {
            const imageUrl = inferenceFile.inference_url;           
            let tempImage = new Image();
            tempImage.onload = function () {
                model.predict(tempImage)
                .then(result => {  
                    if (Array.isArray(result) && result.length > 0) {
                        setInferenceResult(result);    
                    }
                })
                .catch(error => {
                    console.log(error);
                });     
           }
           tempImage.src = imageUrl;
		}
	}, [inferenceFile]);

    const resultItemList = inferenceResult.map((item, index) => {
        // console.log('=====================deploycomponent========================')
        // console.log(Item)
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

    const handleChange = (e) => {
        setIsDeloyWebcamAvailabel(false);
        setInputType(e.target.value);
    };

	return (
        <DeployItem>
            <ItemHeader isTrained={isTrained}>
                <HeaderText>
                    배포
                </HeaderText>
                <HeaderContent onClick={props.handleToggleDeployModal}>
                    <SaveAltOutlinedIcon className='headerContentIcon'/>
                    <div className='headerContentText'>모델 내보내기</div>
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
                    <div className='selectText'>입력</div>
                    <div className='selectComponent'>            
                        <TeachableSelect 
                            options={inputTypeList} 
                            width={110} 
                            name='inputType'
                            value={inputType}
                            handleChange={handleChange}
                            shape='round'
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
                    <FileUploadArea isOpen={inputType === '파일' ? true : false}>
                        <DeployFileUploaderComponent inferenceFile={inferenceFile} setInferenceFile={setInferenceFile} setIsInferenceOpen={setIsInferenceOpen} />
                    </FileUploadArea>
                    <WebcamArea isOpen={inputType === '파일' ? false : true}>
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
                    <DeployFileViewerComponent inferenceFile={inferenceFile}/>
                </ViewArea>
                :
                null    
                }
                <ResultArea isInferenceOpen={isInferenceOpen}>
                    <div className='resultIcon'>
                        <ArrowDownwardIcon className='icon'/>
                    </div>
                    <div className='resultInfoText'>추론 결과</div>
                    {resultItemList}
                </ResultArea>
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
    background: white;
    border-radius: 15px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
`;

const ItemHeader = styled.div`
    width: 100%;
    height: 115px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-cotent: space-between;
    ${props => props.isTrained && `
        border-bottom: 2px solid #e9ecef;
    `}
`;

const HeaderText = styled.div`
    height: 42px;
    font-size: 20px;
    font-weight: 600;
`;

const HeaderContent = styled.div`
    height: 42px;
    background: #F1F3F4;
    color: #495057;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    :hover {
        background: #E8F0FE;
        color: #1967D2;
        font-weight: 600;
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
        border-radius: 5px;

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
        border-radius: 5px;
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
        border-radius: 5px;
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