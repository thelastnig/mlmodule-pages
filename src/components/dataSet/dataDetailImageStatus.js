import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

export default function DataDetailStatusTable(props) {
	const { data } = props;
	return (
		<div>
			<TableHeader>
				<Th1>ATTRIBUTE</Th1>
				<Th2>MIN</Th2>
				<Th3>MAX</Th3>
				<Th4>MEAN</Th4>
				<Th5>MEDIAN</Th5>
			</TableHeader>
			<TableBody>
				<TableRow>
					<Th1>Width</Th1>
					<Th2>{data.image_min_width}</Th2>
					<Th3>{data.image_max_width}</Th3>
					<Th4>{data.image_mean_width}</Th4>
					<Th5>{data.image_median_width}</Th5>
				</TableRow>
				<TableRow>
					<Th1>Height</Th1>
					<Th2>{data.image_min_height}</Th2>
					<Th3>{data.image_max_height}</Th3>
					<Th4>{data.image_mean_height}</Th4>
					<Th5>{data.image_median_height}</Th5>
				</TableRow>
				<TableRow>
					<Th1>W : H</Th1>
					<Th2>{data.image_min_aspect_ratio}</Th2>
					<Th3>{data.image_max_aspect_ratio}</Th3>
					<Th4>{data.image_mean_aspect_ratio}</Th4>
					<Th5>{data.image_median_aspect_ratio}</Th5>
				</TableRow>
				<TableRow>
					<Th1>Size</Th1>
					<Th2>{data.image_min_size}</Th2>
					<Th3>{data.image_max_size}</Th3>
					<Th4>{data.image_mean_size}</Th4>
					<Th5>{data.image_median_size}</Th5>
				</TableRow>
			</TableBody>
		</div>
	);
}
const Th5 = styled.div`
	display: flex;
`;
const Th4 = styled.div`
	display: flex;
	width: 100px;
	margin-right: 42px;
`;

const Th3 = styled.div`
	width: 100px;
	margin-right: 34px;
	display: flex;
`;

const Th2 = styled.div`
	width: 100px;
	margin-right: 31px;
	display: flex;
`;

const Th1 = styled.div`
	margin-left: 16px;
	width: 100px;
	margin-right: 76px;
	display: flex;
`;

const TableRow = styled.div`
	width: 692px;
	height: 40px;
	color: #82878b;
	font-size: 14px;
	display: flex;
	font-weight: 500;
	align-items: center;
	border-bottom: 1px solid #eaebec;
	:hover {
		cursor: pointer;
		background: ${colors.hover_sel};
	}
`;

const TableBody = styled.div`
	height: 200px;
	overflow-y: auto;
`;

const TableHeader = styled.div`
	width: 692px;
	height: 40px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	display: flex;
	font-weight: 700;
	align-items: center;
`;
