import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import { InferenceContext } from 'views/Inference';

const ResultImage = (props) => {
	const { list } = props;
	const { showResultItem } = useContext(InferenceContext);

	return list ? (
		list.map((data, index) => {
			return (
				<Content key={index}>
					<ImgBox src={data.url} onClick={(e) => showResultItem(data)} />
					<Spacer size={'sm'} />
					<ImgTitle>{data.file_name}</ImgTitle>
					<Spacer size={'xs'} />
				</Content>
			);
		})
	) : (
		<></>
	);
};
export default ResultImage;

const Content = styled.div`
	width: 240px;
	margin-right: 5px;
	display: flex;
	flex-direction: column;
	display: inline-block;
`;
const ImgBox = styled.img`
	width: 240px;
	height: 135px;
	background: ${colors.gray_light};
	cursor: pointer;
`;
const ImgTitle = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
