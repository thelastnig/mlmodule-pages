import React, { useState, useEffect, createContext, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import './inference.scss';
import agent from 'lib/apis';
import { PROJECT_TYPE } from 'constants/common';
import LocalStorageManager from 'utils/LocalStorageManager';

import { useStateActionHandler } from 'store/inference/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useStateWithLabel } from 'store/root/hooks';
import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { PageWrapper, BodyContainer, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import Spacer from 'components/spacer';
import InferenceSaveResult from 'component/dialog/InferenceSaveResult';
import InferenceProcess from 'component/dialog/InferenceProcess';
import TabComponent from 'components/inference/TabComponent';
import SelectModel from 'components/inference/SelectModel';
import InferenceResult from 'components/inference/InferenceResult';
import { checkIsRunning, checkIsSucceed } from 'views/expRun';
import { ROUTER_EXPERIMENT } from 'components/layout/MenuConst';
import ResultImage from 'component/dialog/ResultImage';
import Button from 'component/Button';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export const InferenceContext = createContext(null);
const InferenceComponent = (props) => {
	const experiment_id = props.match.params.experiment_id;

	const history = useHistory();
	const { getInferenceSetting } = useStateActionHandler();
	const { loadProjectType } = useCommonState();
	const { isLoggedIn } = useAuthState();

	const [selectModel, setSelectModel] = useState('');
	const [checkItems, setCheckItems] = useState([]);

	const [resultItem, setResultItem] = useState(false); // result 클릭시 보여줄 이미
	const [inference_id, set_inference_id] = useState('');
	const [before_storage_dataset_nm, set_before_storage_dataset_nm] = useState('');
	const [before_local_dataset, set_before_local_dataset] = useState([]);
	const [model_list, set_model_list] = useState([]);
	const [status, setStatus] = useState('');
	const [logShowAble, setLogShowAble] = useState(false);
	const [saveResultAble, setSaveResultAble] = useState(false);
	const [isRunning, setIsRunning] = useStateWithLabel(false, 'isRunning');
	const [isSucceed, setIsSucceed] = useState(false);
	const [tabType, setTabType] = useState('L'); //P: Private, S: Storage, L: Local
	const isTabular = useMemo(() => loadProjectType !== PROJECT_TYPE.IMAGE);
	const [uploadFiles, setUploadFiles] = useState([]);
	const { showDialog } = useDialogAction();
	const { showAlert } = useAlertAction();

	const showProcessDlg = () => {
		showDialog(dialogList.INFERENCE_PROCESS);
	};
	const handleToggleInferenceSaveResult = () => {
		showDialog(dialogList.INFERENCE_SAVE_RESULT)
	};

	useEffect(() => {
		if (checkIsRunning(status)) {
			setIsRunning(true);
			setIsSucceed(false);
			setLogShowAble(false);
			setSaveResultAble(false);
			setTabType('L');
		} else if (checkIsSucceed(status)) {
			setIsRunning(false);
			setIsSucceed(true);
			setLogShowAble(true);
			setSaveResultAble(true);
		} else {
			setIsRunning(false);
			setIsSucceed(false);
			setLogShowAble(false);
			setSaveResultAble(false);
		}
	}, [status]);

	const fetchInferenceSetting = () => {
		let params = {
			project_id: LocalStorageManager.getLoadedProjectId(),
			experiment_id: experiment_id,
		};
		getInferenceSetting(params)
			.then((response) => {
				console.log('then response = ', response);
				const {
					// after_dataset,
					before_local_dataset,
					inference_id,
					before_storage_dataset_nm,
					model_list,
					model_nm,
					inference_status,
				} = response.data;
				set_inference_id(inference_id);
				set_before_storage_dataset_nm(before_storage_dataset_nm);
				set_model_list(model_list);
				setStatus(inference_status);
				set_before_local_dataset(before_local_dataset);
				let model = model_list.find((v) => {
					return v.model_nm === model_nm;
				});
				setSelectModel(model);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	useEffect(() => {
		if (!isLoggedIn) {
			return;
		}
		fetchInferenceSetting();
	}, [isLoggedIn]);

	const startInferenceClicked = (files) => {
		let formData = new FormData();
		formData.append('project_id', LocalStorageManager.getLoadedProjectId());
		formData.append('experiment_id', selectModel.experiment_id);
		if (tabType === 'L') {
			files.forEach((file) => {
				formData.append('files', file);
			});
		} else {
			formData.append('dataset_id', checkItems[0].dataset_id);
		}

		agent
			.startInference(formData)
			.then((response) => {
				console.log('then response = ', response);
				const { inference_id } = response.data;
				set_inference_id(inference_id);
				setStatus('running');
				fetchInferenceSetting();
			})
			.catch((error) => {
				console.log('error ', error);
				if (error.data.detail)
					showAlert({
						message: error.data.detail,
					});
				else
					showAlert({
						message: error.statusText,
					});
			})
			.finally((v) => {});
	};

	const stopClicked = () => {
		if (!inference_id || !checkIsRunning(status)) {
			return;
		}
		let params = {
			inference_id: inference_id, //37,
		};
		agent
			.stopInference(params)
			.then((response) => {
				history.push('/' + ROUTER_EXPERIMENT);
			})
			.catch((error) => {
				console.log('error ', error);
				if (error.data.detail)
					showAlert({
						message: error.data.detail,
					});
				else
					showAlert({
						message: error.statusText,
					});
			})
			.finally((v) => {});
	};

	const showResultItem = (data) => {
		showDialog(dialogList.INFERENCE_RESULT_ITEM);
		setResultItem(data);
	};

	const inferenceStore = useMemo(() => {
		return {
			isTabular,
			inference_id,
			set_inference_id,
			loadProjectType,
			status,
			setStatus,
			logShowAble,
			saveResultAble,
			showProcessDlg,
			stopClicked,
			isRunning,
			isSucceed,
			tabType,
			setTabType,
			startInferenceClicked,
			showResultItem,
			before_storage_dataset_nm,
			uploadFiles,
			setUploadFiles,
			before_local_dataset,
		};
	}, [
		isTabular,
		inference_id,
		set_inference_id,
		loadProjectType,
		status,
		setStatus,
		logShowAble,
		saveResultAble,
		showProcessDlg,
		stopClicked,
		isRunning,
		isSucceed,
		tabType,
		setTabType,
		startInferenceClicked,
		showResultItem,
		before_storage_dataset_nm,
		uploadFiles,
		setUploadFiles,
		before_local_dataset,
	]);

	return (
		<InferenceContext.Provider value={inferenceStore}>
			<ResultImage data={resultItem} />
			<InferenceProcess />
			<InferenceSaveResult inference_id={inference_id} />
			<PageWrapper>
				<TitleComponent text={'Inference'} />
				<BodyContainer>
					<SelectModel model_list={model_list} selectModel={selectModel} setSelectModel={setSelectModel} experiment_id={experiment_id} />
					<TabComponent checkItems={checkItems} setCheckItems={setCheckItems} selectModel={selectModel} />
					<Spacer />
					<InferenceResult />
					<BottomArea style={{ width: '1524px', paddingTop: '16px', height: '140px' }}>
						<BottomButtons>
							<Button
								colorType={'blue'}
								size={'medium'}
								disabled={!saveResultAble}
								onClick={handleToggleInferenceSaveResult}
								tooltipText={!saveResultAble ? 'Inference가 완료되어야 저장할 수 있습니다.\n추론 결과 레이블과 데이터를 다운로드합니다.' : ''}
							>
								Save Results
							</Button>
						</BottomButtons>
					</BottomArea>
				</BodyContainer>
			</PageWrapper>
		</InferenceContext.Provider>
	);
};

export default InferenceComponent;

export const checkInference = (_id, okCallback, failCallback) => {
	let params = {
		project_id: LocalStorageManager.getLoadedProjectId(),
	};
	agent
		.hasOtherInferenceRunning({ params })
		.then((response) => {
			console.log('then response = ', response);
			const { experiment_id, other_running } = response.data;
			if (other_running && _id !== experiment_id) {
				failCallback();
			} else {
				okCallback(_id);
			}
		})
		.catch((error) => {
			console.log('error ', error);
		})
		.finally((v) => {});
};

const BottomButtons = styled.div`
	width: 1524px;
	display: flex;
	justify-content: flex-end;
`;
