import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.project);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();
	const onCallGetProgressStatus = useCallback(
		(params)=>{
			dispatch(reducer.actions.callGetProgressStatus({params}));
		},
		[dispatch],
	);
	const onFetchProjectsListCallback = useCallback(
		(params) => {
			dispatch(reducer.actions.loadProjectList({ params }));
		},
		[dispatch],
	);
	const updateSortingCB = useCallback(
		(params) => {
			dispatch(reducer.actions.updateSorting(params));
		},
		[dispatch],
	);
	const setProjectStatus = useCallback(
		(params) => {
			return apis.setProjectStatus({ access_token, params });
		},
		[dispatch],
	);

	const onUpdateProject = useCallback(
		(data) => {
			dispatch(reducer.actions.updateSelectProject(data));
		},
		[dispatch],
	);

	const onInitDataCB = useCallback(() => {
		dispatch(reducer.actions.initData());
	}, [dispatch]);

	const setProjectDesc = useCallback(
		(params) => {
			return apis.setProjectDesc({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchProjectsListCallback,
		onUpdateProject,
		updateSortingCB,
		onInitDataCB,
		setProjectStatus,
		setProjectDesc,
		onCallGetProgressStatus,
	};
}
