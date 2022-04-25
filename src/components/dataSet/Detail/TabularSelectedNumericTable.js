import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { StyledTable } from 'components/common/table/TableComponent';

const TabularSelectedNumericTable = (props) => {
	const { selectFeature } = props;
	return (
		<>
			<StyledTable>
				<StyledTableHeader>
					<tr>
						<th>
							<TN_1>
								<div>No.</div>
							</TN_1>
						</th>
						<th>
							<TN_2>
								<div>STATISTICS</div>
							</TN_2>
						</th>
						<th>
							<TN_3>
								<div>VALUE</div>
							</TN_3>
						</th>
					</tr>
				</StyledTableHeader>
				<tbody style={{ height: '200px', display: 'block', overflowY: 'auto' }}>
					{selectFeature &&
						Object.keys(selectFeature.stats).map((key, index) => (
							<StyledTableRow key={index}>
								{
									<>
										<td>
											<TN_1>{index + 1}</TN_1>
										</td>
										<td>
											<TN_2>{key}</TN_2>
										</td>
										<td>
											<TN_3>{selectFeature.stats[key]}</TN_3>
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
export default TabularSelectedNumericTable;

const StyledTableHeader = styled.thead`
	width: 100%;
	height: 40px;
	margin: 1px 0 0 0;
	padding: 10px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const TN_1 = styled.div`
	display: flex;
	width: 118px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TN_2 = styled.div`
	display: flex;
	width: 215px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TN_3 = styled.div`
	display: flex;
	width: 215px;
	padding-left: 8px;
	padding-right: 8px;
`;

const StyledTableRow = styled.tr`
	width: 100%;
	height: 40px;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
`;
