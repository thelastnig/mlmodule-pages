import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import DateUtil from 'utils/DateUtil';
import * as colors from 'styles/colors';

import Spacer from 'components/spacer';
import { AnalyzeContext } from 'views/Analyze';
import { SortIcon } from 'components/common/table/TableComponent';
import RadioButton from 'component/RadioButton';
import { BoxTitle, LeftContainerBottom } from 'views/PreProcess';

const HisotryTable = (props) => {
	const { sorting, sorting_type, updateSortingCB, historyList } = useContext(AnalyzeContext);
	const [checkItem, setCheckItem] = useState('');

	useEffect(() => {
		if (historyList.length > 0) {
			setCheckItem(historyList[0]);
		}
	}, [historyList]);

	return (
		<LeftContainerBottom>
			<BoxTitle>History</BoxTitle>
			<Spacer size={'lg'} />
			<CommonTh>
				<HistoryTD_1></HistoryTD_1>
				<HistoryTD_2>
					<div>No.</div>
				</HistoryTD_2>
				<HistoryTD_3>
					<SortIcon
						columnName={'DATE'}
						sortColumn={'create_date'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</HistoryTD_3>
				<HistoryTD_4>
					<SortIcon
						columnName={'PREPROCESS'}
						sortColumn={'pipeline_algorithm'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</HistoryTD_4>
				<HistoryTD_5>
					<SortIcon
						columnName={'Version'}
						sortColumn={'version'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</HistoryTD_5>
			</CommonTh>
			<Tbody>
				{historyList.map((data, index) => (
					<CommonTr>
						<HistoryTD_1>
							<RadioButton
								data={data}
								selected={checkItem === data}
								onClick={(e, data) => {
									setCheckItem(data);
								}}
							/>
						</HistoryTD_1>
						<HistoryTD_2>{index + 1}</HistoryTD_2>
						<HistoryTD_3 style={{ color: colors.light_blue }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</HistoryTD_3>
						<HistoryTD_4>{data.pipeline_algorithm}</HistoryTD_4>
						<HistoryTD_5>{data.version}</HistoryTD_5>
					</CommonTr>
				))}
			</Tbody>
		</LeftContainerBottom>
	);
};
export default HisotryTable;

const HistoryTD_1 = styled.div`
	width: 66px;
	display: flex;
	align-items: center;
`;
const HistoryTD_2 = styled.div`
	display: flex;
	width: 100px;
	margin-right: 32px;
`;
const HistoryTD_5 = styled.div`
	display: flex;
	width: 60px;
`;
const HistoryTD_4 = styled.div`
	display: flex;
	width: 100px;
	margin-right: 88px;
`;
const HistoryTD_3 = styled.div`
	display: flex;
	width: 80px;
	margin-right: 118px;
`;

const CommonTh = styled.div`
	width: 692px;
	height: 40px;
	padding: 11px 0px 10px 16px;
	background: ${colors.list_header};
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	display: flex;
`;
const CommonTr = styled.div`
	width: 692px;
	height: 40px;
	padding: 10px 0px 10px 16px;
	border-bottom: 1px solid ${colors.line_color};
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	display: flex;
`;
export const Tbody = styled.div`
	height: 200px;
	overflow: hidden;
	overflow-y: auto;
`;
