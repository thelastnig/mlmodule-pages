import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { useHandleState, useStateActionHandler } from 'store/algorithm/hooks';

import { SortIcon, StyledTable } from 'components/common/table/TableComponent';
import { checkOnlyOneClickCB } from 'components/common/table/Checkbox';

import Tooltip from 'components/common/Tooltip';

const checkInclude = (checkItems, data) => {
	let checked = checkItems.filter((v) => {
		return v.algorithm_id === data.algorithm_id;
	});
	return checked.length > 0;
};
export default function AlgorithmTable(props) {
	const { list, checkItems, setCheckItems, algorithmClicked } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	return (
		<TableArea>
			<StyledTable>
				<StyledTableHeader>
					<TH_1>
						<div>No.</div>
					</TH_1>
					<TH_2>
						<SortIcon
							columnName={'Algorithm'}
							sortColumn={'algorithm_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_2>
					<TH_3 data-tip data-for={'algorithm_complexity_tootip'}>
						<SortIcon
							columnName={'COMPLEXITY (GFLOPS)'}
							sortColumn={'complexity'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
						<Tooltip id={'algorithm_complexity_tootip'} text={'합성곱신경망(CNN)의 복잡도입니다.(단위: Giga FLOPs)'}/>
					</TH_3>
					<TH_4 data-tip data-for={'algorithm_size_tootip'}>
						<SortIcon
							columnName={'Size(Mp)'}
							sortColumn={'parameter_count'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
						<Tooltip id={'algorithm_size_tootip'} text={'학습을 통해 조정할 신경망의 파라미터 수(단위: Million parameters)'}/>
					</TH_4>
					{/* {<TH_5>
						<SortIcon
							columnName={'Resources NEEDS'}
							sortColumn={'resource_needs'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_5>} */}
				</StyledTableHeader>
				<tbody style={{ height: '260px', display: 'block', overflowY: 'auto' }}>
					{list.map((data, index) => (
						<StyledTableRow
							key={index}
							// isChecked={checkItems.includes(data)}
							isChecked={checkInclude(checkItems, data)}
							onClick={(e) => {
								checkOnlyOneClickCB(data, checkItems, setCheckItems);
								algorithmClicked(data);
							}}
						>
							{
								<>
									<TH_1>{index + 1}</TH_1>
									<TH_2>
										<span data-tip data-for={`${data.algorithm_nm}_tooltip`}>
											{data.algorithm_nm}
											<Tooltip id={`${data.algorithm_nm}_tooltip`} text={data.algorithm_description}/>
										</span>
									</TH_2>
									<TH_3>{data.complexity}</TH_3>
									<TH_4>{data.parameter_count}</TH_4>
									{/* {<TH_5>{data.resource_needs}</TH_5>} */}
								</>
							}
						</StyledTableRow>
					))}
				</tbody>
			</StyledTable>
		</TableArea>
	);
}
const TableArea = styled.div`
	height: 290px;
`;

const TH_1 = styled.div`
	width: 130px;
	display: flex;
	padding-left: 30px;
	padding-right: 10px;
`;

const TH_2 = styled.div`
	width: 450px;
	display: flex;
	padding-left: 10px;
	padding-right: 10px;
	word-break: break-all;
`;

const TH_3 = styled.div`
	width: 220px;
	display: flex;
	padding-left: 10px;
	padding-right: 5px;
	text-align: center;
`;

const TH_4 = styled.div`
	width: 120px;
	display: flex;
	padding-left: 20px;
	padding-right: 20px;
	text-align: center;
`;

const TH_5 = styled.div`
	width: 150px;
	display: flex;
	padding-left: 5px;
	padding-right: 5px;
	text-align: center;
`;

const StyledTableHeader = styled.thead`
	width: 100%;
	height: 35px;
	padding: 6px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
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
