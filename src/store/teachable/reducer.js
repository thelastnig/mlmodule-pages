import produce from 'store/produce';

export const SET_TASKTYPE = 'teachable/SET_TASKTYPE';
export const CHANGE_LIST = 'teachable/CHANGE_LIST';
export const CHANGE_DETECTION_LIST = 'teachable/CHANGE_DETECTION_LIST';
export const INIT_DATA = 'teachable/INIT_DATA';
export const ADD_CLASS = 'teachable/ADD_CLASS';
export const DELETE_CLASS = 'teachable/DELETE_CLASS';
export const REORDER_CLASS = 'teachable/REORDER_CLASS';
export const CHANGE_CLASS_NAME = 'teachable/CHANGE_CLASS_NAME';
export const UPLOAD_IMAGE = 'teachable/UPLOAD_IMAGE';
export const UPLOAD_AUDIO = 'teachable/UPLOAD_AUDIO';
export const CHANGE_PARAMS = 'teachable/CHANGE_PARAMS';
export const INIT_PARAMS = 'teachable/INIT_PARAMS';
export const CHANGE_UPLOAD_OPEN = 'teachable/CHANGE_UPLOAD_OPEN';
export const DELETE_IMAGE = 'teachable/DELETE_IMAGE';
export const DELETE_ALL_IMAGES = 'teachable/DELETE_ALL_IMAGES';
export const TOGGLE_WEBCAM_AVAILABLE = 'teachable/TOGGLE_WEBCAM_AVAILABLE';
export const TOGGLE_AUDIO_AVAILABLE = 'teachable/TOGGLE_AUDIO_AVAILABLE';

// Data Upload
export const ADD_DATASET = 'teachable/ADD_DATASET';
export const ADD_DATASET_SUCCESS = 'teachable/ADD_DATASET_SUCCESS';
export const ADD_DATASET_FAIL = 'teachable/ADD_DATASET_FAIL';

// TF module
export const ADD_MODEL = 'teachable/ADD_MODEL';
export const ADD_METADATA = 'teachable/ADD_METADATA';
export const SET_TRAIN_PROGRESS = 'teachable/SET_TRAIN_PROGRESS';
export const ADD_HISTORY = 'teachable/ADD_HISTORY';
export const STOP_TRAIN = 'teachable/STOP_TRAIN';

// Train step
export const CHANGE_WORKING = 'teachable/CHANGE_WORKING';
export const CHANGE_DATALOADING = 'teachable/CHANGE_DATALOADING';
export const CHANGE_TRAINING = 'teachable/CHANGE_TRAINING';

// Deploy - convert model format
export const CONVERT_TEACHABLE_MODEL = 'teachable/CONVERT_TEACHABLE_MODEL';
export const CONVERT_TEACHABLE_MODEL_SUCCESS = 'teachable/CONVERT_TEACHABLE_MODEL_SUCCESS';
export const CONVERT_TEACHABLE_MODEL_FAIL = 'teachable/CONVERT_TEACHABLE_MODEL_FAIL';

// Google Drive
export const SET_GOOGLE_ACCESS_TOKEN = 'teachable/SET_GOOGLE_ACCESS_TOKEN';

// Alert
export const SHOW_DATA_UPLOAD_ALERT = 'teachable/SHOW_DATA_UPLOAD_ALERT';
export const HIDE_DATA_UPLOAD_ALERT = 'teachable/HIDE_DATA_UPLOAD_ALERT';
export const SET_DATA_SAMPLE_INDEX = 'teachable/SET_DATA_SAMPLE_INDEX';

// Audio
export const ADD_AUDIO_FULL_DATA = 'teachable/ADD_AUDIO_FULL_DATA';


