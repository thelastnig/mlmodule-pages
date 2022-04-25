import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/projectRepository/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import MoreButton from 'components/projectRepository/MoreButton';
import { SatusDot } from 'components/common/StyledComponent';
import ProjectDetail from 'component/dialog/ProjectDetail';
import ProjectStatusChange from 'component/dialog/ProjectStatusChange';
import NewBadge from 'component/NewBadge';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function ProjectRepositoryTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, fetchList, total_row_count } = props;

	const [detailModal, setDetailModal] = React.useState(false);
	const [changeModal, setChangeModal] = React.useState(false);

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();
	const { showDialog } = useDialogAction();

	let emptyRowCnt = maxRowCnt - list.length;

	const handleToggleDetailModal = (data) => {
		setDetailModal(data);
		showDialog(dialogList.PROJECT_DETAIL);
	};
	const handleToggleChangeModal = (data) => {
		setChangeModal(data);
		showDialog(dialogList.PROJECT_STATUS_CHANGE);
	};

	return (
		<>
			<ProjectStatusChange data={changeModal} fetchList={fetchList} />
			<ProjectDetail data={detailModal} toggle={handleToggleDetailModal} fetchList={fetchList} />
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
								columnName={'Project'}
								sortColumn={'project_nm'}
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
								columnName={'User ID'}
								sortColumn={'user_id'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5>
							<SortIcon
								columnName={'Type'}
								sortColumn={'type_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_5>
					</th>
					<th>
						<TD_6>
							<SortIcon
								columnName={'Model'}
								sortColumn={'model_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_6>
					</th>
					<th>
						<TD_7>
							<SortIcon
								columnName={'Status'}
								sortColumn={'working_status'}
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
					<th>
						<TD_9>
							<SortIcon
								columnName={'Updated'}
								sortColumn={'update_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_9>
					</th>
					<th>
						<TD_10></TD_10>
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
											{data.project_nm}
											<NewBadge date={data.create_date} />
										</TD_2>
									</td>
									<td>
										<TD_3>{data.group_nm}</TD_3>
									</td>
									<td>
										<TD_4>{data.user_id}</TD_4>
									</td>
									<td>
										<TD_5>{data.type_nm}</TD_5>
									</td>
									<td>
										<TD_6>{data.model_nm}</TD_6>
									</td>
									<td>
										<TD_7>
											<SatusDot type={data.working_status_nm.toLowerCase()}></SatusDot>
											{data.working_status_nm}
										</TD_7>
									</td>
									<td>
										<TD_8 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_8>
									</td>
									<td>
										<TD_9 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.update_date)}</TD_9>
									</td>
									<td>
										<TD_10>
											<MoreButton
												data={data}
												onToggleDetailModal={handleToggleDetailModal}
												handleToggleChangeModal={handleToggleChangeModal}
											/>
										</TD_10>
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
	width: 70px;
	padding-left: 22px;
	padding-right: 24px;
	text-align: left;
`;
const TD_2 = styled.div`
	display: flex;
	width: 383px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 235px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_4 = styled.div`
	display: flex;
	width: 124px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_5 = styled.div`
	display: flex;
	width: 109px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_6 = styled.div`
	display: flex;
	width: 194px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_7 = styled.div`
	display: flex;
	width: 124px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_8 = styled.div`
	display: flex;
	width: 106px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_9 = styled.div`
	display: flex;
	width: 110px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_10 = styled.div`
	display: flex;
	width: 48px;
	padding-left: 8px;
	padding-right: 15px;
`;
