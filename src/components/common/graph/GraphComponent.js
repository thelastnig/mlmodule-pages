import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

export default function LogComponent(props) {
	const {
		graphData,
		graphWidth,
		graphHeight,
		layoutLeft,
		layoutRight,
		layoutTop,
		layoutBottom,
		layoutPadding,
		legendY,
	} = props;
	const [trainMetricGraphData, setTrainMetricGraphData] = useState([]);
	const [valMetricGraphData, setValMetricGraphData] = useState([]);
	const [trainLossGraphData, setTrainLossGraphData] = useState([]);
	const [valLossGraphData, setValLossGraphData] = useState([]);
	const [trainMetricKeyName, setTrainMetricKeyName] = useState('');
	const [valMetricKeyName, setValMetricKeyName] = useState('');
	const [trainLossKeyName, setTrainLossKeyName] = useState('');
	const [valLossKeyName, setValLossKeyName] = useState('');
	const [totalEpoch, setTotalEpoch] = useState([]);
	const [visibleGraph, setVisibleGraph] = useState('metric');

	useEffect(() => {
		if (Object.keys(graphData.trainGraphData).length !== 0) {
			let trainMetricData = [];
			let trainLossData = [];
			let valMetricData = [];
			let valLossData = [];
			let epoch = [];

			const trainRawData = graphData.trainGraphData;
			const trainDataAllKeys = Object.keys(trainRawData);
			trainDataAllKeys.forEach((key) => {
				if (key.includes('loss')) {
					setTrainLossKeyName(key);
					trainLossData = trainRawData[key];
					setTrainLossGraphData(trainLossData);
				} else {
					setTrainMetricKeyName(key);
					trainMetricData = trainRawData[key];
					setTrainMetricGraphData(trainMetricData);
				}
			});

			const valRawData = graphData.valGraphData;
			const ValDataAllKeys = Object.keys(valRawData);
			ValDataAllKeys.forEach((key) => {
				if (key.includes('loss')) {
					setValLossKeyName(key);
					valLossData = valRawData[key];
					setValLossGraphData(valLossData);
				} else {
					setValMetricKeyName(key);
					valMetricData = valRawData[key];
					setValMetricGraphData(valMetricData);
				}
			});

			for (let i = 0; i < trainMetricData.length; i++) {
				epoch.push(i + 1);
			}
			setTotalEpoch(epoch);
		}
	}, [graphData]);

	const handleChange = (event) => {
		setVisibleGraph(event.target.value);
	};

	return (
		<GraphArea visibleGraph={visibleGraph}>
			<div className="graphSelectArea">
			{trainLossGraphData.length !== 0 
			?				
			<FormControl className="formControl">
				<NativeSelect value={visibleGraph} onChange={(event) => handleChange(event)}>
					<option value="metric">metric</option>
					<option value="loss">loss</option>
				</NativeSelect>
			</FormControl>
			:
			null
			}
			</div>
			<div className="metricGraphArea">
				{
					trainLossGraphData.length !== 0
					?
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
							width: graphWidth,
							height: graphHeight,
							margin: {
								l: layoutLeft,
								r: layoutRight,
								b: layoutBottom,
								t: layoutTop,
								pad: layoutPadding,
							},
							showlegend: true,
							legend: {
								orientation: 'h',
								y: legendY,
							},
						}}
					/>
					:
					<Plot
						data={[
							{
								x: totalEpoch,
								y: trainMetricGraphData,
								type: 'scatter',
								mode: 'lines+markers',
								marker: { color: '#004282', size: 8 },
								name: trainMetricKeyName,
							},
							{
								x: totalEpoch,
								y: valMetricGraphData,
								type: 'scatter',
								mode: 'lines+markers',
								marker: { color: '#E22706', size: 8 },
								name: valMetricKeyName,
							},
						]}
						layout={{
							autosize: false,
							width: graphWidth,
							height: graphHeight,
							margin: {
								l: layoutLeft,
								r: layoutRight,
								b: layoutBottom,
								t: layoutTop,
								pad: layoutPadding,
							},
							showlegend: true,
							legend: {
								orientation: 'h',
								y: legendY,
							},
							xaxis: {
								autotick: false,
								zeroline: false,
								showline: false,
								range: [0.5, 1.5],
							},
						}}
					/>
				}
			</div>
			<div className="lossGraphArea">
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
						width: graphWidth,
						height: graphHeight,
						margin: {
							l: layoutLeft,
							r: layoutRight,
							b: layoutBottom,
							t: layoutTop,
							pad: layoutPadding,
						},
						showlegend: true,
						legend: {
							orientation: 'h',
							y: legendY,
						},
					}}
				/>
			</div>
		</GraphArea>
	);
}

const GraphArea = styled.div`
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
		width: 100%;
		height: 30px;
		text-align: right;
		background: white;
		z-index: 100;

		.formControl {
			width: 120px;
			margin-right: 20px;
		}
	}
`;
