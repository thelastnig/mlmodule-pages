import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';
import { useAuthState } from '../auth/hooks';
import apis from 'lib/apis';

export function useHandleState() {
	return useSelector((state) => state.setting);
}

export function useStateActionHandler() {
	const { access_token } = useAuthState();
	const dispatch = useDispatch();

	const onFetchSplitParamTCB = useCallback(() => {
		dispatch(reducer.actions.loadSplitParamT(access_token));
	}, [dispatch]);

	const onFetchSplitParamCCB = useCallback(() => {
		dispatch(reducer.actions.loadSplitParamC(access_token));
	}, [dispatch]);

	const onFetchPresetListCCB = useCallback(
		(params = {}) => {
			// dispatch(reducer.actions.loadPresetList({access_token, params}));
			return apis.loadPresetList({ access_token, params });
		},
		[dispatch],
	);

	return {
		onFetchSplitParamTCB,
		onFetchSplitParamCCB,
		onFetchPresetListCCB,
	};
}
