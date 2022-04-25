import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.models);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchModelsListCallback = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.loadModelsList({ access_token, params }));
		},
		[dispatch],
	);
	const onFetchModelsDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.loadModelDetail({ access_token, params }));
		},
		[dispatch],
	);
	const onFetchModelVersionDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.loadModelVersionDetail({ access_token, params }));
		},
		[dispatch],
	);

	const setRegisteredModelVersionCB = useCallback(
		(params = {}) => {
			return apis.registerModelNameVersion({ access_token, params });
		},
		[dispatch],
	);
	const setRegisteredModelCB = useCallback(
		(params = {}) => {
			return apis.registerModelName({ access_token, params });
		},
		[dispatch],
	);
	const onInitDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initModelDetail());
		},
		[dispatch],
	);
	const onInitVersionDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initModelVersionDetail());
		},
		[dispatch],
	);
	const onSaveLimitVersionCB = useCallback(
		(params = {}) => {
			return apis.saveLimitVersion({ access_token, params });
		},
		[dispatch],
	);

	const setDescription = useCallback(
		(params = {}) => {
			return apis.setDescription({ access_token, params });
		},
		[dispatch],
	);

	const setVersionTag = useCallback(
		(params = {}) => {
			return apis.setVersionTag({ access_token, params });
		},
		[dispatch],
	);
	const changeVersionTag = useCallback(
		(params = {}) => {
			return apis.changeVersionTag({ access_token, params });
		},
		[dispatch],
	);

	const deleteVersionTag = useCallback(
		(params = {}) => {
			return apis.deleteVersionTag({ access_token, params });
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
		onFetchModelsListCallback,
		onFetchModelsDetailCB,
		setRegisteredModelVersionCB,
		setRegisteredModelCB,
		onInitDetailCB,
		onSaveLimitVersionCB,
		onFetchModelVersionDetailCB,
		onInitVersionDetailCB,
		setDescription,
		setVersionTag,
		changeVersionTag,
		deleteVersionTag,
		onInitDataCB,
		updateSortingCB,
	};
}
