import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.annotator);
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
	const onAllocateAnnotatorCB = useCallback(
		(params = {}) => {
			return apis.allocateAnnotator({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchListCB,
		onAllocateAnnotatorCB,
	};
}
