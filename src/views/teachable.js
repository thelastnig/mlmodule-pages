import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FileUploaderComponent from 'components/teachable/FileUploaderComponent';
import WebcamUploaderComponent from 'components/teachable/WebcamUploaderComponent';
import AudioRecorderComponent from 'components/teachable/AudioRecorderComponent';
import FileViewerComponent from 'components/teachable/FileViewerComponent';
import AudioFileViewerComponent from 'components/teachable/AudioFileViewerComponent';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import AddToQueueOutlinedIcon from '@material-ui/icons/AddToQueueOutlined';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MicIcon from '@material-ui/icons/Mic';
import Button from '@material-ui/core/Button';
import LabelIcon from '@material-ui/icons/Label';
import AddClassButton from 'components/teachable/AddClassButton';
import AnnotationComponent from 'components/teachable/AnnotationComponent';
import TrainComponent from 'components/teachable/TrainComponent';
import DeployComponent from 'components/teachable/DeployComponent';
import MoreButton from 'components/teachable/MoreButton';
import GridLines from 'react-gridlines';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import { default as Draggable2 } from 'react-draggable';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import FileSaver from 'file-saver';
import JSZip from "jszip";
import { base64toFile } from 'utils/TeachableUtils'; 

// Modal
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import TeachableModal from 'component/dialog/TeachableModal';
import TeachableDeployModal from 'component/dialog/TeachableDeployModal';
import TeachableAlert from 'component/dialog/TeachableAlert';

// sound classification
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

// detection result
import { Lightbox } from "react-modal-image";

// option area
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { KeyboardReturnOutlined } from '@material-ui/icons';

const grid = 35;

const getItemStyle = (isDragging, draggableStyle) => ({
    width: '600px',
	userSelect: 'none',
	margin: `0 0 ${grid}px 0`,
	background: isDragging ? '#f1f3f5' : TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND,
	...draggableStyle
});

const getListStyle = isDraggingOver => ({
	background: null,
    width: 600,
    position: 'relative'
});

const queryAttr = 'data-rbd-drag-handle-draggable-id';


