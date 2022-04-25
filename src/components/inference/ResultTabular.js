import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { StyledTable } from 'components/common/table/TableComponent';

const ResultTabluar = (props) => {
	const { column_name, tabular_list } = props.data;
	return (
		<TableArea>
			<StyledTable>
				<thead>
					<TableHeader>
						<CommonTH>No.</CommonTH>
						{column_name &&
							column_name.map((data, index) => {
								return <CommonTH key={index}>{data.toUpperCase()}</CommonTH>;
							})}
					</TableHeader>
				</thead>
				<TableBody>
					{tabular_list &&
						tabular_list.map((data, index) => {
							return (
								<TableRow key={index}>
									<CommonTD>{index + 1}</CommonTD>
									{column_name.map((column, index) => {
										return <CommonTD key={index}>{data[column]}</CommonTD>;
									})}
								</TableRow>
							);
						})}
				</TableBody>
			</StyledTable>
		</TableArea>
	);
};
export default ResultTabluar;

const TableHeader = styled.tr`
	// width:596px;
	width: 100%;
	height: 34px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	// display:flex;
	font-weight: 700;
	align-items: center;
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
`;
const TableRow = styled.tr`
	// width:596px;
	width: 100%;
	height: 36px;
	color: #82878b;
	font-size: 14px;
	font-weight: 500;
	align-items: center;
	border-bottom: 1px solid #eaebec;
`;
const CommonTH = styled.th`
	padding: 0 10px;
	text-align: left;
	white-space: nowrap;
`;
const TableBody = styled.tbody`
	// width:596px;
	width: 100%;
	height: 407px;
	overflow-y: auto;
`;
const CommonTD = styled.td`
	padding: 0 10px;
	white-space: nowrap;
`;

const TableArea = styled.div`
	width: 1460px;
	height: 350px;
	overflow-y: auto;
`;
