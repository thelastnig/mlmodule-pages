import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import 'components/Experiment/experiment.scss';
import agent from 'lib/apis';

import DialogTitleComponent from 'components/modal/DialogTitle';
import GraphComponent from 'components/Experiment/HPO/ExpRunHpoDetailGraphComponent';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const hpoTrialgraphDataParser = (rawGraphDataList) => {
	let graphData = null;

	if (rawGraphDataList !== null && rawGraphDataList.length) {
		let objectiveMetricName = '';
		let additionalMetricName = '';
		let objectiveMetricValue = [];
		let additionalMetricValue = [];

		rawGraphDataList.map((rawGraphData) => {
			if (rawGraphData !== null) {
				if (rawGraphData['metricName'].includes('val')) {
					objectiveMetricName = rawGraphData['metricName'];
					objectiveMetricValue.push(rawGraphData['value']);
				} else {
					additionalMetricName = rawGraphData['metricName'];
					additionalMetricValue.push(rawGraphData['value']);
				}
			}
		});

		graphData = {
			objectiveMetric: {
				name: objectiveMetricName,
				value: objectiveMetricValue,
			},
			additionalMetric: {
				name: additionalMetricName,
				value: additionalMetricValue,
			},
		};
	}

	return graphData;
};

export default function ExpRunHpoDetail({ data }) {
	const [graphData, setGraphData] = useState(null);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_HPO_DETAIL;

	const fetchData = () => {
		let params = {
			trial_name: data.trialName,
		};
		agent
			.getHpoTrialData(params)
			.then((response) => {
				const { list } = response.data;
				setGraphData(hpoTrialgraphDataParser(list));
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	useEffect(() => {
		if (isShow) {
			fetchData();
		}
	}, [isShow]);
	return (
		<div>
			<Dialog
				className={'exp_run_detail_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Trial Data'} toggle={hideDialog} />
				<DialogContentArea>
					<DialogContent>
						<GraphComponent graphData={graphData} />
					</DialogContent>
				</DialogContentArea>
			</Dialog>
		</div>
	);
}

const DialogContentArea = styled.div`
	padding: 24px;
`;

const DialogContent = styled.div`
	width: 754px;
	height: 558px;
	background-color: #b5bcc4;
`;
