import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';

const Plot = createPlotlyComponent(Plotly);

export default function LogComponent(props) {
	const { graphData, graphWidth, graphHeight, layoutLeft, layoutRight, layoutTop, layoutBottom, layoutPadding } =
		props;
	const [xGraphData, setXGraphData] = useState([]);
	const [yGraphData, setYGraphData] = useState([]);
	const [itemNameData, setItemNameData] = useState([]);
	// const [graphType, setGraphType] = useState('');

	useEffect(() => {
		if (graphData !== null) {
			setXGraphData(graphData['xList']);
			setYGraphData(graphData['yList']);
			setItemNameData(graphData['nameList']);
			// setGraphType(graphData["type"]);
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
							mode: 'markers',
							type: 'scatter',
							marker: {
								size: 11,
								colorscale: 'Viridis',
								color: yGraphData,
							},
							opacity: 0.9,
							text: itemNameData,
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