const Teachable = (props) => {
    const history = useHistory();

    const dataModuleRef = useRef(null);
    const annotationModuleStartRef = useRef(null);
    const annotationModuleEndRef = useRef(null);
    const trainModuleStartRef = useRef(null);
    const trainModuleEndRef = useRef(null);
    const deployModuleRef = useRef(null);

    const { taskType, 
        taskSubType, 
        class_count, 
        list, 
        params,
        detection_list, 
        isWorking,
        isTrained,
        detectionResultImage,
        isDetectionResultImageClick,
        isDataStepDone,
        isAnnotationStepDone,
        isDeployStepDone,
    } = useHandleState();
    const { setTaskType, 
        changeList,
        changeDetectionList,
        reorderClass, 
        changeClassName, 
        deleteClass, 
        changeUploadOpen, 
        toggleWebCamAvailable,
        deleteAllImages, 
        showDataUploadAlert,
        hideDataUploadAlert,
        toggleDetectionResultImageClick,
        initData,
        changeDataStep,
        changeAnnotationStep,
        changeDeployStep,
    } = useStateActionHandler();
	const [ placeholderProps, setPlaceholderProps ] = useState({});
    const [ isAnnotationOpen, setIsAnnotationOpen ] = useState(false);
    const [ isAlertTrainingOpen, setIsAlertTrainingOpen ] = useState(false);
    const [ isAlertDataOpen, setIsAlertDataOpen ] = useState(false);
    const [ isOptionAreaOpen, seIsOptionAreaOpen ] = useState(true);
    const [ isOptionAreaClicked, setIsOptionAreaClicked ] = useState(false);
    const [ isDetectionOptionAreaClicked, setIsDetectionOptionAreaClicked ] = useState(false);
    const [ memoryUsage, setMemoryUsage ] = useState([
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
        {x: 1, value: 0},
    ]);
    const updateXarrow = useXarrow();

    // sound classification
    const [ transferRecognizer, setTransferRecognizer ] = useState(null);

    // modal
    const { showDialog } = useDialogAction();

	const handleToggleDetailModal = () => {
		showDialog(dialogList.TEACHABLE_MODAL);
	};

	const handleToggleDeployModal = () => {
        if (!isTrained) {
            return;
        }
        if (taskSubType === 'detection') {
            return;
        }
        if (taskType === 'image') {
            showDialog(dialogList.TEACHABLE_DEPLOY_MODAL);
        } else {
            if (transferRecognizer === null) {
                console.log("no trained model!!!");
                return;
            }
            transferRecognizer.save('downloads://my-sound-model');
        }
	};
    
	const onDragEnd = (result) => {
		if (!result.destination) {
			return;
		}
        setPlaceholderProps({})
        reorderClass({
            list: list, 
            startIndex: result.source.index, 
            endIndex: result.destination.index
        });
	};

	const onDragUpdate = update => {
    if(!update.destination){
      return;
    }
		const draggableId = update.draggableId;
		const destinationIndex = update.destination.index;

		const domQuery = `[${queryAttr}='${draggableId}']`;
		const draggedDOM = document.querySelector(domQuery);

		if (!draggedDOM) {
			return;
		}
		const { clientHeight, clientWidth } = draggedDOM;

		const clientY = parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingTop) + [...draggedDOM.parentNode.children]
			.slice(0, destinationIndex)
			.reduce((total, curr) => {
				const style = curr.currentStyle || window.getComputedStyle(curr);
				const marginBottom = parseFloat(style.marginBottom);
				return total + curr.clientHeight + marginBottom;
			}, 0);

		setPlaceholderProps({
			clientHeight,
			clientWidth,
            clientY,
            clientX: parseFloat(window.getComputedStyle(draggedDOM.parentNode).paddingLeft)
		});
	};

	const onChangeValue = (e, id) => {
		const value = e.target.value;
        const raw_list = taskSubType === 'classification' ? list : detection_list;
        const changed_list = raw_list.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    class_name: value
                };
            } else {
                return item;
            }
        })
        if (taskSubType === 'classification') {
            changeList({
                list: changed_list
            });
        } else {
            changeDetectionList({
                detection_list: changed_list
            });
        }
	};

    const handleFocus = (e) => {
        e.target.select();
    };

    const clickDelete = useCallback((id) => {
        const changed_list = list.filter((item) => item.id !== id);
		const reduced_class_count = class_count - 1;
        deleteClass ({
            list: changed_list,
            class_count: reduced_class_count
        });
    }, [list]);

    const clickDeleteAllImages = (id) => {
        const raw_list = taskSubType === 'classification' ? list : detection_list;
        const changed_list = raw_list.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    data: [],
                    isUploadOpen: false,
                };
            } else {
                return item;
            }
        })
        if (taskSubType === 'classification') {
            changeList({
                list: changed_list
            });
        } else {
            changeDetectionList({
                detection_list: changed_list
            });
        }
    };

    const clickUploadOpen = (id, uploaderType, isMedia=false, isMediaAvaliable=false) => {
        const raw_list = taskSubType === 'classification' ? list : detection_list;
        const changed_list = raw_list.map((item) => {
            if (item.id === id) {
                if (isMedia) {
                    if (taskType === 'image') {
                        return {
                            ...item,
                            isUploadOpen: !item.isUploadOpen,
                            uploaderType: uploaderType,
                            isWebcamAvailable: isMediaAvaliable
                        };

                    } else {
                        return {
                            ...item,
                            isUploadOpen: !item.isUploadOpen,
                            uploaderType: uploaderType,
                            isAudioAvailable: isMediaAvaliable
                        };
                    }
                }
                else {
                    return {
                        ...item,
                        isUploadOpen: !item.isUploadOpen,
                        uploaderType:uploaderType
                    };
                }
            } else {
                return {
                    ...item,
                    isUploadOpen: false,
                    uploaderType: 'local'
                };
            }
        })
        if (taskSubType === 'classification') {
            changeList({
                list: changed_list
            });
        } else {
            changeDetectionList({
                detection_list: changed_list
            });    
        }
    };

    const clickDownloadSamples = (id) => {
        const raw_list = taskSubType === 'classification' ? list : detection_list;
        raw_list.map((item) => {
            if (item.id === id) {
                if (item.data.length === 0) {
                    console.log('no items')
                    return;
                }
                let zip = new JSZip();
                item.data.map((data) => {
                    try {
                        const fileName = data.data_type === 'local' ?  data.name : data.file_name;
                        const imageFile = base64toFile(data.base64, fileName);
                        zip.file(fileName, imageFile);
                    } catch (e) {
                        console.log(e);
                    }                  
                });
                
                zip.generateAsync({type: 'blob'})
                .then(content => {
                    const zipFileName = item.class_name + '-samples.zip' 
                    FileSaver.saveAs(content, zipFileName);
                });
            }
        }); 
    };

    const clickCloseAlertTraining = () => {
        setIsAlertTrainingOpen(false);
    };

    const clickCloseAlertData = () => {
        setIsAlertDataOpen(false);
    };

    const clickToggleButton = () => {
        seIsOptionAreaOpen(!isOptionAreaOpen);
        if (!isOptionAreaClicked) {
            setIsOptionAreaClicked(true);
            if (taskSubType === 'detection') {
                setIsDetectionOptionAreaClicked(true);
            }
        }
    };

    const closeLightbox = () => {
        toggleDetectionResultImageClick({
            isDetectionResultImageClick: false
        });
    };

    const xArrows = list.map((item, index) => {
        const end = isAnnotationOpen ? annotationModuleStartRef : trainModuleStartRef
        return <Xarrow
            key= {index}
            start={item.id} 
            end={end}
            showHead={false}
            strokeWidth={2}
            curveness={0.2}
            lineColor={TEACHABLE_COLOR_LIST.GRAY}
        />
    });

    const xArrowsDetection = detection_list.map((item, index) => {
        const end = isAnnotationOpen ? annotationModuleStartRef : trainModuleStartRef
        return <Xarrow
            key= {index}
            start={item.id} 
            end={end}
            showHead={false}
            strokeWidth={2}
            curveness={0.2}
            lineColor={TEACHABLE_COLOR_LIST.GRAY}
        />
    });

    useEffect(() => {
        if (!props.match.params.annotation) {
            initData();
        }
        setTaskType({
            taskType: props.match.params.type,
            taskSubType: props.match.params.subType,
        });
        if (props.match.params.type === 'sound') {
            setSoundModel();
        }
        if (props.match.params.subType === 'detection') {
            seIsOptionAreaOpen(false);
            setIsAnnotationOpen(true);
        } else {
            setIsDetectionOptionAreaClicked(true);
        }
    }, [props.match.params.type])

    useEffect(() => {
        const limitNum = taskType === 'image' ? taskType === 'classification' ? 10 : 20 : 20;
        if (taskSubType === 'classification') {
            if (list.length < 2) {
                changeDataStep({
                    isDataStepDone: false
                });
            } else {
                for (let i = 0; i < list.length; i++) {
                    if (list[i].data.length < limitNum) {
                        changeDataStep({
                            isDataStepDone: false
                        });
                    } else {
                        changeDataStep({
                            isDataStepDone: true
                        });
                    }
                }
            }
        } else {
            const dectection_data = detection_list[0].data;
            if (dectection_data.length < limitNum) {
                changeDataStep({
                    isDataStepDone: false
                });
            } else {
                changeDataStep({
                    isDataStepDone: true
                });
            }
            let isAnnotation = false;
            dectection_data.forEach(item => {
                if (item.annotation_fileupload.length !== 0 || item.annotation_tool.length !== 0) {
                    isAnnotation = true;
                } else {
                    isAnnotation = false;
                    return;
                }
            });
            if (isAnnotation) {
                changeAnnotationStep({
                    isAnnotationStepDone: true
                });
            } else {
                changeAnnotationStep({
                    isAnnotationStepDone: false
                });
            }
        }
    }, [list, detection_list])

    const setSoundModel = async () => {
        try {
            const baseRecognizer = speechCommands.create('BROWSER_FFT');
            await baseRecognizer.ensureModelLoaded();
            const tempTransferRecognizer = baseRecognizer.createTransfer(props.match.params.type);
            setTransferRecognizer(tempTransferRecognizer);
        } catch (error) {
            console.log(error);
        }
    }

     // media available
     const setMideaAvailable = (id, value) => {
        const raw_list = taskSubType === 'classification' ? list : detection_list;
        const changed_list = raw_list.map((item) => {
            if (item.id === id) {
                if (taskType === 'image') {
                    return {
                        ...item,
                        isWebcamAvailable: value
                    };
                } else {
                    return {
                        ...item,
                        isAudioAvailable: value
                    };
                }
            } else {
                return item;
            }
        })
        if (taskSubType === 'classification') {
            changeList({
                list: changed_list
            });
        } else {
            changeDetectionList({
                detection_list: changed_list
            });
        }
	};

    const dataAlertStatement = taskSubType === 'classification' 
    ?
        taskType === 'image'
        ?
        '모델을 학습하려면 2개 이상의 클래스가 필요하며, 각 클래스에 샘플이 10개 이상 있어야 합니다.'
        :
        '모델을 학습하려면 2개 이상의 클래스가 필요하며, 각 클래스에 샘플이 20개 이상 있어야 합니다.'
    :
    '모델을 학습하려면 샘플이 20개 이상 있어야 하며, 모든 샘플에 라벨링이 되어야 합니다.';


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

    const recordingInterval = useInterval(() => {
        const memory = window.performance.memory.usedJSHeapSize / Math.pow(1000, 2);
        memoryUsage.shift();
        setMemoryUsage([...memoryUsage, {x: 0, value: memory}]);
    }, 2000);

    const raw_list = taskSubType === 'classification' ? list : detection_list;
    const stepDataItem = raw_list.map((item, index) => {
        if (taskSubType === 'classification') {
            return (
                <div key={index}>{item.class_name}: {item.data.length} {item.data.length <= 1 ? 'file' : 'files'}</div>
            )
        } else {
            return (
                <div key={index}>{item.data.length} {item.data.length <= 1 ? 'file' : 'files'}</div>
            )
        }
    })

    const handleClickReset = () => {
        window.location.reload();
    }

	return (
        <>
            {/* <ProgressIndicatorWrapper>
                {
                isWorking
                ?
                <LinearProgress />
                :
                <ProgressNone />
                }
            </ProgressIndicatorWrapper> */}
            <MainWrapper>
			    <TeachableModal />
			    <TeachableDeployModal />
                <TeachableAlert />
                <OptionArea isOptionAreaOpen={isOptionAreaOpen} 
                    isOptionAreaClicked={isOptionAreaClicked} 
                    isDataStepDone={isDataStepDone}
                    isAnnotationStepDone={isAnnotationStepDone}
                    isTrainStepDone={isTrained}
                    isDeployStepDone={isDeployStepDone}
                    isDetection={taskSubType === 'detection'? true : false}
                    isDetectionOptionAreaClicked={isDetectionOptionAreaClicked}
                >
                    <div className='optionToggleButton' onClick={clickToggleButton}>
                        {
                            isOptionAreaOpen
                            ?
                            <KeyboardArrowRightIcon className='toggleButton' />
                            :
                            <KeyboardArrowLeftIcon className='toggleButton' />
                        }
                    </div>
                    <div className='optionContent'>
                        <div className='itemInfo'>
                            <PlayArrowIcon className='optionIcon'></PlayArrowIcon>
                            <div className='optionText'>Memory Usage (MB)</div>
                        </div>
                        <div className='chartArea'>
                            <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                                data={memoryUsage}
                                margin={{
                                    top: 10,
                                    right: 15,
                                    left: -20,
                                    bottom: 0,
                                }}
                                >
                                <XAxis tick={false}/>
                                <YAxis tickLine={false} style={{ fontSize: '12px'}} />
                                <Area type="monotone" dataKey="value" stroke="#1967D2" fill="rgba(25, 113, 194, .3)" />
                            </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className='itemInfo'>
                            <PlayArrowIcon className='optionIcon'></PlayArrowIcon>
                            <div className='optionText'>ML Steps</div>
                        </div>
                        <div className='stepArea'>
                            <div className='stepItem'>
                                <div className='stepTitleWrapper'>
                                    <div className='stepTitle'>Data</div>
                                    <CheckCircleIcon className='stepIcon data'></CheckCircleIcon>
                                </div>
                                <div className='stepContent'>
                                    {stepDataItem}
                                </div>
                            </div>
                            { 
                            taskSubType === 'detection'
                            ?
                            <>                
                            <div className='stepLine'></div>
                            <div className='stepTriangle'></div>
                            <div className='stepItem'>
                                <div className='stepTitleWrapper'>
                                    <div className='stepTitle'>Annotation</div>
                                    <CheckCircleIcon className='stepIcon annotation'></CheckCircleIcon>
                                </div>
                                <div className='stepContent'>
                                </div>
                            </div>
                            </>
                            :
                            null
                            }
                            <div className='stepLine'></div>
                            <div className='stepTriangle'></div>
                            <div className='stepItem'>
                                <div className='stepTitleWrapper'>
                                    <div className='stepTitle'>Train</div>
                                    <CheckCircleIcon className='stepIcon train'></CheckCircleIcon>
                                </div>
                                <div className='stepContent'>
                                    <span>Epochs: {params.epochs}</span><br/>
                                    {
                                    taskType === 'image'
                                    ?
                                    <>
                                    <span>Batch Size: {params.batch_size}</span><br/>
                                    <span>Learning Rate: {params.learning_rate}</span>
                                    </>
                                    :
                                    null
                                    }
                                </div>
                            </div>
                            <div className='stepLine'></div>
                            <div className='stepTriangle'></div>
                            <div className='stepItem'>
                                <div className='stepTitleWrapper'>
                                    <div className='stepTitle'>Deploy</div>
                                    <CheckCircleIcon className='stepIcon deploy'></CheckCircleIcon>
                                </div>
                                <div className='stepContent'>
                                </div>
                            </div>
                        </div>

                        
                        <div className='itemInfo reset'>
                            <PlayArrowIcon className='optionIcon'></PlayArrowIcon>
                            <div className='optionText'>Reset Task</div>
                        </div>
                        <div className='resetButton' onClick={handleClickReset}>Reset</div>
                    </div>
                </OptionArea>
                <MainInnerWrapper>
                    <GridLines 
                        className='grid-area' 
                        cellWidth={60} 
                        strokeWidth={2} 
                        cellWidth2={12}
                        lineColor='#343a40'
                        lineColor2='black'
                    >
                        <GridArea>
                            <AlertData isAlertDataOpen={isAlertDataOpen}>
                                <div className='alertDataInner'>
                                    <div className='alertDataText'>{dataAlertStatement}</div>
                                    <Button variant="outlined" 
                                            style={{
                                                backgroundColor: TEACHABLE_COLOR_LIST.PURPLE,
                                                border: '1px solid white',
                                                color: 'white',
                                            }}
                                            className='alertTrainOKBtn' 
                                            onClick={clickCloseAlertData}>
                                        확인
                                    </Button>
                                </div>
                            </AlertData>
                            <AlertTraining isAlertTrainingOpen={isAlertTrainingOpen}>
                                <div className='alertTrainingInner'>
                                    <div className='alertTrainingText'>
                                        <span>탭을 전환하지 마세요</span>&nbsp;&nbsp;-&nbsp;&nbsp;모델을 학습하려면 이 탭이 열려 있어여 합니다.
                                    </div>
                                    <Button variant="outlined" color="primary" className='alertTrainOKBtn' onClick={clickCloseAlertTraining}>확인</Button>
                                </div>
                            </AlertTraining>
                            <Xwrapper>
                            <DataModule ref={dataModuleRef}>    
                                <DragDropContext onDragEnd={onDragEnd} onDragUpdate={onDragUpdate}>
                                    <Droppable droppableId='droppable'>
                                        {(provided, snapshot) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                style={getListStyle(snapshot.isDraggingOver)}
                                            >
                                            {
                                                taskSubType === 'classification'
                                                ?                                                
                                                list.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div className='draggableContentWrapper'
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}
                                                            >   
                                                                <div className='draggableContent'>
                                                                    <ItemHeader>
                                                                        <div className='inputWrapper'>
                                                                            <LabelIcon className='labelIcon'></LabelIcon>
                                                                            <ClassNameInput>
                                                                                <input
                                                                                    className='classInput' 
                                                                                    value={item.class_name}
                                                                                    onChange={(e) => onChangeValue(e, item.id)}
                                                                                    onFocus={(e) => handleFocus(e)}
                                                                                />
                                                                            </ClassNameInput>
                                                                        </div>
                                                                        <MenuBtn>
                                                                            <MoreButton
                                                                                id={item.id}
                                                                                listLength={item.data.length}
                                                                                clickDelete={clickDelete}
                                                                                clickDeleteAllImages={clickDeleteAllImages}
                                                                                clickDownloadSamples={clickDownloadSamples}
                                                                            />
                                                                        </MenuBtn>
                                                                    </ItemHeader>
                                                                    <ItemContent isUploadOpen={item.isUploadOpen}>
                                                                        <FileUploaderArea isUploadOpen={item.isUploadOpen}>
                                                                            {
                                                                                item.isUploadOpen
                                                                                ?
                                                                                null
                                                                                :
                                                                                    taskType === 'image' 
                                                                                    ?
                                                                                    <FileUploaderText>+ Add images</FileUploaderText>
                                                                                    :
                                                                                    <FileUploaderText>+ Add audios(at least 20)</FileUploaderText>
                                                                            }
                                                                            {
                                                                                item.isUploadOpen
                                                                                ?
                                                                                    taskType === 'image'
                                                                                    ?
                                                                                        item.uploaderType === 'webcam'
                                                                                        ?
                                                                                        <WebcamUploaderComponent id={item.id} 
                                                                                            isWebcamAvailable={item.isWebcamAvailable}
                                                                                            isUploadOpen={item.isUploadOpen} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            setWebcamAvailable={setMideaAvailable}
                                                                                        />
                                                                                        :
                                                                                        <FileUploaderComponent id={item.id}
                                                                                            taskType={taskType} 
                                                                                            class_name={item.class_name} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            showDataUploadAlert={showDataUploadAlert}
                                                                                            hideDataUploadAlert={hideDataUploadAlert}
                                                                                        />
                                                                                    :
                                                                                        item.uploaderType === 'audioRecorder'
                                                                                        ?
                                                                                        <AudioRecorderComponent id={item.id} 
                                                                                            isAudioAvailable={item.isAudioAvailable}
                                                                                            isUploadOpen={item.isUploadOpen}
                                                                                            transferRecognizer={transferRecognizer}
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            setAudioAvailable={setMideaAvailable}
                                                                                        />
                                                                                        :
                                                                                        <FileUploaderComponent id={item.id}
                                                                                            taskType={taskType} 
                                                                                            class_name={item.class_name} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            showDataUploadAlert={showDataUploadAlert}
                                                                                            hideDataUploadAlert={hideDataUploadAlert}
                                                                                        />
                                                                                :
                                                                                    taskType === 'image'
                                                                                    ?
                                                                                    <FileUploaderSelect>
                                                                                        <div className='fileUploaderSelectItem' onClick={() => clickUploadOpen(item.id, 'webcam', true, false)}>
                                                                                            <VideocamOutlinedIcon className='selectIcon'/>
                                                                                            <div className='selectText'>Webcam</div>
                                                                                        </div>
                                                                                        <div className='fileUploaderSelectItem file' onClick={() => clickUploadOpen(item.id, 'local')}>
                                                                                            <AddToQueueOutlinedIcon className='selectIcon file'/>
                                                                                            <div className='selectText file'>File</div>
                                                                                        </div>
                                                                                    </FileUploaderSelect>
                                                                                    :
                                                                                    <FileUploaderSelect>
                                                                                        <div className='fileUploaderSelectItem' onClick={() => clickUploadOpen(item.id, 'audioRecorder', true, false)}>
                                                                                            <MicIcon className='selectIcon'/>
                                                                                            <div className='selectText'>Mike</div>
                                                                                        </div>
                                                                                        <div className='fileUploaderSelectItem file' onClick={() => clickUploadOpen(item.id, 'local')}>
                                                                                            <AddToQueueOutlinedIcon className='selectIcon file'/>
                                                                                            <div className='selectText file'>File</div>
                                                                                        </div>
                                                                                    </FileUploaderSelect>
                                                                            }
                                                                        </FileUploaderArea>
                                                                        <FileViewerArea>
                                                                            {
                                                                            taskType === 'image'
                                                                            ?
                                                                            <FileViewerComponent id={item.id} data={item.data} isUploadOpen={item.isUploadOpen} {...props}/>
                                                                            :
                                                                            <AudioFileViewerComponent id={item.id} data={item.data} isUploadOpen={item.isUploadOpen} {...props}/>
                                                                            }
                                                                        </FileViewerArea>
                                                                    </ItemContent>
                                                                </div>
                                                                <div className='draggableRef' id={item.id}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                                :                                  
                                                detection_list.map((item, index) => (
                                                    <Draggable key={item.id} draggableId={item.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div className='draggableContentWrapper'
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={getItemStyle(
                                                                    snapshot.isDragging,
                                                                    provided.draggableProps.style
                                                                )}
                                                            >   
                                                                <div className='draggableContent'>
                                                                    <ItemHeader>
                                                                        <div className='inputWrapper'>
                                                                            <LabelIcon className='labelIcon'></LabelIcon>
                                                                            <ClassNameInput>
                                                                                <input
                                                                                    className='classInput detection' 
                                                                                    value={item.class_name}
                                                                                    onChange={(e) => onChangeValue(e, item.id)}
                                                                                    onFocus={(e) => handleFocus(e)}
                                                                                    disabled
                                                                                />
                                                                            </ClassNameInput>
                                                                        </div>
                                                                        <MenuBtn>
                                                                            {
                                                                                item.data.length > 0
                                                                                ?
                                                                                <MoreButton
                                                                                    id={item.id}
                                                                                    listLength={item.data.length}
                                                                                    clickDelete={clickDelete}
                                                                                    clickDeleteAllImages={clickDeleteAllImages}
                                                                                    clickDownloadSamples={clickDownloadSamples}
                                                                                />
                                                                                :
                                                                                null
                                                                            }
                                                                        </MenuBtn>
                                                                    </ItemHeader>
                                                                    <ItemContent isUploadOpen={item.isUploadOpen}>
                                                                        <FileUploaderArea isUploadOpen={item.isUploadOpen}>
                                                                            {
                                                                                item.isUploadOpen
                                                                                ?
                                                                                null
                                                                                :
                                                                                    taskType === 'image' 
                                                                                    ?
                                                                                    <FileUploaderText>+ Add images</FileUploaderText>
                                                                                    :
                                                                                    <FileUploaderText>+ Add audios(at least 20)</FileUploaderText>
                                                                            }
                                                                            {
                                                                                item.isUploadOpen
                                                                                ?
                                                                                    taskType === 'image'
                                                                                    ?
                                                                                        item.uploaderType === 'webcam'
                                                                                        ?
                                                                                        <WebcamUploaderComponent id={item.id} 
                                                                                            isWebcamAvailable={item.isWebcamAvailable}
                                                                                            isUploadOpen={item.isUploadOpen} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            setWebcamAvailable={setMideaAvailable}
                                                                                        />
                                                                                        :
                                                                                        <FileUploaderComponent id={item.id}
                                                                                            taskType={taskType} 
                                                                                            class_name={item.class_name} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            showDataUploadAlert={showDataUploadAlert}
                                                                                            hideDataUploadAlert={hideDataUploadAlert}
                                                                                        />
                                                                                    :
                                                                                        item.uploaderType === 'audioRecorder'
                                                                                        ?
                                                                                        <AudioRecorderComponent id={item.id} 
                                                                                            isAudioAvailable={item.isAudioAvailable}
                                                                                            isUploadOpen={item.isUploadOpen}
                                                                                            transferRecognizer={transferRecognizer}
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            setAudioAvailable={setMideaAvailable}
                                                                                        />
                                                                                        :
                                                                                        <FileUploaderComponent id={item.id}
                                                                                            taskType={taskType} 
                                                                                            class_name={item.class_name} 
                                                                                            {...props} 
                                                                                            clickUploadOpen={clickUploadOpen}
                                                                                            showDataUploadAlert={showDataUploadAlert}
                                                                                            hideDataUploadAlert={hideDataUploadAlert}
                                                                                        />
                                                                                :
                                                                                    taskType === 'image'
                                                                                    ?
                                                                                    <FileUploaderSelect>
                                                                                        <div className='fileUploaderSelectItem' onClick={() => clickUploadOpen(item.id, 'webcam', true, false)}>
                                                                                            <VideocamOutlinedIcon className='selectIcon'/>
                                                                                            <div className='selectText'>Webcam</div>
                                                                                        </div>
                                                                                        <div className='fileUploaderSelectItem file' onClick={() => clickUploadOpen(item.id, 'local')}>
                                                                                            <AddToQueueOutlinedIcon className='selectIcon file'/>
                                                                                            <div className='selectText file'>File</div>
                                                                                        </div>
                                                                                    </FileUploaderSelect>
                                                                                    :
                                                                                    <FileUploaderSelect>
                                                                                        <div className='fileUploaderSelectItem' onClick={() => clickUploadOpen(item.id, 'audioRecorder', true, false)}>
                                                                                            <MicIcon className='selectIcon'/>
                                                                                            <div className='selectText'>Mike</div>
                                                                                        </div>
                                                                                        <div className='fileUploaderSelectItem' onClick={() => clickUploadOpen(item.id, 'local')}>
                                                                                            <AddToQueueOutlinedIcon className='selectIcon file'/>
                                                                                            <div className='selectText file'>File</div>
                                                                                        </div>
                                                                                    </FileUploaderSelect>
                                                                            }
                                                                        </FileUploaderArea>
                                                                        <FileViewerArea>
                                                                            <FileViewerComponent id={item.id} data={item.data} isUploadOpen={item.isUploadOpen} {...props}/>
                                                                        </FileViewerArea>
                                                                    </ItemContent>
                                                                </div>
                                                                <div className='draggableRef' id={item.id}/>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            }
                                                {provided.placeholder}
                                                <div style={{
                                                    position: 'absolute',
                                                    top: placeholderProps.clientY,
                                                    left: placeholderProps.clientX,
                                                    height: placeholderProps.clientHeight,
                                                    background: 'rgba(210, 227, 252, 0.6)',
                                                    width: placeholderProps.clientWidth
                                                    }}/>
                                                </div>
                                    )}
                                    </Droppable>
                                </DragDropContext>
                                {
                                    taskSubType === 'classification'
                                    ?
                                    <AddClassButton/>
                                    :
                                    null
                                }
                            </DataModule>
                            <Draggable2 onDrag={updateXarrow} onStop={updateXarrow}>
                                <AnnotationModuleWrapper isAnnotationOpen={isAnnotationOpen}>
                                    <AnnotationModule isAnnotationOpen={isAnnotationOpen}>
                                        <div ref={annotationModuleStartRef} className='trainModuleRef'/>
                                        <AnnotationComponent />
                                        <div ref={annotationModuleEndRef} className='trainModuleRef'/>
                                    </AnnotationModule>
                                </AnnotationModuleWrapper>
                            </Draggable2>
                            <Draggable2 onDrag={updateXarrow} onStop={updateXarrow}>
                                <TrainModule>
                                    <div ref={trainModuleStartRef} className='trainModuleRef'/>
                                    <TrainComponent 
                                        handleToggleDetailModal={handleToggleDetailModal} 
                                        setIsAlertTrainingOpen={setIsAlertTrainingOpen}
                                        setIsAlertDataOpen={setIsAlertDataOpen}
                                        transferRecognizer={transferRecognizer}
                                        setTransferRecognizer={setTransferRecognizer}
                                        clickUploadOpen={clickUploadOpen}
                                    />
                                    <div ref={trainModuleEndRef} className='trainModuleRef'/>
                                </TrainModule>
                            </Draggable2>
                            <Draggable2 onDrag={updateXarrow} onStop={updateXarrow}>
                                <DeployModule ref={deployModuleRef}>
                                    <DeployComponent 
                                        handleToggleDeployModal={handleToggleDeployModal}
                                        transferRecognizer={transferRecognizer}
                                    />
                                </DeployModule>
                            </Draggable2>
                            {
                            taskSubType === 'classification'
                            ?
                            xArrows
                            :
                            xArrowsDetection
                            }
                            {
                            isAnnotationOpen
                            ?
                            <Xarrow
                                start={annotationModuleEndRef} 
                                end={trainModuleStartRef}
                                showHead={false}
                                strokeWidth={2}
                                lineColor={TEACHABLE_COLOR_LIST.GRAY}
                            />
                            :
                            null
                            }
                            <Xarrow
                                start={trainModuleEndRef} 
                                end={deployModuleRef}
                                showHead={false}
                                strokeWidth={2}
                                lineColor={TEACHABLE_COLOR_LIST.GRAY}
                            />
                            </Xwrapper>
                        </GridArea>
                    </GridLines>
                </MainInnerWrapper>
                {                       
                isDetectionResultImageClick && (
                <ModalWrapper>
                    <Lightbox
                    // medium={detectionResultFile}
                    className="inferenceModaImage" 
                    large={detectionResultImage}
                    onClose={closeLightbox}
                    hideDownload={true}
                    hideZoom={true}
                    />
                </ModalWrapper>
                )}
            </MainWrapper>
        </>
	);
};

