import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { ReactPictureAnnotation } from 'react-picture-annotation';
import styled, { keyframes, css } from 'styled-components';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import AnnotationFileViewerComponent from 'components/teachable/AnnotationFileViewerComponent';
import AnnotationDataComponent from 'components/teachable/AnnotationDataComponent';
import { generateDataset } from 'tf-od/dataprep';
import { startTrain } from 'tf-od/train';

const defaultShapeStyle = {
    /** text area **/
    padding: 5, // text padding
    fontSize: 14, // text font size
    fontColor: 'white', // text font color
    fontBackground: TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT, // text background color
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif",
    
    /** stroke style **/
    lineWidth: 2, // stroke width
    shapeBackground: "hsla(210, 16%, 93%, 0.2)", // background color in the middle of the marker
    shapeStrokeStyle: TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT, // shape stroke color
    shadowBlur: 10, // stroke shadow blur
    shapeShadowStyle: "hsla(210, 9%, 31%, 0.35)", // shape shadow color
    
    /** transformer style **/
    transformerBackground: TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR,
    transformerSize: 10
};


const App = () => {
    const history = useHistory();
	const { 
        taskType, 
        detection_list, 
    } = useHandleState();
  const [ selectedIndex, setSelectedIndex ] = useState(0);
	const [ imageList, setImageList ] = useState([]);
	const { changeDetectionList } = useStateActionHandler();

	const id = detection_list[0].id;

	useEffect(() => {
			const initialImageList = detection_list[0].data.filter(item => item.annotation_type === 'tool');
			setImageList(initialImageList);
		}, [])

	const [pageSize, setPageSize] = useState({
			width: window.innerWidth - 300,
			height: window.innerHeight - 150
	  });
	  const onResize = () => {
			setPageSize({ width: window.innerWidth - 300, height: window.innerHeight - 150});
	  };
	
	  useEffect(() => {
			window.addEventListener('resize', onResize);
			return () => window.removeEventListener('resize', onResize);
	  }, []);

	const onSelect = selectedId => console.log(selectedId);

	const onChange = (data) => {
		const changed_list = imageList.map((item, index) => {
        if (index === selectedIndex) {
					return {
						...item,
						name: item.path,
						annotation_tool: data,
					}
        } else {
					return {
						...item,
						name: item.path,
					}
				}
		});
		setImageList(changed_list);
	}

	const handleClickNext = (index) => {
		setSelectedIndex(index);
	};

	const handleClickAnnotationDelete = (annotationId) => {
		const changed_list = imageList.map((item, index) => {
			if (index === selectedIndex) {
				const changed_annotation = item.annotation_tool.filter((annotaion) => annotaion.id !== annotationId);
				return {
					...item,
					name: item.path,
					annotation_tool: changed_annotation,
				}
			} else {
				return {
					...item,
					name: item.path,
					
				}
			}
		});
		setImageList(changed_list);
	};

	const handleClickSubmit = () => {
		// const dataList = detection_list[0].data;
		// const {images, targets} = generateDataset(dataList);
		// const batchSize = 4;
		// const initialTransferEpochs = 50;
		// const fineTuningEpochs = 50;
		// startTrain(images, targets, batchSize, initialTransferEpochs, fineTuningEpochs);

		let isAnnotation = true;

		imageList.forEach(item => {
			if (item.annotation_tool.length === 0) {
				isAnnotation = false;
				return;
			} else {
				item.annotation_tool.forEach(annotation => {
					if (!annotation.hasOwnProperty('comment')) {	
						isAnnotation = false;
						return;
					}
				});
			}
		});
		
		if (!isAnnotation) {
			alert("라벨링이 되지 않은 데이터가 있습니다. 라벨링을 완료해 주세요.");
			return;
		}

		const changed_list = detection_list.map((item) => {
			if (item.id === id) {
				let newData = item.data.slice();
				const annotatedData = newData.map((file, index) => {
					let newFile = file;
					imageList.forEach(imageItem => {
						if (file.name === imageItem.name) {
							newFile = {
								...file,
								name: file.name,
								annotation_tool: imageItem.annotation_tool
							};
						} else {
							return;
						}
					})
					return newFile;
				});
				return {
						...item,
						data: annotatedData
				};
			} else {
					return item;
			}
		});

		changeDetectionList({
			detection_list: changed_list
		});

		history.push('/easyml/image/detection/annotation');
	}

	const handleClickCancel = () => {
		history.push('/easyml/image/detection/annotation');
	}

  
	return (
	  <AnnotationWrapper>
		<LeftArea>
			<div className='innerWrapper'>
			{
				imageList.length > 0
				?
				<ReactPictureAnnotation
					key={selectedIndex}
					image={imageList[selectedIndex].base64}
					onSelect={onSelect}
					onChange={onChange}
					width={pageSize.width}
					height={pageSize.height}
					scrollSpeed={0}
					annotationData={imageList[selectedIndex].annotation_tool}
					annotationStyle={defaultShapeStyle}
				/>
				:
				null
			}
			</div>
		</LeftArea>
		<RightArea>
			{
				imageList.length > 0
				?
				<>
				<AnnotationFileViewerComponent id={0} data={imageList} handleClickNext={handleClickNext}/>
				<AnnotationDataComponent annotationIndex={0} annotationData={imageList[selectedIndex].annotation_tool} handleClickAnnotationDelete={handleClickAnnotationDelete}/>
				</>
				:
				null
			}
			<div className='buttonWrapper'>
				<div className='annotationSubmit' onClick={handleClickSubmit}>Submit</div>
				<div className='annotationCancel' onClick={handleClickCancel}>Cancel</div>
			</div>
		</RightArea>
	  </AnnotationWrapper>
	);
  };

export default App;

  
const AnnotationWrapper = styled.div`
	width: 100%;
	height: calc(100vh - 70px);
	display: flex;
    justify-content: center;
    align-items: flex-start;
	background: ${TEACHABLE_COLOR_LIST.GRID_BACKGROUND};
`;

const LeftArea = styled.div`
	width: calc(100vw - 350px);
	.innerWrapper {
		width: calc(100vw - 350px);
		margin-top: 40px;
	}
`;

const RightArea = styled.div`
	width: 350px;
	padding: 12.5px;

	.buttonWrapper {
		width: 100%;
		height: 40px;
		margin-top: 30px;
		display: flex;    
		justify-content: space-between;
		align-items: center;
	}

	.annotationSubmit {
		width: 48%;
		height: 40px;
		line-height: 40px;
		color: white;
		text-align: center;
		background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;

		&:hover {
			background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
		}
	}

	.annotationCancel {
		width: 48%;
		height: 40px;
		line-height: 40px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
		text-align: center;
        border: 1px ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR} solid;
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;

		&:hover {
            background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
		}
	}
`;
  