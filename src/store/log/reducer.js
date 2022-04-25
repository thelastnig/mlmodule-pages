import produce from '../produce';

export const LOAD_LOG_REQUEST = 'log/LOAD_LOG_REQUEST';
export const LOAD_LOG_SUCCESS = 'log/LOAD_LOG_SUCCESS';
export const LOAD_LOG_FAILURE = 'log/LOAD_LOG_FAILURE';

const loadLog = (data) => ({ type: LOAD_LOG_REQUEST, payload: data });
const loadLogSuccess = (data) => ({ type: LOAD_LOG_SUCCESS, payload: data });
const loadLogFailure = (error) => ({ type: LOAD_LOG_FAILURE, payload: error });

export const actions = {
	loadLog,
	loadLogSuccess,
	loadLogFailure,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	registered_model_list: [],
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case LOAD_LOG_REQUEST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.registered_model_list = [];
				break;
			case LOAD_LOG_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				action.payload.map((item) => draft.registered_model_list.push(item));
				break;
			case LOAD_LOG_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.registered_model_list = [];
				break;
			default:
				return state;
		}
	});

export default reducer;
