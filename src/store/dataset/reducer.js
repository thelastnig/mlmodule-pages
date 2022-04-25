import produce from '../produce';

export const LOAD_LIST_REQUEST = 'dataset/LOAD_LIST_REQUEST';
export const LOAD_LIST_SUCCESS = 'dataset/LOAD_LIST_SUCCESS';
export const LOAD_LIST_FAILURE = 'dataset/LOAD_LIST_FAILURE';
export const UPDATE_SORTING = 'dataset/UPDATE_SORTING';
export const INIT_DATA = 'dataset/TEMPLATE_INIT_DATA';
export const GET_DETAIL_REQUEST = 'dataset/GET_TEMPLATE_DETAIL_REQUEST';
export const GET_DETAIL_SUCCESS = 'dataset/GET_TEMPLATE_DETAIL_SUCCESS';
export const GET_DETAIL_FAIL = 'dataset/GET_TEMPLATE_DETAIL_FAIL';
export const INIT_DETAIL_FAIL = 'dataset/INIT_DETAIL_FAIL';
export const SET_START_INDEX = 'dataset/SET_START_INDEX';
export const SET_START_DATE = 'dataset/SET_START_DATE';
export const SET_END_DATE = 'dataset/SET_END_DATE';
export const SET_FILTER_TYPE = 'dataset/SET_FILTER_TYPE';
export const SET_FILTER_TEXT = 'dataset/SET_FILTER_TEXT';
export const SET_TAB_TYPE = 'dataset/SET_TAB_TYPE';
export const SET_ROW_COUNT = 'dataset/SET_ROW_COUNT';

export const SET_MERGE_DATA_LIST = 'dataset/SET_MERGE_DATA_LIST';
export const MERGE_DATA_REQUEST = 'dataset/MERGE_DATA_REQUEST';
export const MERGE_DATA_SUCCESS = 'dataset/MERGE_DATA_SUCCESS';
export const MERGE_DATA_FAILURE = 'dataset/MERGE_DATA_FAILURE';
export const INIT_MERGE_STATE = 'dataset/INIT_MERGE_STATE';

export const REPLACE_LABEL_REQUEST = 'dataset/REPLACE_LABEL_REQUEST';
export const REPLACE_LABEL_SUCCESS = 'dataset/REPLACE_LABEL_SUCCESS';
export const REPLACE_LABEL_FAILURE = 'dataset/REPLACE_LABEL_FAILURE';
export const INIT_ANNOTATION_ID = 'dataset/INIT_ANNOTATION_ID';

const getList = (data) => ({ type: LOAD_LIST_REQUEST, payload: data });
const getListSuccess = (data) => ({ type: LOAD_LIST_SUCCESS, payload: data });
const getListFailure = (error) => ({ type: LOAD_LIST_FAILURE, payload: error });
const updateSorting = (data) => ({ type: UPDATE_SORTING, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });
const getDetail = (data) => ({ type: GET_DETAIL_REQUEST, payload: data });
const getDetailSuccess = (data) => ({ type: GET_DETAIL_SUCCESS, payload: data });
const getDetailFail = (data) => ({ type: GET_DETAIL_FAIL, payload: data });
const initDetail = (data) => ({ type: INIT_DETAIL_FAIL, payload: data });
const setStartIndex = (data) => ({ type: SET_START_INDEX, payload: data });
const setStartDate = (data) => ({ type: SET_START_DATE, payload: data });
const setEndDate = (data) => ({ type: SET_END_DATE, payload: data });
const setFilterType = (data) => ({ type: SET_FILTER_TYPE, payload: data });
const setFilterText = (data) => ({ type: SET_FILTER_TEXT, payload: data });
const setTabType = (data) => ({ type: SET_TAB_TYPE, payload: data });
const setRowCount = (data) => ({ type: SET_ROW_COUNT, payload: data });
const setMergeDataList = (data) => ({ type: SET_MERGE_DATA_LIST, payload: data });
const mergeData = (data) => ({ type: MERGE_DATA_REQUEST, payload: data });
const mergeDataSuccess = (data) => ({ type: MERGE_DATA_SUCCESS, payload: data });
const mergeDataFailure = (error) => ({ type: MERGE_DATA_FAILURE, payload: error });
const initMergeState = () => ({ type: INIT_MERGE_STATE });
const replaceLabel = (data) => ({ type: REPLACE_LABEL_REQUEST, payload: data });
const replaceLabelSuccess = (data) => ({ type: REPLACE_LABEL_SUCCESS, payload: data });
const replaceLabelFailure = (error) => ({ type: REPLACE_LABEL_FAILURE, payload: error });
const initAnnotationId = () => ({ type: INIT_ANNOTATION_ID });

