import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

export default function LogComponent(props) {
	const { graphData, graphWidth, graphHeight, layoutLeft, layoutRight, layoutTop, layoutBottom, layoutPadding } =
		props;
	const [xGraphData, setXGraphData] = useState([]);
	const [yGraphData, setYGraphData] = useState([]);
	const [zGraphData, setZGraphData] = useState([]);
	useEffect(() => {
		if (graphData !== null) {
			setXGraphData(graphData['xList']);
			setYGraphData(graphData['yList']);
			setZGraphData(graphData['zList']);
		}
	}, [graphData]);

	return (
		<GraphArea>
			<div className="metricGraphArea">
				<Plot
					data={[
						{
							x: xGraphData,
							y: yGraphData,
							z: zGraphData,
							mode: 'markers',
							type: 'scatter3d',
							marker: {
								size: 5,
								colorscale: 'Viridis',
								color: xGraphData,
							},
							opacity: 0.8,
							hoverinfo: 'x+y+z',
							// name: trainMetricKeyName,
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
						hovermode: 'closest',
						xaxis: { zeroline: false },
						yaxis: { zeroline: false },
						zaxis: { zeroline: false },
						paper_bgcolor: 'white',
						plot_bgcolor: 'white',
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
`;
