import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';

export function useHandleState() {
	return useSelector((state) => state.monitor);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onGetList = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getList({ access_token, params }));
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
		onGetList,
		updateSortingCB,
	};
}
