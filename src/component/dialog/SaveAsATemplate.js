import React, { useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import { colors } from 'styles';
import agent from 'lib/apis';

import { useInputWithFiler } from 'store/root/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function SaveTemplate({ data }) {
	let [template_name, change_template_name] = useInputWithFiler(false);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_SAVE_TEMPLATE;

	const onConfirmClicked = useCallback((e) => {
		let params = {
			experiment_id: data.experiment_id,
			template_nm: template_name,
		};
		agent
			.setSaveTemplate(params)
			.then((response) => {
				console.log('then response = ', response);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {
				hideDialog();
			});
	});
	
	return (
		<div>
			<Dialog
				className={'register_model_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Save as a template'} toggle={hideDialog} />
				<DialogContent>
					<Session>
						<SessionTitle>Template Name</SessionTitle>
						<CustomInput placeholder="내용을 입력해 주세요." value={template_name} onChange={change_template_name} maxLength="100" />
					</Session>
					<Session>
						<SessionTitle>Dataset</SessionTitle>
						<InputDisabled>{data.dataset_nm}</InputDisabled>
					</Session>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 0 24px;
	height: 287px;
`;
const Session = styled.div``;
const SessionTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
	padding-top: 12px;
`;
const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	background-color: ${colors.bg_white};
	:focus {
		border: solid 1.2px #005cb5;
	}
`;

const InputDisabled = styled.div`
	width: 100%;
	height: 36px;
	padding: 8px 52px 8px 16px;
	border-radius: 4px;
	border: solid 1px #e1e2e3;
	background-color: #f9f9f9;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #b8babd;
`;
