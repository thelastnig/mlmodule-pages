import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/user/hooks';
import { useAlertAction } from 'store/alert/hooks';

import MoreButton from 'components/userGroup/UserMoreButton';
import ChangeRole from 'components/userGroup/ChangeRole';
import UserStatusChange from 'component/dialog/UserStatusChange';
import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import GroupChange from 'component/dialog/GroupChange';
import NewBadge from 'component/NewBadge';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function UserTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, fetchList, total_row_count } = props;

	const { showAlert } = useAlertAction();
	const { updateSortingCB, resetPassword } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	const [showChange, setShowChange] = useState(false);
	const [changeGroupData, setChangeGroupData] = useState('');
	const { showDialog } = useDialogAction();

	let emptyRowCnt = maxRowCnt - list.length;

	const showToggleChange = (data) => {
		setShowChange(data);
		showDialog(dialogList.USER_STATUS_CHANGE);
		console.log('dasfadsfasd');
	};
	const groupChangeClick = useCallback((data) => {
		setChangeGroupData(data);
		showDialog(dialogList.GROUP_CHANGE);
	});

	const resetPWClicked = (data) => {
		showAlert({
			message: '패스워드를 초기화 하시겠습니까?',
			isConfirm: true,
			onOk: () => resetOkClick(data),
		});
	};
	const resetOkClick = (data) => {
		let params = {
			user_id: data.user_id,
		};
		resetPassword(params);
	};
	return (
		<>
			<UserStatusChange data={showChange} fetchList={fetchList} />
			<GroupChange data={changeGroupData} fetchList={fetchList} />
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
								columnName={'User ID'}
								sortColumn={'user_id'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<SortIcon
								columnName={'NAME'}
								sortColumn={'user_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<SortIcon
								columnName={'Status'}
								sortColumn={'working_status_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5>
							<SortIcon
								columnName={'Created'}
								sortColumn={'create_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_5>
					</th>
					<th>
						<TD_6>
							<SortIcon
								columnName={'Updated'}
								sortColumn={'update_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_6>
					</th>
					<th>
						<TD_7>
							<SortIcon
								columnName={'Role'}
								sortColumn={'role'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_7>
					</th>
					<th>
						<TD_8></TD_8>
					</th>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => (
						<TableRow
							key={index}
							isChecked={checkItems.includes(data)}
							onClick={(e) => ''}
							// onClick={e=>checkClickCB(data, checkItems, setCheckItems)}
						>
							{
								<>
									<tr onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}>
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
												<div>{data.user_id}</div>
												<NewBadge date={data.create_date} />
											</TD_2>
										</td>
										<td>
											<TD_3>{data.user_nm}</TD_3>
										</td>
										<td>
											<TD_4>{data.working_status_nm}</TD_4>
										</td>
										<td>
											<TD_5 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_5>
										</td>
										<td>
											<TD_6 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.update_date)}</TD_6>
										</td>
									</tr>
									<td>
										<TD_7>
											<ChangeRole data={data} />
										</TD_7>
									</td>
									<td>
										<TD_8>
											<MoreButton
												data={data}
												showToggleChange={showToggleChange}
												resetPWClicked={resetPWClicked}
												groupChangeClick={groupChangeClick}
											/>
										</TD_8>
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
	width: 79px;
	padding-left: 22px;
	padding-right: 43px;
	text-align: left;
`;
const TD_2 = styled.div`
	display: flex;
	width: 203px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 272px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_4 = styled.div`
	display: flex;
	width: 208px;
	padding-right: 36px;
	word-break: break-all;
`;
const TD_5 = styled.div`
	display: flex;
	width: 211px;
	padding-right: 36px;
`;
const TD_6 = styled.div`
	display: flex;
	width: 213px;
	padding-right: 36px;
`;
const TD_7 = styled.div`
	display: flex;
	width: 280px;
	padding-right: 36px;
`;
const TD_8 = styled.div`
	display: flex;
	width: 40px;
	//padding-right: 37px;
`;
