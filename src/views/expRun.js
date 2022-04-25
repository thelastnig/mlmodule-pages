import React, { useState, useEffect, useCallback, createContext, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';
import { EXPERIMENT_STATUS } from 'constants/common';
import FormatUtil from 'utils/FormatUtil';
import DataParser from 'utils/DataParser';
import NextIcon from 'assets/icon/icon-arrow-next-n.png';

import { useHandleState as useExpHandleState, useStateActionHandler as useExpActionHandler } from 'store/experiments/hooks';
import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';

import DlgDataSplit from 'component/dialog/DataSplit';
import DlgAlgorithm from 'component/dialog/RunAlgorithm';
import DlgResource from 'component/dialog/Resource';
import ProgressBar from 'components/common/ProgressBar';
import LogComponent from 'components/Experiment/expRun_LogComponent';
import GraphComponent from 'components/Experiment/expRun_GraphComponent';
import { ExperimentAlgorithm, ExperimentParameter, ExperimentResource, ExperimentDataSet } from 'components/common/ExperimentComponent';
import { TitleComponent } from 'components/common/StyledComponent';
import { ROUTER_EXPERIMENT } from 'components/layout/MenuConst';

import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Tooltip from 'components/common/Tooltip';

export const ExpRunContext = createContext(null);
export default function Exprun(props) {
	const experiment_id = props.match.params.experiment_id;
	const [dataParam, setDataParam] = React.useState('');
	const [dataSplit, setDataSplit] = React.useState('');
	const [dataAlgorithm, setDataAlgorithm] = React.useState('');
	const [dataResource, setDataResource] = React.useState('');
	const [showDataSplit, setShowDataSplit] = React.useState(false);
	const [showAlgorithm, setAlgorithm] = React.useState(false);
	const [showResource, setShowResource] = React.useState(false);
	const [showStartTrain, setShowStartTrain] = React.useState(false);
	const [selectAlgorithm, setSelectAlgorithm] = useState('');
	const { onSetStopTrainCB, onFetchExperimentsDetailCallback, onInitDetailCB } = useExpActionHandler();
	const history = useHistory();
	const [isActiveDataSplit, setIsActiveDataSplit] = React.useState(true);
	const [isActiveAlgorithm, setIsActiveAlgorithm] = React.useState(false);
	const [isActiveResource, setIsActiveResource] = React.useState(false);

	const [status, setStatus] = React.useState('');
	const { detail } = useExpHandleState();
	const { currentUser, isLoggedIn } = useAuthState();
	const { loadTemplate } = useCommonState();

	const [graphEpoch, setGraphEpoch] = useState(0);
	const [percent, setPercent] = useState(0);
	const [kFoldpercent, setKFoldPercent] = useState(0);

	const [projectType, setProjectType] = useState(null);

	const [TemplateMode, setTemplateMode] = useState(false);

	const { showDialog } = useDialogAction();

	useEffect(() => {
		setTemplateMode(!!loadTemplate);
	});

	const { showAlert } = useAlertAction();

	const fetchDetail = () => {
		let params = {
			experiment_id: experiment_id,
		};
		onFetchExperimentsDetailCallback(params);
	};

	useEffect(() => {
		if (isLoggedIn) {
			fetchDetail();
		}
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDetailCB();
		};
	}, [isLoggedIn]);

	useEffect(() => {
		if (checkIsRunning(status) || checkIsSucceed(status)) {
			setIsActiveDataSplit(false);
			setIsActiveAlgorithm(false);
			setIsActiveResource(false);
			if (checkIsSucceed(status)) {
				setKFoldPercent(100);
			}
		} else {
			setIsActiveDataSplit(TemplateMode ? false : true);
			if (TemplateMode) {
				const { algorithm, datasplit, params, resource } = loadTemplate;
				setDataParam(params);
				setDataSplit(datasplit);
				setDataAlgorithm(algorithm);
				setDataResource(resource);
				setIsActiveResource(true);
			}
		}
	}, [status, TemplateMode]);

	useEffect(() => {
		if (FormatUtil.isEmpty(detail)) {
			return;
		}
		let status = detail.working_status_nm.toLowerCase();
		setStatus(status);

		if (checkIsRunning(status) || checkIsSucceed(status)) {
			const { datasplit, dataAlgorithm, dataResource, dataParam, projectType } = DataParser.parseExperimentDetail(detail);
			setDataSplit(datasplit);
			setDataAlgorithm(dataAlgorithm);
			setDataResource(dataResource);
			setDataParam(dataParam);
			// Graph를 위한 epoch 저장
			if ('epoch' in dataParam) {
				setGraphEpoch(dataParam.epoch);
			}
			setProjectType(projectType);
		}
	}, [detail]);
	const onSetStartClicked = (e) => {
		let params = {
			user_id: currentUser.user_id,
			experiment_id: experiment_id, //1,
			algorithm_id: dataAlgorithm.algorithm_id, //6,
			split_type: dataSplit.split_type, //"T",
			split_training: dataSplit.split_training, //"70",
			split_validation: dataSplit.split_validation, //"15",
			split_test: dataSplit.split_test, //"15",
			split_seed: dataSplit.split_seed, //"50",
			split_cross: dataSplit.split_cross, //"",
			split_stratify: dataSplit.split_stratify, //true,
			parameter: dataParam,
			preset_id: dataResource.preset_id, //"1"
		};
		agent
			.setStartTrain({ params })
			.then((response) => {
				fetchDetail();
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

	const stopTrainAbort = useCallback(() => {
		stopTrain(true);
	});
	useCallback(() => {
		stopTrain(false);
	});
	const stopTrain = useCallback((is_aborted) => {
		let params = {
			experiment_id: experiment_id,
			is_aborted: is_aborted,
		};
		onSetStopTrainCB(params)
			.then((response) => {
				gotoExpList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const onSetStopClicked = useCallback((e) => {
		showAlert({
			message: '현재 시점까지 학습된 모델이 저장되고 학습이 중단됩니다. 학습을 중단하시겠습니까?',
			isConfirm: true,
			onOk: stopTrainAbort,
			// cancelCB: stopTrainNoAbort,
			/*
			 * No 버튼 : Status 가 Aborted가 되면서 Experiment 화면으로 이동 (EX-001)
			 * Yes 버튼 : Status 가 Completed가 되면서 Experiment 화면으로 이동 (EX-001)
			 * */
		});
	});

	const gotoExpList = useCallback(() => {
		history.push('/' + ROUTER_EXPERIMENT);
	});

	const handleToggleDataSplit = () => {
		setShowDataSplit(!showDataSplit);
		showDialog(dialogList.EXPERIMENT_DATA_SPLIT);
	};

	const handleToggleAlgorithm = () => {
		setAlgorithm(!showAlgorithm);
		showDialog(dialogList.EXPERIMENT_RUN_ALGORITHM);
	};

	const handleToggleResource = () => {
		if (!dataSplit || !dataAlgorithm) {
			setShowResource(false);
			return;
		}
		showDialog(dialogList.EXPERIMENT_RESOURCE);
		setShowResource(!showResource);
	};

	const handleToggleStartTrain = () => {
		setShowStartTrain(!showStartTrain);
	};

	const setDataSplitCB = (data) => {
		setDataSplit(data);
		setIsActiveAlgorithm(true);
	};

	const setAlgorithmCB = (data) => {
		const { algorithm, algorithmData, paramsData } = data;
		setDataAlgorithm(algorithmData);
		setDataParam(paramsData);
		setSelectAlgorithm(algorithm);
		setIsActiveResource(true);
		setDataResource('');
	};
	const setResourceCB = (data) => {
		setDataResource(data);
	};

	const expRunStore = useMemo(() => {
		return {
			percent,
			setPercent,
		};
	}, [percent, setPercent]);
	return (
		<ExpRunContext.Provider value={expRunStore}>
			<DlgDataSplit setDataSplitCB={setDataSplitCB} isShowCrossValidation={true} />
			<DlgAlgorithm setAlgorithmCB={setAlgorithmCB} experiment_id={experiment_id} />
			<DlgResource
				show={showResource}
				toggle={handleToggleResource}
				setResourceCB={setResourceCB}
				dataSplit={dataSplit}
				dataAlgorithm={dataAlgorithm}
				dataParam={dataParam}
				experiment_id={experiment_id}
				algorithm={selectAlgorithm}
			/>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<TitleComponent text={'Run'} />
				<DashBoardContainer>
					<WhiteBox style={{ paddingBottom: '24px' }}>
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
										<ButtonGray>
											Data Split 
										</ButtonGray>
									)}
									<div style={{ width: '20px', height: '20px', margin: '0px 8px 0px 8px' }}>
										<img src={NextIcon} alt="" />
									</div>
									{isActiveAlgorithm ? (
										<ButtonBlue 
											isActive={isActiveAlgorithm} 
											onClick={handleToggleAlgorithm}
										>
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
										<ButtonBlue 
											isActive={isActiveResource} 
											onClick={handleToggleResource}
										>
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
										<div style={{ width: '364px' }}>
											<ExperimentDataSet dataSet={detail.dataset} dataSplit={dataSplit} />
										</div>
										<div style={{ width: '364px' }}>
											<ExperimentAlgorithm data={dataAlgorithm} />
										</div>
										<div style={{ width: '364px' }}>
											<ExperimentParameter data={dataParam} algorithm={selectAlgorithm} />
										</div>
										<div style={{ width: '365px' }}>
											<ExperimentResource data={dataResource} />
										</div>
									</ConfigurationItemTitleArea>
								</ConfigurationItemArea>
							</ConfigurationArea>
							<StartTranArea>
								{checkIsSucceed(status) ? (
									''
								) : checkIsRunning(status) ? (
									<ButtonRed onClick={onSetStopClicked}>Stop</ButtonRed>
								) : dataSplit && dataAlgorithm && dataResource ? (
									<ButtonBlue onClick={onSetStartClicked}>Start</ButtonBlue>
								) : (
									<ButtonGray data-tip data-for={'run_start_disable_tootip'}>
										Start
										<Tooltip id={'run_start_disable_tootip'} text={'모든 configuration 설정을 마쳐야 학습 시작이 가능합니다.'}/>
									</ButtonGray>
								)}
							</StartTranArea>
						</TableContainer>
						<BottomContainer style={{ display: 'flex', justifyContent: 'space-between' }}>
							<BottomBox>
								<div>
									<div style={{ width: '100%', display: 'flex' }}>
										<BottomText>Log</BottomText>
										<LogComponent experiment_id={experiment_id} data={detail} status={status} setStatus={setStatus} />
									</div>
								</div>
							</BottomBox>
							<BottomBox>
								<div>
									<div style={{ width: '100%', display: 'flex' }}>
										<BottomText>Progress</BottomText>
										<BottomContentBox>
											{projectType && projectType === 'tabular' ? (
												<div className="nonGraphWrapper">
													<div className="nonGraphText">Not Available</div>
												</div>
											) : (
												<GraphComponent graphEpoch={graphEpoch} dataSplit={dataSplit} setKFoldPercent={setKFoldPercent} />
											)}
										</BottomContentBox>
									</div>
								</div>
							</BottomBox>
						</BottomContainer>
						<BottomContainer style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', height: '23px' }}>
							<div style={{ width: '750px' }}>
								{checkIsRunning(status) && projectType === 'image' ? (
									dataSplit.split_type === 'T' ? (
										<>
											<ProgressBar completed={percent} />
											<div
												style={{
													marginTop: '4px',
													fontSize: '14',
													height: '19px',
													color: colors.text_black,
													textAlign: 'right',
												}}
											>
												{percent}%
											</div>
										</>
									) : (
										<>
											<ProgressBar completed={kFoldpercent} />
											<div
												style={{
													marginTop: '4px',
													fontSize: '14',
													height: '19px',
													color: colors.text_black,
													textAlign: 'right',
												}}
											>
												{kFoldpercent}%
											</div>
										</>
									)
								) : (
									<div></div>
								)}
							</div>
						</BottomContainer>
					</WhiteBox>
				</DashBoardContainer>
			</div>
		</ExpRunContext.Provider>
	);
}

export const checkIsDraft = (status) => {
	if (status === EXPERIMENT_STATUS.NONE || status === EXPERIMENT_STATUS.DRAFT) {
		return true;
	}
	return false;
};

export const checkIsRunning = (status) => {
	if (status === EXPERIMENT_STATUS.RUNNING || status === EXPERIMENT_STATUS.PENDING || status === 'ex3') {
		return true;
	}
	return false;
};
export const checkIsSucceed = (status) => {
	if (status === EXPERIMENT_STATUS.SUCCEEDED || status === 'ex4') {
		return true;
	}
	return false;
};
export const checkIsAbort = (status) => {
	if (status === EXPERIMENT_STATUS.ABORTED || status === 'ex6') {
		return true;
	}
	return false;
};
export const checkIsCompleted = (status) => {
	if (status === EXPERIMENT_STATUS.COMPLETED) {
		return true;
	}
	return false;
};
export const checkIsFailed = (status) => {
	if (status === EXPERIMENT_STATUS.FAILED || status === 'ex5') {
		return true;
	}
	return false;
};
const WhiteBox = styled.div`
	width: 100%;
	height: 100%;
`;

const DashBoardContainer = styled.div`
	width: 100%;
	height: 144px;
	display: flex;
	flex-direction: column;
	padding: 0px 63px 0 64px;
`;

const TableContainer = styled.div`
	width: 100%;
	height: 412px;
	margin-top: 16px;
	padding: 0px 0px 18px 0px;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	background-color: ${colors.bg_white};
	border: solid 1px #dfe2e5;
`;

const ButtonContainer = styled.div`
	width: 100%;
	height: 40px;
	display: flex;
	align-items: center;
`;

const BottomContainer = styled.div`
	margin-top: 12px;
	display: flex;
	height: 296px;
`;

const BottomBox = styled.div`
	width: 750px;
	height: 296px;
	background: ${colors.bg_white};
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	border: solid 1px #dfe2e5;
	padding: 16px;
	padding-left: 32px;
`;

const BottomText = styled.div`
	font-size: 15px;
	font-weight: 500;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	text-align: center;
	width: 14%;
	text-align: left;
`;

const BottomContentBox = styled.div`
	width: 614px;
	background: #979797;
	height: 264px;
	.nonGraphWrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #d5d6d7;
	}
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
	padding-top: 6px;
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

const StartTranArea = styled.div`
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
	:hover {
		background: ${colors.light_blue_hover};
	}
	:active {
		background: ${colors.light_blue_press};
	}
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

const SetConfigurationArea = styled.div`
	padding: 10px 32px;
`;
