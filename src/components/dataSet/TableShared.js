import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import MoreButton from 'components/dataSet/MoreButton';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow, TD_COMMON, TH_COMMON } from 'components/common/table/TableComponent';
import TooltipComponent from 'components/common/TooltipComponent';
import NewBadge from 'component/NewBadge';

export default function TableShared(props) {
	const { list, checkItems, setCheckItems, emptyRowCnt, sorting, sorting_type, updateSortingCB, total_row_count } = props;
	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<TH_1>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_1>
					<TH_COMMON style={Cell2}>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell9}>
						<SortIcon
							columnName={'Version'}
							sortColumn={'version'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Type'}
							sortColumn={'dataset_type'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'User ID'}
							sortColumn={'user_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'Size'}
							sortColumn={'dataset_size'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell6}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell7}>
						<SortIcon
							columnName={'Label'}
							sortColumn={'label_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell8}>
						<div></div>
					</TH_COMMON>
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
									<TD_1>
										<Checkbox
											data={data}
											checked={checkItems.includes(data)}
											checkItems={checkItems}
											setCheckItems={setCheckItems}
											// NoClickable={true}
										/>
									</TD_1>
									<TD_COMMON style={Cell2}>
										{data.dataset_nm}
										<NewBadge date={data.create_date} />
									</TD_COMMON>
									<TD_COMMON style={Cell9}>{data.version}</TD_COMMON>
									<TD_COMMON style={Cell3}>{data.dataset_type}</TD_COMMON>
									<TD_COMMON style={Cell4}>{data.user_id}</TD_COMMON>
									<TD_COMMON style={Cell5}>{data.dataset_size}</TD_COMMON>
									<TD_COMMON style={{ ...Cell6, color: colors.light_blue }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_COMMON>
									<td>
										<TooltipComponent tooltip_key={'label' + index} text={data.label_nm}>
											<TD_7>{data.label_nm}</TD_7>
										</TooltipComponent>
									</td>
									<TD_COMMON style={Cell8}>
										<MoreButton onRegister={null} data={data} isPrivate={false} />
									</TD_COMMON>
								</>
							}
						</TableRow>
					))}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const TH_1 = styled.th`
	width: 80px;
	padding-left: 24px;
`;
const TD_1 = styled.td`
	width: 80px;
	padding-left: 24px;
`;
const Cell2 = {
	// width       : '540px',
	width: '500px',
	paddingLeft: '10px',
	paddingRight: '60px',
};
const Cell3 = {
	width: '140px',
	paddingLeft: '20px',
	paddingRight: '10px',
};
const Cell4 = {
	width: '150px',
	paddingLeft: '20px',
	paddingRight: '20px',
};
const Cell5 = {
	width: '155px',
	paddingLeft: '20px',
	paddingRight: '20px',
};
const Cell6 = {
	width: '120px',
	paddingLeft: '20px',
	paddingRight: '20px',
};
const Cell7 = {
	width: '200px',
	paddingLeft: '20px',
	paddingRight: '20px',
};
const Cell8 = {
	width: '70px',
	paddingLeft: '20px',
	paddingRight: '10px',
};
const Cell9 = {
	width: '120px',
	paddingLeft: '20px',
	paddingRight: '10px',
};
const TD_7 = styled.div`
	display: flex;
	width: 200px;
	padding-left: 20px;
	padding-right: 20px;
`;
