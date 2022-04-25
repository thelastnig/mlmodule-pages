import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';

import '../../components/common/common.scss';

import { colors } from 'styles';

import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';

export default function Alert() {
	const { isDataUploadAlertOpen } = useHandleState();
	const { hideDataUploadAlert } = useStateActionHandler();

	const handleClose = (event, reason) => {
		if (reason && (reason == 'backdropClick' || reason == 'escapeKeyDown')) { 
			return;
		}
		hideDataUploadAlert();
	};

	return (
		<Dialog className={'alert_dlg alert_teachable_data'}  open={isDataUploadAlertOpen} onClose={handleClose}>
			<DialogWrapper>
				<DialogTitle>샘플 로드 중...</DialogTitle>
				<DialogContent>
					<LinearProgress className="progress" />
				</DialogContent>
			</DialogWrapper>
		</Dialog>
	);
}

const DialogWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
`;

const DialogTitle = styled.div`
	width: 85%;
	margin: 0 auto;
	font-size: 16px;
	font-weight: 600;
	margin-bottom: 15px;
`;

const DialogContent = styled.div`
	width: 85%;
	margin: 0 auto;
`;
