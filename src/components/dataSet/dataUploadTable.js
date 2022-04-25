import React, { useState } from 'react';
import styled from 'styled-components'
	;
import { colors } from 'styles';

import DataUploadPreview from 'component/dialog/DataUploadPreview';
import { SortIcon } from 'components/common/table/TableComponent';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function DataUploadTable(props) {
	const { isImgMode, uploadFiles } = props;
	const [previewFile, setPreviewFile] = useState('');
	const { showDialog } = useDialogAction();
	
	const previewClick = (file) => {
		if (!isImgMode) {
			return;
		}
		setPreviewFile(file);
		showDialog(dialogList.DATA_UPLOAD_PREVIEW);
	};
	return (
		<div>
			<DataUploadPreview file={previewFile} />
			<StyledTableHeader>
				<Th1>
					<div>No.</div>
				</Th1>
				<Th2>
					<div>NAME</div>
					<SortIcon />
				</Th2>
				<Th3>
					<div>Type</div>
					<SortIcon />
				</Th3>
			</StyledTableHeader>
			<TableBody>
				{uploadFiles.map((data, index) => {
					return (
						<StyledTableRow>
							<Th1>{index + 1}</Th1>
							<Th2>
								<div className={isImgMode ? 'clickable' : ''} onClick={(e) => previewClick(data)}>
									{data.name}
								</div>
							</Th2>
							<Th3>{data.type}</Th3>
						</StyledTableRow>
					);
				})}
			</TableBody>
		</div>
	);
}

const TableBody = styled.div`
	height: 493px;
	display: block;
	overflow-y: overlay;
`;

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
