import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.inference);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchDataListCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getDataSetList({ params }));
		},
		[dispatch],
	);
	const onInitDataCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initData({ access_token, params }));
		},
		[dispatch],
	);

	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);

	const onGetInferenceModelList = useCallback(
		(params = {}) => {
			return apis.getInferenceModelList({ access_token, params });
		},
		[dispatch],
	);

	const getImageList = useCallback(
		(params = {}) => {
			return apis.getImageList({ access_token, params });
		},
		[dispatch],
	);

	const getTabularData = useCallback(
		(params = {}) => {
			return apis.getTabularData({ access_token, params });
		},
		[dispatch],
	);

	const getImagePreview = useCallback(
		(params = {}) => {
			return apis.getImagePreview({ access_token, params });
		},
		[dispatch],
	);

	const onStartInference = useCallback(
		(params = {}) => {
			return apis.startInference({ access_token, params });
		},
		[dispatch],
	);

	const getInferenceSetting = useCallback(
		(params = {}) => {
			return apis.getInferenceSetting({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchDataListCB,
		onInitDataCB,
		updateSortingCB,
		onGetInferenceModelList,
		getImageList,
		getImagePreview,
		getTabularData,
		onStartInference,
		getInferenceSetting,
	};
}
