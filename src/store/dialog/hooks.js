import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';

export function useDialogState() {
	return useSelector((state) => state.dialog);
}

export function useDialogAction() {
	const dispatch = useDispatch();

	const showDialog = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.showDialog(params));
		},
		[dispatch],
	);

	const hideDialog = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.hideDialog(params));
		},
		[dispatch],
	);

	return {
		showDialog,
		hideDialog,
	};
}
