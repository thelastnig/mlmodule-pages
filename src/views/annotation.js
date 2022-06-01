import React, { useCallback, useState, useEffect, useRef } from 'react';
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
	const { 
        taskType, 
        detection_list, 
    } = useHandleState();
    const [ selectedIndex, setSelectedIndex ] = useState(0);
	const [ value, setValue ] = useState();
	const { changeList,
    } = useStateActionHandler();

	const imageList = detection_list[0].data;
	const id = detection_list[0].id;

	const annotationList = imageList[selectedIndex].annotation;

	const images = imageList.map((item) => {
		return {
			src: item.base64,
			name: item.name,
			annotation: item.annotation
		}
	});

	useEffect(() => {
		setValue({});
    }, [selectedIndex])

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
		const changed_list = detection_list.map((item) => {
            if (item.id === id) {
				let new_data = item.data.slice();
				new_data[selectedIndex]['annotation'] = data;
				return {
					...item,
					data: new_data
				};
            } else {
                return item;
            }
        })
        changeList({
            list: changed_list
        });
	};

	const handleClickNext = (index) => {
		setSelectedIndex(index);
	};

	const handleClickAnnotationDelete = (annotationId) => {
		const changed_list = detection_list.map((item) => {
            if (item.id === id) {
				let new_data = item.data.slice();
				const changed_annotation = new_data[selectedIndex]['annotation'].filter((item) => item.id !== annotationId);
				new_data[selectedIndex]['annotation'] = changed_annotation;
				return {
					...item,
					data: new_data
				};
            } else {
                return item;
            }
        })
        changeList({
            list: changed_list
        });
	};

	const handleClicSubmit = () => {
		const dataList = detection_list[0].data;
		const {images, targets} = generateDataset(dataList);
		const batchSize = 4;
		const initialTransferEpochs = 50;
		const fineTuningEpochs = 50;
		startTrain(images, targets, batchSize, initialTransferEpochs, fineTuningEpochs);
	};
  
	return (
	  <AnnotationWrapper>
		<LeftArea>
			<div className='innerWrapper'>
			<ReactPictureAnnotation
				key={selectedIndex}
				image={images[selectedIndex].src}
				onSelect={onSelect}
				onChange={onChange}
				width={pageSize.width}
				height={pageSize.height}
				scrollSpeed={0}
				annotationData={images[selectedIndex].annotation}
				annotationStyle={defaultShapeStyle}
			/>
			</div>
		</LeftArea>
		<RightArea>
			<AnnotationFileViewerComponent id={0} data={imageList} handleClickNext={handleClickNext}/>
			<AnnotationDataComponent annotationIndex={0} annotationData={annotationList} handleClickAnnotationDelete={handleClickAnnotationDelete}/>
			<div className='annotationSubmit' onClick={handleClicSubmit}>Submit</div>
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

	.annotationSubmit {
		width: 100%;
		height: 40px;
		line-height: 40px;
		color: white;
		margin-top: 30px;
		text-align: center;
		background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
		cursor: pointer;
		font-size: 14px;
		font-weight: 600;

		&:hover {
			background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
		}


	}
`;
  