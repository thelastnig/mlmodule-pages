import React from 'react';
import styled from 'styled-components';

const EmptyTable = () => {
	return (
		<TableHolderArea>
			<TableHolderText>결과가 없습니다.</TableHolderText>
		</TableHolderArea>
	);
};
export default EmptyTable;

const TableHolderArea = styled.div`
	width: 100%;
	height: 390px;
	display: flex;
	align-items: center;
	justify-content: center;
	border-top: 1px solid #eaebec;
`;

const TableHolderText = styled.div`
	width: 250px;
	height: 22px;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: #b8babd;
`;
