import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { DatasetImageContext } from 'components/dataSet/Detail/ImageComponent';

const StaticComponent = (props) => {
	const { attributes } = useContext(DatasetImageContext);
	return (
		<div>
			<TableHeader>
				<Th1>
					<div>ATTRIBUTE</div>
				</Th1>
			</TableHeader>
			<TableBody>
				<TableRow>
					<Th1>Width</Th1>
					<Th2>{attributes.width}</Th2>
				</TableRow>
				<TableRow>
					<Th1>Height</Th1>
					<Th2>{attributes.height}</Th2>
				</TableRow>
				<TableRow>
					<Th1>W : H</Th1>
					<Th2>{attributes.ratio}</Th2>
				</TableRow>
				<TableRow>
					<Th1>Size</Th1>
					<Th2>{attributes.size}</Th2>
				</TableRow>
			</TableBody>
		</div>
	);
};
export default StaticComponent;

const Th2 = styled.div`
	display: flex;
`;

const Th1 = styled.div`
	margin-left: 16px;
	width: 95px;
	margin-right: 5px;
	display: flex;
`;

const TableRow = styled.div`
	width: 240px;
	height: 40px;
	color: #82878b;
	font-size: 14px;
	display: flex;
	font-weight: 500;
	align-items: center;
	border-bottom: 1px solid #eaebec;
	// :hover {
	//   cursor: pointer;
	//   background: ${colors.hover_sel};
	// }
`;

const TableBody = styled.div`
	height: 200px;
	overflow-y: auto;
`;

const TableHeader = styled.div`
	width: 250px;
	height: 40px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	display: flex;
	font-weight: 700;
	align-items: center;
`;
