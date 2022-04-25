import React from 'react';
import styled from 'styled-components';

import { SortIcon, StyledTable, TableHeader, TableRow } from 'components/common/table/TableComponent';

export default function GroupTable(props) {
	const { list, sorting_type, updateSortingCB } = props;

	return (
		<>
			<StyledTable>
				<TableHeader style={{ borderTop: '0' }}>
					<tr>
						<th>
							<TD_1>
								<div>No.</div>
							</TD_1>
						</th>
						<th>
							<TD_2>
								<SortIcon
									columnName={'Group'}
									sortColumn={'group_nm'}
									sorting={'group_nm'}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_2>
						</th>
					</tr>
				</TableHeader>
				<tbody style={{ height: '240px', display: 'block', overflowY: 'auto' }}>
					{list.map((data, index) => (
						<TableRow key={index} style={{ cursor: 'default' }}>
							{
								<>
									<td>
										<TD_1>{index + 1}</TD_1>
									</td>
									<td>
										<TD_2>{data.group_nm}</TD_2>
									</td>
								</>
							}
						</TableRow>
					))}
				</tbody>
			</StyledTable>
		</>
	);
}

const TD_1 = styled.div`
	display: flex;
	width: 160px;
	padding-left: 28px;
`;
const TD_2 = styled.div`
	display: flex;
	width: 225px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
