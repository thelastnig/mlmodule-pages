import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';
import ListParamMaker from 'utils/ListParamMaker';

import { useAuthState, useAuthAction } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useStateActionHandler as userGroupActionHandler } from 'store/usergroup/hooks';
import { useCommonState, useCommonAction } from 'store/common/hooks';

import { PageWrapper, TitleComponent } from 'components/common/StyledComponent';
import Spacer from 'components/spacer';
import GroupTable from 'components/user/GroupTable';
import Button from 'component/Button';
import Switch from 'component/Switch';

import LocalStorageManager from 'utils/LocalStorageManager';

export default function MyPage() {
	const { currentUser } = useAuthState();
	const { onSignOutCallback, onChangePWCB } = useAuthAction();
	const { showAlert } = useAlertAction();
	const { isToolTipHide } = useCommonState();
	const { setToolTipHide } = useCommonAction();

	const { isLoggedIn, isAdmin } = useAuthState();
	const { getJoinedGroupList } = userGroupActionHandler();
	const [joinedGroupList, setJoinedGroupList] = useState([]);
	const [sorting_type, setSortingType] = useState(false);

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

	const onLogoutClick = (e) => {
		console.log('onLogoutClick');
		e.preventDefault();
		e.stopPropagation();
		onSignOutCallback();
	};

	useEffect(() => {
		if (isLoggedIn && !isAdmin) {
			fetchJoinedGroupList();
		}
	}, [sorting_type]);

	const fetchJoinedGroupList = useCallback(() => {
		if (currentUser) {
			let params = ListParamMaker.make({
				sorting: 'group_nm',
				sorting_type,
				user_id: currentUser.user_id,
			});
			getJoinedGroupList(params)
				.then((response) => {
					console.log('the response = ', response);
					let { list } = response.data;
					setJoinedGroupList(list);
				})
				.catch((error) => {
					console.log('error ', error);
					setJoinedGroupList([]);
				})
				.finally(() => {});
		}
	});

	const updateSortingCB = (params) => {
		setSortingType(params.sorting_type);
	};

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
	const saveClicked = useCallback(() => {
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
				});
				setCurrentPWInfo('P');
				set_currentPW('');
				set_newPW('');
				set_newCPW('');
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
	});

	const handleClickTooltipSwitch = () => {		
		LocalStorageManager.setTooltipHide(!LocalStorageManager.isTooltipHide());
		setToolTipHide(LocalStorageManager.isTooltipHide());
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'My Page'} />
				<WhiteBox>
					<LeftArea>
						<LogoImg src={THEME.getImageURL('logo-mypage')} />
						<Spacer size={'lg'} />
						<Spacer size={'lg'} />
						<ColoredSubTitle>개인 정보</ColoredSubTitle>
						<Spacer size={'lg'} />
						<NameBox>
							<Label>Name</Label>
							<Text>{currentUser && currentUser.user_nm}</Text>
						</NameBox>
						<Spacer size={'lg'} />
						<NameBox>
							<Label>ID</Label>
							<Text>{currentUser && currentUser.user_id}</Text>
						</NameBox>
						<Spacer size={'lg'} />
						<NameBox>
							<Label>Role</Label>
							<Text>{currentUser && currentUser.role_nm}</Text>
						</NameBox>
						<Spacer size={'lg'} />
						<Spacer />
						<Label>현재 그룹</Label>
						<Spacer />
						<TableArea>
							<GroupTable list={joinedGroupList} sorting_type={sorting_type} updateSortingCB={updateSortingCB} />
						</TableArea>
					</LeftArea>
					<DivisionLine />
					<RightArea>
						<ColoredSubTitle>암호 변경</ColoredSubTitle>
						<Spacer size={'lg'} />
						<Label>Current Password</Label>
						<StyledInput
							type="password"
							onFocus={(e) => setCPWPass(true)}
							onBlur={(e) => setCPWPass(false)}
							placeholder="현재 암호"
							value={currentPW}
							onChange={onCurrentPWChange}
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
						<Spacer />
						<Spacer />
						<Label>New Password</Label>
						<StyledInput
							placeholder="새 암호"
							type="password"
							onFocus={(e) => setNPWPass(true)}
							onBlur={(e) => setNPWPass(false)}
							value={newPW}
							onChange={onNewPWChange}
							Fail={nPWError}
							Success={nPWPass}
							maxLength={20}
						/>
						<Spacer size={'xl'} />
						<Spacer />
						<Label>Confirm Password</Label>
						<StyledInput
							type="password"
							placeholder="새 암호 다시 입력"
							onFocus={(e) => setNcPWPass(true)}
							onBlur={(e) => setNcPWPass(false)}
							value={newCPW}
							onChange={onCNewPWChange}
							Fail={ncPWError}
							Success={ncPWPass}
							maxLength={20}
						/>
						<Spacer />
						<ButtonBox>
							<Button colorType={'blue'} size={'xsmall'} onClick={(e) => saveClicked()} >OK</Button>
						</ButtonBox>
						<Spacer size={'lg'} />
						<Spacer size={'lg'} />
						<ColoredSubTitle>환경 설정</ColoredSubTitle>
						<Spacer size={'lg'} />
						<NameBox>
							<Label>도움말 문구</Label>
							<Switch width={42} height={20} isOn={!isToolTipHide} handleOnClick={handleClickTooltipSwitch} />							
						</NameBox>
					</RightArea>
				</WhiteBox>
				<BottomArea>
					<LogOut onClick={onLogoutClick}>log out</LogOut>
				</BottomArea>
			</PageWrapper>
		</>
	);
}

