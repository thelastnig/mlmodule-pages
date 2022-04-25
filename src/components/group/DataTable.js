import React, { useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/group/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import MoreButton from 'components/group/GroupMoreButton';
import GroupDetail from 'component/dialog/GroupDetailDeveloper';
import NewBadge from 'component/NewBadge';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const GROUP_END_BEFORE_TIME = 1000 * 60 * 60 * 24 * 7;

export default function DataTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, fetchList, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();
	const { showDialog } = useDialogAction();

	let emptyRowCnt = maxRowCnt - list.length;
	const [showDetail, setShowDetail] = useState(false);

	const showToggleDetail = (data) => {
		setShowDetail(data);
		showDialog(dialogList.GROUP_DETAIL_DEVELOPER);
	};

	return (
		<>
			<GroupDetail data={showDetail} />
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
								columnName={'Group'}
								sortColumn={'group_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<SortIcon
								columnName={'Status'}
								sortColumn={'working_status_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<SortIcon
								columnName={'Start Date'}
								sortColumn={'start_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5>
							<SortIcon
								columnName={'End Date'}
								sortColumn={'end_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_5>
					</th>
					<th>
						<TD_6></TD_6>
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
											/>
										</TD_1>
									</td>
									<td>
										<TD_2>
											{data.group_nm}
											<NewBadge date={data.create_date} />
										</TD_2>
									</td>
									<td>
										<TD_3>{data.working_status_nm}</TD_3>
									</td>
									<td>
										<TD_4 style={{ color: colors.light_blue }}>{data.start_date}</TD_4>
									</td>
									<td>
										<TD_5
											style={{
												color: DateUtil.isInTime(data.end_date, GROUP_END_BEFORE_TIME) ? colors.fail : colors.light_blue,
											}}
										>
											{data.end_date}
										</TD_5>
									</td>
									<td>
										<TD_6>
											<MoreButton data={data} showToggleDetail={showToggleDetail} />
										</TD_6>
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
	width: 80px;
	padding-left: 22px;
	padding-right: 43px;
	text-align: left;
`;
const TD_2 = styled.div`
	display: flex;
	width: 477px;
	padding-left: 36px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 300px;
	padding-left: 36px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_4 = styled.div`
	display: flex;
	width: 300px;
	padding-left: 36px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_5 = styled.div`
	display: flex;
	width: 300px;
	padding-left: 36px;
	padding-right: 36px;
`;

const TD_6 = styled.div`
	display: flex;
	width: 42px;
	padding-right: 37px;
`;