const setTaskType = (data) => ({ type: SET_TASKTYPE, payload: data });
const changeList = (data) => ({ type: CHANGE_LIST, payload: data });
const changeDetectionList = (data) => ({ type: CHANGE_DETECTION_LIST, payload: data });
const initData = (data) => ({ type: INIT_DATA, payload: data });
const addClass = (data) => ({ type: ADD_CLASS, payload: data });
const deleteClass = (data) => ({ type: DELETE_CLASS, payload: data });
const reorderClass = (data) => ({ type: REORDER_CLASS, payload: data });
const changeClassName = (data) => ({ type: CHANGE_CLASS_NAME, payload: data });
const uploadImage = (data) => ({ type: UPLOAD_IMAGE, payload: data });
const uploadAudio = (data) => ({ type: UPLOAD_AUDIO, payload: data });
const changeParams = (data) => ({ type: CHANGE_PARAMS, payload: data });
const initParams = (data) => ({ type: INIT_PARAMS, payload: data });
const changeUploadOpen = (data) => ({ type: CHANGE_UPLOAD_OPEN, payload: data });
const deleteImage = (data) => ({ type: DELETE_IMAGE, payload: data });
const deleteAllImages = (data) => ({ type: DELETE_IMAGE, payload: data });
const toggleWebCamAvailable = (data) => ({ type: TOGGLE_WEBCAM_AVAILABLE, payload: data });
const toggleAudioAvailable = (data) => ({ type: TOGGLE_AUDIO_AVAILABLE, payload: data });

// Data Upload
const addDataset = (data) => ({ type: ADD_DATASET, payload: data });
const addDatasetSuccess = (data) => ({ type: ADD_DATASET_SUCCESS, payload: data });
const addDatasetFail = (data) => ({ type: ADD_DATASET_FAIL, payload: data });

// TF module
const addModel = (data) => ({ type: ADD_MODEL, payload: data });
const addMetadata = (data) => ({ type: ADD_METADATA, payload: data });
const setTrainProgress = (data) => ({ type: SET_TRAIN_PROGRESS, payload: data });
const addHistory = (data) => ({ type: ADD_HISTORY, payload: data });
const stopTrain = (data) => ({ type: STOP_TRAIN, payload: data });

// working step
const changeWorking = (data) => ({ type: CHANGE_WORKING, payload: data });
const changeDataloading = (data) => ({ type: CHANGE_DATALOADING, payload: data });
const changeTraining = (data) => ({ type: CHANGE_TRAINING, payload: data });

// Deploy - convert model format
const convertTeachableModel = (data) => ({ type: CONVERT_TEACHABLE_MODEL, payload: data });
const convertTeachableModelSuccess = (data) => ({ type: CONVERT_TEACHABLE_MODEL_SUCCESS, payload: data });
const convertTeachableModelFail = (data) => ({ type: CONVERT_TEACHABLE_MODEL_FAIL, payload: data });

// Google Drive
const setGoogleAccessToken = (data) => ({ type: SET_GOOGLE_ACCESS_TOKEN, payload: data });

// Alert
const showDataUploadAlert = (data) => ({ type: SHOW_DATA_UPLOAD_ALERT, payload: data });
const hideDataUploadAlert = (data) => ({ type: HIDE_DATA_UPLOAD_ALERT, payload: data });
const setDataSampleIndex = (data) => ({ type: SET_DATA_SAMPLE_INDEX, payload: data });


export const actions = {
	setTaskType,
	changeList,
	changeDetectionList,
	initData,
	addClass,
	deleteClass,
	reorderClass,
	changeClassName,
	uploadImage,
	changeParams,
	initParams,
	changeUploadOpen,
	deleteImage,
	deleteAllImages,
	addDataset,
	addDatasetSuccess,
	addDatasetFail,
	addModel,
	addMetadata,
	setTrainProgress,
	stopTrain,
	addHistory,
	changeWorking,
	changeDataloading,
	changeTraining,
	convertTeachableModel,
	convertTeachableModelSuccess,
	convertTeachableModelFail,
	setGoogleAccessToken,
	toggleWebCamAvailable,
	toggleAudioAvailable,
	showDataUploadAlert,
	hideDataUploadAlert,
	setDataSampleIndex,
};

