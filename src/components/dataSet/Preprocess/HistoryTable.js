import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { PreprocessContext } from 'views/PreProcess';
import { SortIcon } from 'components/common/table/TableComponent';
import RadioButton from 'component/RadioButton';
import { checkIsRunning } from 'views/expRun';
import { CommonTh, CommonTr, Tbody } from 'components/dataSet/Preprocess/HistoryComponent';

const HisotryTable = (props) => {
	const { sorting, sorting_type, updateSortingCB, historyList, selectHistory, setSelectHistory, status } = useContext(PreprocessContext);
	return (
		<div>
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
								selected={selectHistory === data}
								onClick={(e) => {
									if (checkIsRunning(status)) {
										return;
									}
									setSelectHistory(data);
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
		</div>
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
