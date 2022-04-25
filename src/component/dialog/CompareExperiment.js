import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import DataParser from 'utils/DataParser';

import { useStateActionHandler } from 'store/experiments/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import { AlgorithmSize } from 'components/common/ExperimentComponent';
import GraphComponent from 'components/common/graph/GraphComponent';
import { graphDataParser, metricDataParser, finalMetricDataParser } from 'utils/graphUtil';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';


const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '1423px', maxWidth: '1423px' },
		height: '691px',
	},
}));

export default function CompareExperiment({ checkItems }) {
	const { getExperimentCompareCB } = useStateActionHandler();
	const [modelInfo, setModelInfo] = useState([]);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_COMPARE;

	const classes = useStyles();
	useEffect(() => {
		if (isShow) {
			let experiment_list = '[';
			for (let i = 0; i < checkItems.length; i++) {
				if (i > 0) {
					experiment_list += ',';
				}
				experiment_list += checkItems[i].experiment_id;
			}
			experiment_list += ']';
			let params = {
				experiment_list: experiment_list,
			};
			getExperimentCompareCB(params)
				.then((response) => {
					console.log('then response = ', response);
					const { experiment_info } = response.data;
					const { graph_info } = response.data;
					let modelInfoList = [];
					if (experiment_info && graph_info && experiment_info.length === graph_info.length) {
						experiment_info.map((experiment, index) => {
							modelInfoList.push({
								"expInfo": experiment,
								"graphInfo": graph_info[index],
								"metricInfo": metricDataParser(graph_info[index])
							});
						});
					}
					setModelInfo(modelInfoList);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		}
	}, [isShow]);
	useCallback(() => {
		hideDialog();
	});

	const Models = modelInfo.map((data, index) => {
		const parsedGraphData = graphDataParser(data.graphInfo);	
		const graphWidth = 466;
		const graphHeight = 200;
		const layoutLeft = 40;
		const layoutRight = 30;
		const layoutTop = 0;
		const layoutBottom = 0;
		const layoutPadding = 0;
		const legendX = 0;
		const legendY = -0.1;

		let number = index + 1;
		if (number < 10) {
			number = '0' + number;
		}

		let parsedTrainData = null;
		if (data.metricInfo && data.metricInfo.trainMetricData) {
			parsedTrainData = finalMetricDataParser(data.metricInfo.trainMetricData);
		};
		
		let parsedValData = null;
		if (data.metricInfo && data.metricInfo.valMetricData) {
			parsedValData = finalMetricDataParser(data.metricInfo.valMetricData);
		};
		
		let parsedTestData = null;
		if (data.metricInfo && data.metricInfo.testMetricData) {
			parsedTestData = finalMetricDataParser(data.metricInfo.testMetricData);
		};
			
		return (
			<ModelContainer key={index}>
				<ModelItem>
					<ColumnTitle className='left'><div className='text'>Model {number}</div></ColumnTitle>
					<ColumnContent>	
						<Model data={data.expInfo}  index={index} />
					</ColumnContent>
				</ModelItem>
				<ModelItem>
					<ColumnTitle className='left'>Graph</ColumnTitle>
					<ColumnContent>	
						<ImageBox key={index}>
							<GraphComponent
								graphData={parsedGraphData}
								graphWidth={graphWidth}
								graphHeight={graphHeight}
								layoutLeft={layoutLeft}
								layoutRight={layoutRight}
								layoutTop={layoutTop}
								layoutBottom={layoutBottom}
								layoutPadding={layoutPadding}
								legendX={legendX}
								legendY={legendY}
							/>
						</ImageBox>
					</ColumnContent>
				</ModelItem>
				<ModelItem>
					<ColumnTitle><div className='text'>Evaluator</div></ColumnTitle>
					<ColumnContent>	
						<Metric>
							{data.metricInfo && data.metricInfo.metricName && (
							<div className='metricWrapper'>
								<div className='metricText'>
									{data.metricInfo.metricName[0].toUpperCase() + data.metricInfo.metricName.slice(1)}
								</div>
							</div>
							)}
							{data.metricInfo && data.metricInfo.isLoss && (
							<div className='lossWrapper'>
								<div className='lossText'>
									Loss
								</div>
							</div>
							)}
						</Metric>
					</ColumnContent>
				</ModelItem>
				<ModelItem>
					<ColumnTitle><div className='text'>Training</div></ColumnTitle>
					<ColumnContent>	
						<Metric>
							{parsedTrainData && parsedTrainData.metricKey && ( 
							<div className='metricWrapper'>
								<div className='metricText'>{parsedTrainData.metricKey}</div>
							</div>
							)}
							{parsedTrainData && parsedTrainData.lossKey && ( 
							<div className='lossWrapper'>
								<div className='lossText'>{parsedTrainData.lossKey}</div>
							</div>
							)}
						</Metric>
					</ColumnContent>
				</ModelItem>
				<ModelItem>
					<ColumnTitle><div className='text'>Validation</div></ColumnTitle>
					<ColumnContent>	
						<Metric>
							{parsedValData && parsedValData.metricKey && ( 
							<div className='metricWrapper'>
								<div className='metricText'>{parsedValData.metricKey}</div>
							</div>
							)}
							{parsedValData && parsedValData.lossKey && ( 
							<div className='lossWrapper'>
								<div className='lossText'>{parsedValData.lossKey}</div>
							</div>
							)}
						</Metric>
					</ColumnContent>
				</ModelItem>
				<ModelItem>
					<ColumnTitle className='last'><div className='text'>Test</div></ColumnTitle>
					<ColumnContent>	
						<Metric className='last'>
							{parsedTestData && parsedTestData.metricKey && ( 
							<div className='metricWrapper'>
								<div className='metricText'>{parsedTestData.metricKey}</div>
							</div>
							)}
							{parsedTestData && parsedTestData.lossKey && ( 
							<div className='lossWrapper'>
								<div className='lossText'>{parsedTestData.lossKey}</div>
							</div>
							)}
						</Metric>
					</ColumnContent>
				</ModelItem>
			</ModelContainer>
		);
	})

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'compare_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Compare'} toggle={hideDialog} />
				<DialogContent>
					<ContentWrapper>
						{Models}
					</ContentWrapper>
				</DialogContent>
			</Dialog>
		</div>
	);
}

