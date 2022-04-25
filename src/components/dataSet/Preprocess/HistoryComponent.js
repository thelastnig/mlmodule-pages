import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import { BoxTitle, LeftContainerBottom, PreprocessContext } from 'views/PreProcess';
import PipeLineTable from 'components/dataSet/Preprocess/PipeLineTable';
import HistoryTable from 'components/dataSet/Preprocess/HistoryTable';

const HistoryComponent = (props) => {
	const { isTemplateMode } = useContext(PreprocessContext);
	return (
		<>
			{isTemplateMode ? (
				<LeftContainerBottom>
					<BoxTitle>Pipeline</BoxTitle>
					<Spacer size={'lg'} />
					<PipeLineTable />
				</LeftContainerBottom>
			) : (
				<LeftContainerBottom>
					<BoxTitle>History</BoxTitle>
					<Spacer size={'lg'} />
					<HistoryTable />
				</LeftContainerBottom>
			)}
		</>
	);
};
export default HistoryComponent;

export const CommonTh = styled.div`
	width: 100%;
	height: 40px;
	padding: 11px 0px 10px 16px;
	background: ${colors.list_header};
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	display: flex;
`;
export const Tbody = styled.div`
	height: 200px;
	overflow: hidden;
	overflow-y: auto;
`;

export const CommonTr = styled.div`
	width: 690px;
	height: 40px;
	padding: 10px 0px 10px 16px;
	border-bottom: 1px solid ${colors.line_color};
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	display: flex;
`;
