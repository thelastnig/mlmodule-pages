import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.experiments);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchExperimentsListCallback = useCallback(
		(params = {}) => {
			console.log('params = ', params);
			dispatch(reducer.actions.loadExperimentsList({ access_token, params }));
		},
		[dispatch],
	);

	const onFetchExperimentsDetailCallback = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.loadExperimentsDetail({ access_token, params }));
		},
		[dispatch],
	);
	const onSetStartCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setStartTrain({ access_token, params }));
		},
		[dispatch],
	);
	const onSetStopTrainCB = useCallback(
		(params = {}) => {
			return apis.setStopTrain({ access_token, params });
		},
		[dispatch],
	);

	const onInitDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initExperimentsDetail());
		},
		[dispatch],
	);

	// const onFetchExperimentParamCB = useCallback((params = {}) => {
	//   dispatch(reducer.actions.getExperimentParam(access_token));
	// }, [dispatch]);

	const getExperimentCompareCB = useCallback(
		(params = {}) => {
			return apis.getExperimentCompare({ access_token, params });
		},
		[dispatch],
	);
	const deleteExpCB = useCallback(
		(params = {}) => {
			return apis.delExperimentList({ access_token, params });
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

	const changeExperimentInfo = useCallback(
		(params = {}) => {
			return apis.changeExperimentInfo({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchExperimentsListCallback,
		onFetchExperimentsDetailCallback,
		onSetStartCB,
		onSetStopTrainCB,
		onInitDetailCB,
		getExperimentCompareCB,
		deleteExpCB,
		updateSortingCB,
		onInitDataCB,
		changeExperimentInfo,
	};
}
