import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import apis from 'lib/apis';

export function useAuthState() {
	return useSelector((state) => state.auth);
}

export function useAuthAction() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onLoginRequestCallback = useCallback(
		(param = {}) => {
			dispatch(reducer.actions.loginRequest(param));
		},
		[dispatch],
	);

	const setUserInfo = useCallback(
		(param = {}) => {
			dispatch(reducer.actions.updateUserInfo(param));
		},
		[dispatch],
	);

	const onSignOutCallback = useCallback(() => {
		dispatch(reducer.actions.signOutRequest());
	}, [dispatch]);

	const onChangePWCB = useCallback(
		(params = {}) => {
			return apis.setChangePassword({ access_token, params });
		},
		[dispatch],
	);

	const setIsAdmin = useCallback(
		(params) => {
			dispatch(reducer.actions.setIsAdmin(params));
		},
		[dispatch],
	);

	const onTokenRefreshCallback = useCallback(() => {}, [dispatch]);

	const setRequiredChangePW = useCallback(
		(params) => {
			dispatch(reducer.actions.setRequiredChangePW(params));
		},
		[dispatch],
	);

	return {
		onLoginRequestCallback,
		onSignOutCallback,
		onTokenRefreshCallback,
		setUserInfo,
		onChangePWCB,
		setIsAdmin,
		setRequiredChangePW,
	};
}
