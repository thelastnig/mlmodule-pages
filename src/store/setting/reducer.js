import produce from '../produce';

export const LOAD_SPLIT_PARAM_T_REQUEST = 'experiment/LOAD_SPLIT_PARAM_T_REQUEST';
export const LOAD_SPLIT_PARAM_T_SUCCESS = 'experiment/LOAD_SPLIT_PARAM_T_SUCCESS';
export const LOAD_SPLIT_PARAM_T_FAILURE = 'experiment/LOAD_SPLIT_PARAM_T_FAILURE';
export const LOAD_SPLIT_PARAM_C_REQUEST = 'experiment/LOAD_SPLIT_PARAM_C_REQUEST';
export const LOAD_SPLIT_PARAM_C_SUCCESS = 'experiment/LOAD_SPLIT_PARAM_C_SUCCESS';
export const LOAD_SPLIT_PARAM_C_FAILURE = 'experiment/LOAD_SPLIT_PARAM_C_FAILURE';
export const LOAD_PRESET_LIST_REQUEST = 'experiment/LOAD_PRESET_LIST_REQUEST';
export const LOAD_PRESET_LIST_SUCCESS = 'experiment/LOAD_PRESET_LIST_SUCCESS';
export const LOAD_PRESET_LIST_FAILURE = 'experiment/LOAD_PRESET_LIST_FAILURE';

const loadSplitParamT = (data) => ({ type: LOAD_SPLIT_PARAM_T_REQUEST, payload: data });
const loadSplitParamTSuccess = (data) => ({ type: LOAD_SPLIT_PARAM_T_SUCCESS, payload: data });
const loadSplitParamTFailure = (error) => ({ type: LOAD_SPLIT_PARAM_T_FAILURE, payload: error });
const loadSplitParamC = (data) => ({ type: LOAD_SPLIT_PARAM_C_REQUEST, payload: data });
const loadSplitParamCSuccess = (data) => ({ type: LOAD_SPLIT_PARAM_C_SUCCESS, payload: data });
const loadSplitParamCFailure = (error) => ({ type: LOAD_SPLIT_PARAM_C_FAILURE, payload: error });
const loadPresetList = (data) => ({ type: LOAD_PRESET_LIST_REQUEST, payload: data });
const loadPresetListSuccess = (data) => ({ type: LOAD_PRESET_LIST_SUCCESS, payload: data });
const loadPresetListFailure = (error) => ({ type: LOAD_PRESET_LIST_FAILURE, payload: error });

export const actions = {
	loadSplitParamT,
	loadSplitParamTSuccess,
	loadSplitParamTFailure,
	loadSplitParamC,
	loadSplitParamCSuccess,
	loadSplitParamCFailure,
	loadPresetList,
	loadPresetListSuccess,
	loadPresetListFailure,
};

const initialState = {
	Loading: false,
	paramT: {
		isFetch: false,
		split_seed: null,
		split_stratify: null,
		split_test: null,
		split_training: null,
		split_type: null,
		split_validation: null,
	},
	paramC: {
		isFetch: false,
	},
	preset_fetch: false,
	preset_list: [],
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case LOAD_SPLIT_PARAM_T_REQUEST:
				draft.paramT = {};
				draft.paramT.isFetch = true;
				break;
			case LOAD_SPLIT_PARAM_T_SUCCESS:
				draft.paramT = action.payload;
				draft.paramT.isFetch = true;
				break;
			case LOAD_SPLIT_PARAM_T_FAILURE:
				draft.paramT = {};
				draft.paramT.isFetch = false;
				break;
			case LOAD_SPLIT_PARAM_C_REQUEST:
				draft.paramC = {};
				draft.paramC.isFetch = true;
				break;
			case LOAD_SPLIT_PARAM_C_SUCCESS:
				draft.paramC = action.payload;
				draft.paramC.isFetch = true;
				break;
			case LOAD_SPLIT_PARAM_C_FAILURE:
				draft.paramC = {};
				draft.paramC.isFetch = true;
				break;
			case LOAD_PRESET_LIST_REQUEST:
				draft.preset_list = [];
				draft.preset_fetch = true;
				break;
			case LOAD_PRESET_LIST_SUCCESS:
				action.payload.map((item) => draft.preset_list.push(item));
				draft.preset_fetch = true;
				break;
			case LOAD_PRESET_LIST_FAILURE:
				draft.preset_list = [];
				draft.preset_fetch = true;
				break;
			default:
				return state;
		}
	});

export default reducer;
