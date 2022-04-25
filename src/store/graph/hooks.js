import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';

export function useHandleState() {
	return useSelector((state) => state.graph);
}

export function useStateActionHandler() {
	const dispatch = useDispatch();

	const addGraphData = useCallback(
		(params) => {
			dispatch(reducer.actions.addGraphData(params));
		},
		[dispatch],
	);

	const initGraphData = useCallback(
		(params) => {
			dispatch(reducer.actions.initGraphData(params));
		},
		[dispatch],
	);

	return {
		addGraphData,
		initGraphData,
	};
}
