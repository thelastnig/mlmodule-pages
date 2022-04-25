import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import agent from 'lib/apis';

import Spacer from 'components/spacer';
import RadioButton from 'component/RadioButton';
import { AnalyzeContext, BoxTitle } from 'views/Analyze';
import RightDynamicParam from 'components/dataSet/Preprocess/RightDynamicParam';
import StatusComponent from 'components/dataSet/Preprocess/StatusComponent';
import { checkIsRunning, checkIsAbort } from 'views/expRun';
import MethodAbout from 'components/dataSet/MethodAbout';
import Button from 'component/Button';

const RightComponent = (props) => {
	const { paramsValue, setParamsValue } = props;

	const {
		detail,
		setShowResult,
		method,
		setMethod,
		applyClicked,
		stopClicked,
		status,
		methodParameter,
		setMethodParameter,
		makeDefault,
		defaultCnt,
	} = useContext(AnalyzeContext);
	const [list, setList] = useState([]);

	const defaultClicked = () => {
		makeDefault();
	};

	const fetchAnalyticMethodList = () => {
		let params = {};
		agent
			.getAnalyticMethodList(params)
			.then((response) => {
				console.log('then response = ', response);
				const { list } = response.data;
				setList(list);
				setMethod(list[0]);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (method) {
			setMethodParameter(method.analyze_default_parameters);
		}
	}, [method]);

	useEffect(() => {
		if (!detail) {
			return;
		}
		fetchAnalyticMethodList();
	}, [detail]);

	return (
		<>
			<RightContainer>
				<BoxTitle>Choose Analyze Method</BoxTitle>
				<Spacer />
				<Label>Dim, Reduction</Label>
				<Spacer size={'lg'} />
				<FlexBox>
					<RadioButton
						selected={list.length > 0 && method === list[0]}
						disabled={checkIsRunning(status)}
						onClick={(e) => {
							setParamsValue({});
							setMethod(list[0]);
						}}
					/>
					<MethodName>{list.length > 0 && list[0].analyze_call_function}</MethodName>
				</FlexBox>

				<Spacer />
				<Spacer />

				<Label>Clustering</Label>
				<Spacer size={'lg'} />
				<FlexBox>
					<RadioButton
						selected={list.length > 0 && method === list[1]}
						disabled={checkIsRunning(status)}
						onClick={(e) => {
							setParamsValue({});
							setMethod(list[1]);
						}}
					/>
					<MethodName>{list.length > 0 && list[1].analyze_call_function}</MethodName>
				</FlexBox>

				<MethodAbout value={method.analyze_description} />
				<BoxTitle>Parameter</BoxTitle>
				<DynamicParamArea>
					{methodParameter &&
						methodParameter.map((param) => (
							<RightDynamicParam
								key={param.name}
								disabled={checkIsRunning(status)}
								id={param.name}
								paramData={param}
								defaultCnt={defaultCnt}
								paramsValue={paramsValue}
								setParamsValue={setParamsValue}
							/>
						))}
				</DynamicParamArea>
				<Buttons>
					{!checkIsRunning(status) && (
						<>
							<Button
								colorType={'whiteBlue'}
								size={'xsmall'}
								onClick={(e) => defaultClicked()}>
								Initialize
							</Button>
						</>
					)}
					<Button
						colorType={'whiteBlue'}
						size={'xsmall'}
						onClick={applyClicked}
						disabled={checkIsRunning(status) || checkIsAbort(status)}>
							Apply
					</Button>
					<Button
						colorType={'whiteBlue'}
						size={'xsmall'}
						onClick={(e) => setShowResult(true)}>
							Result
					</Button>
					{checkIsRunning(status) && (
						<Button
							colorType={'whiteBlue'}
							size={'xsmall'}
							onClick={stopClicked}>
								Stop
						</Button>
					)}
					<Spacer />
					<StatusComponent type={'analyze'} status={status} />
				</Buttons>
			</RightContainer>
		</>
	);
};
export default RightComponent;

const DynamicParamArea = styled.div`
	width: 100%;
	height: 305px;
	overflow-y: overlay;
	margin-bottom: 5px;
`;

const MethodName = styled.div`
	width: 472px;
	height: 36px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1px #ced4da;
`;
const Buttons = styled.div`
	display: flex;
`;

const RightContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;
const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
const FlexBox = styled.div`
	display: flex;
	height: 36px;
	width: 100%;
	align-items: center;
`;
