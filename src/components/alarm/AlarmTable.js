import React from 'react';
import styled from 'styled-components';
import { colors } from 'styles';

import DateUtil from 'utils/DateUtil';
import IconMailCol from 'assets/icon/icon-mail-col.png';
import IconMailRead from 'assets/icon/icon-mail-read.png';
import IconMailUnread from 'assets/icon/icon-mail-unread.png';
import IconGroup from 'assets/icon/icon-group-2.png';

import { useHandleState, useStateActionHandler } from 'store/alarm/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import EmptyTable from 'components/common/table/EmptyTable';
import { makeEmptyRow, SortIcon, StyledTable, TableHeader, TableRow } from 'components/common/table/TableComponent';
import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import AlarmLog from 'component/dialog/AlarmLog';
import AlarmMessage from 'components/alarm/AlarmMessage';

export default function AlarmTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, total_row_count, readAlarm } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	const emptyRow = makeEmptyRow(emptyRowCnt);
	const [showLog, setShowLog] = React.useState(false);
	const [needReadUpdate, setReadUpdate] = React.useState(false); //팝업 닫힐때 읽은 readAlarm 호출할기 위해 사용.
	const { showDialog } = useDialogAction();

	const handleToggleLogModal = (e, data) => {
		e && e.preventDefault();
		e && e.stopPropagation();

		if (data && data.read_yn === 0) {
			setReadUpdate(data);
		} else {
			if (needReadUpdate && needReadUpdate.read_yn === 0) {
				readAlarm(needReadUpdate.error_no);
			}
			setReadUpdate(false);
		}
		setShowLog(data);
		showDialog(dialogList.ALARM_LOG);
	};

	const isEllipsis = (str) => {
		let ellipsis = false;
		let context = document.createElement('canvas').getContext('2d');
		context.font = '14px';

		if (str && str.length > 0 && context.measureText(str).width > 130) {
			ellipsis = true;
		}

		return ellipsis;
	};

	return (
		<>
			<AlarmLog data={showLog} />
			<StyledTable>
				<TableHeader>
					<tr>
						<th>
							<TD_1>
								<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
							</TD_1>
						</th>
						<th>
							<TD_2>
								<SortIcon
									columnName={
										<div>
											<img src={IconMailCol} width="20px" height="20px" alt="" />
										</div>
									}
									sortColumn={'read_yn'}
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
									columnName={'Stage'}
									sortColumn={'part_nm'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_6>
						</th>
						<th>
							<TD_7>
								<SortIcon
									columnName={'ALARM ID'}
									sortColumn={'alarm_id'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_7>
						</th>
						<th>
							<TD_8>
								<SortIcon
									columnName={'DATE'}
									sortColumn={'create_date'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_8>
						</th>
						<th>
							<TD_9>
								<SortIcon
									columnName={'MESSAGE'}
									sortColumn={'message'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_9>
						</th>
						<th>
							<TD_10></TD_10>
						</th>
						<th>
							<TD_11>
								<div>Log</div>
							</TD_11>
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
									onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
									// onClick={e => checkClickCB(data, checkItems, setCheckItems)}
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
													<IconReadUnread is_read={data.read_yn} />
												</TD_2>
											</td>
											<td>
												<TD_3 is_read={data.read_yn}>{data.group_nm}</TD_3>
											</td>
											<td>
												<TD_4 is_read={data.read_yn}>{data.project_nm}</TD_4>
											</td>
											<td>
												<TD_5 is_read={data.read_yn}>{data.user_id}</TD_5>
											</td>
											<td>
												<TD_6 is_read={data.read_yn}>{data.part_nm}</TD_6>
											</td>
											<td>
												<TD_7 is_read={data.read_yn}>{data.alarm_id}</TD_7>
											</td>
											<td>
												<TD_8
													style={{ color: `${data.read_yn ? '#9ea1a4' : colors.light_blue}` }}
												>
													{DateUtil.parseDateToYYYYMMDD(data.create_date)}
												</TD_8>
											</td>
											<td>
												<TD_9 is_read={data.read_yn} is_red={true}>
													<TD_SINGLE_LINE>{data.message}</TD_SINGLE_LINE>
												</TD_9>
											</td>
											<td>
												<TD_10>
													{isEllipsis(data.message) ? (
														<AlarmMessage data={data} readAlarm={readAlarm} />
													) : (
														''
													)}
												</TD_10>
											</td>
											<td>
												<TD_11 onClick={(e) => handleToggleLogModal(e, data)}>
													<IconGroupImg />
												</TD_11>
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
											<td>
												<TD_8></TD_8>
											</td>
											<td>
												<TD_9></TD_9>
											</td>
											<td>
												<TD_10></TD_10>
											</td>
											<td>
												<TD_11></TD_11>
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

const IconReadUnread = ({ is_read }) => (
	<img src={is_read ? IconMailRead : IconMailUnread} width="20px" height="20px" alt="" />
);

const IconGroupImg = () => <img src={IconGroup} width="20px" height="20px" style={{ marginLeft: '5px' }} alt="" />;

const TD_1 = styled.div`
	width: 36px;
	padding-left: 22px;
	text-align: left;
`;

const TD_2 = styled.div`
	display: flex;
	width: 71px;
	padding-left: 22px;
	padding-right: 6px;
`;

const TD_3 = styled.div`
	display: flex;
	width: 216px;
	padding-right: 36px;
	word-break: break-all;
	color: ${(props) => (props.is_read ? '#9ea1a4' : '')};
`;

const TD_4 = styled.div`
	display: flex;
	width: 395px;
	padding-right: 72px;
	word-break: break-all;
	color: ${(props) => (props.is_read ? '#9ea1a4' : '')};
`;

const TD_5 = styled.div`
	display: flex;
	width: 126px;
	padding-right: 52px;
	word-break: break-all;
	color: ${(props) => (props.is_read ? '#9ea1a4' : '')};
`;

const TD_6 = styled.div`
	display: flex;
	width: 119px;
	padding-right: 20px;
	color: ${(props) => (props.is_read ? '#9ea1a4' : '')};
`;

const TD_7 = styled.div`
	display: flex;
	width: 126px;
	padding-right: 39px;
	color: ${(props) => (props.is_read ? '#9ea1a4' : '')};
`;

const TD_8 = styled.div`
	display: flex;
	width: 145px;
	padding-right: 13px;
`;
const TD_9 = styled.div`
	display: flex;
	padding-right: 1px;
	width: 190px;
	color: ${(props) => (props.is_read ? '#9ea1a4' : props.is_red ? `${colors.fail}` : `${colors.text_black}`)};
`;

const TD_10 = styled.div`
	display: flex;
	width: 20px;
`;

const TD_11 = styled.div`
	display: flex;
	width: 56px;
	padding-left: 10px;
`;

const TD_SINGLE_LINE = styled.div`
	table-layout: fixed;
	width: 190px;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
`;
