import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { finalMetricDataParser } from 'utils/graphUtil';


export const EvaluationMetticName = ({ data }) => {
	return (
		<>
			<ConfigurationItemTitle>Evaluator</ConfigurationItemTitle>
			{data && data.metricName && (
					<ConfigurationDescriptionTitle>{data.metricName[0].toUpperCase() + data.metricName.slice(1)}</ConfigurationDescriptionTitle>
			)}
			{data && data.isLoss && (
					<ConfigurationDescriptionTitle>loss</ConfigurationDescriptionTitle>
			)}
		</>
	);
};

export const EvaluationTraining = ({ data }) => {
	let parsedData = null;
	if (data) {
		parsedData = finalMetricDataParser(data.trainMetricData);
	};
	return (
		<>
			<ConfigurationItemTitle>Training</ConfigurationItemTitle>
			{parsedData && parsedData.metricKey && ( 
					<ConfigurationDescriptionTitle>{parsedData.metricKey}</ConfigurationDescriptionTitle>
			)}
			{parsedData && parsedData.lossKey && (
					<ConfigurationDescriptionTitle>{parsedData.lossKey}</ConfigurationDescriptionTitle>
			)}
		</>
	);
};

export const EvaluationValidation = ({ data }) => {
	let parsedData = null;
	if (data) {
		parsedData = finalMetricDataParser(data.valMetricData);
	};
	return (
		<>
			<ConfigurationItemTitle>Validation</ConfigurationItemTitle>
			{parsedData && parsedData.metricKey && ( 
					<ConfigurationDescriptionTitle>{parsedData.metricKey}</ConfigurationDescriptionTitle>
			)}
			{parsedData && parsedData.lossKey && (
					<ConfigurationDescriptionTitle>{parsedData.lossKey}</ConfigurationDescriptionTitle>
			)}
		</>
	);
};

export const EvaluationTest = ({ data }) => {
	let parsedData = null;
	if (data) {
		parsedData = finalMetricDataParser(data.testMetricData);
	};
	return (
		<>
			<ConfigurationItemTitle style={{ borderRight: '0px' }}>Test</ConfigurationItemTitle>
			{parsedData && parsedData.metricKey && ( 
					<ConfigurationDescriptionTitle style={{ borderRight: '0px' }}>{parsedData.metricKey}</ConfigurationDescriptionTitle>
			)}
			{parsedData && parsedData.lossKey && (
					<ConfigurationDescriptionTitle style={{ borderRight: '0px' }}>{parsedData.lossKey}</ConfigurationDescriptionTitle>
			)}
		</>
	);
};

export const EvaluationNone = () => {
	return (
		<>
		<EvaluationNoneTitleWrapper>
			<EvaluationNoneTitle>Evaluator</EvaluationNoneTitle>
			<EvaluationNoneTitle>Validation</EvaluationNoneTitle>
			<EvaluationNoneTitle>Training</EvaluationNoneTitle>
			<EvaluationNoneTitle className='last'>Test</EvaluationNoneTitle>
		</EvaluationNoneTitleWrapper>
		<EvaluationNoneText><div className="noneText">Not Available</div></EvaluationNoneText>
		</>
	);
};

const ConfigurationItemTitle = styled.div`
	background-color: #f8f9fa;
	line-height: 36px;
	padding-left: 15px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: -0.3px;
	border-right: 1px solid ${colors.gray_blue_gray};
`;

const ConfigurationDescriptionTitle = styled.div`
	width: 100%;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	white-space: nowrap;
	text-overflow: ellipsis;
	line-height: 36px;
	padding-left: 15px;
	border-right: 1px solid ${colors.gray_blue_gray};
	border-top: 1px solid ${colors.gray_blue_gray};
`;

const EvaluationNoneTitleWrapper = styled.div`
	display: flex;
`;

const EvaluationNoneTitle = styled.div`	
	width: 241px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	white-space: nowrap;
	text-overflow: ellipsis;
	line-height: 36px;
	padding-left: 15px;
	border-right: 1px solid ${colors.gray_blue_gray};
	background-color: #f8f9fa;

	&.last {
		width: 242px;
		border-right: none;
	}
`;

const EvaluationNoneText = styled.div`
	width: 100%;
	border-top: 1px solid ${colors.gray_blue_gray};
	display: flex;
	justify-content: center;
	align-items: center;

	.noneText {
		font-size: 14px;
		font-weight: normal;
		font-stretch: normal;
		font-style: normal;
		line-height: normal;
		letter-spacing: -0.3px;
		line-height: 36px;
	}
`;

