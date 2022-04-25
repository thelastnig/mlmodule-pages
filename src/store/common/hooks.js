import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';

export function useCommonState() {
	return useSelector((state) => state.common);
}

export function useCommonAction() {
	const dispatch = useDispatch();

	const setLoadProject = useCallback(
		(data) => {
			dispatch(reducer.actions.setLoadProject(data));
		},
		[dispatch],
	);
	const setLoadTemplate = useCallback(
		(data) => {
			dispatch(reducer.actions.setLoadTemplate(data));
		},
		[dispatch],
	);

	const onShowSpinnerCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.showSpinner(params));
		},
		[dispatch],
	);
	const onHideSpinnerCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.hideSpinner(params));
		},
		[dispatch],
	);

	const onAbortSpinnerCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.abortSpinner(params));
		},
		[dispatch],
	);

	const getCommonStatus = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.getCommonStatus({ params }));
		},
		[dispatch],
	);

	const initCommonStatus = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initCommonStatus({ params }));
		},
		[dispatch],
	);

	const setToolTipHide = useCallback(
		(params = false) => {
			dispatch(reducer.actions.setToolTipHide(params));
		},
		[dispatch]
	);

	const addBackgroundJob = useCallback(
		(params = '') => {
			dispatch(reducer.actions.addBackgroundJob(params));
		},
		[dispatch]
	);

	const finishBackgroundJob = useCallback(
		(params = '') => {
			dispatch(reducer.actions.finishBackgroundJob(params));
		},
		[dispatch]
	);

	const setBackgroundJob = useCallback(
		(params = []) => {
			dispatch(reducer.actions.setBackgroundJob(params));
		},
		[dispatch]
	);

	const initBackgroundErrTxt = useCallback(
		() => {
			dispatch(reducer.actions.initBackgroundErrTxt());
		},
		[dispatch]
	);

	return {
		setLoadProject,
		setLoadTemplate,
		onShowSpinnerCB,
		onHideSpinnerCB,
		onAbortSpinnerCB,
		getCommonStatus,
		initCommonStatus,
		setToolTipHide,
		addBackgroundJob,
		finishBackgroundJob,
		setBackgroundJob,
		initBackgroundErrTxt,
	};
}
