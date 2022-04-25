import produce from '../produce';

export const LOAD_LIST_REQUEST = 'inference/LOAD_DATASET_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'project/LOAD_DATASET_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'project/LOAD_DATASET_LIST_FAILURE';
export const UPDATE_SORTING = 'project/DATASET_UPDATE_SORTING';
export const INIT_DATA = 'project/INIT_DATA';

const getDataSetList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const getDataSetListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const getDataSetListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });

export const actions = {
	getDataSetList,
	getDataSetListSuccess,
	getDataSetListFailure,
	updateSorting,
	initData,
};

const initialState = {
	list: [],
	row_count: 4,
	total_row_count: 0,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				break;
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case LOAD_LIST_REQUEST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				break;
			case LOAD_LIST_SUCCESS:
				console.log('LOAD_LIST_SUCCESS');
				draft.loadListSuccess = true;
				draft.loadListError = null;
				let list = action.payload.list;
				draft.total_row_count = action.payload.total_row_count;
				list.map((item) => draft.list.push(item));
				let counts = {
					total: action.payload.total,
					completed: action.payload.completed,
					ready: action.payload.ready,
					working: action.payload.working,
				};
				draft.counts = counts;
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				break;
			default:
				return state;
		}
	});

export default reducer;
