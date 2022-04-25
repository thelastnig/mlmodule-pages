import React, { memo } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

const DlgInferenceImageTable = memo((props) => {
	const { list, imageClicked, selectData } = props;
	console.log('dsdsds list = ', list);
	console.log('dsdsds selectData = ', selectData);
	return (
		<div>
			<Divider />
			<TableHeader>
				<Th1>No.</Th1>
				<Th2>Dataset</Th2>
			</TableHeader>
			<Divider />
			<TableBody>
				{list.map((data, index) => (
					<TableRow isChecked={selectData === data} key={index} onClick={(e) => imageClicked(data)}>
						<Th1>{index + 1}</Th1>
						<Th2>{data}</Th2>
					</TableRow>
				))}
			</TableBody>
		</div>
	);
});
export default DlgInferenceImageTable;

const Divider = styled.div`
	width: 300px;
	height: 1px;
	background-color: #eaebec;
`;

const TableHeader = styled.div`
	width: 300px;
	height: 34px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	display: flex;
	font-weight: 700;
	align-items: center;
`;

const TableBody = styled.div`
	width: 300px;
	height: 407px;
	overflow-y: auto;
`;

const TableRow = styled.div`
	width: 300px;
	height: 36px;
	color: #82878b;
	font-size: 14px;
	display: flex;
	font-weight: 500;
	align-items: center;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;

const Th2 = styled.div`
	display: flex;
	width: 200px;
	padding: 0 16px;
`;

const Th1 = styled.div`
	display: flex;
	width: 100px;
	padding: 0 16px;
`;
