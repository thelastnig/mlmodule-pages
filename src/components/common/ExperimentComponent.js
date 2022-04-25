import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DataParser from 'utils/DataParser';

export const ExperimentDataSet = ({ dataSet, dataSplit }) => {
	return (
		<>
			<ConfigurationItemTitle>Data</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				{dataSplit && dataSet && dataSet.dataset_nm && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Name</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{dataSet && dataSet.dataset_nm}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{dataSplit && dataSplit.split_type === 'T' ? (
					<>
						<BetweenContent>
							<ConfigurationDescriptionTitle>Train</ConfigurationDescriptionTitle>
							<ConfigurationDescriptionSingle>
								<DataTrain data={dataSplit} />
							</ConfigurationDescriptionSingle>
						</BetweenContent>
						<BetweenContent>
							<ConfigurationDescriptionTitle>Validation</ConfigurationDescriptionTitle>
							<ConfigurationDescriptionSingle>
								<DataValidation data={dataSplit} />
							</ConfigurationDescriptionSingle>
						</BetweenContent>
						<BetweenContent>
							<ConfigurationDescriptionTitle>Test</ConfigurationDescriptionTitle>
							<ConfigurationDescriptionSingle>
								<DataTest data={dataSplit} />
							</ConfigurationDescriptionSingle>
						</BetweenContent>
					</>
				) : dataSplit && dataSplit.split_type === 'C' ? (
					'Cross - Validation'
				) : (
					''
				)}
			</ConfigurationItemDescription>
		</>
	);
};

export const ExperimentAlgorithm = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>Algorithm</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				{data && data.algorithm_nm && (
					<>
						<ConfigurationDescriptionTitle>Name</ConfigurationDescriptionTitle>
						<ConfigurationDescription>{data && data.algorithm_nm}</ConfigurationDescription>
					</>
				)}
				{data && data.complexity && (
					<>
						<ConfigurationDescriptionTitle>Size</ConfigurationDescriptionTitle>
						<ConfigurationDescription>
							<AlgorithmSize data={data} />
						</ConfigurationDescription>
					</>
				)}
			</ConfigurationItemDescription>
		</>
	);
};
export const AlgorithmSize = ({ data }) => {
	return (
		<>
			{data && (
				<>
					{(data) ? data.complexity : '-'}
					{data.hasOwnProperty('complexity') && data.complexity && (
						<span>
							{' '}
							X 10<sup>6</sup>
						</span>
					)}
				</>
			)}
		</>
	);
};
export const DataTrain = ({ data }) => {
	return (
		<>
			{data && (
				<>
					{data.split_training}
					{data.split_training && '(%)'}
				</>
			)}
		</>
	);
};
export const DataValidation = ({ data }) => {
	return (
		<>
			{data && (
				<>
					{data.split_validation}
					{data.split_validation && '(%)'}
				</>
			)}
		</>
	);
};
export const DataTest = ({ data }) => {
	return (
		<>
			{data && (
				<>
					{data.split_test}
					{data.split_test && '(%)'}
				</>
			)}
		</>
	);
};
const ParameterItem = (props) => {
	const { name, value } = props;
	return (
		<BetweenContent>
			<ConfigurationDescriptionTitle>{name}</ConfigurationDescriptionTitle>
			<ConfigurationDescriptionSingle>
				{/*{typeof value === "boolean" ? value ? 'True' : 'False' : value}*/}
				{typeof value === 'boolean' ? value.toString() : value}
			</ConfigurationDescriptionSingle>
		</BetweenContent>
	);
};
export const ExperimentParameter = ({ data, algorithm }) => {
	return (
		<>
			<ConfigurationItemTitle>Parameters</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				{algorithm
					? algorithm.parameter.map((param) => <ParameterItem name={param.display_name} value={data[param.name]} />)
					: data
					? Object.keys(data).map((key, index) =>
							key.includes('_hpo') || key.includes('_hrange') ? null : data[key] === 'hpo_check_metric' ? (
								<ParameterItem name={key + '(HPO)'} value={''} />
							) : (
								<ParameterItem name={key} value={data[key]} />
							),
					)
					: ''}
			</ConfigurationItemDescription>
		</>
	);
};

const parseSplit = (data) => {
	let type = data.split_type;
	let title = '';
	let value = '';
	if (type === 'T') {
		title = 'Train / Test / Validation';
		let training = parseInt(data.split_training);
		let test = parseInt(data.split_test);
		let validation = parseInt(data.split_validation);
		let total = training + test + validation;
		let trainging_p = (training / total) * 10;
		let test_p = (test / total) * 10;
		let validation_p = (validation / total) * 10;
		value = '(' + trainging_p + ':' + test_p + ':' + validation_p + ')';
	} else {
		title = 'Cross - Validation';
	}
	return title + value;
}

export const ExperimentDataSplit = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>Data</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				<ConfigurationDescriptionTitle>Split</ConfigurationDescriptionTitle>
				<ConfigurationDescription>{data && parseSplit(data)}</ConfigurationDescription>
			</ConfigurationItemDescription>
		</>
	);
};
export const ExperimentResource = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>Resources</ConfigurationItemTitle>
			<ConfigurationItemDescription>
				{data && data.preset_nm && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>Name</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.preset_nm}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>GPU</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{DataParser.parseGPU(data)}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>CPU</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{DataParser.parseCPU(data)}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
				{data && (
					<BetweenContent>
						<ConfigurationDescriptionTitle>RAM</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{DataParser.parseRAM(data)}</ConfigurationDescriptionSingle>
					</BetweenContent>
				)}
			</ConfigurationItemDescription>
		</>
	);
};
export const ExperimentHpoSettings = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>HPO Settings</ConfigurationItemTitle>
			<ConfigurationItemDescription style={{ borderRight: '0px' }}>
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
				{data && data.objective_metric_name && (
					<>
						<ConfigurationDescriptionTitle>Objective Metric Name</ConfigurationDescriptionTitle>
						<ConfigurationDescription>{data.objective_metric_name}</ConfigurationDescription>
					</>
				)}
				{data && data.additional_metric_name && (
					<>
						<ConfigurationDescriptionTitle>Additional Metric Name</ConfigurationDescriptionTitle>
						<ConfigurationDescriptionSingle>{data.additional_metric_name}</ConfigurationDescriptionSingle>
					</>
				)}
			</ConfigurationItemDescription>
		</>
	);
};

const ConfigurationDescription = styled.div`
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.gray_dark};
	padding: 4px 0;
`;

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
