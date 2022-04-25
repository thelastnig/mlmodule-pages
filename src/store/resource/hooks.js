import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.resource);
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

	const deleteExpCB = useCallback(
		(params = {}) => {
			return apis.delExperimentList({ access_token, params });
		},
		[dispatch],
	);

	const terminateExpCB = useCallback(
		(params = {}) => {
			return apis.terminateExperiment({ access_token, params });
		},
		[dispatch],
	);

	return {
		onGetList,
		updateSortingCB,
		deleteExpCB,
		terminateExpCB,
	};
}
