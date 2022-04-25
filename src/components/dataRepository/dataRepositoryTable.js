import React from 'react';
import styled from 'styled-components'
	;
import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/dataRepository/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';

export default function DataRepositoryTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;

	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<th>
						<TD_1>
							<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
						</TD_1>
					</th>
					<th>
						<TD_2>
							<SortIcon
								columnName={'Dataset'}
								sortColumn={'dataset_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<SortIcon
								columnName={'Group'}
								sortColumn={'group_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<SortIcon
								columnName={'Project'}
								sortColumn={'project_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5>
							<SortIcon
								columnName={'User ID'}
								sortColumn={'user_id'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_5>
					</th>
					<th>
						<TD_6>
							<SortIcon
								columnName={'Type'}
								sortColumn={'dataset_type'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_6>
					</th>
					<th>
						<TD_7>
							<SortIcon
								columnName={'Label'}
								sortColumn={'label_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_7>
					</th>
					<th>
						<TD_8>
							<SortIcon
								columnName={'Created'}
								sortColumn={'create_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_8>
					</th>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => (
						<TableRow
							key={index}
							isChecked={checkItems.includes(data)}
							onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
						>
							{
								<>
									<td>
										<TD_1>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
												// NoClickable={true}
											/>
										</TD_1>
									</td>
									<td>
										<TD_2>
											{data.dataset_nm}
											<NewBadge date={data.create_date} />
										</TD_2>
									</td>
									<td>
										<TD_3>{data.group_nm}</TD_3>
									</td>
									<td>
										<TD_4>{data.project_nm}</TD_4>
									</td>
									<td>
										<TD_5>{data.user_id}</TD_5>
									</td>
									<td>
										<TD_6>{data.dataset_type}</TD_6>
									</td>
									<td>
										<TD_7>{data.label_nm}</TD_7>
									</td>
									<td>
										<TD_8 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_8>
									</td>
								</>
							}
						</TableRow>
					))}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const TD_1 = styled.div`
	width: 63px;
	padding-left: 19px;
	padding-right: 24px;
	text-align: left;
`;
const TD_2 = styled.div`
	display: flex;
	width: 248px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 248px;
	padding-right: 30px;
`;
const TD_4 = styled.div`
	display: flex;
	width: 328px;
	padding-right: 30px;
`;
const TD_5 = styled.div`
	display: flex;
	width: 158px;
	padding-right: 20px;
`;
const TD_6 = styled.div`
	display: flex;
	width: 148px;
	padding-right: 20px;
`;
const TD_7 = styled.div`
	display: flex;
	width: 168px;
	padding-right: 20px;
`;
const TD_8 = styled.div`
	display: flex;
	width: 146px;
	padding-right: 20px;
`;
