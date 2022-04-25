import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors, sizes } from 'styles';
import history from 'lib/history';
import loginImg from 'assets/img/img-login.png';
import loginPWImg from 'assets/icon/icon-login-pw.png';
import loginIDImg from 'assets/icon/icon-login-id.png';

import { useAuthState, useAuthAction } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Checkbox from 'components/common/table/Checkbox';
import ChangePassword from 'component/dialog/ChangePassword';
import {THEME} from "styles/theme/theme";

export default function Login() {
	const { isLoggedIn, currentUser, error, logInUserId, isRequiredChangePW } = useAuthState();
	const { onLoginRequestCallback, setRequiredChangePW } = useAuthAction();
	const { showAlert } = useAlertAction();
	const { showDialog } = useDialogAction();

	let [user_id, setUser_id] = useState('');
	let [user_pw, setUser_pw] = useState('');
	let [invalidId, setInvalidId] = useState('');
	let [invalidPwd, setInvalidPwd] = useState('');
	let [rememberMe, setRememberme] = useState(false);
	let [loginBtnDisabled, setLoginBtnDisabled] = useState(true);
	let [showChangePasswordDlg, setShowChangePasswordDlg] = useState(false);

	const onChange_user_id = useCallback(
		(e) => {
			setUser_id(e.target.value);
			setInvalidId('');
			setInvalidPwd('');
			if (e.target.value.length > 0 && user_pw.length > 0) {
				setLoginBtnDisabled(false);
			} else {
				setLoginBtnDisabled(true);
			}
		},
		[user_pw],
	);
	const onChange_password = useCallback(
		(e) => {
			setUser_pw(e.target.value);
			setInvalidId('');
			setInvalidPwd('');
			if (e.target.value.length > 0 && user_id.length > 0) {
				setLoginBtnDisabled(false);
			} else {
				setLoginBtnDisabled(true);
			}
		},
		[user_id],
	);

	useEffect(() => {
		if (isLoggedIn && currentUser.access_token_value) {
			if (isRequiredChangePW) {
				showDialog(dialogList.AUTH_CHANGE_PASSWORD);
			} else {
				history.push('/');
			}
		}
	}, [isLoggedIn && currentUser.access_token_value]);

	const loginHandle = useCallback(() => {
		if (!user_id) {
			setInvalidId('아이디가 존재하지 않습니다.');
		}
		if (!user_pw) {
			setInvalidPwd('비밀번호가 맞지 않습니다.');
		}
		if (!user_id || !user_pw) {
			return;
		}
		let params = {
			user_id: user_id,
			user_pw: user_pw,
			remember_me: rememberMe ? 1 : 0,
			noErrorPopup: true,
		};
		onLoginRequestCallback(params);
	}, [user_id, user_pw, rememberMe]);

	const forgetPWClicked = useCallback(() => {
		showAlert({
			message: '관리자에게 비밀번호 초기화를 요청 하시기 바랍니다.',
		});
	});

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Enter') {
			loginHandle();
		}
	});

	useEffect(() => {
		if (error && error.data && error.data.detail) {
			console.log('logIn Failed : ', error.data.detail);
			setUser_id(logInUserId);
			let msg_desc = error.data.detail;
			showAlert({
				message: error.data.detail,
			});
			if (msg_desc.includes('user_id')) {
				setInvalidId('아이디가 존재하지 않습니다.');
			}
			if (msg_desc.includes('Password')) {
				setInvalidPwd('비밀번호가 맞지 않습니다.');
			}
		}
	}, []);

	const handleToggleShowChangePassword = () => {
		setRequiredChangePW(false);
		if (isLoggedIn && currentUser.access_token_value) {
			history.push('/');
		}
	};

	return (
		<>
			<ChangePassword toggle={handleToggleShowChangePassword} />
			<LoginView>
				<LoginImage>
					<img src={loginImg} style={{ width: 'inherit', height: '100%' }} alt="" />
				</LoginImage>
				<LogoImg src={THEME.getImageURL('logo-login')} />
				<LoginContainer>
					<SmallTextContainer>Welcome back, please login to your account.</SmallTextContainer>
					<MainTitleContainer>{THEME.loginTitle}</MainTitleContainer>
					<InputName>ID</InputName>
					<CustomInputWrap invalidId={invalidId} isEntered={user_id.length > 0}>
						<CustomInput placeholder="아이디 혹은 이메일 주소를 입력해주세요." value={user_id} onChange={onChange_user_id} />
						<CustomInputIcon iconImg={loginIDImg} />
					</CustomInputWrap>
					<AdditionalInfoId>{invalidId}</AdditionalInfoId>
					{/*{invalidId && <AdditionalInfoId>{invalidId}</AdditionalInfoId>}*/}
					<InputName style={{ marginTop: '18px' }}>PASSWORD</InputName>
					<CustomInputWrap isEntered={user_pw.length > 0} invalidPwd={invalidPwd}>
						<CustomInput placeholder="****" type="password" onChange={onChange_password} onKeyPress={handleKeyPress} />
						<CustomInputIcon iconImg={loginPWImg} />
					</CustomInputWrap>
					<PwdContainer>
						{invalidPwd ? <AdditionalInfoPwd>{invalidPwd}</AdditionalInfoPwd> : <div></div>}
						<ForgotPassword onClick={() => forgetPWClicked()}>Forgot Password</ForgotPassword>
					</PwdContainer>
					<LoginButton
						onClick={() => {
							loginHandle();
						}}
						disabled={loginBtnDisabled}
					>
						Log in
					</LoginButton>
					<RememberContainer>
						<ChkBoxContainer>
							<Checkbox checked={rememberMe} onChange={(e) => setRememberme(!rememberMe)} />
						</ChkBoxContainer>
						<RememberText>Remember me</RememberText>
					</RememberContainer>
				</LoginContainer>
			</LoginView>
		</>
	);
}

