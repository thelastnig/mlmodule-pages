import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';

import { useStateActionHandler } from 'store/inference/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';

import DialogFooter from 'components/modal/DialogFooter';
import { StyledTable } from 'components/common/table/TableComponent';
import DialogTitleComponent from 'components/modal/DialogTitle';
import { dialogList } from 'constants/dialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '1656px', maxWidth: '1656px' },
		height: '935px',
	},
}));

export default function DlgInferenceTabularDetail(props) {
	const { data } = props;

	const { getTabularData } = useStateActionHandler();

	const [column_name, setColumn_name] = useState([]);
	const [tabular_list, setTabular_list] = useState([]);
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.INFERENCE_TABULAR_DETAIL;

	const classes = useStyles();

	useEffect(() => {
		if (isShow) {
			let params = {
				dataset_id: data.dataset_id,
			};
			getTabularData(params)
				.then((response) => {
					console.log('then response = ', response);
					const { column_name, tabular_list } = response.data;
					setColumn_name(column_name);
					setTabular_list(tabular_list);
				})
				.catch((error) => {
					console.log('error ', error);
					// clearTimeout(timeInterval.current);
				})
				.finally((v) => {});
		}
	}, [isShow]);

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'inference_tabular_detail_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Dataset Details'} toggle={hideDialog} />
				<DialogBody>
					<Table column_name={column_name} tabular_list={tabular_list} />
				</DialogBody>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const Table = (props) => {
	const { column_name, tabular_list } = props;

	return (
		<TableArea>
			<StyledTable>
				<TableHeader>
					<CommonTH>No.</CommonTH>
					{column_name.map((data, index) => {
						return <CommonTH key={index}>{data.toUpperCase()}</CommonTH>;
					})}
				</TableHeader>
				<TableBody>
					{tabular_list.map((data, index) => {
						return (
							<>
								<TableRow>
									<CommonTD>{index + 1}</CommonTD>
									{column_name.map((column, index) => {
										return <CommonTD>{data[column]}</CommonTD>;
									})}
								</TableRow>
							</>
						);
					})}
				</TableBody>
			</StyledTable>
		</TableArea>
	);
};

const DialogBody = styled.div`
	height: 474px;
`;
const TableArea = styled.div`
	padding: 19px 24px;
	width: 100%;
	height: 100%;
	overflow: auto;
`;
const CommonTH = styled.th`
	padding: 0 10px;
	text-align: left;
`;
const CommonTD = styled.td`
	padding: 0 10px;
	white-space: nowrap;
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

const TableBody = styled.tbody`
	// width:596px;
	width: 100%;
	height: 407px;
	overflow-y: auto;
`;

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
