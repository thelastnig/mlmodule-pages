import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { StyledTable, TableRow } from 'components/common/table/TableComponent';
import { PreprocessContext } from 'views/PreProcess';
import { Tbody } from 'components/dataSet/Preprocess/HistoryComponent';
import { TableArea } from 'views/userGroup';
import { StyledTableHeader } from 'components/models/LogTable';

const PipeLineTable = () => {
	const { historyList, selectHistory, setSelectHistory } = useContext(PreprocessContext);

	useEffect(() => {
		if (!selectHistory && historyList.length > 0) {
			setSelectHistory(historyList[0]);
		}
	}, [selectHistory, historyList]);
	return (
		<TableArea>
			<StyledTable>
				<StyledTableHeader>
					<PipeLineTD_1>
						<div>No.</div>
					</PipeLineTD_1>
					<PipeLineTD_2>
						<div>DATA</div>
						{/*<SortIcon*/}
						{/*  sortColumn={'create_date'}*/}
						{/*  sorting={sorting}*/}
						{/*  sorting_type={sorting_type}*/}
						{/*  updateSortingCB={updateSortingCB}*/}
						{/*/>*/}
					</PipeLineTD_2>
					<PipeLineTD_3>
						<div>PREPROCESS</div>
						{/*<SortIcon*/}
						{/*  sortColumn={'pipeline_algorithm'}*/}
						{/*  sorting={sorting}*/}
						{/*  sorting_type={sorting_type}*/}
						{/*  updateSortingCB={updateSortingCB}*/}
						{/*/>*/}
					</PipeLineTD_3>
				</StyledTableHeader>
				<Tbody>
					{historyList.map((data, index) => (
						<TableRow
							key={index}
							isChecked={selectHistory === data}
							onClick={(e) => {
								setSelectHistory(data);
							}}
							style={{ height: '37px', borderTop: 'none', borderBottom: '1px solid #eaebec' }}
						>
							<PipeLineTD_1 style={{ color: '#82878b' }}>{index + 1}</PipeLineTD_1>
							<PipeLineTD_2 style={{ color: colors.light_blue }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</PipeLineTD_2>
							<PipeLineTD_3 style={{ color: '#82878b' }}>{data.pipeline_algorithm}</PipeLineTD_3>
						</TableRow>
					))}
				</Tbody>
			</StyledTable>
		</TableArea>
	);
};
export default PipeLineTable;
const PipeLineTD_1 = styled.td`
	display: flex;
	width: 220px;
	padding-left: 10px;
`;
const PipeLineTD_2 = styled.td`
	display: flex;
	width: 240px;
	padding-left: 10px;
`;
const PipeLineTD_3 = styled.td`
	display: flex;
	padding-left: 10px;
`;
