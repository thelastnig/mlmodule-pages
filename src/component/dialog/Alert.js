import React, { useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import styled from 'styled-components';

import '../../components/common/common.scss';

import { colors } from 'styles';

import { useAlertState, useAlertAction } from 'store/alert/hooks';

import Button from 'component/Button';

export default function Alert() {
	const { message, isConfirm, onOk, onCancel } = useAlertState();
	const { hideAlert } = useAlertAction();

	const ok = useCallback(() => {
		onOk && onOk();
		hideAlert();
	});

	const cancel = useCallback(() => {
		onCancel && onCancel();
		hideAlert();
	});

	const closed = useCallback(() => {
		if (isConfirm) {
			cancel();
		} else {
			ok();
		}
	});

	const messages = message.split('\n');

	return (
		<Dialog className={'alert_dlg dialog_layout'} open={!!message} onClose={closed}>
			<DialogTitle>Message</DialogTitle>
			<DialogContent>{messages && messages.length > 0 && messages.map(message => (
				<>
					{message}<br />
				</>
			))}</DialogContent>
			<DialogFooterWrapper>
				{message &&
					(isConfirm ?
						<>
							<Button size={'xsmall'} colorType={'cancel'} onClick={cancel}>Cancel</Button>
							<Button size={'xsmall'} colorType={'blue'} onClick={ok}>OK</Button>
						</>
						:
						<ConfirmBtn onClick={ok}>Close</ConfirmBtn>
					)
				}
			</DialogFooterWrapper>
		</Dialog>
	);
}

const DialogTitle = styled.div`
	text-align: center;
	font-size: 20px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.5px;
	color: ${colors.text_black};
	height: 100px;
	padding-top: 60px;
`;

const DialogContent = styled.div`
	padding: 0 50px;
	height: calc(100% - 64px - 100px);
	text-align: center;
	word-break: break-all;
	overflow: auto;
`;

const DialogFooterWrapper = styled.div`
	display: flex;
	justify-content: flex-end;
	width: 100%;
	height: 64px;
	padding: 12px;
	background-color: #f0f1f3;
	text-align: right;
`;

const ConfirmBtn = styled.div`
	display: inline-block;
	width: 296px;
	height: 40px;
	border-radius: 2px;
	background: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	color: ${colors.text_white};
	text-align: center;
	line-height: 40px;
	cursor: pointer;
	:hover {
		background: ${colors.light_blue_hover};
	}
	:active {
		background: ${colors.light_blue_hover};
	}
	:disabled {
		background: ${colors.gray_default};
	}
`;
