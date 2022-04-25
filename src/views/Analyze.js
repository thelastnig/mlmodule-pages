import React, { createContext, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';
import { PROJECT_TYPE } from 'constants/common';
import LocalStorageManager from 'utils/LocalStorageManager';
import ListParamMaker from 'utils/ListParamMaker';

import { useAuthState } from 'store/auth/hooks';
import { useCommonState } from 'store/common/hooks';

import Spacer from 'components/spacer';
import { PageWrapper, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import { ROUTER_DATASET } from 'components/layout/MenuConst';
import Button from 'component/Button';
import { checkIsRunning } from 'views/expRun';
import AnalayzeResult from 'component/dialog/AnalayzeResult';
import DatasetInfo from 'components/dataSet/Analyze/DatasetInfo';
import HistoryComponent from 'components/dataSet/Analyze/HistoryComponent';
import RightComponent from 'components/dataSet/Analyze/RightComponent';
import TimeIntervalComponent from 'components/dataSet/Analyze/TimeIntervalComponent';

export let paramsValue = {};

export function setParamsValue(data) {
	paramsValue = data;
}
export const AnalyzeContext = createContext(null);
const Analyze = (props) => {
	const dataset_id = props.match.params.dataset_id;
	const history = useHistory();
	const { loadProjectType } = useCommonState();
	const { isLoggedIn } = useAuthState();
	const [sorting, setSorting] = useState('create_date');
	const [sorting_type, setSorting_type] = useState(true);
	const [historyList, setHistoryList] = useState([]);
	const [detail, setDetail] = useState('');
	const [showResult, setShowResult] = useState(false);
	const [method, setMethod] = useState('');

	const [analyze_status, set_analyze_status] = useState(false);
	const [status, setStatus] = useState(false);
	const [pipeline_name, set_pipeline_name] = useState('');
	const isTabular = useMemo(() => loadProjectType !== PROJECT_TYPE.IMAGE);
	// dynamic parameter의 state를 관리
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
		if (isLoggedIn) {
			fetchAnalyzeSetting();
		}
		return () => {
			setParamsValue({});
		};
	}, [isLoggedIn]);
	useEffect(() => {
		if (isLoggedIn && dataset_id) {
			fetchDetail();
		}
	}, [isLoggedIn, dataset_id]);

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
			fetchPreprocessHistoryList();
		}
	}, [isLoggedIn, sorting, sorting_type]);

	// analyze도 history는 preprocesshistory api를 같이 사용한다.
	const fetchPreprocessHistoryList = () => {
		let params = ListParamMaker.make({
			sorting,
			sorting_type,
			dataset_id: dataset_id,
		});
		agent
			.getPreprocessHistoryList(params)
			.then((response) => {
				console.log('then response = ', response);
				const { list } = response.data;
				setHistoryList(list);
			})
			.catch((error) => {
				console.log('error ', error);
				// clearTimeout(timeInterval.current);
			})
			.finally((v) => {});
	};

	const fetchAnalyzeSetting = () => {
		let params = {
			project_id: LocalStorageManager.getLoadedProjectId(),
		};
		agent
			.getAnalyzeSetting(params)
			.then((response) => {
				console.log('then response = ', response);
				const {
					analyze_status,
				} = response.data;
				set_analyze_status(analyze_status);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const updateSortingCB = ({ sorting, sorting_type }) => {
		setSorting(sorting);
		setSorting_type(sorting_type);
	};

	const okClicked = () => {
		history.push('/' + ROUTER_DATASET);
	};

	const applyClicked = () => {
		let params = {
			dataset_id: dataset_id,
			algorithm: method.analyze_nm,
		};
		Object.keys(paramsValue).forEach((key, index) => {
			let value = paramsValue[key];
			params[key] = value;
		});
		agent
			.applyAnalytic(params)
			.then((response) => {
				const { pipeline_name } = response.data;
				set_pipeline_name(pipeline_name);
				setStatus('running');
				set_analyze_status(true);
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
			.stopAnalyzePipeline(params)
			.then((response) => {
				console.log('then response = ', response);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const getLatestAnalyze = () => {
		let params = {
			dataset_id: dataset_id,
		};
		agent
			.getLatestAnalyze(params)
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
			detail,
			sorting,
			setSorting,
			historyList,
			sorting_type,
			setSorting_type,
			showResult,
			setShowResult,
			method,
			setMethod,
			analyze_status,
			updateSortingCB,
			applyClicked,
			stopClicked,
			getLatestAnalyze,
			pipeline_name,
			set_pipeline_name,
			status,
			setStatus,
			methodParameter,
			setMethodParameter,
			makeDefault,
			defaultCnt,
		};
	}, [
		dataset_id,
		isTabular,
		detail,
		sorting,
		setSorting,
		sorting_type,
		setSorting_type,
		historyList,
		showResult,
		setShowResult,
		method,
		setMethod,
		analyze_status,
		updateSortingCB,
		applyClicked,
		stopClicked,
		pipeline_name,
		status,
		methodParameter,
		setMethodParameter,
		makeDefault,
		defaultCnt,
	]);
	return (
		<AnalyzeContext.Provider value={Store}>
			<TimeIntervalComponent />
			<AnalayzeResult show={showResult} toggle={setShowResult} />
			<PageWrapper>
				<TitleComponent text={'Data'} />
				<SubTitleBox>{'Data > Analyze'}</SubTitleBox>
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
					<Button size={'xsmall'} colorType={'blue'} onClick={(e) => okClicked()} >OK</Button>
				</ButtonContainer>
			</PageWrapper>
		</AnalyzeContext.Provider>
	);
};

export default Analyze;

export const checkAnalyze = (_dataset_id, okCallback, failCallback) => {
	let params = {
		project_id: LocalStorageManager.getLoadedProjectId(),
	};
	agent
		.getAnalyzeSetting(params)
		.then((response) => {
			console.log('then response = ', response);
			const { analyze_status, dataset_id } = response.data;
			if (analyze_status && dataset_id !== _dataset_id) {
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
export const LeftContainerTop = styled.div`
	width: 100%;
	height: 324px;
	background: ${colors.bg_white};
	padding: 24px 32px 0 32px;
`;

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
	height: 676px;
	display: flex;
`;
