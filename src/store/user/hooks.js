import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.user);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getList({ access_token, params }));
		},
		[dispatch],
	);

	const onInitDataCB = useCallback(() => {
		dispatch(reducer.actions.initData());
	}, [dispatch]);
	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);
	const setUserRole = useCallback(
		(params = {}) => {
			return apis.setUserRole({ access_token, params });
		},
		[dispatch],
	);
	const setUserStatus = useCallback(
		(params = {}) => {
			return apis.setUserStatus({ access_token, params });
		},
		[dispatch],
	);
	const resetPassword = useCallback(
		(params = {}) => {
			return apis.resetPassword({ access_token, params });
		},
		[dispatch],
	);
	const addUser = useCallback(
		(params = {}) => {
			return apis.addUser({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchListCB,
		onInitDataCB,
		updateSortingCB,
		setUserRole,
		setUserStatus,
		resetPassword,
		addUser,
	};
}
