import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import { ROLE_LIST } from 'constants/common';

import { useInputWithFiler } from 'store/root/hooks';
import { useStateActionHandler as userActionHandler } from 'store/user/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Spacer from 'components/spacer';
import SelectCustom from 'components/common/SelectCustom';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';

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

export default function UserCreate({ fetchList }) {
	const classes = useStyles();
	const { addUser } = userActionHandler();

	const [user_id, change_user_id, set_user_id] = useInputWithFiler(true);
	const [user_name, change_user_name, set_user_name] = useInputWithFiler(false);
	const [role, setRole] = useState('');

	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const { showAlert } = useAlertAction();
	const isShow = dialogName === dialogList.USER_CREATE;

	const onConfirmClicked = (e) => {
		let params = {
			user_id: user_id,
			user_nm: user_name,
			role: role.value,
		};
		addUser(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
				if (error.data.detail)
					showAlert({
						message: error.data.detail,
					});
				else if (error.data.message === "'role'")
					showAlert({
						message: 'role을 선택해 주세요.',
					});
				else
					showAlert({
						message: error.data.message,
					});
			})
			.finally((v) => {
				hideDialog();
			});
	};

	useEffect(() => {
		set_user_id('');
		set_user_name('');
		setRole('');
	}, [isShow]);

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'user_create_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'New User'} toggle={hideDialog} />
				<DialogContent>
					<Spacer />
					<Label>User ID</Label>
					<Spacer />
					<CustomInput placeholder="User ID를 입력해주세요." value={user_id} onChange={change_user_id} maxLength="100" />

					<Spacer size={'lg'} />
					<Label>User Name</Label>
					<Spacer />
					<CustomInput placeholder="User Name를 입력해주세요." value={user_name} onChange={change_user_name} maxLength="100" />

					<Spacer size={'lg'} />
					<Label>Password</Label>
					<Spacer />
					<DisabledInput>{'123456789#@!'}</DisabledInput>
					<Spacer size={'lg'} />
					<Label>Role</Label>
					<Spacer />
					<SelectCustom
						styleOptions={{
							width: '428px',
							height: '36px',
						}}
						isDisabled={false}
						isLoading={false}
						isClearable={false}
						isRtl={false}
						isSearchable={false}
						disabledColor={true}
						options={ROLE_LIST}
						getOptionLabel={(option) => option.label}
						getOptionValue={(option) => option.value}
						onChange={setRole}
						value={role}
						label_key={'label'}
						value_key={'value'}
						placeholder={'Role을 선택해 주세요.'}
						isRemovePrefixCurrent={true}
					/>
					<Spacer size={'xl'} />
					<BottomText>해당 사용자에게 초기 Password가 전달됩니다.</BottomText>
					<BottomText>사용자가 Password를 수정하는 것을 권장합니다.</BottomText>
					<Spacer size={'xl'} />
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} confirmTitle={'Save'} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const BottomText = styled.div`
	font-size: 15px;
	letter-spacing: -0.38px;
	color: #1e1f22;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const DisabledInput = styled.div`
	width: 428px;
	height: 36px;
	border-radius: 4px;
	background-color: #f0f1f3;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: #9ea1a4;
	padding: 8px 16px;
`;

const CustomInput = styled.input`
	width: 428px;
	height: 36px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	padding: 8px 16px;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5 !important;
	}
`;

const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