const RememberText = styled.div`
	width: 81px;
	font-size: 12px;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.text_black};
	margin-left: 7px;
`;

const ChkBoxContainer = styled.div`
	margin-top: 5px;
`;

const RememberContainer = styled.div`
	display: flex;
	height: 17px;
	align-items: center;
	justify-content: center;
	margin-top: 20px;
`;

const PwdContainer = styled.div`
	width: 440px;
	display: flex;
	justify-content: space-between;
	height: 19px;
	margin-left: 492px;
	height: 35px;
`;

const LoginView = styled.div`
	display: flex;
	width: ${sizes.main_width};
	margin: auto;
	height: 100%;
`;

const LoginImage = styled.div`
	width: 496px;
	position: relative;
`;

const LogoImg = styled.img`
	position: fixed;
	margin-left: 56px;
	margin-top: 56px;
	width: 145px;
	height: 44px;
`;

const LoginContainer = styled.div`
	width: 100%;
	border-radius: 1px;
	background-color: ${colors.bg_white};
`;

const SmallTextContainer = styled.div`
	width: 396px;
	height: 27px;
	margin-top: 288px;
	font-size: 20px;
	letter-spacing: -0.5px;
	text-align: center;
	color: #8f9ba6;
	margin-left: 514px;
`;

const MainTitleContainer = styled.div`
	width: 612px;
	height: 55px;
	margin-left: 406px;
	font-size: 40px;
	font-weight: bold;
	letter-spacing: -0.8px;
	text-align: center;
	color: ${colors.text_black};
	margin-top: 18px;
`;

const InputName = styled.div`
	width: 440px;
	height: 20px;
	margin-top: 40px;
	margin-left: 492px;
	font-size: 12px;
	letter-spacing: -0.3px;
	color: #8f9ba6;
	display: flex;
	align-items: center;
`;

const CustomInputWrap = styled.div`
	position: relative;
	width: 440px;
	height: 40px;
	margin-top: 2px;
	margin-left: 492px;
	border: none;
	border-bottom: ${(props) => (props.isEntered ? `1px solid ${colors.text_black}` : `1px solid ${colors.disable}`)};
	border-bottom: ${(props) => props.invalidId && `1px solid ${colors.success}`};
	border-bottom: ${(props) => props.invalidPwd && `1px solid ${colors.fail}`};
`;

const CustomInput = styled.input`
	width: 420px;
	height: 39px;
	font-size: 12px;
	letter-spacing: -0.3px;
	border: none;
	font-size: 16px;
	letter-spacing: -0.4px;
	outline: none !important;
	color: ${colors.text_black};
	background-color: ${colors.bg_white};
	::placeholder {
		color: ${colors.disable};
	}
`;

const CustomInputIcon = styled.span`
	position: absolute;
	width: 20px;
	height: 20px;
	right: 0px;
	background: url(${(props) => props.iconImg});
	top: 50%;
	transform: translate(0%, -50%);
`;

const LoginButton = styled.button`
	width: 440px;
	height: 48px;
	margin-left: 492px;
	margin-top: 40px;
	padding: 13px 180px 13px 180px;
	border-radius: 24px;
	background-color: ${colors.brand};
	color: ${colors.bg_white};
	font-weight: 500;
	font-size: 16px;
	outline: none;
	border: none;
	cursor: pointer;
	:active {
		background: ${colors.press_blue};
	}
	:disabled {
		background: ${colors.gray_default};
		cursor: not-allowed;
	}
`;

const ForgotPassword = styled.div`
	width: 150px;
	font-size: 14px;
	letter-spacing: -0.35px;
	text-align: right;
	color: ${colors.text_black};
	margin: 10px 0px 0px 0px;
	cursor: pointer;
`;

const AdditionalInfoId = styled.div`
	height: 17px;
	margin: 10px 0px 0px 492px;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${colors.success};
	margin-top: 4px;
`;

const AdditionalInfoPwd = styled.div`
	display: flex;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${colors.fail};
	margin: 10px 0px 0px 0px;
	width: 100%;
	margin-top: 4px;
`;
