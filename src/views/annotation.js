import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { ReactPictureAnnotation } from 'react-picture-annotation';
import styled, { keyframes, css } from 'styled-components';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const App = () => {
	const { 
        taskType, 
        list, 
    } = useHandleState();
    const [ selectedIndex, setSelectedIndex ] = useState(0);

	const imageList = list[0].data;

	const images = imageList.map((item) => {
		return {
			src: item.base64,
			name: item.name
		}
	});


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
	const onChange = data => console.log(data);

	const handleClickNext = () => {
		setSelectedIndex(selectedIndex + 1);
	}
  
	return (
	  <AnnotationWrapper>
		<LeftArea>
			<div className='innerWrapper'>
			<ReactPictureAnnotation
				image={images[selectedIndex].src}
				onSelect={onSelect}
				onChange={onChange}
				width={pageSize.width}
				height={pageSize.height}
				scrollSpeed={0}
			/>
			</div>
		</LeftArea>
		<RightArea>
			<button onClick={handleClickNext}>Next</button>
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
`;

const LeftArea = styled.div`
	width: calc(100vw - 300px);
	.innerWrapper {
		width: calc(100vw - 300px);
		margin-top: 40px;
	}
`;

const RightArea = styled.div`
	border: 1px solid blue;
	width: 300px;
	height: 700px;
`;
  