const WhiteBox = styled.div`
	width: 1524px;
	height: 647px;
	display: flex;
	margin: 42px 64px 0 64px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	background: ${colors.bg_white};
	overflow: hidden;
`;

const LeftArea = styled.div`
	width: 490px;
	padding: 32px;
`;

const DivisionLine = styled.div`
	width: 1px;
	margin-top: 72px;
	margin-bottom: 32px;
	background: ${colors.gray_light};
`;

const RightArea = styled.div`
	width: 490px;
	padding: 72px 32px 32px 32px;
`;

const BottomArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: 12px 64px;
`;

const TableArea = styled.div`
	width: 425px;
	height: 306px;
	padding: 8px;
	border: solid 1px #dfe2e5;
`;

const ButtonBox = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const StyledInput = styled.input`
	width: 424px;
	height: 40px;
	margin: 4px 0 0;
	padding: 10px 0;
	border: none;
	outline: none;
	color: ${colors.gray_dark};
	border-bottom: 2px solid #e1e4e7;
	background: ${colors.bg_white};
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

const LogOut = styled.div`
	width: 168px;
	height: 40px;
	padding: 0 16px 0 15px;
	border-radius: 2px;
	background: #e1e4e7;
	font-size: 16px;
	font-weight: 500;
	font-style: normal;
	font-stretch: normal;
	line-height: 40px;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.text_black};
	cursor: pointer;
	:hover {
		background: #b5bcc4;
	}
`;

const Text = styled.div`
	height: 20px;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${colors.gray_dark};
`;

const Label = styled.div`
	height: 20px;
	font-size: 13px;
	font-weight: 500;
	letter-spacing: -0.33px;
	color: ${colors.text_black};
`;

const NameBox = styled.div`
	display: flex;
	flex-direction: column;
`;

const ColoredSubTitle = styled.div`
	font-size: 16px;
	font-weight: 500;
	letter-spacing: -0.4px;
	color: ${colors.brand};
	font-family: AppleSDGothicNeo;
`;

const LogoImg = styled.img`
	width: 80px;
	height: 24px;
`;

const AdditionalInfoPw = styled.div`
	width: 100%;
	height: 17px;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${(props) => (props.Info === 'F' ? `${colors.fail}` : `${colors.success}`)};
	margin-top: 4px;
`;
