import React, { useEffect, useState, createContext, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import agent from 'lib/apis';
import { colors } from 'styles';
import FormatUtil from 'utils/FormatUtil';
import DataParser from 'utils/DataParser';
import NextIcon from 'assets/icon/icon-arrow-next-n.png';

import { useAuthState } from 'store/auth/hooks';

import DataSplit from 'component/dialog/DataSplit';
import HpoAlgorithm from 'component/dialog/HpoAlgorithm';
import Resource from 'component/dialog/Resource';
import ExpRunHpoDetail from 'component/dialog/ExpRunHpoDetail';
import HpoSetting from 'component/dialog/HpoSetting';
import {
	ExperimentAlgorithm,
	ExperimentParameter,
	ExperimentResource,
	ExperimentDataSet,
	ExperimentHpoSettings,
} from 'components/common/ExperimentComponent';
import { PageWrapper, BodyContainer, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import TrialListTable from 'components/Experiment/HPO/TrialListTable';
import { checkIsDraft, checkIsRunning, checkIsSucceed } from 'views/expRun';
import { ROUTER_EXPERIMENT } from 'components/layout/MenuConst';

import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Tooltip from 'components/common/Tooltip';

export const HPOContext = createContext(null);
export default function ExprunHPO(props) {
	const experiment_id = props.match.params.experiment_id;
	const [dataParam, setDataParam] = React.useState('');
	const [dataSplit, setDataSplit] = React.useState('');
	const [dataAlgorithm, setDataAlgorithm] = React.useState(false);
	const [dataResource, setDataResource] = React.useState(false);
	const [dataHpoSettings, setDataHpoSettings] = React.useState(false);
	const [showDataSplit, setShowDataSplit] = React.useState(false);
	const [showAlgorithm, setdAlgorithm] = React.useState(false);
	const [showResource, setShowResource] = React.useState(false);
	const [showDetails, setShowDetails] = React.useState(false);
	const [showSettings, setShowSettings] = React.useState(false);
	const [dataHPOParam, setDataHPOParam] = React.useState('');
	const [trial, setTrial] = useState('');
	const history = useHistory();
	const [isActiveDataSplit, setIsActiveDataSplit] = React.useState(true);
	const [isActiveAlgorithm, setIsActiveAlgorithm] = React.useState(false);
	const [isActiveResource, setIsActiveResource] = React.useState(false);

	const [model_name, set_model_name] = useState('');

	const [status, setStatus] = React.useState('');

	const [detail, setDetail] = React.useState({});
	const { isLoggedIn } = useAuthState();
	const [checkLearningRate, setCheckLearningRate] = useState(false);
	const [checkBatchSize, setCheckBatchSize] = useState(false);
	const [checkWeightDecay, setCheckWeightDecay] = useState(false);

	const [total_trial_num, set_total_trial_num] = useState('');
	const [current_trial_num, set_current_trial_num] = useState('');
	const [trialList, setTrialList] = useState([]);
	const [projectType, setProjectType] = useState('');
	const { showDialog } = useDialogAction();

	const hpoStore = useMemo(() => {
		return {
			experiment_id,
			model_name,
			set_model_name,
			trial,
			setTrial,
			status,
			setStatus,
			checkLearningRate,
			checkBatchSize,
			checkWeightDecay,
			total_trial_num,
			set_total_trial_num,
			current_trial_num,
			set_current_trial_num,
			trialList,
			setTrialList,
			projectType,
			setProjectType,
		};
	}, [
		experiment_id,
		model_name,
		trial,
		setTrial,
		status,
		setStatus,
		checkLearningRate,
		checkBatchSize,
		checkWeightDecay,
		total_trial_num,
		current_trial_num,
		trialList,
		projectType,
	]);

	useEffect(() => {
		if (isLoggedIn) {
			let params = {
				experiment_id: experiment_id,
			};
			agent
				.getExperimentConfig(params)
				.then((response) => {
					console.log('then response = ', response);
					const {
						total_trial_num,
						current_trial_num,
						list,
						project_type,
					} = response.data;
					setDetail(response.data);
					list && setTrialList(list);
					set_current_trial_num(current_trial_num);
					set_total_trial_num(total_trial_num);
					setProjectType(project_type);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		}
		return () => {
			console.log('종료');
		};
	}, [isLoggedIn]);

	useEffect(() => {
		if (checkIsRunning(status) || checkIsSucceed(status)) {
			setIsActiveDataSplit(false);
			setIsActiveAlgorithm(false);
			setIsActiveResource(false);
		} else {
			setIsActiveDataSplit(true);
		}
	}, [status]);

	useEffect(() => {
		if (FormatUtil.isEmpty(detail)) {
			return;
		}
		let status = detail.working_status_nm.toLowerCase();
		if (detail.hpo_status) {
			status = detail.hpo_status.toLowerCase();
		}
		setStatus(status);

		// return
		const { datasplit, dataAlgorithm, dataResource, dataParam, dataHpoSettings } = DataParser.parseExperimentDetail(detail);
		setDataSplit(datasplit);
		setDataAlgorithm(dataAlgorithm);
		setDataResource(dataResource);
		setDataParam(dataParam);
		setDataHpoSettings(dataHpoSettings);
		set_model_name(detail.model_nm);
	}, [detail]);
	const onStartHPOClicked = (e) => {
		/*
    CONCEPT
    startHpo -> getHpoTrialList -> getHpoTrialData -> submitHpoTrial
     */
		handleToggleSettings();
	};
	const onStopHPOClicked = (e) => {
		/*
    CONCEPT
    클릭하게 되면, HPO 가 끝나면서 experiment 화면으로 이동 (EX-001)
     */
		let params = {
			experiment_id,
			model_name,
		};
		agent
			.stopHpo(params)
			.then((response) => {
				history.push('/' + ROUTER_EXPERIMENT);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const onSubmitClicked = () => {
		/*
        CONCEPT
        trial_id 를 request로 넘기면서 HPO 종료
         HPO 가 끝나면서 experiment 화면으로 이동 (EX-001)
    */
		let params = {
			experiment_id,
			trial_name: trial.trialName,
		};
		agent
			.submitHpoTrial(params)
			.then((response) => {
				history.push('/' + ROUTER_EXPERIMENT);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const handleToggleDataSplit = () => {
		setShowDataSplit(!showDataSplit);
		showDialog(dialogList.EXPERIMENT_DATA_SPLIT);
	};

	const handleToggleAlgorithm = () => {
		setdAlgorithm(!showAlgorithm);
		showDialog(dialogList.EXPERIMENT_HPO_ALGORITHM);
	};

	const handleToggleResource = () => {
		if (!dataSplit || !dataAlgorithm) {
			setShowResource(false);
			return;
		}
		showDialog(dialogList.EXPERIMENT_RESOURCE);
		setShowResource(!showResource);
	};

	const handleToggleDetails = (data) => {
		setShowDetails(data);
		showDialog(dialogList.EXPERIMENT_HPO_DETAIL);
	};

	const handleToggleSettings = () => {
		setShowSettings(!showSettings);
		showDialog(dialogList.EXPERIMENT_HPO_SETTINGS);
	};

	const setDataSplitCB = (data) => {
		setDataSplit(data);
		setIsActiveAlgorithm(true);
	};

	const setAlgorithmCB = (data) => {
		const { algorithmData, paramsData } = data;
		setDataAlgorithm(algorithmData);
		setDataParam(paramsData);
		setIsActiveResource(true);
	};
	const setResourceCB = (data) => {
		setDataResource(data);
	};
	useEffect(() => {
		let item = { ...dataParam };
		let { learning_rate_hpo, weight_decay_hpo, batch_size_hpo } = item;
		delete item.learning_rate_hpo;
		delete item.weight_decay_hpo;
		delete item.batch_size_hpo;
		if (learning_rate_hpo) {
			delete item.learning_rate;
			let key = 'learning_rate(HPO)';
			item[key] = '';
			setCheckLearningRate(true);
		} else {
			setCheckLearningRate(false);
		}
		if (batch_size_hpo) {
			delete item.batch_size;
			let key = 'batch_size(HPO)';
			item[key] = '';
			setCheckBatchSize(true);
		} else {
			setCheckBatchSize(false);
		}
		if (weight_decay_hpo) {
			delete item.weight_decay;
			let key = 'weight_decay(HPO)';
			item[key] = '';
			setCheckWeightDecay(true);
		} else {
			setCheckWeightDecay(false);
		}
		setDataHPOParam(item);
	}, [dataParam]);

	return (
		<HPOContext.Provider value={hpoStore}>
			<DataSplit setDataSplitCB={setDataSplitCB} isShowCrossValidation={false} />
			<HpoAlgorithm setAlgorithmCB={setAlgorithmCB} experiment_id={experiment_id} />
			<Resource
				setResourceCB={setResourceCB}
				dataSplit={dataSplit}
				dataAlgorithm={dataAlgorithm}
				dataParam={dataHPOParam}
				experiment_id={experiment_id}
			/>
			<ExpRunHpoDetail data={showDetails}/>
			<HpoSetting
				dataSplit={dataSplit}
				dataAlgorithm={dataAlgorithm}
				dataParam={dataParam}
				experiment_id={experiment_id}
				dataResource={dataResource}
				setDataHpoSettings={setDataHpoSettings}
			/>
			<PageWrapper>
				<TitleComponent text={'Run / Hyperparameter Optimization'} />
				<BodyContainer>
					<SubTitleBox style={{ padding: '12px 0px 8px 0px' }}>Hyperparameter Optimization (HPO)</SubTitleBox>
					<TableContainer>
						<SetConfigurationArea>
							<ContentItemTitle>Set Configuration</ContentItemTitle>
							<ButtonContainer>
								{isActiveDataSplit ? (
									<ButtonBlue 
										isActive={isActiveDataSplit} 
										onClick={handleToggleDataSplit}
										data-tip
										data-for={'run_data_split_tooltip'}
									>
										Data Split{' '}
										<Tooltip id={'run_data_split_tooltip'} text={'정확도가 높은 모델 생성을 위해 데이터 분할합니다.'}/>
									</ButtonBlue>
								) : (
									<ButtonGray>Data Split </ButtonGray>
								)}
								<div style={{ width: '20px', height: '20px', margin: '0px 8px 0px 8px' }}>
									<img src={NextIcon} alt="" />
								</div>
								{isActiveAlgorithm ? (
									<ButtonBlue isActive={isActiveAlgorithm} onClick={handleToggleAlgorithm}>
										Algorithm{' '}
									</ButtonBlue>
								) : (
									<ButtonGray data-tip data-for={'run_algorithm_disable_tootip'}>
										Algorithm 
										<Tooltip id={'run_algorithm_disable_tootip'} text={'Algorithm 선택으로, Data Split을 완료해야 진행 가능합니다.'}/>
									</ButtonGray>
								)}
								<div style={{ width: '20px', height: '20px', margin: '0px 8px 0px 8px' }}>
									<img src={NextIcon} alt="" />
								</div>
								{isActiveResource ? (
									<ButtonBlue isActive={isActiveResource} onClick={handleToggleResource}>
										Resources{' '}
									</ButtonBlue>
								) : (
									<ButtonGray data-tip data-for={'run_resources_disable_tootip'}>
										Resources
										<Tooltip id={'run_resources_disable_tootip'} text={'자원 선택으로, Algorithm을 선택해야 진행 가능합니다.'}/>
									</ButtonGray>
								)}
							</ButtonContainer>
						</SetConfigurationArea>
						<ConfigurationArea>
							<ContentItemTitle>Configuration</ContentItemTitle>
							<ConfigurationItemArea>
								<ConfigurationItemTitleArea>
									<div style={{ width: '291px' }}>
										<ExperimentDataSet dataSet={detail.dataset} dataSplit={dataSplit} />
									</div>
									<div style={{ width: '291px' }}>
										<ExperimentAlgorithm data={dataAlgorithm} />
									</div>
									<div style={{ width: '291px' }}>
										<ExperimentParameter data={dataHPOParam} />
									</div>
									<div style={{ width: '292px' }}>
										<ExperimentResource data={dataResource} />
									</div>
									<div style={{ width: '292px' }}>
										<ExperimentHpoSettings data={dataHpoSettings} />
									</div>
								</ConfigurationItemTitleArea>
							</ConfigurationItemArea>
						</ConfigurationArea>
						<ButtonArea>
							{checkIsSucceed(status) ? (
								''
							) : checkIsRunning(status) ? (
								<ButtonRed onClick={onStopHPOClicked}>Stop HPO</ButtonRed>
							) : dataSplit && dataAlgorithm && dataResource ? (
								<ButtonBlue onClick={onStartHPOClicked}>Start HPO</ButtonBlue>
							) : (
								<ButtonGray data-tip data-for={'run_start_disable_tootip'}>
									Start HPO
									<Tooltip id={'run_start_disable_tootip'} text={'모든 configuration 설정을 마쳐야 학습 시작이 가능합니다.'}/>
								</ButtonGray>
							)}
						</ButtonArea>
					</TableContainer>
					<TableArea>
						{checkIsRunning(status) || checkIsSucceed(status) ? (
							<TrialListTable show={!checkIsDraft(status)} onDetailsClick={handleToggleDetails} projectType={projectType} />
						) : (
							<TableTextHolderArea>
								<TableTextHolder>HPO의 실행결과가 보여집니다.</TableTextHolder>
							</TableTextHolderArea>
						)}
					</TableArea>
					<ButtonArea style={{ padding: '12px 0px 100px 0px' }}>
						{trial && (trial['Status'] === 'succeeded' || trial['Status'] === 'Succeeded') && checkIsSucceed(status) ? (
							<ButtonBlue onClick={onSubmitClicked}>Submit</ButtonBlue>
						) : (
							<ButtonGray>Submit</ButtonGray>
						)}
					</ButtonArea>
				</BodyContainer>
			</PageWrapper>
		</HPOContext.Provider>
	);
}
const TableContainer = styled.div`
	width: 100%;
	height: 410px;
	padding: 0px 0px 18px 0px;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	background-color: ${colors.bg_white};
	border: solid 1px #dfe2e5;
`;

const SetConfigurationArea = styled.div`
	padding: 10px 32px;
`;

const ButtonContainer = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
`;

const TableArea = styled.div`
	margin-top: 12px;
	width: 100%;
	height: 362px;
	background-color: ${colors.bg_white};
	border: solid 1px #dfe2e5;
	border-radius: 4px;
`;

const TableTextHolderArea = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const TableTextHolder = styled.div`
	width: 220px;
	height: 19px;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: #b8babd;
`;

const ConfigurationArea = styled.div`
	padding: 10px 32px;
`;

const ContentItemTitle = styled.div`
	font-size: 15px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
`;

const ConfigurationItemArea = styled.div`
	width: 100%;
	height: 190px;
	border-radius: 4px;
	border: solid 1px ${colors.gray_blue_gray};
`;

const ConfigurationItemTitleArea = styled.div`
	background-color: #f8f9fa;
	width: 100%;
	height: 36px;
	border-bottom: solid 1px #d5dce4;
	border-radius: 4px 4px 0 0;
	display: flex;
`;

const ButtonArea = styled.div`
	text-align: right;
	padding: 0 32px;
`;

const ButtonBlue = styled.div`
	display: inline-block;
	width: 120px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.bg_white};
	cursor: pointer;
`;

const ButtonRed = styled.div`
	display: inline-block;
	width: 120px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: ${colors.fail};
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.bg_white};
	cursor: pointer;
`;

const ButtonGray = styled.div`
	display: inline-block;
	width: 120px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: #d5d6d7;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.bg_white};
	cursor: not-allowed;
`;
