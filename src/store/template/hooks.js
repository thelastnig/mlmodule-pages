import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';

export function useHandleState() {
	return useSelector((state) => state.template);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchTemplateListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getTemplateList({ access_token, params }));
		},
		[dispatch],
	);

	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);
	const updateExperimentId = useCallback(
		(params) => {
			dispatch(reducer.actions.updateExperimentId(params));
		},
		[dispatch],
	);

	const onFetchDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getTemplateDetail({ access_token, params }));
		},
		[dispatch],
	);
	const onInitDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initTemplateDetail({ access_token, params }));
		},
		[dispatch],
	);

	const onInitDataCB = useCallback(() => {
		dispatch(reducer.actions.initData());
	}, [dispatch]);

	return {
		onFetchTemplateListCB,
		updateExperimentId,
		updateSortingCB,
		onFetchDetailCB,
		onInitDetailCB,
		onInitDataCB,
	};
}
