import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.usergroup);
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
	const resetPassword = useCallback(
		(params = {}) => {
			return apis.resetPassword({ access_token, params });
		},
		[dispatch],
	);

	const getInGroupList = useCallback(
		(params = {}) => {
			return apis.getUserGroupList({ access_token, params });
		},
		[dispatch],
	);
	const changeUserGroup = useCallback(
		(params = {}) => {
			return apis.changeUserGroup({ access_token, params });
		},
		[dispatch],
	);

	const getUsingGroupList = useCallback(
		(params = {}) => {
			return apis.getUsingGroupList({ access_token, params });
		},
		[dispatch],
	);
	const getJoinedGroupList = useCallback(
		(params = {}) => {
			return apis.getJoinedGroupList({ access_token, params });
		},
		[dispatch],
	);
	const setInitTabType = useCallback(
		(params) => {
			dispatch(reducer.actions.setInitTabType(params));
		},
		[dispatch],
	);

	return {
		onFetchListCB,
		onInitDataCB,
		updateSortingCB,
		setUserRole,
		resetPassword,
		getInGroupList,
		changeUserGroup,
		getUsingGroupList,
		getJoinedGroupList,
		setInitTabType,
	};
}