export default Teachable;


const toggleToRight = keyframes`
    from {
        right: 0px;
    }
    to {
        right: -250px;
    }
`;

const toggleToLeft = keyframes`
    from {
        right: -250px;
    }
    to {
        right: 0px;
    }
`;

const MainWrapper = styled.div`
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
`;

const ModalWrapper = styled.div`

`;

const MainInnerWrapper = styled.div`
    width: 100%;
    overflow: auto;
    .grid-area {
        background: ${TEACHABLE_COLOR_LIST.GRID_BACKGROUND};
        width: 100%;
        min-height: calc(100vh - 70px);
        padding: 50px;
    } 
`;

const OptionArea = styled.div`
    position: absolute;
    top: 0px;
    right: 0px;
    width: 285px;
    height: 100%;
    z-index: 999;
    display: flex;
    justify-content: center;
    align-items: flex-start;

    ${props => props.isDetection && ` 
        right: -250px;
    `}

    ${props => !props.isOptionAreaOpen && props.isDetectionOptionAreaClicked &&
        css` 
            animation: ${toggleToRight} 0.5s ease-in-out forwards;
        `
    }

    ${props => props.isOptionAreaOpen && props.isOptionAreaClicked &&
        css` 
            animation: ${toggleToLeft} 0.5s ease-in-out forwards;
        `
    }

    .optionToggleButton {
        width: 35px;
        height: 45px;
        margin-top: 20px;
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;


        .toggleButton {
            font-size: 28px;
            color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        }
    }

    .optionContent {
        width: 250px;
        height: 100%;
        margin: 0 auto;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
    }

    .itemInfo {
        width: 100%;
        margin-top: 20px;
        margin-bottom: 20px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: white;

        &.reset {
            margin-top: 40px;

        }

        .optionIcon {
            font-size: 16px;
            margin-left: 10px;
            margin-right: 5px;
        }
        .optionText {
            font-size: 12px;
        }
    }
    .chartArea {
        
    }

    .stepArea  {
        width: 150px;
        margin: 0 auto;
    }

    .stepItem {
        border: 1px solid ${TEACHABLE_COLOR_LIST.GRAY};
        border-radius: 5px;
        color: ${TEACHABLE_COLOR_LIST.GRAY};
        font-size: 12px;
        text-align: center;
        padding: 5px 0;
    }

    .stepTitleWrapper {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .stepTitle {
        font-weight: 600;
    }

    .stepIcon {
        font-size: 16px;
        color: ${TEACHABLE_COLOR_LIST.GREEN_COLOR};
        margin-left: 5px;
        display: none;

        &.data {
            ${props => props.isDataStepDone && ` 
                display: block;
            `}
            ${props => !props.isDataStepDone && ` 
                display: none;
            `}
        }
        &.annotation {
            ${props => props.isAnnotationStepDone && ` 
                display: block;
            `}
            ${props => !props.isAnnotationStepDone && ` 
                display: none;
            `}
        }
        &.train {
            ${props => props.isTrainStepDone && ` 
                display: block;
            `}
            ${props => !props.isTrainStepDone && ` 
                display: none;
            `}
        }
        &.deploy {
            ${props => props.isDeployStepDone && ` 
                display: block;
            `}
            ${props => !props.isDeployStepDone && ` 
                display: none;
            `}
        }
    }

    .stepLine {
        margin-left: 75px;
        border-left: 1px solid ${TEACHABLE_COLOR_LIST.GRAY};
        height: 40px;
    }

    .stepTriangle {
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 10px 5px 0 5px;
        border-color: ${TEACHABLE_COLOR_LIST.GRAY} transparent transparent transparent;
        margin-left: 70px;
    }

    .resetButton {
        margin: 0 auto;
        margin-top: 20px;
        width: 80%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        cursor: pointer;
        font-weight: 600;
        border: 1px ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR} solid;

        :hover {
            background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        }   
    }
`;

