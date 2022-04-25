import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import './App.scss';
import { sizes } from 'styles';
import LocalStorageManager from 'utils/LocalStorageManager';

import Routes from './Routes';

import { useAuthState, useAuthAction } from 'store/auth/hooks';
import { useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Header from 'components/layout/header';
import LeftSideBar from 'components/layout/leftSideBar';
import Alert from 'component/dialog/Alert';
import Spinner from 'component/Spinner';

import { BACKGROUND_JOB_DESC } from 'constants/common';

export default function App() {
	let isAuthenticated = LocalStorageManager.isAuthenticated();

	const { isLoggedIn, currentUser } = useAuthState();
	const { setUserInfo } = useAuthAction();
	const { setLoadProject, setLoadTemplate, setToolTipHide, setBackgroundJob } = useCommonAction();
	const { showAlert } = useAlertAction();

	const getRole = () => {
		return currentUser && currentUser.role;
	};

	useEffect(() => {
		if (isAuthenticated && !isLoggedIn) {
			setUserInfo(LocalStorageManager.getLoggedInUser());
			setLoadProject(LocalStorageManager.getLoadedProject());
			setLoadTemplate(LocalStorageManager.getLoadedTemplate());
		}
	}, [isAuthenticated, isLoggedIn, setUserInfo]);

	useEffect(() => {
		setToolTipHide(LocalStorageManager.isTooltipHide());

		const notCompletedBgJob = LocalStorageManager.getBackgroundJob();
		if (notCompletedBgJob && notCompletedBgJob.length > 0) {
			const jobListTxt = notCompletedBgJob.reduce((acc, job, idx) => {
				return `${acc}${idx !== 0 ? ', ' : ''}${BACKGROUND_JOB_DESC[job]}`;
			}, '');

			showAlert({
				message: `[${jobListTxt}] 작업이 완료되지 않은 상태에서 페이지를 나가서 완료시점을 알 수 없습니다.\n\n해당 작업 페이지로 이동해 확인해주세요.`,
			});
			LocalStorageManager.setBackgroundJob([]);
		}
	}, []);

	return (
		<>
			<Route
				render={({ location }) => {
					const isLoginPage = location.pathname.split('/')[1] === 'login';

					return (
						<>
							{!isLoginPage && <Header />}
							<MainContainer isLoginPage={isLoginPage} className={'MainContainer'}>
								{!isLoginPage && <LeftSideBar />}
								<MainWrapper isLoginPage={isLoginPage}>
									<Routes role={getRole()} isLoggedIn={isAuthenticated || isLoggedIn} />
								</MainWrapper>
							</MainContainer>
						</>
					);
				}}
			/>

			<Alert />
			<Spinner />
		</>
	);
}

const MainContainer = styled.div`
	display: flex;
	margin: auto;
	width: 100%;
	height: calc(100% - 64px);
	${(props) =>
		props.isLoginPage &&
		`
			height: 100%;
		`}
`;

const MainWrapper = styled.div`
	display: flex;
	margin: auto;
	width: calc(100% - ${sizes.menu_width});
	height: 100%;
	${(props) =>
		props.isLoginPage &&
		`
			width: 100%;
		`}
`;
