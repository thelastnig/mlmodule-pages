import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import { colors } from 'styles';

import { useInputWithFiler } from 'store/root/hooks';
import { useStateActionHandler } from 'store/experiments/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { InputDisabled } from 'components/common/StyledComponent';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function ChangeModelName({ data, fetchList }) {
	const [model_name, change_model_name, set_model_name] = useInputWithFiler(false);
	const { changeExperimentInfo } = useStateActionHandler();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_CHANGE_MODEL_NAME;

	const onConfirmClicked = () => {
		let params = {
			experiment_id: data.experiment_id,
			model_nm: model_name,
		};

		changeExperimentInfo(params)
			.then((response) => {
				console.log('then response = ', response);
				changeCompleteModelName();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	
	useEffect(() => {
		set_model_name(data.model_nm);
	}, [isShow]);

	const changeCompleteModelName = useCallback(() => {
		hideDialog();
		fetchList();
	});

	return (
		<div>
			<Dialog
				className={'change_model_name_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Change Model Name'} toggle={hideDialog} />
				<DialogContent>
					<Session>
						<SessionTitle>Model Name</SessionTitle>
						<InputDisabled>{data.model_nm}</InputDisabled>
					</Session>
					<Session>
						<SessionTitle>New Model Name</SessionTitle>
						<CustomInput
							placeholder={'새로운 모델 이름을 입력해주세요.'}
							value={model_name}
							onChange={change_model_name}
							maxLength="100"
						/>
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
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
`;
