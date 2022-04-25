import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { StyledTable } from 'components/common/StyledComponent';

export default function LogTable({ data, model_nm }) {
	return <TableMarkup data={data} />;
}

const TableMarkup = ({ data }) => {
	return (
		<StyledTable>
			<StyledTableHeader>
				<tr>
					<th>
						<TD_1>
							<div>No.</div>
						</TD_1>
					</th>
					<th>
						<TD_2>
							<div>MODIFIED</div>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<div>CONTENT</div>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<div>MODIFIER</div>
						</TD_4>
					</th>
				</tr>
			</StyledTableHeader>
			<tbody>
				{data.map((data, index) => (
					<StyledTableRow key={data.index}>
						{
							<>
								<td>
									<TD_1>{index + 1}</TD_1>
								</td>
								<td>
									<TD_2>{data.update_date}</TD_2>
								</td>
								<td>
									<TD_3>{data.content}</TD_3>
								</td>
								<td>
									<TD_4>{data.modifier}</TD_4>
								</td>
							</>
						}
					</StyledTableRow>
				))}
			</tbody>
		</StyledTable>
	);
};

const TD_1 = styled.div`
	display: flex;
	width: 240px;
	padding-left: 32px;
	padding-right: 8px;
`;

const TD_2 = styled.div`
	display: flex;
	width: 492px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_3 = styled.div`
	display: flex;
	width: 300px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_4 = styled.div`
	display: flex;
	width: 300px;
	padding-left: 8px;
	padding-right: 8px;
`;

export const StyledTableHeader = styled.thead`
	width: 100%;
	height: 46px;
	margin: 1px 0 0 0;
	padding: 13px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
`;

export const StyledTableRow = styled.tr`
	width: 100%;
	height: 49px;
	padding: 1px 0px 0px 0px;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
`;
