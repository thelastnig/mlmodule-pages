import React from 'react';
import styled from 'styled-components';

import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/annotation/hooks';

import {
	SortIcon,
	StyledTable,
	TableRow,
	TableHeaderComponent,
	TableBodyComponent,
} from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';
import { SatusDot } from 'components/common/StyledComponent';
import MoreButton from 'components/annotation/AnnotationMoreButton';
import { checkOnlyOneClickCB } from 'components/common/table/Checkbox';

export default function AnnotationTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;

	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<TD_1>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_1>
					<TD_2>
						<SortIcon
							columnName={'Project'}
							sortColumn={'project_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_2>
					<TD_3>
						<SortIcon
							columnName={'Type'}
							sortColumn={'type'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_3>
					<TD_4>
						<SortIcon
							columnName={'Model'}
							sortColumn={'model'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_4>
					<TD_5>
						<SortIcon
							columnName={'Total'}
							sortColumn={'total'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_5>
					<TD_6>
						<SortIcon
							columnName={'Status'}
							sortColumn={'status'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_6>
					<TD_7>
						<SortIcon
							columnName={'Annotator'}
							sortColumn={'annotator_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_7>
					<TD_8>
						<SortIcon
							columnName={'Created'}
							sortColumn={'assigned_time'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_8>
					<TD_9>
						<SortIcon
							columnName={'Updated'}
							sortColumn={'update_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_9>
					<TD_10>
						<div></div>
					</TD_10>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => (
						<TableRow
							key={index}
							isChecked={checkItems.includes(data)}
							onClick={(e) => checkOnlyOneClickCB(data, checkItems, setCheckItems)}
						>
							{
								<>
									<TD_1>
										{data.dataset_nm}
										<NewBadge date={data.assigned_time} />
									</TD_1>
									<TD_2>{data.project_nm}</TD_2>
									<TD_3>{data.type}</TD_3>
									<TD_4>{data.model}</TD_4>
									<TD_5>{data.total}</TD_5>
									<TD_6>
										<SatusDot type={data.status.toLowerCase()}></SatusDot>
										{data.status}
									</TD_6>
									<TD_7>{data.annotator_id}</TD_7>
									<TD_8>{DateUtil.parseDateToYYYYMMDD(data.assigned_time)}</TD_8>
									<TD_9>{DateUtil.parseDateToYYYYMMDD(data.update_date)}</TD_9>
									<TD_10>
										<MoreButton data={data} />
									</TD_10>
								</>
							}
						</TableRow>
					))}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const TD_1 = styled.td`
	display: flex;
	width: 312px;
	padding-left: 25px;
	padding-right: 8px;
`;

const TD_2 = styled.td`
	display: flex;
	width: 312px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_3 = styled.td`
	display: flex;
	width: 80px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_4 = styled.td`
	display: flex;
	width: 140px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_5 = styled.td`
	display: flex;
	width: 120px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_6 = styled.td`
	display: flex;
	width: 120px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_7 = styled.td`
	display: flex;
	width: 150px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_8 = styled.td`
	width: 120px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_9 = styled.td`
	width: 120px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_10 = styled.td`
	width: 48px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;