const initialState = {
	taskType: 'image',
	taskSubType: 'classification',
	list_init: 2,
	list: [{
		id: 'id-0',
		class_name: 'class 0',
		audioFullData: '',
		data: [],
		isUploadOpen: false,
		uploaderType: 'local',
		isWebcamAvailable: false,
		isAudioAvailable: false
	},{
		id: 'id-1',
		class_name: 'class 1',
		audioFullData: '',
		data: [],
		isUploadOpen: false,
		uploaderType: 'local',
		isWebcamAvailable: false,
		isAudioAvailable: false
	}],
	detection_list: [{
		id: 'id-0',
		class_name: 'class 0',
		audioFullData: '',
		data: [],
		isUploadOpen: false,
		uploaderType: 'local',
		isWebcamAvailable: false,
		isAudioAvailable: false,
	}],
	useAugmentation: false,
	params: {
		epochs: 50,
		batch_size: 16,
		learning_rate: 0.001,
	},
	class_count: 2,
	train_progress: 0,
	metadata: null,
	model: null,
	history: null,
	isWorking: false,
	isDataloading: false,
	isTraining: false,
	gapiAccessToken: null,
	isTrained: false,
	isDataUploadAlertOpen: false,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case SET_TASKTYPE:
				draft.taskType = action.payload.taskType;
				draft.taskSubType = action.payload.taskSubType;
				break;
			case CHANGE_LIST:
				draft.list = action.payload.list;
				break;
			case CHANGE_DETECTION_LIST:
				draft.detection_list = action.payload.detection_list;
				break;
			case INIT_DATA:
				return initialState;
			case ADD_CLASS:
				draft.class_count = action.payload.class_count;
				draft.list_init = draft.list_init + 1;
				draft.list = [...draft.list, action.payload.added_item]
				break;
			case DELETE_CLASS:
				draft.class_count = action.payload.class_count;
				draft.list = action.payload.list;
				break;
			case REORDER_CLASS:
				const result = Array.from(action.payload.list);
				const [removed] = result.splice(action.payload.startIndex, 1);
				result.splice(action.payload.endIndex, 0, removed);
				draft.list = result
				break;
			case CHANGE_CLASS_NAME:
				draft.list = action.payload.list;
				break;
			case UPLOAD_IMAGE:
				draft.list = action.payload.list;
				break;
			case UPLOAD_AUDIO:
				draft.list = action.payload.list;
				break;
			case CHANGE_PARAMS:
				draft.params = action.payload.params;
				break;
			case INIT_PARAMS:
				draft.params = {
					epochs: 50,
					batch_size: 16,
					learning_rate: 0.001,
				};
				break;
			case CHANGE_UPLOAD_OPEN:
				draft.list = action.payload.list;
				break;
			case DELETE_IMAGE:
				draft.list = action.payload.list;
				break;
			case DELETE_ALL_IMAGES:
				draft.list = action.payload.list;
				break;
			case ADD_DATASET:
				break;
			case ADD_DATASET_SUCCESS:
				draft.detail = action.payload;
				break;
			case ADD_DATASET_FAIL:
				break;
			case ADD_MODEL:
				draft.model = action.payload.model;
				break;
			case ADD_METADATA:
				draft.metadata = action.payload.metadata;
				break;
			case SET_TRAIN_PROGRESS:
				draft.train_progress = action.payload.train_progress;
				break;
			case STOP_TRAIN:
				draft.train_progress = 0;
				draft.metadata = null;
				draft.model = null;
				draft.history = null;
				draft.isWorking = false;
				draft.isDataloading = false;
				draft.isTraining = false;
				draft.isTrained = false;
				break;
			case ADD_HISTORY:
				draft.history = action.payload.history;
				break;
			case CHANGE_WORKING:
				draft.isWorking = action.payload.isWorking;
				break;
			case CHANGE_DATALOADING:
				draft.isDataloading = action.payload.isDataloading;
				break;
			case CHANGE_TRAINING:
				draft.isTraining = action.payload.isTraining;
				draft.isTrained = action.payload.isTrained;
				break;
			case CONVERT_TEACHABLE_MODEL:
				break;
			case CONVERT_TEACHABLE_MODEL_SUCCESS:
				draft.detail = action.payload;
				break;
			case CONVERT_TEACHABLE_MODEL_FAIL:
				break;
			case SET_GOOGLE_ACCESS_TOKEN:
				draft.gapiAccessToken = action.payload.gapiAccessToken;
				break;
			case TOGGLE_WEBCAM_AVAILABLE:
				draft.list = action.payload.list;
				break;
			case TOGGLE_AUDIO_AVAILABLE:
				draft.list = action.payload.list;
				break;
			case SHOW_DATA_UPLOAD_ALERT:
				draft.isDataUploadAlertOpen = true;
				break;
			case HIDE_DATA_UPLOAD_ALERT:
				draft.isDataUploadAlertOpen = false;
				break;
			default:
				return state;
		}
	});

export default reducer;
