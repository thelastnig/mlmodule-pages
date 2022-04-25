import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';

import { useHandleState, useStateActionHandler } from 'store/model_version_list/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import { ROUTER_MODELS } from 'components/layout/MenuConst';

export default function VersionTable(props) {
	const { list, model_nm, maxRowCnt, fetchVersionList, total_row_count } = props;

	const { showAlert } = useAlertAction();
	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;

	const history = useHistory();
	const onModelClicked = useCallback((data) => {
		let key = data.version;
		history.push('/' + ROUTER_MODELS + '/' + model_nm + '/' + key);
	});
	const onDeleteClicked = (data, e) => {
		e.preventDefault();
		e.stopPropagation();
		showAlert({
			message: '선택한 Model을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: () => deleteOkClick(data),
		});
	};
	const deleteOkClick = (data, e) => {
		let params = [];
		let item = {
			name: model_nm,
			version: data.version + '',
		};
		params.push(item);
		agent
			.deleteVersionList(params)
			.then((response) => {
				fetchVersionList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<th>
						<TD_1>
							<SortIcon
								columnName={'Version'}
								sortColumn={'version'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_1>
					</th>
					<th>
						<TD_2>
							<SortIcon
								columnName={'DEVELOPER'}
								sortColumn={'developer'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<SortIcon
								columnName={'Created'}
								sortColumn={'create_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<SortIcon
								columnName={'Updated'}
								sortColumn={'update_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5></TD_5>
					</th>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => (
						<TableRow key={index} isChecked={false} onClick={(e) => onModelClicked(data, e)}>
							{
								<>
									<td>
										<TD_1>{data.version}</TD_1>
									</td>
									<td>
										<TD_2>{data.developer}</TD_2>
									</td>
									<td>
										<TD_3>{data.create_date}</TD_3>
									</td>
									<td>
										<TD_4>{data.update_date}</TD_4>
									</td>
									<td>
										<TD_5>
											<ButtonRemove onClick={(e) => onDeleteClicked(data, e)}>Remove</ButtonRemove>
										</TD_5>
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

const ButtonRemove = styled.div`
	width: 80px;
	height: 32px;
	padding: 7px 10px;
	border-radius: 2px;
	background-color: ${colors.button_gray_bg};
	font-family: NotoSans;
	font-size: 12px;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.text_black};
	:hover {
		background: ${colors.button_gray_bg_hover};
	}
	:active {
		background: ${colors.button_gray_bg_press};
	}
`;
const TD_1 = styled.div`
	display: flex;
	width: 350px;
	padding-left: 32px;
	padding-right: 8px;
`;
const TD_2 = styled.div`
	display: flex;
	width: 320px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_3 = styled.div`
	display: flex;
	width: 340px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_4 = styled.div`
	display: flex;
	width: 340px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_5 = styled.div`
	display: flex;
	width: 100px;
	padding-right: 17px;
`;
