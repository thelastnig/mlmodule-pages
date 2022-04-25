import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';
import SortN from 'assets/icon/btn-sort-n.png';
import SortAsc from 'assets/icon/btn-sort-ascending-n.png';
import SortDesc from 'assets/icon/btn-sort-descending-n.png';

import EmptyTable from 'components/common/table/EmptyTable';

export const makeEmptyRow = (emptyRowCnt) => {
	const emptyRow = [];
	for (let i = 0; i < emptyRowCnt; i++) {
		emptyRow.push({});
	}
	return emptyRow;
};
export function SortIcon(props) {
	const { columnName, sortColumn, sorting, sorting_type, updateSortingCB } = props;
	const sortClick = (type) => {
		if (!updateSortingCB) {
			return;
		}
		let _sorting_type = sorting_type;
		if (sorting === type) {
			_sorting_type = !_sorting_type;
		} else {
			_sorting_type = true;
		}
		let params = {
			sorting: type,
			sorting_type: _sorting_type,
		};
		updateSortingCB(params);
	};
	return (
		<>
			<SortImgWrapper onClick={(e) => sortClick(sortColumn)}>
				{columnName}
				<SortImg src={sortColumn !== sorting ? SortN : sorting_type ? SortAsc : SortDesc} />
			</SortImgWrapper>
		</>
	);
}

const SortImgWrapper = styled.div`
	height: 20px;
	display: flex;
	cursor: pointer;
`;

const SortImg = styled.img`
	width: 20px;
	height: 20px;
`;

export const RowBody = styled.div`
	display: flex;
`;

export const StyledTable = styled.table`
	border: none;
	border-collapse: collapse;
	width: 100%;
`;

export const TableHeaderComponent = (props) => {
	const { children } = props;
	return (
		<TableHeader>
			<THTr>{children}</THTr>
		</TableHeader>
	);
};

export const TableBodyComponent = (props) => {
	const { total_row_count, children, emptyRowCnt } = props;
	const emptyRow = makeEmptyRow(emptyRowCnt);
	return (
		<tbody>
			{total_row_count !== 0 ? (
				<>
					{children}
					{emptyRow.map((data, index) => (
						<TableRow key={index} noClickable={true}>
							{<></>}
						</TableRow>
					))}
				</>
			) : (
				<EmptyTable />
			)}
		</tbody>
	);
};
export const TableHeader = styled.thead`
	width: 100%;
	height: 46px;
	margin: 1px 0 0 0;
	padding: 13px 0px 0px 0px;
	background-color: #f8f9fa;
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #dfe2e5;
`;

export const THTr = styled.tr`
	display: flex;
`;

export const TH_COMMON = styled.th`
	display: flex;
	width: 60px;
	padding-left: 8px;
	padding-right: 8px;
`;

export const TD_COMMON = styled.td`
	display: flex;
	width: 60px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;

export const TD_TEXT = styled.div`
	${(props) =>
		props.isLoaded
			? `color: ${colors.gray_dark};`
			: props.isBlue
			? `color: ${colors.light_blue};`
			: props.isGray
			? `color: #9ea1a4`
			: ``}
`;

export const LoadMark = styled.div`
	width: 44px;
	height: 18px;
	padding: 2px 4px 2px 5px;
	border-radius: 4px;
	background-color: #39aed0;
	font-family: NotoSans;
	font-size: 10px;
	font-weight: 600;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.25px;
	color: ${colors.bg_white};
`;

export const TableRow = styled.tr`
  width: 100%;
  height: 49px;
  padding: 1px 0 0 0;
  align-items: center;
  display: flex;
  font-size: 14px;
  letter-spacing: -0.3px;
  color: ${colors.text_black};
  border-top: 1px solid #eaebec;
  ${(props) => (props.isChecked ? `background: ${THEME.selected};` : `background: #fff`)}
  ${(props) =>
		props.noClickable
			? ``
			: `:hover {
        cursor: pointer;
        background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
      }`}
  :hover {
    cursor: ${(props) => (props.onClick ? `pointer` : 'unset')};
    background: ${(props) => (props.onClick ? `${THEME.hover}` : null)};
`;
