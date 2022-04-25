import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { useHandleState, useStateActionHandler } from 'store/algorithm/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SortIcon, StyledTable } from 'components/common/table/TableComponent';
import { AlgorithmSize } from 'components/common/ExperimentComponent';
import EmptyTable from 'components/common/table/EmptyTable';
import { AutoMlContext } from 'views/expRunAutoML';

const MAXCOUNT = 4;

export default function ListTable(props) {
	const { list, checkItems, setCheckItems, total_row_count } = props;

	const { showAlert } = useAlertAction();

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	const { setSelectAlgorithm } = useContext(AutoMlContext);

	const checkMaxCount = (data) => {
		if (MAXCOUNT && !checkItems.includes(data) && checkItems.length >= MAXCOUNT) {
			showAlert({
				message: '최대 ' + MAXCOUNT + '개의 알고리즘만 동시에 실행할 수 있습니다.',
			});
			return false;
		}
		return true;
	};
	return (
		<>
			<StyledTable>
				<StyledTableHeader>
					<TD_1>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} maxCount={MAXCOUNT} />
					</TD_1>
					<TD_2>
						<div>No.</div>
					</TD_2>
					<TD_3>
						<SortIcon
							columnName={'Algorithm'}
							sortColumn={'algorithm_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_3>
					<TD_4>
						<SortIcon
							columnName={'COMPLEXITY'}
							sortColumn={'complexity'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_4>
					<TD_5>
						<SortIcon
							columnName={'Size(#Parmas)'}
							sortColumn={'parameter_count'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_5>
					<TD_6>
						<SortIcon
							columnName={'Resources NEEDS'}
							sortColumn={'resource_needs'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TD_6>
				</StyledTableHeader>
				<tbody style={{ height: '490px', display: 'block', overflowY: 'auto' }}>
					{total_row_count !== 0 ? (
						<>
							{list.map((data, index) => (
								<StyledTableRow
									key={index}
									isChecked={checkItems.includes(data)}
									onClick={(e) => {
										setSelectAlgorithm(data);
										checkClickCB(data, checkItems, setCheckItems, true);
									}}
								>
									{
										<>
											<TD_1>
												<Checkbox
													data={data}
													checked={checkItems.includes(data)}
													checkItems={checkItems}
													setCheckItems={setCheckItems}
													checkMaxCount={checkMaxCount}
													// NoClickable={true}
												/>
											</TD_1>
											<TD_2>{index + 1}</TD_2>
											<TD_3>{data.algorithm_nm}</TD_3>
											<TD_4>
												<div style={{ width: '90px', textAlign: 'center' }}>
													<AlgorithmSize data={data} />
												</div>
											</TD_4>
											<TD_5>{data.parameter_count}</TD_5>
											<TD_6>
												<div style={{ width: '120px', textAlign: 'center' }}>{data.resource_needs}</div>
											</TD_6>
										</>
									}
								</StyledTableRow>
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

const TD_1 = styled.td`
	width: 60px;
	padding-left: 23px;
`;
const TD_2 = styled.td`
	display: flex;
	width: 100px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_3 = styled.td`
	display: flex;
	width: 400px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_4 = styled.td`
	display: flex;
	width: 130px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_5 = styled.td`
	display: flex;
	width: 140px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_6 = styled.td`
	display: flex;
	width: 160px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const StyledTableHeader = styled.thead`
	width: 100%;
	height: 46px;
	padding: 13px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
`;

const StyledTableRow = styled.tr`
	width: 100%;
	height: 49px;
	padding: 1px 0 0 0;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;
