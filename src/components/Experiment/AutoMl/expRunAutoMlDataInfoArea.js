import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Spacer from 'components/spacer';
import { DataArea, DataInputBox, DataName, DataTitle, Divider, InfoTitle, StyledInput } from 'views/expRunAutoML';
import { AutoMlContext } from 'views/expRunAutoML';
import EditButton from 'components/Experiment/AutoMl/EditButton';

import Tooltip from 'components/common/Tooltip';

export default function AutoMlDataInfoArea(props) {
	const { dataset_info } = props;

	const [percentOk, setPercentOk] = useState(true);

	const { trainValue, setTrainValue, validationValue, setValidationValue, testValue, setTestValue } = useContext(AutoMlContext);

	const [isEdit, setIsEdit] = useState(false);

	const onClickedEditBtn = () => {
		setIsEdit(!isEdit);
	};

	useEffect(() => {
		let Training = isNaN(parseInt(trainValue)) ? 0 : parseInt(trainValue);
		let Validation = isNaN(parseInt(validationValue)) ? 0 : parseInt(validationValue);
		let TestSplit = isNaN(parseInt(testValue)) ? 0 : parseInt(testValue);

		if (Training + Validation + TestSplit === 100) {
			setPercentOk(true);
		} else {
			setPercentOk(false);
		}
	}, [trainValue, validationValue, testValue]);

	const onChangeTrainValue = (e) => {
		let value = e.target.value;
		setTrainValue(value);
	};
	const onChangeValidationValue = (e) => {
		let value = e.target.value;
		setValidationValue(value);
	};
	const onChangeTestValue = (e) => {
		let value = e.target.value;
		setTestValue(value);
	};

	return (
		<DataInfoArea>
			<InfoTitle>
				<div style={{ width: '154px', height: '20px', marginRight: '140px' }}>Data</div>
				<EditButton isEdit={isEdit} onClickedEditBtn={onClickedEditBtn} saveDisabled={!percentOk} />
			</InfoTitle>
			<DataArea>
				<DataTitle>Name</DataTitle>
				<Spacer size={'sm'} />
				<DataName>{dataset_info.dataset_nm}</DataName>
				<Spacer size={'lg'} />
				<Divider />
				<ErrorLineArea>{!percentOk && <ErrorLine>Training, Validation, Test의 합은 100이어야만 합니다.</ErrorLine>}</ErrorLineArea>
				<DataSingleLine data-tip data-for={'automl_train_tooltip'}>
					<DataTitle>Train</DataTitle>
					<DataInputBox readOnly={!isEdit}>
						<StyledInput value={trainValue} onChange={onChangeTrainValue} maxLength={2} readOnly={!isEdit} />
						<div>%</div>						
					</DataInputBox>
					{!isEdit && (
						<Tooltip id={'automl_train_tooltip'} text={'Edit을 눌러 변경 후, Save 버튼을 클릭하세요.'}/>
					)}						
				</DataSingleLine>
				<DataSingleLine data-tip data-for={'automl_validation_tooltip'}>
					<DataTitle>Validation</DataTitle>
					<DataInputBox readOnly={!isEdit}>
						<StyledInput value={validationValue} onChange={onChangeValidationValue} maxLength={2} readOnly={!isEdit} />
						<div>%</div>						
					</DataInputBox>
					{!isEdit && (
						<Tooltip id={'automl_validation_tooltip'} text={'Edit을 눌러 변경 후, Save 버튼을 클릭하세요.'}/>
					)}
				</DataSingleLine>
				<DataSingleLine data-tip data-for={'automl_test_tooltip'}>
					<DataTitle>Test</DataTitle>
					<DataInputBox readOnly={!isEdit}>
						<StyledInput value={testValue} onChange={onChangeTestValue} maxLength={2} readOnly={!isEdit} />
						<div>%</div>						
					</DataInputBox>
					{!isEdit && (
						<Tooltip id={'automl_test_tooltip'} text={'Edit을 눌러 변경 후, Save 버튼을 클릭하세요.'}/>
					)}
				</DataSingleLine>
			</DataArea>
		</DataInfoArea>
	);
}

const DataInfoArea = styled.div`
	width: 100%;
	height: 261px;
	padding: 0;
	border: solid 1px #eaebec;
`;

const ErrorLine = styled.div`
	font-size: 10px;
	text-align: right;
	color: red;
`;

const ErrorLineArea = styled.div`
	height: 12px;
`;

const DataSingleLine = styled.div`
	display: flex;
	align-items: center;
	height: 28px;
	margin-top: 7px;
	justify-content: space-between;
`;
