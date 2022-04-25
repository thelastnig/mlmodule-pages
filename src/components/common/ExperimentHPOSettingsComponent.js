import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';


export const ExperimentHpoSettings = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>HPO Settings</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				{data && data.max_trial_count && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Max Trial Count</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.max_trial_count}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && data.parallel_trial_count && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Parallel Trial Count</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.parallel_trial_count}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && data.max_failed_trial_count && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Max Failed Trial Count</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.max_failed_trial_count}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
			</ConfigurationItemDescription>
		</>
	);
};

export const ExperimentHpoObjective = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>Objective</ConfigurationItemTitle>
			<ConfigurationItemDescription style={{ borderRight: '0px' }}>
				{data && data.objective_metric_name && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Objective Metric Name</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.objective_metric_name}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && data.objective_type && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Objective Type</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.objective_type}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && data.objective_goal && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Objective Goal</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.objective_goal}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && data.additional_metric_name && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Additional Metric Name</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.additional_metric_name}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
			</ConfigurationItemDescription>
		</>
	);
};

const ConfigurationItemTitle = styled.div`
	line-height: 36px;
	padding-left: 15px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: -0.3px;
`;

const ConfigurationItemDescription = styled.div`
	padding: 8px 15px;
	width: 100%;
	height: 152px;
	overflow-y: auto;
	border-right: 1px solid ${colors.gray_blue_gray};
`;

const BetweenContent = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 4px 0px;
`;

const ConfigurationDescriptionTitle = styled.div`
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;

const ConfigurationDescriptionSingle = styled.div`
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.gray_dark};
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
