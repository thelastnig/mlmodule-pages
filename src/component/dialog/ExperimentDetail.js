import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import 'components/Experiment/experiment.scss';
import { colors } from 'styles';
import DataParser from 'utils/DataParser';
import { metricDataParser } from 'utils/graphUtil';

import { useStateActionHandler, useHandleState } from 'store/experiments/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { ExperimentAlgorithm, ExperimentParameter, ExperimentResource } from 'components/common/ExperimentComponent';
import { ExperimentHpoSettings, ExperimentHpoObjective } from 'components/common/ExperimentHPOSettingsComponent';
import { EvaluationMetticName, EvaluationTraining, EvaluationValidation, EvaluationTest, EvaluationNone } from 'components/common/ExperimentEvaluationComponent';
import GraphComponent from 'dialog/DlgDetail_GraphComponent';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const regex = /\r/gi;

const graphDataParser = (rawGraphData) => {
	let graphData = null;

	if (rawGraphData !== null) {
		const resultKeys = Object.keys(rawGraphData);
		let trainKeys = [];
		resultKeys.map((key) => {
			if (key.includes('train')) {
				trainKeys.push(key);
			}
		});
		let valKeys = [];
		resultKeys.map((key) => {
			if (key.includes('val')) {
				valKeys.push(key);
			}
		});

		let trainGraphData = {};
		trainKeys.forEach((item) => {
			trainGraphData[item] = rawGraphData[item];
		});

		let valGraphData = {};
		valKeys.forEach((item) => {
			valGraphData[item] = rawGraphData[item];
		});

		graphData = {
			trainGraphData: trainGraphData,
			valGraphData: valGraphData,
		};
	}

	return graphData;
};

