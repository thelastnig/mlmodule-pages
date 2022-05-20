import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import FileUploaderComponent from 'components/teachable/FileUploaderComponent';
import WebcamUploaderComponent from 'components/teachable/WebcamUploaderComponent';
import AudioRecorderComponent from 'components/teachable/AudioRecorderComponent';
import FileViewerComponent from 'components/teachable/FileViewerComponent';
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined';
import AddToQueueOutlinedIcon from '@material-ui/icons/AddToQueueOutlined';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import MicIcon from '@material-ui/icons/Mic';
import Button from '@material-ui/core/Button';
import LabelIcon from '@material-ui/icons/Label';
import AddClassButton from 'components/teachable/AddClassButton';
import PreprocessComponent from 'components/teachable/PreprocessComponent';
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
import logo from 'assets/icon/surromind.png';
import LinearProgress from '@material-ui/core/LinearProgress';

// Modal
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import TeachableModal from 'component/dialog/TeachableModal';
import TeachableDeployModal from 'component/dialog/TeachableDeployModal';
import TeachableAlert from 'component/dialog/TeachableAlert';

// sound classification
import * as tf from '@tensorflow/tfjs';
import * as speechCommands from '@tensorflow-models/speech-commands';

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
    const dataModuleRef = useRef(null);
    const preprocessModuleStartRef = useRef(null);
    const preprocessModuleEndRef = useRef(null);
    const trainModuleStartRef = useRef(null);
    const trainModuleEndRef = useRef(null);
    const deployModuleRef = useRef(null);

    const { taskType, class_count, list, isWorking } = useHandleState();
    const { setTaskType, 
        changeList,
        reorderClass, 
        changeClassName, 
        deleteClass, 
        changeUploadOpen, 
        toggleWebCamAvailable,
        deleteAllImages, 
        showDataUploadAlert,
        hideDataUploadAlert,
    } = useStateActionHandler();
	const [ placeholderProps, setPlaceholderProps ] = useState({});
    const [ isPreprocessOpen, setIsPreprocessOpen ] = useState(false);
    const [ isAlertTrainingOpen, setIsAlertTrainingOpen ] = useState(false);
    const [ isAlertDataOpen, setIsAlertDataOpen ] = useState(false);
    const [ isOptionAreaOpen, seIsOptionAreaOpen ] = useState(true);
    const [ isOptionAreaClicked, setIsOptionAreaClicked ] = useState(false);
    const updateXarrow = useXarrow();

    // sound classification
    const [ transferRecognizer, setTransferRecognizer ] = useState(null);

    // modal
    const { showDialog } = useDialogAction();

	const handleToggleDetailModal = () => {
		showDialog(dialogList.TEACHABLE_MODAL);
	};

	const handleToggleDeployModal = () => {
		showDialog(dialogList.TEACHABLE_DEPLOY_MODAL);
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
        const changed_list = list.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    class_name: value
                };
            } else {
                return item;
            }
        })
        changeClassName({
            list: changed_list
        });
	};

    const handleFocus = (e) => {
        e.target.select();
    };

    const clickDelete = useCallback((id) => {
        const changed_list = list.filter((item) => item.id !== id);
		const reduced_class_count = class_count - 1;
        deleteClass({
            list: changed_list,
            class_count: reduced_class_count
        });
    }, [list]);

    const clickDeleteAllImages = useCallback((id) => {
        const changedList = list.map((item) => {
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
        deleteAllImages({
            list: changedList
        });
    }, [list]);

    const clickUploadOpen = (id, uploaderType, isMedia=false, isMediaAvaliable=false) => {
        const changed_list = list.map((item) => {
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
        changeUploadOpen({
            list: changed_list
        });
    };

    const clickDownloadSamples = (id) => {
        list.map((item) => {
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
    }

    const clickCloseAlertData = () => {
        setIsAlertDataOpen(false);
    }

    const clickToggleButton = () => {
        seIsOptionAreaOpen(!isOptionAreaOpen);
        if (!isOptionAreaClicked) {
            setIsOptionAreaClicked(true);
        }
    }

    const xArrows = list.map((item, index) => {
        const end = isPreprocessOpen ? preprocessModuleStartRef : trainModuleStartRef
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
        setTaskType({taskType: props.match.params.type});
        if (props.match.params.type === "sound") {
            setSoundModel();
        }
    }, [props.match.params.type])

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
        const changed_list = list.map((item) => {
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
        changeList({
            list: changed_list
        });
	};

	return (
        <>
            <HeaderWrapper>
                <div className='headerUpper'>
                    <div className='upperWrapper'>
                        <div className='upperLeft'>
                            <img src={logo} height='22px'/>
                        </div>
                        <div className='upperRight'>
                            <div className='upperRightItem'>Easy ML Module</div>
                            <div className='upperRightItem'>Annotation</div>
                        </div>
                    </div>
                    <div className='upperEnd'>
                        <div className='upperEndItem status'>RUNNING</div>
                        <div className='upperEndItem type'>CPU</div>
                    </div>
                </div>
                <div className='headerLower'>
                    
                </div>
            </HeaderWrapper>
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
                <OptionArea isOptionAreaOpen={isOptionAreaOpen} isOptionAreaClicked={isOptionAreaClicked}>
                    <div className='optionToggleButton' onClick={clickToggleButton}>
                        {
                            isOptionAreaOpen
                            ?
                            <KeyboardArrowRightIcon className='toggleButton' />
                            :
                            <KeyboardArrowLeftIcon className='toggleButton' />
                        }
                    </div>
                    <div className='optionContent'></div>
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
                    {/* <button onClick={() => setIsPreprocessOpen(!isPreprocessOpen)}>Preprocess</button> */}
                        <GridArea>
                            <AlertData isAlertDataOpen={isAlertDataOpen}>
                                <div className='alertDataInner'>
                                    <div className='alertDataText'>
                                        모델을 학습하려면 2개 이상의 클래스가 필요하며, 각 클래스에 샘플이 {taskType === 'image' ? 10 : 20}개 이상 있어야 합니다.
                                    </div>
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
                                                {list.map((item, index) => (
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
                                                ))}
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
                                <AddClassButton/>
                            </DataModule>
                            <Draggable2 onDrag={updateXarrow} onStop={updateXarrow}>
                                <PreprocessModuleWrapper isPreprocessOpen={isPreprocessOpen}>
                                    <PreprocessModule isPreprocessOpen={isPreprocessOpen}>
                                        <div ref={preprocessModuleStartRef} className='trainModuleRef'/>
                                        <PreprocessComponent />
                                        <div ref={preprocessModuleEndRef} className='trainModuleRef'/>
                                    </PreprocessModule>
                                </PreprocessModuleWrapper>
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
                            {xArrows}
                            {
                            isPreprocessOpen
                            ?
                            <Xarrow
                                start={preprocessModuleEndRef} 
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

const HeaderWrapper = styled.div`
    width: 100%;
    height: 70px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
    padding-left: 20px;
    padding-right: 20px;

    .headerUpper {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .headerLower {
        width: 100%;
        height: 30px;
    }

    .upperWrapper {
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .upperLeft {
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .upperRight {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .upperRightItem {
            color: ${TEACHABLE_COLOR_LIST.GRAY}
            margin-right: 20px;
        }
    }

    .upperEnd {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .upperEndItem {
            margin-left: 15px;
            font-size: 12px;
            border-radius: 3px;
            padding-top: 2px;
            padding-bottom: 2px;
            padding-left: 8px;
            padding-right: 8px;
            letter-spacing: 1px;
            background-color: rgba(55, 178, 77, .3);
            color: #37b24d;
            font-weight: 600;

            &.type {
                color: #1967D2;
                background-color: rgba(25, 113, 194, .3);
            }
        }
    }
`;

const ProgressIndicatorWrapper = styled.div`
    width: 100%;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
`;

const ProgressNone = styled.div`
    width: 100%;
    height: 4px;
`;

const MainWrapper = styled.div`
    width: 100%;
    height: calc(100% - 70px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
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

    ${props => !props.isOptionAreaOpen && 
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
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};

    }
`;

const GridArea = styled.div`
    width: 100%;
    height: 100%;
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

const PreprocessModuleWrapper = styled.div`
    ${props => props.isPreprocessOpen && `
        display: block;
    `}
    ${props => !props.isPreprocessOpen && `
        display: none;
    `}
`;

const PreprocessModule = styled.div`
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