const GridArea = styled.div`
    width: 100%;
	min-height: 900px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
    overflow: auto;
`;

const AlertData = styled.div`
    width: 720px;
    height: 55px;
    background: ${TEACHABLE_COLOR_LIST.PURPLE};
    border-radius: 5px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 8px;
    left: 600px;
    z-index: 999;

    ${props => props.isAlertDataOpen && `
        display: block;
    `}

    ${props => !props.isAlertDataOpen && `
        display: none;
    `}

    .alertDataInner {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .alertDataText {
        font-size: 14px;
        color: white;
    }
`;

const AlertTraining = styled.div`
    width: 570px;
    height: 45px;
    background: white;
    border-radius: 5px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 15px;
    left: 680px;
    display: none;
    z-index: 999;

    ${props => props.isAlertTrainingOpen && `
        display: block;
    `}

    ${props => !props.isAlertTrainingOpen && `
        display: none;
    `}

    .alertTrainingInner {
        width: 100%;
        height: 100%;
        padding-left: 20px;
        padding-right: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .alertTrainingText {
        font-size: 12px;
        span {
            font-size: 14px;
            font-weight: 600;
        }
    }
`;

const DataModule = styled.div`
    margin-right: 150px;

    .draggableContentWrapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .draggableContent {
        width: 100%;
        height: 100%;
    }
    .draggableRef {
    }
`;