export default function ExperimentDetails({ data }) {
	const { onFetchExperimentsDetailCallback, onInitDetailCB } = useStateActionHandler();
	const { detail } = useHandleState();
	const [dataAlgorithm, setDataAlgorithm] = React.useState('');
	const [dataResource, setDataResource] = React.useState('');
	const [dataParam, setDataParam] = React.useState('');
	const [logList, setLogList] = React.useState([]);
	const [dataGraph, setDataGraph] = useState(null);
	const [projectType, setProjectType] = useState(null);
	const [trainType, setTrainType] = useState(null);
	const [dataHpoSettings, setDataHpoSettings] = useState(null);
	const [dataMetrics, setDataMetrics] = useState(null);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_DETAIL;

	useEffect(() => {
		if (isShow) {
			let params = {
				experiment_id: data.experiment_id,
			};
			onFetchExperimentsDetailCallback(params);
		} else {
			setLogList([]);
			setDataGraph(null);
			onInitDetailCB();
		}
	}, [isShow]);

	useEffect(() => {
		const { dataAlgorithm, dataResource, dataParam, log, dataGraph, projectType, trainType, dataHpoSettings } = DataParser.parseExperimentDetail(detail);
		setDataAlgorithm(dataAlgorithm);
		setDataResource(dataResource);
		setDataParam(dataParam);
		log &&
			setLogList((prevList) => {
				prevList[0] = log.replace(regex, '\n');
				return [prevList];
			});
		const parsedGraphData = graphDataParser(dataGraph);
		setDataGraph(parsedGraphData);
		setProjectType(projectType);
		setTrainType(trainType);
		setDataHpoSettings(dataHpoSettings);
		const parsedMetricData = metricDataParser(dataGraph);
		setDataMetrics(parsedMetricData);
	}, [detail]);

	return (
		<div>
			<Dialog
				className={'experiment_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Details'} toggle={hideDialog} />
				<DialogContent>
					<div>
						<ContentItemTitle>Configuration</ContentItemTitle>
						<ConfigurationItemArea>
							<ConfigurationItemTitleArea>
								{/* TODO inline style */}
								<div style={{ width: '322px' }}>
									<ExperimentAlgorithm data={dataAlgorithm} />
								</div>

								<div style={{ width: '322px' }}>
									<ExperimentParameter data={dataParam} />
								</div>

								<div style={{ width: '321px' }}>
									<ExperimentResource data={dataResource} />
								</div>
							</ConfigurationItemTitleArea>
						</ConfigurationItemArea>
					</div>
					<div>
						<ContentItemTitle>Graph</ContentItemTitle>
						<TensorBoardArea style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
							{dataGraph && (Object.keys(dataGraph.trainGraphData).length !== 0) ? (
								<GraphComponent graphData={dataGraph} projectType={projectType} />
							) : (
								<div className="nonGraphWrapper">
									<div className="nonGraphText">Not Available</div>
								</div>
							)}
						</TensorBoardArea>
					</div>
					<div>
						<ContentItemTitle>Evaluation Results</ContentItemTitle>
						<EvaluationItemArea>
							{
								dataMetrics && dataMetrics.metricName && dataMetrics.trainMetricData 
								?
								<>
								{/* TODO inline style */}							
								<div style={{ width: '241px' }}>
									<EvaluationMetticName data={dataMetrics} />
								</div>

								<div style={{ width: '241px' }}>
									<EvaluationTraining data={dataMetrics} />
								</div>

								<div style={{ width: '241px' }}>
									<EvaluationValidation data={dataMetrics} />
								</div>

								<div style={{ width: '242px' }}>
									<EvaluationTest data={dataMetrics} />
								</div>
								</>
								:
								<div style={{ width: '965px'}}>
									<EvaluationNone/>
								</div>
							}
						</EvaluationItemArea>
					</div>
					{
						trainType === "HPO"
						?
						<div>
							<ContentItemTitle>HPO Settings</ContentItemTitle>
							<ConfigurationItemArea className='hpo'>
								<ConfigurationItemTitleArea>
									{/* TODO inline style */}
									<div style={{ width: '482.5px' }}>
										<ExperimentHpoSettings data={dataHpoSettings} />
									</div>

									<div style={{ width: '482.5px' }}>
										<ExperimentHpoObjective data={dataHpoSettings} />
									</div>
								</ConfigurationItemTitleArea>
							</ConfigurationItemArea>
						</div>
						:
						null
					}
					<div>
						<ContentItemTitle>log</ContentItemTitle>
						<LogArea>
							{logList.map((v, i) => (
								<LogItem key={i}>{v}</LogItem>
							))}
						</LogArea>
					</div>
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const LogItem = styled.div`
	color: #ffffff;
	padding: 5px 0;
`;

const DialogContent = styled.div`
	padding: 0 24px;
	height: 615px;
	overflow-y: auto;
`;

const ContentItemTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
	padding-top: 12px;
`;

const ConfigurationItemArea = styled.div`
	width: 967px;
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

const EvaluationItemArea = styled.div`
	width: 967px;
	height: 100%;
	border-radius: 4px;
	border: solid 1px ${colors.gray_blue_gray};
	display: flex;
`;

const TensorBoardArea = styled.div`
	width: 967px;
	height: 266px;
	background-color: #f0f1f3;
	.nonGraphWrapper {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;
const LogArea = styled.div`
	width: 967px;
	height: 260px;
	margin-bottom: 12px;
	background: black;

	padding: 5px;
	overflow-y: scroll;
	overflow-x: hidden;
	white-space: pre-wrap;
	// ::-webkit-scrollbar {
	// -webkit-appearance: unset;
	//   width: unset;
	//   height: unset;
	//   }
	&::-webkit-scrollbar {
		/* 세로 스크롤 넓이 */
		width: 8px;

		/* 가로 스크롤 높이 */
		height: 5px;

		border-radius: 2px;
		background: gray;
	}
	&::-webkit-scrollbar-thumb {
		background-color: black;
		border-radius: 6px;
	}
`;