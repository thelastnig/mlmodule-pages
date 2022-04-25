import React, { useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';
import IconGroup from 'assets/icon/icon-group-2.png';

import { useHandleState, useStateActionHandler } from 'store/inference/hooks';

import { checkOnlyOneClickCB } from 'components/common/table/Checkbox';
import InferenceImageDetail from 'component/dialog/InferenceImageDetail';
import InferenceTabularDetail from 'component/dialog/InferenceTabularDetail';
import { makeEmptyRow, SortIcon, TableHeader, StyledTable, TableRow } from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function DataSetTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, isPrivate } = props;
	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	const emptyRow = makeEmptyRow(emptyRowCnt);
	const [detailModal, setDetailModal] = React.useState(false);
	const { showDialog } = useDialogAction();

	const datasetDetailClicked = (e, data) => {
		e.preventDefault();
		e.stopPropagation();
		let type = data.dataset_type;
		setDetailModal(data);
		if (type === 'tabular') {
			showDialog(dialogList.INFERENCE_TABULAR_DETAIL);
		} else {
			showDialog(dialogList.INFERENCE_IMAGE_DETAIL);
		}
	};

	return (
		<>
			<InferenceImageDetail data={detailModal} />
			<InferenceTabularDetail data={detailModal} />
			<StyledTable>
				<TableHeader>
					<TD_1>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_1>
					<TD_7>
						<SortIcon
							columnName={'Version'}
							sortColumn={'version'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_7>
					<TD_2 isPrivate={isPrivate}>
						<SortIcon
							columnName={'User ID'}
							sortColumn={'user_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_2>
					<TD_3 isPrivate={isPrivate}>
						<SortIcon
							columnName={'Type'}
							sortColumn={'dataset_type'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_3>
					<TD_4 isPrivate={isPrivate}>
						<SortIcon
							columnName={'Size'}
							sortColumn={'dataset_size'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_4>
					<TD_5 isPrivate={isPrivate}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_5>
					<TD_6>
						<div>Details</div>
					</TD_6>
				</TableHeader>
				<tbody>
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
										<NewBadge date={data.create_date} />
									</TD_1>
									<TD_7>{data.version}</TD_7>
									<TD_2 isPrivate={isPrivate}>{data.user_id}</TD_2>
									<TD_3 isPrivate={isPrivate}>{data.dataset_type}</TD_3>
									<TD_4 isPrivate={isPrivate}>{data.dataset_size}</TD_4>
									<TD_5 isPrivate={isPrivate} style={{ color: colors.light_blue }}>
										{DateUtil.parseDateToYYYYMMDD(data.create_date)}
									</TD_5>
									<TD_6>
										<div style={{ width: '55px', textAlign: 'center' }}>
											<IconGroupImg onClick={(e) => datasetDetailClicked(e, data)} />
										</div>
									</TD_6>
								</>
							}
						</TableRow>
					))}
					{emptyRow.map((data, index) => (
						<TableRow key={index}>
							{
								<>
									<TD_1></TD_1>
									<TD_2 isPrivate={isPrivate}></TD_2>
									<TD_3 isPrivate={isPrivate}></TD_3>
									<TD_4 isPrivate={isPrivate}></TD_4>
									<TD_5 isPrivate={isPrivate}></TD_5>
									<TD_6></TD_6>
								</>
							}
						</TableRow>
					))}
				</tbody>
			</StyledTable>
		</>
	);
}

const IconGroupImg = ({ onClick }) => <img src={IconGroup} width="20px" height="20px" style={{ marginLeft: '5px' }} onClick={onClick} alt="" />;

const TD_1 = styled.div`
	display: flex;
	width: 735px;
	padding-left: 40px;
	padding-right: 62px;
	word-break: break-all;
`;

const TD_2 = styled.div`
	display: flex;
	width: 150px;
	padding-left: 20px;
	padding-right: 20px;
	${(props) => (props.isPrivate ? `display:none;` : ``)}
`;

const TD_3 = styled.div`
	display: flex;
	width: 140px;
	padding-left: 10px;
	padding-right: 10px;
	${(props) => (props.isPrivate ? `width:180px;` : ``)}
`;

const TD_4 = styled.div`
	display: flex;
	width: 135px;
	padding-left: 10px;
	padding-right: 10px;
	${(props) => (props.isPrivate ? `width:180px;` : ``)}
`;

const TD_5 = styled.div`
	display: flex;
	width: 156px;
	padding-left: 30px;
	padding-right: 34px;
	${(props) => (props.isPrivate ? `width:180px;` : ``)}
`;

const TD_6 = styled.div`
	display: flex;
	width: 122px;
	padding-left: 8px;
`;

const TD_7 = styled.div`
	display: flex;
	width: 120px;
	padding-left: 8px;
	padding-right: 8px;
`;
