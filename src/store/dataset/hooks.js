import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

let State = '';
export function useHandleState() {
	State = useSelector((state) => state.dataset);
	return State;
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

	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);

	const onFetchDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getDetail({ access_token, params }));
		},
		[dispatch],
	);
	const onInitDetailCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initDetail({ access_token, params }));
		},
		[dispatch],
	);

	const onInitDataCB = useCallback(() => {
		dispatch(reducer.actions.initData());
	}, [dispatch]);
	const setStartIndex = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setStartIndex(params));
		},
		[dispatch],
	);
	const setStartDate = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setStartDate(params));
		},
		[dispatch],
	);
	const setRowCount = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setRowCount(params));
		},
		[dispatch],
	);
	const setEndDate = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setEndDate(params));
		},
		[dispatch],
	);
	const setFilterType = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setFilterType(params));
		},
		[dispatch],
	);
	const setFilterText = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setFilterText(params));
		},
		[dispatch],
	);
	const setTabType = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setTabType(params));
		},
		[dispatch],
	);

	const setMergeDataList = useCallback(
		(params = []) => {
			dispatch(reducer.actions.setMergeDataList(params));
		},
		[dispatch]
	);

	const mergeData = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.mergeData(params));
		},
		[dispatch]
	);

	const initMergeState = useCallback(
		() => {
			dispatch(reducer.actions.initMergeState());
		},
		[dispatch]
	);

	const reqReplaceLabel = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.replaceLabel(params)); 
		},
		[dispatch]
	);

	const initAnnotationId = useCallback(
		() => {
			dispatch(reducer.actions.initAnnotationId());
		},
		[dispatch]
	);

	const exportDataCB = useCallback(
		(params = {}) => {
			return apis.exportToExperiment({ access_token, params });
		},
		[dispatch],
	);
	const deleteDataCB = useCallback(
		(params = {}) => {
			return apis.delDatasetList({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchListCB,
		updateSortingCB,
		onFetchDetailCB,
		onInitDetailCB,
		setRowCount,
		onInitDataCB,
		exportDataCB,
		deleteDataCB,
		setStartIndex,
		setStartDate,
		setEndDate,
		setFilterType,
		setFilterText,
		setTabType,
		setMergeDataList,
		mergeData,
		initMergeState,
		reqReplaceLabel,
		initAnnotationId,
	};
}
