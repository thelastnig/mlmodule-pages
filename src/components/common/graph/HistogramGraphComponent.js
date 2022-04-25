import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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
		showticklabels,
	} = props;
	const [xGraphData, setXGraphData] = useState([]);

	useEffect(() => {
		if (graphData !== null) {
			setXGraphData(graphData);
		}
	}, [graphData]);

	return (
		<GraphArea graphWidth={graphWidth} graphHeight={graphHeight}>
			<div className="metricGraphArea">
				{xGraphData.length > 0 ? (
					<Plot
						data={[
							{
								x: xGraphData,
								type: 'histogram',
								opacity: 0.9,
								marker: {
									color: '#5F3DC4',
									line: {
										width: 1,
									},
								},
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
							paper_bgcolor: 'white',
							plot_bgcolor: 'white',
							yaxis: {
								showticklabels: showticklabels,
							},
						}}
					/>
				) : (
					<div className="notAvailableDiv">Not Available</div>
				)}
			</div>
		</GraphArea>
	);
}

const GraphArea = styled.div`
	width: ${(props) => props.graphWidth}px;
	height: ${(props) => props.graphHeight}px;
	display: flex;
	justify-content: center;
	align-items: center;
`;
