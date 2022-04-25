import React, { memo, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import agent from 'lib/apis';

import Spacer from 'components/spacer';
import Button from 'component/Button';
import SelectCustom from 'components/common/SelectCustom';
import { checkIsRunning, checkIsAbort } from 'views/expRun';
import { BoxTitle, PreprocessContext } from 'views/PreProcess';
import PreprocessResult from 'component/dialog/PreprocessResult';
import RightDynamicParam from 'components/dataSet/Preprocess/RightDynamicParam';
import MethodAbout from 'components/dataSet/MethodAbout';
import StatusComponent from 'components/dataSet/Preprocess/StatusComponent';

const RightComponent = memo((props) => {
	const { paramsValue, setParamsValue } = props;

	const {
		isTabular,
		detail,
		isTemplateMode,
		showResult,
		setShowResult,
		applyClicked,
		stopClicked,
		preprocess_nm,
		preprocess_status,
		method,
		setMethod,
		status,
		selectHistory,
		methodParameter,
		setMethodParameter,
		makeDefault,
		defaultCnt,
	} = useContext(PreprocessContext);

	const [list, setList] = useState([]); // method list

	useEffect(() => {
		let method = list.find((v) => {
			return v.preprocess_nm === preprocess_nm;
		});
		method && setMethod(method);
	}, [preprocess_nm, list]);

	const defaultClicked = () => {
		makeDefault();
	};

	useEffect(() => {
		if (list.length > 0) {
			if (preprocess_status) {
				return;
			}
			if (selectHistory) {
				const { pipeline_algorithm } = selectHistory;
				let method = list.find((v) => {
					return v.preprocess_nm === pipeline_algorithm;
				});
				const { pipeline_parameters } = selectHistory;

				setMethod(method);
				setMethodParameter(pipeline_parameters);
				makeDefault(pipeline_parameters);
			} else {
				setMethod(list[0]);
				makeDefault(list[0].preprocess_default_parameters);
				setMethodParameter(list[0].preprocess_default_parameters);
			}
		}
	}, [selectHistory, list]);

	const fetchPreprocessMethodList = () => {
		let params = {
			data_type: isTabular ? 'tabular' : 'image',
		};
		agent
			.getPreprocessMethodList(params)
			.then((response) => {
				console.log('then response = ', response);
				const { list } = response.data;
				setList(list);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (!detail) {
			return;
		}
		fetchPreprocessMethodList();
	}, [detail]);

	const methodChanged = (method) => {
		setParamsValue({});
		makeDefault(method.preprocess_default_parameters);
		setMethod(method);
		setMethodParameter(method.preprocess_default_parameters);
	};

	return (
		<>
			<PreprocessResult show={showResult} toggle={setShowResult} />
			<RightContainer>
				<BoxTitle>Choose Preprocess Method</BoxTitle>
				<Spacer />
				{
					<>
						<div style={{ width: '512px' }}>
							<SelectCustom
								isDisabled={checkIsRunning(status) || isTemplateMode}
								styleOptions={{
									width: '512px',
									height: '36px',
									backgroundColor: isTemplateMode ? '#f9f9f9' : '',
									color: 'black',
								}}
								isLoading={false}
								isClearable={false}
								isRtl={false}
								isSearchable={false}
								disabledColor={true}
								options={list}
								getOptionLabel={(option) => option.preprocess_nm}
								getOptionValue={(option) => option.preprocess_nm}
								onChange={methodChanged}
								value={method}
								label_key={'preprocess_nm'}
								value_key={'preprocess_nm'}
								isRemovePrefixCurrent={true}
							/>
						</div>
						<MethodAbout value={method.preprocess_description} />
						<BoxTitle>Parameter</BoxTitle>
						<DynamicParamArea>
							{methodParameter &&
								methodParameter.map((param, index) => (
									<RightDynamicParam
										key={param.name}
										disabled={checkIsRunning(status) || isTemplateMode}
										id={param.name}
										paramData={param}
										defaultCnt={defaultCnt}
										paramsValue={paramsValue}
										setParamsValue={setParamsValue}
									/>
								))}
						</DynamicParamArea>
					</>
				}

				<>
					{/*TODO 일정으로 인한 정책변경으로 해당 체크박스 주석*/}
					{/*<AddDatalistArea>*/}
					{/*  <div>Add to Datalist</div>*/}
					{/*  <Spacer/>*/}
					{/*  <Checkbox*/}
					{/*    disabled={checkIsRunning(status)}*/}
					{/*    checked={addDatalist}*/}
					{/*    onChange={e => onChangeAddDatalist()}*/}
					{/*  />*/}
					{/*</AddDatalistArea>*/}

					<Spacer />
					<Spacer />

					<Buttons>
						{!isTemplateMode && !checkIsRunning(status) && (
							<Button 
								colorType={'whiteBlue'} 
								size={'xsmall'} 
								onClick={defaultClicked}
								tooltipText={'전처리 Parameter의 변수를 초기화합니다.'}
							>
								Initialize
							</Button>
						)}
						<Button
							colorType={'whiteBlue'}
							size={'xsmall'}
							disabled={checkIsRunning(status) || checkIsAbort(status)}
							onClick={applyClicked}
							tooltipText={'선택한 전처리를 적용합니다.'}
						>
							Apply
						</Button>
						<Button
							colorType={'whiteBlue'}
							size={'xsmall'}
							onClick={(e) => setShowResult(true)}
							tooltipText={'전처리 완료 후 결과를 확인합니다.'}
						>
							Result
						</Button>
						{checkIsRunning(status) && (
							<Button
								colorType={'whiteBlue'}
								size={'xsmall'}
								onClick={stopClicked}
							>
								Stop
							</Button>
						)}
						<Spacer />
						<StatusComponent type={'preprocess'} status={status} />
					</Buttons>
				</>
			</RightContainer>
		</>
	);
});
export default RightComponent;

const DynamicParamArea = styled.div`
	width: 100%;
	height: 370px;
	overflow-y: overlay;
	margin-bottom: 5px;
`;
const RightContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;
const Buttons = styled.div`
	display: flex;
`;
