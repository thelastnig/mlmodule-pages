import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

import { useHandleState as useGraphHandleState, useStateActionHandler as useGraphActionHandler } from 'store/graph/hooks';

// Graph
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

import Tooltip from 'components/common/Tooltip';

const Plot = createPlotlyComponent(Plotly);

export default function LogComponent(props) {
	const { graphEpoch, dataSplit, setKFoldPercent } = props;
	const { initGraphData } = useGraphActionHandler();
	const [trainMetricGraphData, setTrainMetricGraphData] = useState([]);
	const [valMetricGraphData, setValMetricGraphData] = useState([]);
	const [trainLossGraphData, setTrainLossGraphData] = useState([]);
	const [valLossGraphData, setValLossGraphData] = useState([]);
	const [trainMetricKeyName, setTrainMetricKeyName] = useState('');
	const [valMetricKeyName, setValMetricKeyName] = useState('');
	const [trainLossKeyName, setTrainLossKeyName] = useState('');
	const [valLossKeyName, setValLossKeyName] = useState('');
	const [totalEpoch, setTotalEpoch] = useState([]);
	const [isGraphShow, setisGraphShow] = useState(false);
	const [visibleGraph, setVisibleGraph] = useState('metric');
	const { graphData } = useGraphHandleState();
	let epoch = [];

	useEffect(() => {
		if (graphData != null) {
			if (dataSplit && dataSplit.split_type === 'T') {
				if (Object.keys(graphData.trainGraphData).length !== 0 && graphEpoch > 0) {
					for (let i = 0; i < graphEpoch; i++) {
						epoch.push(i + 1);
					}
					setTotalEpoch(epoch);

					let trainMetricData = new Array(graphEpoch).fill(undefined);
					let trainLossData = new Array(graphEpoch).fill(undefined);
					let valMetricData = new Array(graphEpoch).fill(undefined);
					let valLossData = new Array(graphEpoch).fill(undefined);

					const trainRawData = graphData.trainGraphData;
					const trainDataAllKeys = Object.keys(trainRawData);
					trainDataAllKeys.forEach((key) => {
						if (key.includes('loss')) {
							setTrainLossKeyName(key);
							trainRawData[key].forEach((value, index) => {
								trainLossData[index] = value;
							});
							setTrainLossGraphData(trainLossData);
						} else {
							setTrainMetricKeyName(key);
							trainRawData[key].forEach((value, index) => {
								trainMetricData[index] = value;
							});
							setTrainMetricGraphData(trainMetricData);
						}
					});

					const valRawData = graphData.valGraphData;
					const ValDataAllKeys = Object.keys(valRawData);
					ValDataAllKeys.forEach((key) => {
						if (key.includes('loss')) {
							setValLossKeyName(key);
							valRawData[key].forEach((value, index) => {
								valLossData[index] = value;
							});
							setValLossGraphData(valLossData);
						} else {
							setValMetricKeyName(key);
							valRawData[key].forEach((value, index) => {
								valMetricData[index] = value;
							});
							setValMetricGraphData(valMetricData);
						}
					});
					initGraphData();
					setisGraphShow(true);
				}
			} else if (dataSplit && dataSplit.split_type === 'C') {
				if (Object.keys(graphData.trainGraphData).length !== 0 && graphEpoch > 0) {
					const currentFold = Object.keys(graphData.trainGraphData).length / 2;
					const percent = ((currentFold - 1) / parseInt(dataSplit.split_cross)) * 100;
					setKFoldPercent(percent.toFixed(1));

					for (let i = 0; i < graphEpoch; i++) {
						epoch.push(i + 1);
					}
					setTotalEpoch(epoch);

					let trainMetricData = new Array(graphEpoch).fill(undefined);
					let trainLossData = new Array(graphEpoch).fill(undefined);
					let valMetricData = new Array(graphEpoch).fill(undefined);
					let valLossData = new Array(graphEpoch).fill(undefined);

					const trainRawData = graphData.trainGraphData;
					const trainDataAllKeys = Object.keys(trainRawData);
					trainDataAllKeys.forEach((key) => {
						const foldNum = key.split('/')[0];
						if (key.includes('loss') && parseInt(foldNum) === currentFold) {
							setTrainLossKeyName(key);
							trainRawData[key].forEach((value, index) => {
								trainLossData[index] = value;
							});
							setTrainLossGraphData(trainLossData);
						} else if (parseInt(foldNum) === currentFold) {
							setTrainMetricKeyName(key);
							trainRawData[key].forEach((value, index) => {
								trainMetricData[index] = value;
							});
							setTrainMetricGraphData(trainMetricData);
						}
					});

					const valRawData = graphData.valGraphData;
					const ValDataAllKeys = Object.keys(valRawData);
					ValDataAllKeys.forEach((key) => {
						const foldNum = key.split('/')[0];
						if (key.includes('loss') && parseInt(foldNum) === currentFold) {
							setValLossKeyName(key);
							valRawData[key].forEach((value, index) => {
								valLossData[index] = value;
							});
							setValLossGraphData(valLossData);
						} else if (parseInt(foldNum) === currentFold) {
							setValMetricKeyName(key);
							valRawData[key].forEach((value, index) => {
								valMetricData[index] = value;
							});
							setValMetricGraphData(valMetricData);
						}
					});
					initGraphData();
					setisGraphShow(true);
				}
			}
		}
	}, [graphData]);

	const handleChange = (event) => {
		setVisibleGraph(event.target.value);
	};

	return (
		<div data-tip data-for={'run_progress_tooltip'}>
			<GraphArea isGraphShow={isGraphShow} visibleGraph={visibleGraph}>				
				<div className="graphSelectArea">
					<FormControl className="formControl">
						<NativeSelect value={visibleGraph} onChange={(event) => handleChange(event)} data-tip data-for={'progress_metric_tootip'}>
							<option value="metric">metric</option>
							<option value="loss">loss</option>
						</NativeSelect>
						{isGraphShow && (
							<Tooltip 
								id={'progress_metric_tootip'} 
								text={visibleGraph === 'metric' ? 
									'모델 평가 척도의 변화를 확인합니다.\n프로젝트 생성시 선택한 문제에 맞는 척도가 설정되어 있습니다.' : 
									'학습을 가이드하는 손실함수값의 변화를 확인합니다.'}
							/>
						)}
					</FormControl>
				</div>
				<div className="metricGraphArea" data-tip data-for={'run_progress_metric_graph_tooltip'}>
					<Plot
						data={[
							{
								x: totalEpoch,
								y: trainMetricGraphData,
								type: 'scatter',
								mode: 'lines',
								marker: { color: '#004282' },
								name: trainMetricKeyName,
							},
							{
								x: totalEpoch,
								y: valMetricGraphData,
								type: 'scatter',
								mode: 'lines',
								marker: { color: '#E22706' },
								name: valMetricKeyName,
							},
						]}
						layout={{
							autosize: false,
							width: 614,
							height: 234,
							margin: {
								l: 40,
								r: 30,
								b: 10,
								t: 10,
								pad: 4,
							},
							showlegend: true,
							legend: { orientation: 'h' },
						}}
					/>
					{isGraphShow && (
						<Tooltip id={'run_progress_metric_graph_tooltip'} text={'반복학습 횟수(가로축 숫자)에 따른 모델의 평가 척도 변화를 확인합니다.\n학습의 정도(과소적합, 과적합)를 확인할 수 있습니다.'}/>
					)}
				</div>
				<div className="lossGraphArea" data-tip data-for={'run_progress_loss_graph_tooltip'}>
					<Plot
						data={[
							{
								x: totalEpoch,
								y: trainLossGraphData,
								type: 'scatter',
								mode: 'lines',
								marker: { color: '#004282' },
								name: trainLossKeyName,
							},
							{
								x: totalEpoch,
								y: valLossGraphData,
								type: 'scatter',
								mode: 'lines',
								marker: { color: '#E22706' },
								name: valLossKeyName,
							},
						]}
						layout={{
							autosize: false,
							width: 614,
							height: 234,
							margin: {
								l: 40,
								r: 30,
								b: 10,
								t: 10,
								pad: 4,
							},
							showlegend: true,
							legend: { orientation: 'h' },
						}}
					/>
					{isGraphShow && (
						<Tooltip id={'run_progress_loss_graph_tooltip'} text={'반복학습 횟수(가로축 숫자)에 따른 손실함수값의 변화를 확인합니다.\n학습의 정도(과소적합, 과적합)를 확인할 수 있습니다.'}/>
					)}
				</div>
			</GraphArea>
			{!isGraphShow && (
				<Tooltip id={'run_progress_tooltip'} text={'전체 데이터 학습이 한번 완료된 후에 그래프가 생성됩니다.'}/>
			)}
		</div>
	);
}

const GraphArea = styled.div`
	visibility: hidden;
	${(props) =>
		props.isGraphShow &&
		`
	visibility: visible;
  `}
	${(props) =>
		!props.isGraphShow &&
		`
	visibility: hidden;
  `}

  .metricGraphArea {
		display: block;
		${(props) =>
			props.visibleGraph === 'metric' &&
			`
      display: block;
    `}
		${(props) =>
			props.visibleGraph === 'loss' &&
			`
      display: none;
    `}
	}

	.lossGraphArea {
		display: none;
		${(props) =>
			props.visibleGraph === 'metric' &&
			`
      display: none;
    `}
		${(props) =>
			props.visibleGraph === 'loss' &&
			`
      display: block;
    `}
	}

	.graphSelectArea {
		width: 614px;
		height: 30px;
		text-align: right;
		background: white;
		z-index: 100;

		.formControl {
			width: 120px;
		}
	}
`;
