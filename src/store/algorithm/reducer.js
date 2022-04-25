import produce from 'store/produce';

export const LOAD_ALGORITHM_LIST_REQUEST = 'algorithm/LOAD_ALGORITHM_LIST_REQUEST';
export const LOAD_ALGORITHM_LIST_SUCCESS = 'algorithm/LOAD_ALGORITHM_LIST_SUCCESS';
export const LOAD_ALGORITHM_LIST_FAILURE = 'algorithm/LOAD_ALGORITHM_LIST_FAILURE';
export const UPDATE_SORTING = 'algorithm/UPDATE_SORTING';
export const INIT_DATA = 'algorithm/TEMPLATE_INIT_DATA';

const getAlgorithmList = (data) => ({ type: LOAD_ALGORITHM_LIST_REQUEST, payload: data });
const getAlgorithmListSuccess = (data) => ({ type: LOAD_ALGORITHM_LIST_SUCCESS, payload: data });
const getAlgorithmListFailure = (error) => ({ type: LOAD_ALGORITHM_LIST_FAILURE, payload: error });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });

export const actions = {
	getAlgorithmList,
	getAlgorithmListSuccess,
	getAlgorithmListFailure,
	updateSorting,
	initData,
};

const initialState = {
	Loading: false,
	dataset_info: {},
	list: [],
	// row_count      : 6,
	total_row_count: -1, //검색시 "결과가 없습니다" 표시하기 위해 사용.
	sorting: 'algorithm_id',
	sorting_type: false, //true:'asc', false:'desc',
	project_type: null,
};
const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case LOAD_ALGORITHM_LIST_REQUEST:
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_ALGORITHM_LIST_SUCCESS:
				// action.payload.map(item => draft.algorithm_list.push(item));
				draft.dataset_info = action.payload.dataset_info;
				let list = action.payload.algorithm_list;
				list.map((item) => draft.list.push(item));
				draft.total_row_count = list.length;
				draft.project_type = action.payload.project_type;
				break;
			case LOAD_ALGORITHM_LIST_FAILURE:
				draft.list = [];
				draft.total_row_count = -1;
				draft.project_type = null;
				break;
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				draft.list = [];
				draft.total_row_count = -1;
				draft.project_type = null;
				break;
			default:
				return state;
		}
	});

export default reducer;