const Model = ({ data, index }) => {
	return (
		<ModelBox>
			<TextBox>
				<Label>Name :</Label>
				<Text>{data.model_nm}</Text>
			</TextBox>
			<TextBox>
				<Label>Model Size :</Label>
				<Text>{(data.model_size) ? `${data.model_size} MB` : '-'}</Text>
			</TextBox>
			<TextBox>
				<Label>Algorithm :</Label>
				<Text>{data.algorithm_nm}</Text>
			</TextBox>
			<TextBox>
				<Label>No. of Parameters :</Label>
				<Text>
					<AlgorithmSize data={data} />
				</Text>
			</TextBox>
			<ModelSubTitle>Resources</ModelSubTitle>
			<TextBox>
				<Label>Name :</Label>
				<Text>{data.preset_nm}</Text>
			</TextBox>
			<TextBox>
				<Label>GPU :</Label>
				<Text>{DataParser.parseGPU(data)}</Text>
			</TextBox>
			<TextBox>
				<Label>CPU :</Label>
				<Text>{DataParser.parseCPU(data)}</Text>
			</TextBox>
			<TextBox>
				<Label>RAM :</Label>
				<Text>{DataParser.parseRAM(data)}</Text>
			</TextBox>
			<ModelSubTitle>Parameter</ModelSubTitle>
			{data.parameter && Object.keys(data.parameter).map((key, index) => <ParameterItem name={key} value={data.parameter[key]} />)}
		</ModelBox>
	);
};

const ParameterItem = (props) => {
	const { name, value } = props;
	return (
		<TextBox>
			<Label>{name} :</Label>
			<Text>{typeof value === 'boolean' ? value.toString() : value}</Text>
		</TextBox>
	);
};

const ContentWrapper = styled.div`
	width: 1373px;
	margin-bottom: 17px;
`

const ModelItem = styled.div`
	height: 277px;
`

const ColumnTitle = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #f8f9fa;
	font-weight: bold;
	border-right: solid 1px ${colors.gray_blue_gray};
	border-bottom: solid 1px ${colors.gray_blue_gray};

	&.left {
		justify-content: flex-start;
		padding-left: 18px;
	}
	&.last {
		border-right: none;
	}
`

const ColumnContent = styled.div`	
	height: 237px;
`

const ModelSubTitle = styled.div`
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	padding-left: 18px;
	margin-top: 20px;
	margin-bottom: 8px;
`;

const Text = styled.div`
	color: ${colors.text_black};
	font-size: 14px;
	word-break: break-all;
	margin-top: 12px;
`;

const Label = styled.div`
	color: #3e5376;
	font-size: 14px;
	margin-right: 5px;
	white-space: nowrap;
	margin-top: 12px;
`;

const TextBox = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-left: 18px;
	padding-right: 18px;
`;

const ImageBox = styled.div`
	width: 470px;
	height: 237px;
	border-right: solid 1px ${colors.gray_blue_gray};
`;

const ModelContainer = styled.div`
	border-radius: 4px;
	border: solid 1px ${colors.gray_blue_gray};
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 17px;
`;

const ModelBox = styled.div`
	width: 361px;
	height: 100%;
	overflow: overlay;
	border-right: solid 1px ${colors.gray_blue_gray};
	background-color: white;
`;

const Metric = styled.div`
	width: 135px;
	height: 237px;
	border-right: solid 1px ${colors.gray_blue_gray};
	display: flex;
	flex-direction: column;

	&.last {
		border-right: none;
	}

	.metricWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
	}

	.lossWrapper {
		display: flex;
		justify-content: center;
		align-items: center;
		flex: 1;
		border-top: solid 1px ${colors.gray_blue_gray};
	}
`