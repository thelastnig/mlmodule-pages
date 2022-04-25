import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';

export function useAlertState() {
	return useSelector((state) => state.alert);
}

export function useAlertAction() {
	const dispatch = useDispatch();

	const showAlert = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.showAlert(params));
		},
		[dispatch],
	);

	const hideAlert = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.hideAlert(params));
		},
		[dispatch],
	);

	return {
		showAlert,
		hideAlert,
	};
}
