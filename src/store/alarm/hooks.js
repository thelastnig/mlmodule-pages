import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import apis from 'lib/apis';

import { useAuthState } from 'store/auth/hooks';

export function useHandleState() {
	return useSelector((state) => state.alarm);
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

	const getHasUnread = useCallback(
		(params = {}) => {
			return apis.getAlarmList({ access_token, params });
		},
		[dispatch],
	);

	const setAlarmCB = useCallback(
		(params = {}) => {
			return apis.setAlarm({ access_token, params });
		},
		[dispatch],
	);

	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);

	return {
		onFetchListCB,
		updateSortingCB,
		getHasUnread,
		setAlarmCB,
	};
}
