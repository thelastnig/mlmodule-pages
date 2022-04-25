import React from 'react';
import styled from 'styled-components';

import './userGroupTable.scss';
import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/usergroup/hooks';

import { checkOnlyOneClickCB } from 'components/common/table/Checkbox';
import { makeEmptyRow, SortIcon, StyledTable, TableHeader, TableRow } from 'components/common/table/TableComponent';
import EmptyTable from 'components/common/table/EmptyTable';
import NewBadge from 'component/NewBadge';

export default function UserGroupTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, total_row_count } = props;
	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	const emptyRow = makeEmptyRow(emptyRowCnt);

	return (
		<>
			<StyledTable>
				<TableHeader>
					<tr>
						<th>
							<TD_1>
								<SortIcon
									columnName={'User ID'}
									sortColumn={'user_id'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_1>
						</th>
						<th>
							<TD_2>
								<SortIcon
									columnName={'NAME'}
									sortColumn={'user_nm'}
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
									columnName={'LEVEL'}
									sortColumn={'level_nm'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_4>
						</th>
						<th>
							<TD_5>
								<SortIcon
									columnName={'Status'}
									sortColumn={'working_status_nm'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_5>
						</th>
						<th>
							<TD_6>
								<SortIcon
									columnName={'Created'}
									sortColumn={'create_date'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_6>
						</th>
						<th>
							<TD_7>
								<SortIcon
									columnName={'Updated'}
									sortColumn={'update_date'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_7>
						</th>
					</tr>
				</TableHeader>
				<tbody>
					{total_row_count !== 0 ? (
						<>
							{list.map((data, index) => (
								<TableRow
									key={index}
									isChecked={checkItems.includes(data)}
									onClick={(e) => checkOnlyOneClickCB(data, checkItems, setCheckItems)}
								>
									{
										<>
											<td>
												<TD_1>
													<div>{data.user_id}</div>
													<NewBadge date={data.create_date} />
												</TD_1>
											</td>
											<td>
												<TD_2>{data.user_nm}</TD_2>
											</td>
											<td>
												<TD_3>{data.group_nm}</TD_3>
											</td>
											<td>
												<TD_4>{data.level_nm}</TD_4>
											</td>
											<td>
												<TD_5>{data.working_status_nm}</TD_5>
											</td>
											<td>
												<TD_6 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_6>
											</td>
											<td>
												<TD_7 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.update_date)}</TD_7>
											</td>
										</>
									}
								</TableRow>
							))}
							{emptyRow.map((data, index) => (
								<TableRow key={index}>
									{
										<>
											<td>
												<TD_1></TD_1>
											</td>
											<td>
												<TD_2></TD_2>
											</td>
											<td>
												<TD_3></TD_3>
											</td>
											<td>
												<TD_4></TD_4>
											</td>
											<td>
												<TD_5></TD_5>
											</td>
											<td>
												<TD_6></TD_6>
											</td>
											<td>
												<TD_7></TD_7>
											</td>
										</>
									}
								</TableRow>
							))}
						</>
					) : (
						<EmptyTable />
					)}
				</tbody>
			</StyledTable>
		</>
	);
}

const TD_1 = styled.div`
	display: flex;
	width: 186px;
	padding-left: 15px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_2 = styled.div`
	display: flex;
	width: 236px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 327px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_4 = styled.div`
	display: flex;
	width: 196px;
	padding-right: 36px;
`;
const TD_5 = styled.div`
	display: flex;
	width: 196px;
	padding-right: 36px;
`;
const TD_6 = styled.div`
	display: flex;
	width: 211px;
	padding-right: 36px;
`;
const TD_7 = styled.div`
	display: flex;
	width: 150px;
	//padding-right: 37px;
`;
