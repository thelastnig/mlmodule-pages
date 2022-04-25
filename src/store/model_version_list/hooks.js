import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';

export function useHandleState() {
	return useSelector((state) => state.model_version_list);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchVersionListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getRegisteredModelVersionList({ access_token, params }));
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

	return {
		onFetchVersionListCB,
		onInitDataCB,
		updateSortingCB,
	};
}
