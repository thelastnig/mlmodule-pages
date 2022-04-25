import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.group);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchGroupListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.loadGroupList({ access_token, params }));
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

	const addGroup = useCallback(
		(params = {}) => {
			return apis.addGroup({ access_token, params });
		},
		[dispatch],
	);

	const setGroupStatus = useCallback(
		(params = {}) => {
			return apis.setGroupStatus({ access_token, params });
		},
		[dispatch],
	);

	const deleteGroupList = useCallback(
		(params = {}) => {
			return apis.deleteGroupList({ access_token, params });
		},
		[dispatch],
	);

	const getUserList = useCallback(
		(params = {}) => {
			return apis.getUserList({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchGroupListCB,
		onInitDataCB,
		updateSortingCB,
		addGroup,
		setGroupStatus,
		deleteGroupList,
		getUserList,
	};
}
