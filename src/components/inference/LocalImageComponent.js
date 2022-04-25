import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Checkbox from 'components/common/table/Checkbox';
import { InferenceContext } from 'views/Inference';

export default function LocalImageComponent(props) {
	const { uploadFiles, checkItems, setCheckItems } = props;
	const len = uploadFiles.length / 6;

	const maps = [];
	for (let i = 0; i < len; i++) {
		maps.push(i);
	}

	return (
		<LocalImageArea>
			{maps.map((index) => {
				const startIndex = index * 6;
				const endIndex = startIndex + 6 > uploadFiles.length ? uploadFiles.length : startIndex + 6;
				const data = uploadFiles.slice(startIndex, endIndex);
				return (
					<Container>
						<ContentRows datas={data} checkItems={checkItems} setCheckItems={setCheckItems} />
					</Container>
				);
			})}
		</LocalImageArea>
	);
}

const ContentRows = (props) => {
	const { datas, checkItems, setCheckItems } = props;
	const { isRunning } = useContext(InferenceContext);
	return datas.map((data, index) => {
		const isUrlImage = typeof data === 'string';
		return (
			<Content key={index}>
				{!isRunning && (
					<CheckBoxArea>
						<Checkbox
							data={data}
							checked={checkItems.includes(data)}
							checkItems={checkItems}
							setCheckItems={setCheckItems}
							colorType={'white'}
						/>
					</CheckBoxArea>
				)}
				{isUrlImage ? <ImgBox src={data} /> : <ImgBox src={URL.createObjectURL(data)} />}
			</Content>
		);
	});
};
const LocalImageArea = styled.div`
	height: 245px;
	overflow: overlay;
`;
const Container = styled.div`
	width: 100%;
	display: flex;
	margin-bottom: 5px;
`;
const Content = styled.div`
	width: 240px;
	height: 135px;
	margin-right: 5px;
	display: flex;
	flex-direction: column;
	position: relative;
`;
const ImgBox = styled.img`
	width: 240px;
	height: 135px;
	background: ${colors.gray_light};
`;
const CheckBoxArea = styled.div`
	position: absolute;
	top: 4px;
	left: 4px;
`;
