import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from 'store/auth/hooks';

export function useHandleState() {
	return useSelector((state) => state.algorithm);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchAlgorithmListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getAlgorithmList({ access_token, params }));
			// return apis.loadAlgorithmList({access_token, params});
		},
		[dispatch],
	);

	const initAlgorithmListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initData());
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
		onFetchAlgorithmListCB,
		updateSortingCB,
		initAlgorithmListCB,
	};
}
