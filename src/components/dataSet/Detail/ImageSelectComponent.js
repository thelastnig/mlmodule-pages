import React, { useContext } from 'react';
import styled from 'styled-components';

import { DatasetImageContext } from 'components/dataSet/Detail/ImageComponent';

const ImageSelectComponent = ({ imageData }) => {
	// const { imageData } = useContext(DatasetImageContext);

	return (
		<>
			{imageData ? (
				<PreviewImg
					// src={URL.createObjectURL(imageData)}
					src={`data:image/jpeg;base64,${imageData}`}
				/>
			) : (
				<ImageArea>IMAGE</ImageArea>
			)}
		</>
	);
};
export default ImageSelectComponent;

const PreviewImg = styled.img`
	width: 100%;
	max-width: 432px;
	height: 243px;
	object-fit: contain;
`;
const ImageArea = styled.div`
	width: 432px;
	height: 243px;
	background-color: #b5bcc4;
`;
