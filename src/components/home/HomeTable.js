import React from 'react';

import DateUtil from 'utils/DateUtil';

import { useStateActionHandler as useProjectStateActionHandler } from 'store/project/hooks';
import { useCommonState } from 'store/common/hooks';
import { useHandleState } from 'store/project/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SatusDot } from 'components/common/StyledComponent';
import HomeDataMore from 'components/home/HomeMoreButton';
import {
	SortIcon,
	StyledTable,
	TableRow,
	TH_COMMON,
	TD_COMMON,
	TD_TEXT,
	LoadMark,
	TableHeaderComponent,
	TableBodyComponent,
} from 'components/common/table/TableComponent';
import ProjectStatusChange from 'component/dialog/ProjectStatusChange';
import ProjectDetail from 'component/dialog/ProjectDetail';
import NewBadge from 'component/NewBadge';

import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function HomeTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, fetchList, total_row_count, currentUser, onLoadProject } = props;
	const { updateSortingCB } = useProjectStateActionHandler();
	const { loadProject } = useCommonState();

	const { sorting, sorting_type } = useHandleState();
	const [detailModal, setDetailModal] = React.useState(false);
	const [changeModal, setChangeModal] = React.useState(false);
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
			<ProjectDetail data={detailModal} currentUser={currentUser} fetchList={fetchList}/>
			<StyledTable>
				<TableHeaderComponent>
					<TH_COMMON style={Cell1}>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_COMMON>
					<TH_COMMON style={Cell2}>
						<div></div>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Project'}
							sortColumn={'project_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'Group'}
							sortColumn={'group_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'User ID'}
							sortColumn={'user_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell6}>
						<SortIcon
							columnName={'Type'}
							sortColumn={'type_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell7}>
						<SortIcon
							columnName={'Model'}
							sortColumn={'model_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell8}>
						<SortIcon
							columnName={'Status'}
							sortColumn={'working_status_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell9}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell10}>
						<SortIcon
							columnName={'Updated'}
							sortColumn={'update_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON>
						<div></div>
					</TH_COMMON>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => {
						let isLoaded = loadProject && loadProject.project_id === data.project_id;
						return (
							<TableRow
								key={index}
								isChecked={checkItems.includes(data)}
								onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
								onDoubleClick={onLoadProject}
							>
								{
									<>
										<TD_COMMON style={Cell1}>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
												// NoClickable={true}
											/>
										</TD_COMMON>
										<TD_COMMON style={Cell2}>{isLoaded ? <LoadMark>Loaded</LoadMark> : <div></div>}</TD_COMMON>
										<TD_COMMON style={Cell3}>
											<TD_TEXT isLoaded={isLoaded}>
												{data.project_nm}
												<NewBadge date={data.create_date} />
											</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell4}>
											<TD_TEXT isLoaded={isLoaded}>{data.group_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell5}>
											<TD_TEXT isLoaded={isLoaded}>{data.user_id}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell6}>
											<TD_TEXT isLoaded={isLoaded}>{data.type_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell7}>
											<TD_TEXT isLoaded={isLoaded}>{data.model_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell8}>
											<SatusDot type={data.working_status_nm.toLowerCase()}></SatusDot>
											<TD_TEXT isLoaded={isLoaded}>{data.working_status_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell9}>
											<TD_TEXT isLoaded={isLoaded} isBlue={true}>
												{DateUtil.parseDateToYYYYMMDD(data.create_date)}
											</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell10}>
											<TD_TEXT isLoaded={isLoaded}>
												{data.update_date ? DateUtil.parseDateToYYYYMMDD(data.update_date) : ''}
											</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={{ paddingLeft: '20px' }}>
											<HomeDataMore
												data={data}
												onToggleDetailModal={handleToggleDetailModal}
												handleToggleChangeModal={handleToggleChangeModal}
											/>
										</TD_COMMON>
									</>
								}
							</TableRow>
						);
					})}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const Cell1 = {
	width: '55px',
	paddingLeft: '35px',
};
const Cell2 = {
	width: '60px',
};
const Cell3 = {
	width: '445px',
	textOverflow: 'ellipsis',
};
const Cell4 = {
	width: '200px',
};
const Cell5 = {
	width: '100px',
};
const Cell6 = {
	width: '110px',
};
const Cell7 = {
	width: '170px',
};
const Cell8 = {
	width: '110px',
};
const Cell9 = {
	width: '110px',
};
const Cell10 = {
	width: '110px',
};
