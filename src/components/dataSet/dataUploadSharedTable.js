import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { SortIcon } from 'components/common/table/TableComponent';
import { DataUploadContext } from 'views/dataUpload';

const DataUploadSharedTable = () => {
	const { sharedItem } = useContext(DataUploadContext);

	return (
		<div>
			<StyledTableHeader>
				<Th1>
					<div>No.</div>
				</Th1>
				<Th2>
					<div>Dataset</div>
					<SortIcon />
				</Th2>
				<Th3>
					<div>Type</div>
					<SortIcon />
				</Th3>
			</StyledTableHeader>
			<TableBody>
				<StyledTableRow>
					<Th1>{'1'}</Th1>
					<Th2>
						<div>{sharedItem.dataset_nm}</div>
					</Th2>
					<Th3>{sharedItem.dataset_type}</Th3>
				</StyledTableRow>
			</TableBody>
		</div>
	);
};
export default DataUploadSharedTable;

const StyledTableHeader = styled.div`
	width: 692px;
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
	width: 160px;
	padding-left: 8px;
	padding-right: 8px;
	display: flex;
`;

const TableBody = styled.div`
	height: 493px;
	display: block;
	overflow-y: auto;
`;

const StyledTableRow = styled.div`
	width: 692px;
	height: 41px;
	color: #82878b;
	font-size: 14px;
	display: flex;
	font-weight: 500;
	align-items: center;
	border-bottom: 1px solid #eaebec;
`;
