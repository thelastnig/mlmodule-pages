import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

export default function LogComponent(props) {
	const { graphData, projectType } = props;
	const [trainMetricGraphData, setTrainMetricGraphData] = useState([]);
	const [valMetricGraphData, setValMetricGraphData] = useState([]);
	const [trainLossGraphData, setTrainLossGraphData] = useState([]);
	const [valLossGraphData, setValLossGraphData] = useState([]);
	const [trainMetricKeyName, setTrainMetricKeyName] = useState('');
	const [valMetricKeyName, setValMetricKeyName] = useState('');
	const [trainLossKeyName, setTrainLossKeyName] = useState('');
	const [valLossKeyName, setValLossKeyName] = useState('');
	const [totalEpoch, setTotalEpoch] = useState([]);

	useEffect(() => {
		if (graphData != null && projectType === 'image') {
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
		} else if (graphData != null && projectType === 'tabular') {
			let trainMetricData = [];
			let valMetricData = [];

			const trainRawData = graphData.trainGraphData;
			const trainDataAllKeys = Object.keys(trainRawData);
			trainDataAllKeys.forEach((key) => {
				setTrainMetricKeyName(key);
				trainMetricData = trainRawData[key];
				setTrainMetricGraphData(trainMetricData);
			});

			const valRawData = graphData.valGraphData;
			const ValDataAllKeys = Object.keys(valRawData);
			ValDataAllKeys.forEach((key) => {
				setValMetricKeyName(key);
				valMetricData = valRawData[key];
				setValMetricGraphData(valMetricData);
			});
			setTotalEpoch([1]);
		}
	}, [graphData]);

	return (
		<GraphArea>
			<div className="metricGraphArea">
				{projectType === 'image' ? (
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
							width: 483,
							height: 266,
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
				) : (
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
						]}
						layout={{
							autosize: false,
							width: 483,
							height: 266,
							margin: {
								l: 40,
								r: 30,
								b: 10,
								t: 10,
								pad: 4,
							},
							showlegend: true,
							legend: { orientation: 'h' },
							xaxis: {
								autotick: false,
								zeroline: false,
								showline: false,
								range: [0.5, 1.5],
							},
						}}
					/>
				)}
			</div>
			<div className="lossGraphArea">
				{projectType === 'image' ? (
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
							width: 483,
							height: 266,
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
				) : (
					<Plot
						data={[
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
							width: 483,
							height: 266,
							margin: {
								l: 40,
								r: 30,
								b: 10,
								t: 10,
								pad: 4,
							},
							showlegend: true,
							legend: { orientation: 'h' },
							xaxis: {
								autotick: false,
								zeroline: false,
								showline: false,
								range: [0.5, 1.5],
							},
						}}
					/>
				)}
			</div>
		</GraphArea>
	);
}

const GraphArea = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
