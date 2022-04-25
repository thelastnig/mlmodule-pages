import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import './ChangePassword.scss';
import { colors } from 'styles';

import { useAuthState, useAuthAction } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import Button from 'component/Button';

export default function DlgChangePassword({ toggle }) {
	const { last_connection_time } = useAuthState();
	const { onChangePWCB } = useAuthAction();
	const { showAlert } = useAlertAction();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.AUTH_CHANGE_PASSWORD;

	let [currentPW, set_currentPW] = useState('');
	let [newPW, set_newPW] = useState('');
	let [newCPW, set_newCPW] = useState('');
	const [cPWError, setCPWError] = useState(false); // 현재 암호 에러
	const [nPWError, setNPWError] = useState(false); // 새로운 암호 에러
	const [ncPWError, setNcPWError] = useState(false); // 새로운 암호 확인 에러
	const [cPWPass, setCPWPass] = useState(false); // 현재 암호
	const [nPWPass, setNPWPass] = useState(false); // 새로운 암호
	const [ncPWPass, setNcPWPass] = useState(false); // 새로운 암호 확인
	const [currentPWInfo, setCurrentPWInfo] = useState('P'); //현재암호 확인하기... P:확인전 S:확인후 성공 F:확인후 실패
	const currentPWInfoMsg = ['비밀번호 확인', '비밀번호가 일치하지 않습니다.']; //현재암호 확인은 서버에 request 후 확인 가능하므로 고정문구 사용

	const onCurrentPWChange = useCallback((e) => {
		let value = e.target.value;
		set_currentPW(value);
		setCPWError(false);
	});
	const onNewPWChange = useCallback((e) => {
		let value = e.target.value;
		set_newPW(value);
		setNPWError(false);
	});
	const onCNewPWChange = useCallback((e) => {
		let value = e.target.value;
		set_newCPW(value);
		setNcPWError(false);
	});
	const checkPWHasCharacter = (password) => {
		let spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
		if (spe < 0) {
			return false;
		}
		return true;
	};
	const checkHasNumber = (password) => {
		let spe = password.search(/[1234567890]/gi);
		if (spe < 0) {
			return false;
		}
		return true;
	};
	const checkHasEnglish = (password) => {
		let spe = password.search(/[A-Za-z]/gi);
		if (spe < 0) {
			return false;
		}
		return true;
	};
	const checkValidation = useCallback(() => {
		/*
    변경하고 싶은 비밀번호 입력란
    특수문자 1개 이상, 20글자 이내. 글귀 뒤에 표기.
         ‘변경할 비밀번호를 입력해주세요(특수문자 1개 이상 포함)
    이상 시 ‘비밀번호에 특수문자 1개 이상 포함하여야 합니다’ PopUp 생성
    20글자 초과시 입력이 안되어야 함

    변경
    저희는
    영문, 숫자, 특수문자 중 2가지 조합 10자리 이상으로 하려고 합니다.
    */

		if (newPW !== newCPW) {
			showAlert({
				message: '새로운 비밀번호와 확인 비밀번호가 일치하지 않습니다.',
			});
			setNcPWError(true);
			return false;
		}

		if (!newPW) {
			showAlert({
				message: '새로운 비밀번호를 입력하세요.',
			});
			setNPWError(true);
			return false;
		}

		if (newPW.length < 10) {
			showAlert({
				message: '새로운 비밀번호를 10자리 이상 입력하세요.',
			});
			setNPWError(true);
			return false;
		}

		if (currentPW === newPW) {
			showAlert({
				message: '변경하실 비밀번호가 이전과 같습니다.',
			});
			setNcPWError(true);
			return false;
		}

		let hasCharater = checkPWHasCharacter(newPW);
		let hasNumber = checkHasNumber(newPW);
		let hasEnglish = checkHasEnglish(newPW);

		let result = 0;
		if (hasCharater) result++;
		if (hasNumber) result++;
		if (hasEnglish) result++;
		if (result < 2) {
			showAlert({
				message: '비밀번호에 영문, 숫자, 특수문자 중 2가지 조합 이상 포함하여야 합니다.',
			});
			setNPWError(true);
			setNcPWError(true);
			return false;
		}

		return true;
	});

	const changePasswordComplete = useCallback(() => {
		console.log('changePasswordComplete');
		toggle(false);
		hideDialog();
	});
	const onConfirmClicked = (e) => {
		if (!checkValidation()) {
			return;
		}
		setCurrentPWInfo('P');
		let params = {
			password_current: currentPW,
			password_new: newPW,
			password_confirm: newCPW,
			noErrorPopup: true,
		};
		onChangePWCB(params)
			.then((response) => {
				showAlert({
					message: '비밀번호 변경이 완료되었습니다.',
					onOk: changePasswordComplete,
				});
				setCurrentPWInfo('S');
			})
			.catch((error) => {
				console.log('error ', error);
				if (error && error.status === 400 && error.data && error.data.detail && error.data.detail.includes('Password')) {
					setCurrentPWInfo('F');
					setCPWError(true);
				} else {
					let error_message = error.data.detail;
					showAlert({
						message: error_message,
					});
				}
			})
			.finally((v) => {});
	};
	const onCancelClicked = (e) => {
		let params = {
			remind_me_later: 1,
		};
		onChangePWCB(params)
			.then((response) => {
				console.log('then : remind_me_later');
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {
				toggle(false);
				hideDialog();
			});
	};

	return (
		<div>
			<Dialog
				className={'user_change_password_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
				>
				<DialogTitleComponent title={'Change Password'} toggle={hideDialog} />
				<DialogContent>
					<DialogContentHeader>
						<HeaderText>비밀번호 변경</HeaderText>
						<HeaderTextSmall>
							{!last_connection_time ? (
								<>
									<span>최초접속 시</span>
									<span style={{ color: '#e22706' }}>&nbsp;비밀번호&nbsp;</span>
									<span>변경 후 사용해주시기 바랍니다.</span>
								</>
							) : (
								<>
									<span>장기간 비밀번호를 변경하지 않았습니다.</span>
									<span style={{ color: '#e22706' }}>&nbsp;비밀번호</span>
									<span>를 변경해 주세요.</span>
								</>
							)}
						</HeaderTextSmall>
					</DialogContentHeader>
					<Spacer size={'lg'} />
					<InputBoxArea>
						<Label>현재 비밀번호</Label>
						<CustomInput
							type="password"
							onFocus={(e) => setCPWPass(true)}
							onBlur={(e) => setCPWPass(false)}
							value={currentPW}
							onChange={onCurrentPWChange}
							placeholder="현재 암호"
							Fail={cPWError}
							Success={cPWPass}
							maxLength={20}
						/>
						{currentPWInfo === 'P' ? (
							<div></div>
						) : (
							<AdditionalInfoPw Info={currentPWInfo}>
								{currentPWInfo === 'S' ? currentPWInfoMsg[0] : currentPWInfoMsg[1]}
							</AdditionalInfoPw>
						)}
					</InputBoxArea>
					<BoarderLine />
					<InputBoxArea>
						<Label>새로운 비밀번호</Label>
						<CustomInput
							type="password"
							onFocus={(e) => setNPWPass(true)}
							onBlur={(e) => setNPWPass(false)}
							value={newPW}
							onChange={onNewPWChange}
							placeholder="새 암호"
							Fail={nPWError}
							Success={nPWPass}
							maxLength={20}
						/>
					</InputBoxArea>
					<InputBoxArea>
						<Label>비밀번호 확인</Label>
						<CustomInput
							type="password"
							onFocus={(e) => setNcPWPass(true)}
							onBlur={(e) => setNcPWPass(false)}
							value={newCPW}
							onChange={onCNewPWChange}
							placeholder="새암호 다시 입력"
							Fail={ncPWError}
							Success={ncPWPass}
							maxLength={20}
						/>
					</InputBoxArea>
				</DialogContent>
				<DialogFooterComponent confirmClick={onConfirmClicked} cancelClick={onCancelClicked} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	height: 100%;
	width: 100%;
	font-size: 15px;
	font-weight: 500;
	line-height: 1.33;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
const DialogContentHeader = styled.div`
	width: 100%;
	height: 152px;
	padding: 44px 50px 46px;
	background-color: #f0f1f3;
`;
const HeaderText = styled.div`
	height: 33px;
	font-family: AppleSDGothicNeo;
	font-size: 24px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.6px;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: ${colors.text_black};
`;

const HeaderTextSmall = styled.div`
	height: 20px;
	margin: 9px 0 0;
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 1.43;
	letter-spacing: -0.32px;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	color: ${colors.text_black};
`;

const InputBoxArea = styled.div`
	width: 444px;
	margin: 0px 102px;
`;

const Label = styled.div`
	height: 19px;
	margin-top: 20px;
	margin-bottom: 5px;
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
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
	${(props) =>
		props.Success
			? `
      background: ${colors.light_blue_20};
      border-bottom-color: ${colors.light_blue};
    `
			: props.Fail
			? `
      background: ${colors.hover_red};
      border-bottom-color: ${colors.fail};
    `
			: ``}
`;

const AdditionalInfoPw = styled.div`
	width: 100%;
	height: 17px;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${(props) => (props.Info === 'F' ? `${colors.fail}` : `${colors.success}`)};
	margin-top: 4px;
`;

const BoarderLine = styled.div`
	width: 100%;
	height: 1px;
	margin: 24px 0;
	background-color: #f0f1f3;
`;

function DialogFooterComponent({ confirmClick, cancelClick }) {
	return (
		<>
			<DialogFooterWrapper>
				{cancelClick && <Button colorType={'cancel'} size={'large'} onClick={(e) => cancelClick()} >Remind me later</Button>}
				<Button colorType={'blue'} size={'large'} onClick={(e) => confirmClick()} >Change Password</Button>
			</DialogFooterWrapper>
		</>
	);
}

const DialogFooterWrapper = styled.div`
	width: 100%;
	height: 64px;
	padding: 12px 12px 12px 0;
	background-color: #f0f1f3;
	text-align: right;
	justify-content: flex-end;
	display: flex;
`;
