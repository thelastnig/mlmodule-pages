import React from 'react';
import styled from 'styled-components';

import { StyledTable } from 'components/common/table/TableComponent';
import { StyledTableHeader, StyledTableRow } from 'components/dataSet/Detail/TabularSelectedFeature';

const TabularSelectedCategoryTable = (props) => {
	return (
		<>
			<StyledTable>
				<StyledTableHeader>
					<tr>
						<th>
							<TC_1></TC_1>
						</th>
						<th>
							<TC_2></TC_2>
						</th>
						<th>
							<TC_3></TC_3>
						</th>
						<th>
							<TC_4></TC_4>
						</th>
					</tr>
				</StyledTableHeader>
				<StyledTableRow>
					<RowText>Not Available</RowText>
				</StyledTableRow>
			</StyledTable>
		</>
	);
};
export default TabularSelectedCategoryTable;

const TC_1 = styled.div`
	display: flex;
	width: 98px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TC_2 = styled.div`
	display: flex;
	width: 150px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TC_3 = styled.div`
	display: flex;
	width: 150px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TC_4 = styled.div`
	display: flex;
	width: 150px;
	padding-left: 8px;
	padding-right: 8px;
`;

const RowText = styled.div`
	width: 100%;
	text-align: center;
`;
