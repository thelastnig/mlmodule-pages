import React, { useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import notiIconOn from 'assets/icon/btn-notice-on-n.png';
import notiIconOff from 'assets/icon/btn-notice-off-n.png';

import { useAuthState } from 'store/auth/hooks';
import { useCommonState, useCommonAction } from 'store/common/hooks';

const POLLING_INTERVAL = 1 * 1000 * 5; // 5초
const POLLING_USE_INTERVAL = true;
const POLLING_SHOW_SPINNER = false;

export default function AlarmIconComponent() {
	const history = useHistory();
	const { isAdmin, isLoggedIn } = useAuthState();
	const { loadProject, alarm: hasUnread } = useCommonState();
	const { getCommonStatus, initCommonStatus } = useCommonAction();
	const CommonStatusInterval = useRef(null);

	const alarmClicked = () => {
		// setNotiCnt((hasNoti) => {
		//   return hasNoti > 0 ? 0 : 1
		// });
		if (isAdmin) {
			history.push('/alarmAdmin');
		} else {
			history.push('/alarm');
		}
	};

	useEffect(() => {
		if (isLoggedIn) {
			fetchCommonStatus();
			if (POLLING_USE_INTERVAL) {
				getCommonStatusInterval();
			}
		} else {
			clearTimeout(CommonStatusInterval.current);
		}
		if (!loadProject) {
			initCommonStatus();
		}
		return () => {
			// componentWillUnmount 역할
			clearTimeout(CommonStatusInterval.current);
		};
	}, [isLoggedIn, loadProject, isAdmin]);

	const fetchCommonStatus = useCallback(() => {
		let params = {
			noSpinner: !POLLING_SHOW_SPINNER,
			// project_id: isAdmin ? '' : loadProject ? loadProject.project_id : ''
		};
		if (loadProject) {
			params.project_id = loadProject.project_id;
		}
		getCommonStatus(params);
	});
	const clearInterval = useCallback(() => {
		clearTimeout(CommonStatusInterval.current);
	}, [isLoggedIn, loadProject]);

	const getCommonStatusInterval = useCallback(() => {
		if (!isLoggedIn) {
			clearInterval();
			return;
		}
		if (CommonStatusInterval.current) {
			clearInterval();
		}
		// if (!isAdmin && !loadProject) {
		//   return
		// }
		CommonStatusInterval.current = setInterval(() => {
			fetchCommonStatus();
		}, POLLING_INTERVAL);
	}, [isAdmin, loadProject, isLoggedIn]);

	return <>{hasUnread ? <IconComponent src={notiIconOn} onClick={alarmClicked} /> : <IconComponent src={notiIconOff} onClick={alarmClicked} />}</>;
}
const IconComponent = styled.img`
	width: 20px;
	height: 20px;
	margin-left: 24px;
	margin-top: 2px;
	cursor: pointer;
`;