const AnnotationModuleWrapper = styled.div`
    ${props => props.isAnnotationOpen && `
        display: block;
    `}
    ${props => !props.isAnnotationOpen && `
        display: none;
    `}
`;

const AnnotationModule = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 50px;
`;

const TrainModule = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 50px;
`;

const DeployModule = styled.div`
`;


const ItemHeader = styled.div`
    width: 100%;
    height: 55px;
    padding: 15px;
    display: flex;
    justify-cotent: space-between;
    align-items: center;

    .inputWrapper {
        width: 96%;
        display: flex;
        justify-cotent: space-between;
        align-items: center;
        .labelIcon {
            margin-right: 5px;
            font-size: 20px;
            color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        }
    }
`;

const ItemContent = styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    ${props => props.isUploadOpen && `
        height: 430px;
    `}
    ${props => !props.isUploadOpen && `
        height: 250px;
    `}
`;

const ClassNameInput = styled.div`
    .classInput {
        border: none;
        color: white;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
        font-size: 14px;
        :focus {
            outline: none !important;
            border: 2px solid ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        }

        &.detection {
            font-weight: 600;

        }
    }
`;

const MenuBtn = styled.div`
    width: 4%;
    text-align: right;
`;

const FileUploaderArea = styled.div`
    width: 50%;
    height: 100%;
    padding: 15px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const FileViewerArea = styled.div`
    width: 50%;
    padding-top: 7px;
    padding-bottom: 7px;
`;

const FileUploaderText = styled.div`
    width: 100%;
    font-size: 12px;
    font-weight: 600;
    padding-left: 10px;
    margin-top: 40px;
    margin-bottom: 20px;
    color: white;
`;

const FileUploaderSelect = styled.div`
    width: 100ke%;
    padding-left: 10px;
    padding-right: 10px;

    .fileUploaderSelectItem {
        width: 100%;
        height: 35px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        &:hover {
            background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
        }
        &.file {
            margin-top: 10px;
        }
    }

    .selectText {
        font-size: 12px;
        font-weight: 600;
        color: white;

        &.file {
        }
    }

    .selectIcon {
        font-size: 28px;
        color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        margin-left: 75px;
        margin-right: 10px;

        &.file {
            font-size: 24px; 
            margin-left: 78px;
            margin-right: 13px;
        }
    }
`;

