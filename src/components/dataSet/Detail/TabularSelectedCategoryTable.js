import React from 'react';
import styled from 'styled-components';

import { StyledTable } from 'components/common/table/TableComponent';
import { StyledTableHeader, StyledTableRow } from 'components/dataSet/Detail/TabularSelectedFeature';

const TabularSelectedCategoryTable = (props) => {
	const { selectFeature } = props;
	return (
		<>
			<StyledTable>
				<StyledTableHeader>
					<tr>
						<th>
							<TC_1>
								<div>No.</div>
							</TC_1>
						</th>
						<th>
							<TC_2>
								<div>CLASS</div>
							</TC_2>
						</th>
						<th>
							<TC_3>
								<div>COUNT</div>
							</TC_3>
						</th>
						<th>
							<TC_4>
								<div>WEIGHT</div>
							</TC_4>
						</th>
					</tr>
				</StyledTableHeader>
				<tbody style={{ height: '200px', display: 'block', overflowY: 'auto' }}>
					{selectFeature &&
						selectFeature.stats.map((data, index) => (
							<StyledTableRow key={index}>
								{
									<>
										<td>
											<TC_1>{index + 1}</TC_1>
										</td>
										<td>
											<TC_2>{data.label_nm}</TC_2>
										</td>
										<td>
											<TC_3>{data.count}</TC_3>
										</td>
										<td>
											<TC_4>{data.weight}</TC_4>
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
