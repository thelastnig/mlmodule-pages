import React from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import Dialog from '@material-ui/core/Dialog';

import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';
import { useAuthState } from 'store/auth/hooks';
import Button from 'component/Button';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import { useCommonAction } from 'store/common/hooks';

export default function DownloadDataErrorReport() {
	const { currentUser, access_token, refresh_token } = useAuthState();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.DATA_DOWNLOAD_ERROR_REPORT;
	const { onHideSpinnerCB, onShowSpinnerCB } = useCommonAction();

	const onDownloadClicked = (e) => {
		hideDialog();
		const token = {
			access_token_value: access_token,
			refresh_token_value: refresh_token,
			user_id: currentUser.user_id,
			role: currentUser.role,
		};
		const base_url = `${process.env.REACT_APP_API_ENDPOINT}/${process.env.REACT_APP_API_PREFIX}`;
		const download_url = base_url + '/datapre/downloadIntegrityReport' + '?token=' + JSON.stringify(token);
		const link = document.createElement('a');

		$.ajax({
			method: 'GET',
			contentType: 'application/octet-stream',
			url: download_url,
			beforeSend: function () {
				onShowSpinnerCB();
				link.href = download_url;
				link.click();
				link.remove();
			},
			success: function() {
				onHideSpinnerCB();
			},
			fail: function() {},
			complete: function() {
				onHideSpinnerCB();
			}
		})
	};

	return (
		<div>
			<Dialog
				className={'modal_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<CloseBtnArea>
					<CloseBtn onClick={hideDialog}>
						<img src={closeIcon} alt="" />
					</CloseBtn>
				</CloseBtnArea>
				<Title>Message</Title>
				<DialogContent>데이터가 적합하지 않습니다. 데이터를 확인하고 다시 업로드해주세요.</DialogContent>
				<DialogFooterComponent
					onCancel={hideDialog}
					onDownload={onDownloadClicked}
				/>
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	height: 110px;
	width: 210px;
	margin: 16px 50px 50px 60px;
	font-size: 15px;
	font-weight: 500;
	line-height: 1.33;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.text_black};
`;
const Title = styled.div`
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 27px;
	font-size: 20px;
	font-weight: bold;
	letter-spacing: -0.5px;
	color: ${colors.text_black};
`;

const DialogFooterComponent = ({ onCancel, onDownload }) => {
	return (
		<>
			<DialogFooterWrapper>
				{onCancel && <Button colorType={'cancel'} size={'medium'} onClick={onCancel} >Cancel</Button>}
				<Button colorType={'blue'} size={'medium'} onClick={onDownload} >Download</Button>
			</DialogFooterWrapper>
		</>
	);
};
const DialogFooterWrapper = styled.div`
	width: 100%;
	height: 64px;
	padding: 12px 12px 12px 12px;
	background-color: #f0f1f3;
	text-align: right;
	display: flex;
	justify-content: center;
`;

const CloseBtnArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: 16px;
`;

const CloseBtn = styled.div`
	width: 20px;
	height: 20px;
	cursor: pointer;
`;
