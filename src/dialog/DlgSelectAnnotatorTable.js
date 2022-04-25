import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { useHandleState, useStateActionHandler } from 'store/annotator/hooks';

import { SortIcon, StyledTable } from 'components/common/table/TableComponent';
import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { calculatorEnd, calculatorStart } from 'component/dialog/SelectAnnotator';

const DlgSelectAnnotatorTable = (props) => {
	const { list, checkItems, setCheckItems, instanceNum, num_instances } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	const checkMaxCount = (data) => {
		if (checkItems.includes(data)) {
			return true;
		}
		let count = parseInt(num_instances / (checkItems.length + 1));
		if (count > 0) {
			return true;
		}
		return false;
	};
	return (
		<>
			<StyledTable>
				<StyledTableHeader>
					<tr>
						<th>
							<TD_1>
								<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} maxCount={num_instances} />
							</TD_1>
						</th>
						<th>
							<TD_2>
								<div>No.</div>
							</TD_2>
						</th>
						<th>
							<TD_3>
								<SortIcon
									columnName={'NAME'}
									sortColumn={''}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_3>
						</th>
						<th>
							<TD_4>
								<div>START</div>
							</TD_4>
						</th>
						<th>
							<TD_5>
								<div>END</div>
							</TD_5>
						</th>
					</tr>
				</StyledTableHeader>
				<tbody style={{ height: '370px', display: 'block', overflowY: 'auto' }}>
					{list.map((data, index) => (
						<StyledTableRow
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
												checkMaxCount={(e) => checkMaxCount(data)}
												// NoClickable={true}
											/>
										</TD_1>
									</td>
									<td>
										<TD_2>{index + 1}</TD_2>
									</td>
									<td>
										<TD_3>{data.user_nm}</TD_3>
									</td>
									<td>
										<TD_4>{calculatorStart(data, checkItems, instanceNum, num_instances)}</TD_4>
									</td>
									<td>
										<TD_5>{calculatorEnd(data, checkItems, instanceNum, num_instances)}</TD_5>
									</td>
								</>
							}
						</StyledTableRow>
					))}
				</tbody>
			</StyledTable>
		</>
	);
};
export default DlgSelectAnnotatorTable;

const StyledTableHeader = styled.thead`
	width: 100%;
	height: 35px;
	padding: 5px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
`;

const TD_1 = styled.div`
	width: 48px;
	display: flex;
	padding-left: 23px;
`;

const TD_2 = styled.div`
	width: 100px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_3 = styled.div`
	width: 170px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;

const TD_4 = styled.div`
	width: 120px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_5 = styled.div`
	width: 120px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const StyledTableRow = styled.tr`
	width: 100%;
	height: 37px;
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
