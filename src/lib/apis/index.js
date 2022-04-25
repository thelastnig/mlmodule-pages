import axios from 'axios';
import qs from 'qs';

import history from 'lib/history';
import DateUtil from 'utils/DateUtil';
import LocalStorageManager from 'utils/LocalStorageManager';
import { REFRESH_TOKEN, TOKEN_EXPIRED } from 'store/auth/reducer';

import { ABORT_SPINNER, HIDE_SPINNER, SET_LOAD_PROJECT, SHOW_SPINNER } from 'store/common/reducer';

// const API_ROOT = `${process.env.REACT_APP_API_ENDPOINT}`;
// const API_ROOT = `${process.env.REACT_APP_API_ENDPOINT}/_aip/${process.env.REACT_APP_API_VERSION}`;
const API_ROOT = `${process.env.REACT_APP_API_ENDPOINT}/${process.env.REACT_APP_API_PREFIX}`;

let Store = null;
const expriedToken = () => {
	console.log('expiredToken');
	Store.dispatch({
		type: TOKEN_EXPIRED,
	});
	Store.dispatch({
		type: SET_LOAD_PROJECT,
		payload: '',
	});
};

const updateToken = (userInfo) => {
	Store.dispatch({
		type: REFRESH_TOKEN,
		payload: userInfo,
	});
};
const showSpinner = () => {
	Store.dispatch({
		type: SHOW_SPINNER,
	});
};
const hideSpinner = () => {
	Store.dispatch({
		type: HIDE_SPINNER,
	});
};
const abortSpinner = () => {
	Store.dispatch({
		type: ABORT_SPINNER,
	});
};
// let refresh = false
function Agent(axios, baseURL = null) {
	this.StoreToken = false;
	/* Base url create */
	this.axios = axios.create({
		baseURL,
		paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
	});

	this.interceptor = (store) => {
		Store = store;
		this.axios.interceptors.request.use((request) => {
			if (!request.noSpinner) {
				showSpinner();
			}
			return request;
		});
		this.axios.interceptors.response.use(
			(response) => {
				let msg_desc = response.data.message;
				let payload = {
					message: msg_desc,
				};
				if (msg_desc) {
					store.dispatch({
						type: 'common/SHOW_ALERT_DLG',
						payload: payload,
					});
				}
				if (!response.config.noSpinner) {
					hideSpinner();
				}
				return response;
			},
			(error) => {
				let msg_desc = '';
				if (!error.response) {
					msg_desc = 'Network error';
				} else {
					msg_desc = error.response.data.detail;
				}

				if (!msg_desc) {
					msg_desc = error.response.statusText;
				}
				let payload = {
					message: msg_desc,
				};
				if (msg_desc !== 'Network error') {
					if (error.response.status === 401) {
						payload.okCB = expriedToken;
					}

					if (error.response.status === 403) {
						history.push('/');
					}
				}

				let ErrorPopup = true;
				if (error.response?.config?.noErrorPopup) {
					ErrorPopup = false;
				}

				if (msg_desc && ErrorPopup) {
					store.dispatch({
						type: 'common/SHOW_ALERT_DLG',
						payload: payload,
					});
				}
				abortSpinner();
				return Promise.reject(error.response);
			},
		);
	};
	this.setToken = (userInfo, StoreToken) => {
		if (StoreToken && this.StoreToken) {
			return;
		}
		this.StoreToken = true;
		if (userInfo) {
			const { access_token_value, refresh_token_value, user_id, role } = userInfo;

			const token = {
				access_token_value: access_token_value,
				refresh_token_value: refresh_token_value,
				user_id,
				role,
			};
			global.agent.axios.defaults.headers.common[`Accept`] = '*/*';
			global.agent.axios.defaults.headers.common[`SM-AUTH-TOKEN`] = JSON.stringify(token);
		}
	};
	this.beforeCheck = async () => {
		let { currentUser } = Store.getState().auth;
		if (!currentUser) {
			return;
		}
		let access_expired_date = currentUser.access_expired_date;
		if (!access_expired_date) {
			console.log('api !currentUser');
			return;
		}
		const TEN_MINUTE = 1000 * 60 * 10;
		if (DateUtil.isInTime(access_expired_date, TEN_MINUTE)) {
			let response = await this.axios.get('/common/refreshToken');
			let userInfo = response.data;
			this.setToken(userInfo);
			updateToken(userInfo);
		}
	};
	/* Base config */
	this._requestConfig = () => {
		let requestConfig = { headers: {} };
		// let accessToken = access_token;   // TODO: get access token from store
		// requestConfig.headers['SM-AUTH-TOKEN'] = `${accessToken}`;
		// requestConfig = {
		//   headers: {
		//     // 'SM-AUTH-TOKEN': `${accessToken}`,
		//   }
		// };

		return requestConfig;
	};
	this._requestConfigForFilePost = () => {
		let requestConfig = null;
		// let accessToken = access_token;   // TODO: get access token form store
		requestConfig = {
			headers: {
				// 'SM-AUTH-TOKEN': `${accessToken}`,
				'Content-Type': 'multipart/form-data',
			},
		};
		return requestConfig;
	};

	/* Base API method */
	this.get = async (url, params = {}, withConfig = true) => {
		if (typeof url === 'string') url = url.replace('http:', 'https:');
		const config = withConfig ? this._requestConfig() : {};
		if (params.noSpinner) {
			config.noSpinner = true;
		}
		if (params.noErrorPopup) {
			config.noErrorPopup = true;
		}
		delete params.noSpinner;
		delete params.noErrorPopup;
		await this.beforeCheck();
		return this.axios
			.get(url, { params, ...config })
			.then()
			.catch(this._handleError);
	};
	this.getPublic = (url, params = {}) => {
		return this.get(url, params, false);
	};
	this.put = (url, body) => {
		return this.axios.put(url, body, this._requestConfig).then().catch(this._handleError);
	};
	this.patch = (url, body) => {
		return this.axios.patch(url, body, this._requestConfig).then().catch(this._handleError);
	};
	this.post = (url, body) => {
		const config = this._requestConfig();
		if (body instanceof FormData) {
			if (body.get('noErrorPopup')) {
				config.noErrorPopup = true;
				body.delete('noErrorPopup');
			}
			if (body.get('noSpinner')) {
				config.noSpinner = true;
				body.delete('noSpinner');
			}
		} else {
			if (body.noErrorPopup) {
				config.noErrorPopup = true;
			}
			if (body.noSpinner) {
				config.noSpinner = true;
			}
			delete body.noErrorPopup;
			delete body.noSpinner;
		}

		return this.axios
			.post(url, body, { ...config })
			.then()
			.catch(this._handleError);
	};
	this.postWithProgress = (url, body, onProgress) => {
		const config = this._requestConfig();
		if (body instanceof FormData) {
			if (body.get('noErrorPopup')) {
				config.noErrorPopup = true;
				body.delete('noErrorPopup');
			}
		} else {
			if (body.noErrorPopup) {
				config.noErrorPopup = true;
			}
			delete body.noErrorPopup;
		}
		return this.axios
			.post(url, body, { ...config, onUploadProgress: onProgress })
			.then()
			.catch(this._handleError);
	};
	this.delete = (url) => {
		return this.axios.delete(url, this._requestConfig).then().catch(this._handleError);
	};
	this.postFile = (url, file) => {
		return this.axios.post(url, file, this._requestConfigForFilePost).then().catch(this._handleError);
	};

	/* Base handle error */
	this._handleError = (error) => {
		if (!error.response) {
			throw error;
		}
		// TODO: error helper handler for (error code , error message)
		console.log('handle error : ', error.response);
		if (error.response.status === 401) {
			LocalStorageManager.clear();
			// window.location.reload(false);
			window.location.href = '/';
		}

		throw error;
	};

	/* User */
	this.login = (param = {}) => {
		console.log(param);
		// tests
		// "user_id": "user_a@hae.com",
		// "password": "********"
		return this.post('/common/signIn', param);
	};

	this.logout = (access_token) => {
		return this.get('/common/signOut', {}, true, access_token);
	};

	this.setChangePassword = ({ access_token, params }) => {
		return this.post('/common/setPassword', params, true, access_token);
	};

	/* Projects */
	this.loadProjects = ({ access_token, params = {} }) => {
		//     getProjectList?start_index=0&row_count=100&sorting=create_date&sorting_type=asc&filters={"all":"G1", "create_date":["2020-12-21", "2020-12-30"]}
		return this.get('/common/getProjectList', params, true, access_token);
	};
	this.callTest = ({ access_token, params = {} }) => {
		return this.get('/test_api/callTest', params, true, access_token);
	};
	this.getProgressStatus = ({ access_token, params = {} }) => {
		return this.get('/datapre/getProgressStatus', params, true, access_token);
	};
	this.saveNewProject = (params) => {
		return this.post('/common/addProject', params, true);
	};
	this.delProjectList = (params) => {
		return this.post('/common/deleteProjectList', params, true);
	};
	this.getRunSetting = (params) => {
		return this.get('/train/getRunSetting', params, true);
	};

	this.getGroupList = ({ access_token, params }) => {
		return this.get('/common/getGroupList', params, true, access_token);
	};
	this.getCommonStatus = ({ params }) => {
		return this.get('/common/getCommonStatus', params, true);
	};
	this.addGroup = ({ access_token, params }) => {
		return this.post('/common/addGroup', params, true, access_token);
	};
	this.setGroupStatus = ({ access_token, params }) => {
		return this.post('/common/setGroupStatus', params, true, access_token);
	};
	this.deleteGroupList = ({ access_token, params }) => {
		return this.post('/common/deleteGroupList', params, true, access_token);
	};
	this.deleteUserList = (params) => {
		return this.post('/common/deleteUserList', params, true);
	};
	this.getUserList = ({ access_token, params }) => {
		return this.get('/common/getUserList', params, true, access_token);
	};
	this.setUserRole = ({ access_token, params }) => {
		return this.post('/common/setUserRole', params, true, access_token);
	};
	this.setUserStatus = ({ access_token, params }) => {
		return this.post('/common/setUserStatus', params, true, access_token);
	};
	this.resetPassword = ({ access_token, params }) => {
		return this.post('/common/resetPassword', params, true, access_token);
	};
	this.addUser = ({ access_token, params }) => {
		return this.post('/common/addUser', params, true, access_token);
	};
	this.getUserGroupList = ({ access_token, params }) => {
		return this.get('/common/getUserGroupList', params, true, access_token);
	};
	this.changeUserGroup = ({ access_token, params }) => {
		return this.post('/common/changeUserGroup', params, true, access_token);
	};
	this.getUsingGroupList = ({ access_token, params }) => {
		return this.get('/common/getUsingGroupList', params, true, access_token);
	};
	this.getJoinedGroupList = ({ access_token, params }) => {
		return this.get('/common/getJoinedGroupList', params, true, access_token);
	};
	this.setProjectDesc = ({ access_token, params }) => {
		return this.post('/common/setProjectDesc', params, true, access_token);
	};

	/* Experiments */
	// main list
	this.loadExperiments = ({ access_token, params = {} }) => {
		// tests
		// params = {
		//   project_id: 1,
		//   model_nm: 'b',
		// };
		return this.get('/common/getExperimentList', params, true, access_token);
	};
	// detail by id
	this.loadExperimentsDetail = (access_token, params) => {
		params = {
			experiment_id: 1,
		};
		return this.get('/common/getExperimentList/detail', params, true, access_token);
	};
	// detail by id
	this.loadExperimentsParams = ({ access_token, params = {} }) => {
		// params = {
		//   experiment_id: 1,
		// };
		return this.get('/train/getExperimentConfig', params, true, access_token);
	};
	this.getExperimentConfig = (params) => {
		return this.get('/train/getExperimentConfig', params, true);
	};
	this.exportToExperiment = ({ access_token, params = {} }) => {
		// POST http://175.197.4.214:8005/api/datapre/setTrainDataset/
		// {
		//   "user_id":"hsjo",
		//   "project_id":1,
		//   "dataset_id":26
		// }
		return this.post('/datapre/setTrainDataset', params, true, access_token);
	};
	this.getPreprocessHistoryList = (params) => {
		return this.get('/datapre/getPreprocessHistoryList', params, true);
	};
	this.getPreprocessSetting = (params) => {
		// 용도 : DB-004 화면 이동 시 preprocess status를 확인하여, 사용 중인 경우 현재 동작 정보를 전달함
		return this.get('/datapre/getPreprocessSetting', params, true);
	};
	this.applyPreprocess = (params) => {
		return this.post('/datapre/applyPreprocess', params, true);
	};
	this.stopPreprocessPipeline = (params) => {
		return this.get('/datapre/stopPreprocessPipeline', params, true);
	};
	this.getAnalyzeSetting = (params) => {
		return this.get('/datapre/getAnalyzeSetting', params, true);
	};
	this.getAnalyticResult = (params) => {
		return this.get('/datapre/getAnalyticResult', params, true);
	};
	this.getPreprocessMethodList = (params) => {
		return this.get('/datapre/getPreprocessMethodList', params, true);
	};
	this.getAnalyticMethodList = (params) => {
		return this.get('/datapre/getAnalyticMethodList', params, true);
	};
	this.applyAnalytic = (params) => {
		return this.post('/datapre/applyAnalytic', params, true);
	};
	this.stopAnalyzePipeline = (params) => {
		return this.get('/datapre/stopAnalyzePipeline', params, true);
	};
	this.getLatestAnalyze = (params) => {
		return this.get('/datapre/getLatestAnalyze', params, true);
	};
	this.addDataset = (params) => {
		return this.post('/datapre/addDataset', params, true);
	};
	this.addLabel = (params) => {
		return this.post('/datapre/addLabel', params, true);
	};
	this.checkAnalyticStatus = (params) => {
		return this.get('/datapre/checkAnalyticStatus', params, true);
	};

	this.getExperimentCompare = ({ access_token, params = {} }) => {
		return this.get('/train/getExperimentConfigList', params, true, access_token);
	};
	this.delExperimentList = ({ access_token, params = {} }) => {
		return this.post('/common/deleteExperimentList', params, true, access_token);
	};
	this.changeExperimentInfo = ({ access_token, params = {} }) => {
		return this.post('/common/changeExperimentInfo', params, true, access_token);
	};
	this.terminateExperiment = ({ access_token, params = {} }) => {
		return this.post('/common/terminateExperiment', params, true, access_token);
	};

	this.setStartTrain = ({ access_token, params = {} }) => {
		return this.post('/train/startTrain', params, true, access_token);
	};
	this.setStopTrain = ({ access_token, params = {} }) => {
		return this.post('/train/stopTrain', params, true, access_token);
	};

	this.setSaveTemplate = (params) => {
		return this.post('/common/addTemplate', params, true);
	};
	this.deleteTemplateList = (params) => {
		return this.post('/common/deleteTemplateList', params, true);
	};
	/* models */
	this.loadModels = ({ access_token, params = {} }) => {
		return this.get('/models/getRegisteredModelList', params, true, access_token);
	};
	this.loadModelDetail = ({ access_token, params = {} }) => {
		return this.get('/models/getRegisteredModelDetail', params, true, access_token);
	};
	this.loadModeVersionlDetail = ({ access_token, params = {} }) => {
		return this.get('/models/getRegisteredModelVersionDetail', params, true, access_token);
	};
	this.getRegisteredModelVersionList = ({ access_token, params = {} }) => {
		return this.get('/models/getRegisteredModelVersionList', params, true, access_token);
	};
	this.saveLimitVersion = ({ access_token, params = {} }) => {
		return this.post('/models/setRegisteredModelVersionLimit', params, true, access_token);
	};
	this.setDescription = ({ access_token, params = {} }) => {
		return this.post('/models/setVersionDescription', params, true, access_token);
	};
	this.setVersionTag = ({ access_token, params = {} }) => {
		return this.post('/models/addVersionTag', params, true, access_token);
	};
	this.changeVersionTag = ({ access_token, params = {} }) => {
		return this.post('/models/setVersionTag', params, true, access_token);
	};
	this.deleteVersionTag = ({ access_token, params = {} }) => {
		return this.post('/models/deleteVersionTag', params, true, access_token);
	};
	this.convertVersionFormat = (params) => {
		return this.post('/models/convertVersionFormat', params, true);
	};
	this.getModelSetting = (params) => {
		return this.get('/models/getModelSetting', params, true);
	};

	this.getTemplateList = ({ access_token, params = {} }) => {
		return this.get('/common/getTemplateList', params, true, access_token);
	};
	this.setProjectStatus = ({ access_token, params = {} }) => {
		return this.post('/common/setProjectStatus', params, true, access_token);
	};

	this.getAnnotatorList = (params) => {
		return this.get('/datapre/getAnnotatorList', params, true);
	};
	this.allocateAnnotator = ({ access_token, params = {} }) => {
		return this.post('/datapre/allocateAnnotator', params, true, access_token);
	};
	this.getDataSetList = ({ access_token, params = {} }) => {
		return this.get('/datapre/getDatasetList', params, true, access_token);
	};
	this.getDatasetList = (params = {}) => {
		return this.get('/datapre/getDatasetList', params, true);
	};
	this.getDatasetDetail = ({ access_token, params = {} }) => {
		return this.get('/datapre/getDatasetDetail', params, true, access_token);
	};
	this.mergeData = (params = {}) => {
		return this.post('/datapre/mergeDataset', params);
	};
	this.modifyLabel = (params = {}) => {
		return this.post('/datapre/modifyLabel', params);
	};
	this.delDatasetList = ({ access_token, params }) => {
		return this.post('/datapre/deleteDatasetList', params, true, access_token);
	};
	this.getImageDataList = ({ access_token, params }) => {
		return this.get('/datapre/getImageDataList', params, true, access_token);
	};
	this.getImageDetail = ({ access_token, params }) => {
		return this.get('/datapre/getImageDetail', params, true, access_token);
	};
	this.getLabeledImage = ({ params }) => {
		return this.get('/datapre/getLabeledImage', params, true);
	};
	this.checkPreprocessStatus = (params) => {
		return this.get('/datapre/checkPreprocessStatus', params, true);
	};
	this.getLatestPreprocess = (params) => {
		return this.get('/datapre/getLatestPreprocess', params, true);
	};
	this.getPreprocessResult = (params) => {
		return this.get('/datapre/getPreprocessResult', params, true);
	};

	this.getAlarmList = ({ access_token, params = {} }) => {
		return this.get('/common/getAlarmList', params, true, access_token);
	};
	this.setAlarm = ({ access_token, params = {} }) => {
		return this.post('/common/setAlarm', params, true, access_token);
	};
	this.getAlarmLog = (params) => {
		return this.get('/common/getAlarmLog', params, true);
	};

	/* setting */
	this.loadSplitParamT = (access_token) => {
		let params = {
			split_type: 'T',
		};
		return this.get('/train/getDataSplitParam', params, true, access_token);
	};
	this.loadSplitParamC = (access_token) => {
		let params = {
			split_type: 'C',
		};
		return this.get('/train/getDataSplitParam', params, true, access_token);
	};

	this.getAlgorithmList = ({ access_token, params = {} }) => {
		return this.get('/train/getAlgorithmList', params, true, access_token);
	};

	this.loadPresetList = ({ access_token, params = {} }) => {
		return this.get('/train/getPresetList', params, true, access_token);
	};
	this.startAutoMl = (params) => {
		return this.post('/train/startAutoMl', params, true);
	};
	this.stopHpo = (params) => {
		return this.post('/train/stopHpo', params, true);
	};
	this.submitHpoTrial = (params) => {
		return this.post('/train/submitHpoTrial', params, true);
	};
	this.startHpo = (params) => {
		return this.post('/train/startHpo', params, true);
	};
	this.getHpoSpecData = (params) => {
		return this.get('/train/getHpoSpecData', params, true);
	};
	this.getHpoTrialList = (params) => {
		return this.get('/train/getHpoTrialList', params, true);
	};
	this.getHpoTrialData = (params) => {
		return this.get('/train/getHpoTrialData', params, true);
	};

	this.registerModelNameVersion = ({ access_token, params = {} }) => {
		return this.post('/models/addRegisteredModelVersion', params, true, access_token);
	};
	this.registerModelName = ({ access_token, params = {} }) => {
		return this.post('/models/addRegisteredModel', params, true, access_token);
	};
	this.deleteVersionList = (params) => {
		return this.post('/models/deleteVersionList', params, true);
	};

	/*
  log
   */
	this.loadLog = ({ access_token, params = {} }) => {
		return this.get('/train/getTrainLog', params, true, access_token);
	};
	this.getTrainLog = (params) => {
		return this.get('/train/getTrainLog', params, true);
	};

	/*
  inference
   */
	this.getInferenceModelList = ({ access_token, params = {} }) => {
		return this.get('/infer/getInferenceModelList', params, true, access_token);
	};
	this.getImageList = ({ access_token, params = {} }) => {
		return this.get('/infer/getImageList', params, true, access_token);
	};
	this.getImagePreview = ({ access_token, params = {} }) => {
		return this.get('/infer/getImage', params, true, access_token);
	};
	this.getTabularData = ({ access_token, params = {} }) => {
		return this.get('/infer/getTabularData', params, true, access_token);
	};
	this.startInference = (params) => {
		return this.post('/infer/startInference', params, true);
	};
	this.getInferenceSetting = ({ access_token, params = {} }) => {
		return this.get('/infer/getInferenceSetting', params, true, access_token);
	};
	this.getInferenceLog = (params) => {
		return this.get('/infer/getInferenceLog', params, true);
	};
	this.hasOtherInferenceRunning = ({ access_token, params = {} }) => {
		return this.get('/infer/hasOtherInferenceRunning', params, true, access_token);
	};
	this.getInferenceResult = (params) => {
		return this.get('/infer/getInferenceResult', params, true);
	};
	this.stopInference = (params) => {
		return this.post('/infer/stopInference', params, true);
	};

	this.getAnnotationList = ({ access_token, params = {} }) => {
		return this.get('/annotation/getAnnotationList', params, true, access_token);
	};

	// teachable - added by jwpark
	this.addTeachableDataset = (params) => {
		return this.post('/datapre/addTeachableDataset', params, true);
	};
	this.convertTeachableModel = (params) => {
		return this.post('/models/convertTeachableModel', params, true);
	};
}

const agent = new Agent(axios, API_ROOT);
global.agent = agent;
export default agent;
