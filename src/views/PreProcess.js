import React, { createContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';

import ListParamMaker from 'utils/ListParamMaker';
import FormatUtil from 'utils/FormatUtil';
import LocalStorageManager from 'utils/LocalStorageManager';
import agent from 'lib/apis';
import { PROJECT_TYPE } from 'constants/common';

import { useCommonState, useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';

import { PageWrapper, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import Spacer from 'components/spacer';
import DatasetInfo from 'components/dataSet/Preprocess/DatasetInfo';
import HistoryComponent from 'components/dataSet/Preprocess/HistoryComponent';
import RightComponent from 'components/dataSet/Preprocess/RightComponent';
import { ROUTER_DATASET } from 'components/layout/MenuConst';
import TimeIntervalComponent from 'components/dataSet/Preprocess/TimeIntervalComponent';
import { checkIsRunning } from 'views/expRun';
import Button from 'component/Button';

const checkParamValue = (params) => {
	let result = {};
	Object.keys(params).forEach((key, index) => {
		let value = params[key];
		if (key === 'feature_indices') {
			let temp_array = [];
			if (!FormatUtil.isEmpty(value)) {
				let value_a = value.split(',');
				value_a.forEach((v) => {
					if (!isNaN(parseInt(v))) {
						temp_array.push(parseInt(v));
					}
				});
				result[key] = temp_array;
			}
		} else {
			result[key] = value;
		}
	});
	return result;
};
export let paramsValue = {};

export function setParamsValue(data) {
	paramsValue = data;
}
export const PreprocessContext = createContext(null);
const PreProcess = (props) => {
	const dataset_id = props.match.params.dataset_id;
	const history = useHistory();
	const { isLoggedIn } = useAuthState();
	const { showAlert } = useAlertAction();
	const { loadTemplate, loadProjectType, loadTemplate_dataset_id } = useCommonState();
	const [isTemplateMode, setTemplateMode] = useState(false);

	const [sorting, setSorting] = useState('create_date');
	const [sorting_type, setSorting_type] = useState(true);
	const [historyList, setHistoryList] = useState([]);
	const [detail, setDetail] = useState('');
	const [isTabular, setIsTabular] = useState(false);
	const [showResult, setShowResult] = useState(false);
	const [preprocess_status, set_preprocess_status] = useState(false);
	const [status, setStatus] = useState(false);
	const [preprocess_nm, set_preprocess_nm] = useState(false);
	const [selectHistory, setSelectHistory] = useState('');
	const [pipeline_name, set_pipeline_name] = useState('');
	const [addDatalist, setAddDatalist] = useState(false);
	const [method, setMethod] = useState('');
	const [methodParameter, setMethodParameter] = useState([]);
	const [defaultCnt, setDefaultCnt] = useState(0);

	const makeDefault = (param = methodParameter) => {
		let result = {};
		if (param) {
			param.forEach((v) => {
				let id = v.name;
				let value = v.default;
				if (value && Array.isArray(value)) {
					value = value.toString();
				}
				result[id] = value;
			});
		}
		setParamsValue(result);
		setDefaultCnt((prev) => prev + 1);
	};

	useEffect(() => {
		makeDefault(methodParameter);
	}, [methodParameter]);

	useEffect(() => {
		if (loadProjectType === PROJECT_TYPE.IMAGE) {
			setIsTabular(false);
		} else {
			setIsTabular(true);
		}
	}, [loadProjectType]);

	const updateSortingCB = ({ sorting, sorting_type }) => {
		setSorting(sorting);
		setSorting_type(sorting_type);
	};


	const checkParamValidation = (params, values) => {
		let result = true;
		let item = '';
		for (let i = 0; i < params.length; i++) {
			item = params[i];
			console.log('dsds item = ', item);
			const { name, type, range, mandatory } = item;
			if (!mandatory) {
				continue;
			}
			const value = values[name];

			if (type === 'int' || type === 'float') {
				let minValue = '';
				let maxValue = '';
				if (range) {
					minValue = range[0];
					maxValue = range[1];
				}
				if (FormatUtil.isEmpty(value)) {
					result = false;
					break;
				}
				if (minValue !== '-Infinity' && minValue > value) {
					result = false;
					break;
				}
				if (maxValue !== 'Infinity' && maxValue < value) {
					result = false;
					break;
				}
			} else {
				if (FormatUtil.isEmpty(value)) {
					result = false;
					break;
				}
			}
		}
		console.log('validation result = ', result);
		return {
			result,
			error_name: item.display_name,
		};
	};

	const applyClicked = () => {
		if (!method) {
			return;
		}
		if (!loadTemplate_dataset_id) {
			let { result, error_name } = checkParamValidation(method.preprocess_default_parameters, paramsValue);
			if (!result) {
				showAlert({
					message: error_name + '의 값이 유효하지 않습니다.',
				});
				return;
			}
		}
		let params = {
			group_id: detail.group_id,
			template_dataset_id: loadTemplate_dataset_id ? loadTemplate_dataset_id : null,
			dataset_id: dataset_id,
			project_id: detail.project_id,
			dataset_type: detail.dataset_type,
			show_status: 1,
			label_status: detail.label_status,
			label_nm: detail.label_nm,
			algorithm_nm: loadTemplate_dataset_id ? null : method.preprocess_nm,
			algorithm_parameters: loadTemplate_dataset_id ? {} : checkParamValue(paramsValue),
		};
		agent
			.applyPreprocess(params)
			.then((response) => {
				console.log('then response = ', response);
				const { pipeline_name } = response.data;
				set_pipeline_name(pipeline_name);
				setStatus('running');
				set_preprocess_status(true);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const stopClicked = () => {
		if (!checkIsRunning(status)) {
			return;
		}
		setStatus('aborted');
		let params = {
			pipeline_name: pipeline_name,
		};
		agent
			.stopPreprocessPipeline(params)
			.then((response) => {
				console.log('then response = ', response);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const fetchPreprocessSetting = () => {
		let params = {
			project_id: LocalStorageManager.getLoadedProjectId(),
		};
		agent
			.getPreprocessSetting(params)
			.then((response) => {
				console.log('then response = ', response);
				const { preprocess_default_parameters, preprocess_nm, preprocess_status } = response.data;
				set_preprocess_status(preprocess_status);
				preprocess_nm && set_preprocess_nm(preprocess_nm);
				preprocess_default_parameters && setMethodParameter(preprocess_default_parameters);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (isLoggedIn) {
			fetchPreprocessSetting();
		}
		return () => {
			setParamsValue({});
		};
	}, [isLoggedIn]);

	const fetchPreprocessHistoryList = () => {
		let params = ListParamMaker.make({
			sorting,
			sorting_type,
			dataset_id: loadTemplate_dataset_id ? loadTemplate_dataset_id : dataset_id,
		});
		agent
			.getPreprocessHistoryList(params)
			.then((response) => {
				console.log('then response = ', response);
				const { list } = response.data;
				setHistoryList(list);
				if (list.length > 0) {
					setSelectHistory(list[0]);
				}
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const fetchDetail = () => {
		let params = {
			dataset_id: dataset_id,
		};
		agent
			.getDatasetDetail({ params })
			.then((response) => {
				console.log('then response = ', response);
				setDetail(response.data);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (isLoggedIn && dataset_id) {
			fetchDetail();
		}
	}, [isLoggedIn, dataset_id]);

	useEffect(() => {
		if (isLoggedIn && dataset_id) {
			fetchPreprocessHistoryList();
		}
	}, [isLoggedIn, sorting, sorting_type]);

	const confirmClicked = () => {
		history.push('/' + ROUTER_DATASET);
	};

	useEffect(() => {
		set_preprocess_status(checkIsRunning(status));
	}, [status]);

	const getLatestPreprocess = () => {
		let params = {
			dataset_id: dataset_id,
		};
		agent
			.getLatestPreprocess(params)
			.then((response) => {
				console.log('then response = ', response);
				const {
					pipeline_nm,
				} = response.data;
				set_pipeline_name(pipeline_nm);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const Store = useMemo(() => {
		return {
			dataset_id,
			isTabular,
			isTemplateMode,
			setTemplateMode,
			sorting,
			setSorting,
			sorting_type,
			setSorting_type,
			updateSortingCB,
			detail,
			historyList,
			applyClicked,
			stopClicked,
			showResult,
			setShowResult,
			preprocess_nm,
			preprocess_status,
			selectHistory,
			setSelectHistory,
			addDatalist,
			setAddDatalist,
			method,
			setMethod,
			status,
			setStatus,
			pipeline_name,
			set_pipeline_name,
			getLatestPreprocess,
			methodParameter,
			setMethodParameter,
			makeDefault,
			defaultCnt,
		};
	}, [
		dataset_id,
		isTabular,
		isTemplateMode,
		setTemplateMode,
		sorting,
		setSorting,
		sorting_type,
		setSorting_type,
		updateSortingCB,
		detail,
		historyList,
		applyClicked,
		stopClicked,
		showResult,
		setShowResult,
		preprocess_nm,
		preprocess_status,
		selectHistory,
		setSelectHistory,
		addDatalist,
		setAddDatalist,
		method,
		setMethod,
		status,
		setStatus,
		pipeline_name,
		set_pipeline_name,
		getLatestPreprocess,
		methodParameter,
		setMethodParameter,
		makeDefault,
	]);
	useEffect(() => {
		setTemplateMode(!!loadTemplate);
	}, [loadTemplate]);

	return (
		<PreprocessContext.Provider value={Store}>
			<TimeIntervalComponent />
			<PageWrapper>
				<TitleComponent text={'Data'} />
				<SubTitleBox>{'Data > Preprocess'}</SubTitleBox>
				<Content>
					<Spacer />
					<ContentArea>
						<Left>
							<DatasetInfo />
							<HistoryComponent />
						</Left>
						<Spacer size={'lg'} />
						<Right>
							<RightComponent paramsValue={paramsValue} setParamsValue={setParamsValue} />
						</Right>
					</ContentArea>
				</Content>

				<Spacer />
				<Spacer />
				<ButtonContainer>
					<Button size={'xsmall'} colorType={'blue'} onClick={confirmClicked} >OK</Button>
				</ButtonContainer>
			</PageWrapper>
		</PreprocessContext.Provider>
	);
};

export default PreProcess;

export const checkPreProcess = (_dataset_id, okCallback, failCallback) => {
	let params = {
		project_id: LocalStorageManager.getLoadedProjectId(),
	};
	agent
		.getPreprocessSetting(params)
		.then((response) => {
			console.log('then response = ', response);
			const { dataset_id, preprocess_status } = response.data;
			if (preprocess_status && dataset_id !== _dataset_id) {
				failCallback();
			} else {
				okCallback(_dataset_id);
			}
		})
		.catch((error) => {
			console.log('error ', error);
		})
		.finally((v) => {});
};

export const Divider = styled.div`
	width: 100%;
	height: 1px;
	background: ${colors.gray_light};
`;

const ButtonContainer = styled.div`
	width: 1524px;
	margin-left: 64px;
	display: flex;
	justify-content: flex-end;
`;
export const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

export const LeftContainerTop = styled.div`
	width: 100%;
	height: 324px;
	background: ${colors.bg_white};
	padding: 24px 32px 0 32px;
`;
export const LeftContainerBottom = styled.div`
	width: 100%;
	height: 346px;
	background: ${colors.bg_white};
	padding: 33px 32px 0 32px;
`;

const Right = styled.div`
	width: 756px;
	height: 100%;
`;

const Left = styled.div`
	width: 756px;
	height: 100%;
`;

const Content = styled.div`
	width: 1652px;
	padding: 0px 64px 0px 64px;
	display: flex;
	justify-content: space-between;
`;

const ContentArea = styled.div`
	width: 100%;
	height: 670px;
	display: flex;
`;
