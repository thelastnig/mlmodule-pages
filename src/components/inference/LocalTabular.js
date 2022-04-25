import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

const LocalTabular = (props) => {
	const { uploadFiles } = props;

	return (
		<>
			<StyledTableHeader>
				<Th1>
					<div>No.</div>
				</Th1>
				<Th2>
					<div>NAME</div>
				</Th2>
				<Th3>
					<div>Type</div>
				</Th3>
			</StyledTableHeader>
			<TableBody>
				{uploadFiles.map((data, index) => {
					return (
						<StyledTableRow key={index}>
							<Th1>{index + 1}</Th1>
							<Th2>{data.name}</Th2>
							<Th3>{data.type}</Th3>
						</StyledTableRow>
					);
				})}
			</TableBody>
		</>
	);
};

export default LocalTabular;

const StyledTableHeader = styled.div`
	width: 100%;
	height: 41px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	display: flex;
	font-weight: 700;
	align-items: center;
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
`;

const TableBody = styled.div`
	height: 100%;
	display: block;
	overflow-y: overlay;
`;

const StyledTableRow = styled.div`
	width: 100%;
	height: 41px;
	color: #82878b;
	font-size: 14px;
	display: flex;
	font-weight: 500;
	align-items: center;
	border-bottom: 1px solid #eaebec;
`;

const Th1 = styled.div`
	width: 100px;
	padding-left: 16px;
	padding-right: 16px;
	display: flex;
`;

const Th2 = styled.div`
	width: 430px;
	padding-left: 8px;
	padding-right: 8px;
	display: flex;
`;

const Th3 = styled.div`
	padding-left: 8px;
	padding-right: 8px;
	display: flex;
`;
