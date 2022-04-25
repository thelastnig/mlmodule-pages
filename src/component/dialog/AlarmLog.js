import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import './AlarmLog.scss';
import agent from 'lib/apis';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function DlgAlarmLog({ data }) {
	const [log, setLog] = useState('');
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.ALARM_LOG;

	const onConfirmClicked = (e) => {
		hideDialog();
	};
	useEffect(() => {
		if (isShow) {
			let params = {
				error_no: data.error_no,
			};
			agent
				.getAlarmLog(params)
				.then((response) => {
					let { log } = response.data;
					setLog(log);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		}
	}, [isShow]);

	return (
		<div>
			<Dialog
				className={'log_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Log'} toggle={hideDialog} />
				<DialogContent>
					<div style={{ height: '630px', overflowY: 'auto' }}>{log}</div>
				</DialogContent>
				<DialogFooter confirmClick={(e) => onConfirmClicked(e)} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 20px 24px;
	height: 100%;
`;
