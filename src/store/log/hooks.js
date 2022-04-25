import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.experiments);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchLogCB = useCallback(
		(params = {}) => {
			return apis.loadLog({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchLogCB,
	};
}