export const actions = {
	getList,
	getListSuccess,
	getListFailure,
	updateSorting,
	initData,
	getDetail,
	getDetailSuccess,
	getDetailFail,
	initDetail,
	setStartIndex,
	setRowCount,
	setStartDate,
	setEndDate,
	setFilterType,
	setFilterText,
	setTabType,
	setMergeDataList,
	mergeData,
	mergeDataSuccess,
	mergeDataFailure,
	initMergeState,
	replaceLabel,
	replaceLabelSuccess,
	replaceLabelFailure,
	initAnnotationId,
};

const initialState = {
	loadListLoading: false,
	loadListSuccess: false,
	loadListError: null,
	list: [],
	row_count: 10,
	total_row_count: -1,
	sorting: 'create_date',
	sorting_type: false, //true:'asc', false:'desc'
	start_index: 0,
	startDate: new Date(),
	endDate: '',
	filter_type: '',
	filter_text: '',
	project_id: '',
	tabType: 'P', //P: Private, S: Shared
	detail: '',
	datasetIdsInMergeJob: [],
	isDataMergeComplete: false,
	selectedMergeDataList: [],
	datasetIdInJob: 0,
	replacedAnnotaionId: 0,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case UPDATE_SORTING:
				draft.sorting = action.payload.sorting;
				draft.sorting_type = action.payload.sorting_type;
				break;
			case INIT_DATA:
				draft.sorting = 'create_date';
				draft.sorting_type = false;
				draft.start_index = 0;
				draft.startDate = new Date();
				draft.endDate = '';
				draft.filter_type = '';
				draft.filter_text = '';
				draft.tabType = 'P';
				draft.row_count = 10;
				break;
			case LOAD_LIST_REQUEST:
				draft.loadListSuccess = false;
				draft.loadListError = null;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case LOAD_LIST_SUCCESS:
				draft.loadListSuccess = true;
				draft.loadListError = null;
				// action.payload.map(item => draft.list.push(item));
				let list = action.payload.list;
				list.map((item) => draft.list.push(item));
				draft.total_row_count = action.payload.total_row_count;
				break;
			case LOAD_LIST_FAILURE:
				draft.loadListSuccess = true;
				draft.loadListError = action.payload;
				draft.list = [];
				draft.total_row_count = -1;
				break;
			case GET_DETAIL_REQUEST:
				draft.detail = '';
				break;
			case GET_DETAIL_FAIL:
				draft.detail = '';
				break;
			case GET_DETAIL_SUCCESS:
				draft.detail = action.payload;
				break;
			case INIT_DETAIL_FAIL:
				draft.detail = '';
				break;
			case SET_START_INDEX:
				draft.start_index = action.payload;
				break;
			case SET_START_DATE:
				draft.startDate = action.payload;
				break;
			case SET_END_DATE:
				draft.endDate = action.payload;
				break;
			case SET_ROW_COUNT:
				draft.row_count = action.payload;
				break;
			case SET_FILTER_TYPE:
				draft.filter_type = action.payload;
				break;
			case SET_FILTER_TEXT:
				draft.filter_text = action.payload;
				break;
			case SET_TAB_TYPE:
				draft.tabType = action.payload;
				break;
			case MERGE_DATA_REQUEST:
				draft.datasetIdsInMergeJob = action.payload.dataset_ids;
				break;
			case MERGE_DATA_SUCCESS:
				draft.isDataMergeComplete = true;
				break;
			case MERGE_DATA_FAILURE:

				break;
			case INIT_MERGE_STATE:
				draft.datasetIdsInMergeJob = [];
				draft.isDataMergeComplete = false;
				break;
			case SET_MERGE_DATA_LIST:
				draft.selectedMergeDataList = action.payload;
				break;
			case REPLACE_LABEL_REQUEST:
				draft.datasetIdInJob = action.payload.dataset_id;
				break;
			case REPLACE_LABEL_SUCCESS:				
				draft.datasetIdInJob = 0;
				draft.replacedAnnotaionId = action.payload.annotation_id;
				break;
			case REPLACE_LABEL_FAILURE:
				draft.datasetIdInJob = 0;
				break;
			case INIT_ANNOTATION_ID:
				draft.replacedAnnotaionId = 0;
				break;
			default:
				return state;
		}
	});

export default reducer;
