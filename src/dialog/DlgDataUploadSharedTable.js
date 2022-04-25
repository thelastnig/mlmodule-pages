import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { makeEmptyRow, SortIcon, StyledTable, TableRow, TD_COMMON, TH_COMMON, THTr } from 'components/common/table/TableComponent';
import EmptyTable from 'components/common/table/EmptyTable';

const DlgDataUploadSharedTable = (props) => {
	const { list, maxRowCnt, selectItem, setSelectItem, sorting, setSorting, sorting_type, setSorting_type, total_row_count } = props;

	let emptyRowCnt = maxRowCnt - list.length;
	const emptyRow = makeEmptyRow(emptyRowCnt);

	const updateSortingCB = ({ sorting, sorting_type }) => {
		setSorting(sorting);
		setSorting_type(sorting_type);
	};

	return (
		<TableArea>
			<StyledTable>
				<StyledTableHeader>
					<THTr>
						<TH_COMMON style={Cell1}>
							<SortIcon
								columnName={'Project'}
								sortColumn={'project_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TH_COMMON>
						<TH_COMMON style={Cell2}>
							<SortIcon
								columnName={'Dataset'}
								sortColumn={'dataset_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TH_COMMON>
						<TH_COMMON style={Cell8}>
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
					</THTr>
				</StyledTableHeader>
				<tbody>
					{total_row_count !== 0 ? (
						<>
							{list.map((data, index) => (
								<TableRow
									key={index}
									isChecked={selectItem === data}
									onClick={(e) => {
										setSelectItem(data);
									}}
									style={{ height: '37px', borderTop: 'none', borderBottom: '1px solid #eaebec' }}
								>
									{
										<>
											<TD_COMMON style={Cell1}>{data.project_nm}</TD_COMMON>
											<TD_COMMON style={Cell2}>{data.dataset_nm}</TD_COMMON>
											<TD_COMMON style={Cell8}>{data.version}</TD_COMMON>
											<TD_COMMON style={Cell3}>{data.dataset_type}</TD_COMMON>
											<TD_COMMON style={Cell4}>{data.user_id}</TD_COMMON>
											<TD_COMMON style={Cell5}>{data.dataset_size}</TD_COMMON>
											<TD_COMMON style={{ ...Cell6, color: colors.light_blue }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_COMMON>
											<TD_COMMON style={Cell7}>{data.label_nm}</TD_COMMON>
										</>
									}
								</TableRow>
							))}
							{emptyRow.map((data, index) => (
								<TableRow key={index} style={{ height: '37px', borderTop: 'none', borderBottom: '1px solid #eaebec' }}>
									{<></>}
								</TableRow>
							))}
						</>
					) : (
						<EmptyTable />
					)}
				</tbody>
			</StyledTable>
		</TableArea>
	);
};
export default DlgDataUploadSharedTable;

const Cell1 = {
	width: '317px',
	paddingLeft: '35px',
	paddingRight: '12px',
};
const Cell2 = {
	width: '317px',
	paddingLeft: '12px',
	paddingRight: '14px',
};
const Cell3 = {
	width: '109px',
	paddingLeft: '10px',
	paddingRight: '6px',
};
const Cell4 = {
	width: '100px',
	paddingLeft: '6px',
	paddingRight: '10px',
};
const Cell5 = {
	width: '90px',
	paddingLeft: '17px',
	paddingRight: '13px',
};
const Cell6 = {
	width: '110px',
	paddingLeft: '13px',
	paddingRight: '18px',
};
const Cell7 = {
	width: '170px',
	paddingLeft: '18px',
	paddingRight: '12px',
};
const Cell8 = {
	width: '120px',
	paddingLeft: '20px',
	paddingRight: '30px',
};

const TableArea = styled.div`
	width: 1332px;
	height: 480px;
	overflow: hidden;
`;

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
