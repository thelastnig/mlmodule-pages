import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

export default function GraphComponent(props) {
	const { graphData } = props;
	const [objectiveMetricGraphData, setObjectiveMetricGraphData] = useState([]);
	const [additionalMetricGraphData, setAdditionalMetricGraphData] = useState([]);
	const [objectiveMetricKeyName, setObjectiveMetricKeyName] = useState('');
	const [additionalMetricKeyName, setAdditionalMetricKeyName] = useState('');
	const [totalEpoch, setTotalEpoch] = useState([]);

	useEffect(() => {
		if (graphData !== null) {
			setObjectiveMetricKeyName(graphData.objectiveMetric.name);
			setAdditionalMetricKeyName(graphData.additionalMetric.name);
			setObjectiveMetricGraphData(graphData.objectiveMetric.value);
			setAdditionalMetricGraphData(graphData.additionalMetric.value);

			let epoch = [];

			for (let i = 0; i < graphData.objectiveMetric.value.length; i++) {
				epoch.push(i + 1);
			}
			setTotalEpoch(epoch);
		}
	}, [graphData]);

	return (
		<GraphArea>
			<div className="metricGraphArea">
				<Plot
					data={[
						{
							x: totalEpoch,
							y: objectiveMetricGraphData,
							type: 'scatter',
							mode: 'lines',
							marker: { color: '#004282' },
							name: objectiveMetricKeyName,
						},
						{
							x: totalEpoch,
							y: additionalMetricGraphData,
							type: 'scatter',
							mode: 'lines',
							marker: { color: '#E22706' },
							name: additionalMetricKeyName,
						},
					]}
					layout={{
						autosize: false,
						width: 754,
						height: 558,
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
			</div>
		</GraphArea>
	);
}

const GraphArea = styled.div`
	width: 100%;
	height: 100%;
`;
