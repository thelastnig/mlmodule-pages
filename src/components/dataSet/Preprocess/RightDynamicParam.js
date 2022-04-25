import React, { memo } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { PARAMETER_SKIM } from 'constants/common';
import FormatUtil from 'utils/FormatUtil';

import Spacer from 'components/spacer';
import FieldComponent from 'components/DynamicParameter_Dataset/FieldComponent';
import SwitchComponent from 'components/DynamicParameter_Dataset/SwtichComponent';
import ChoiceComponent from 'components/DynamicParameter_Dataset/ChoiceComponent';

const selectStyle = (isTemplateMode) => {
	return {
		width: '512px',
		height: '36px',
		backgroundColor: isTemplateMode ? '#f9f9f9' : '',
	};
};
const fieldStyle = {
	width: '512px',
	height: '36px',
	padding: '8px 40px 8px 16px',
	borderRadius: '4px',
	border: 'solid 1px #e1e2e3',
	backgroundColor: '#ffffff',
	fontSize: '14px',
	fontWeight: 'normal',
	color: '#1e1f22',
	'&:disabled': {
		background: '#f9f9f9',
		color: '#b8babd',
	},
	'&:active': {
		background: 'red',
	},
};
const RightDynamicParam = memo((props) => {
	const { id, paramData, disabled, paramsValue, setParamsValue } = props;
	const widget = paramData.widget;

	const _setParamsValue = (id, value) => {
		let result = paramsValue;
		result[id] = value;
		setParamsValue(result);
		// setParamsValue((prev) => {
		//   // let data = {...prev}
		//   if (prev[id] !== _value) {
		//     let data = {...prev}
		//     data[id] = _value
		//     return data
		//   }
		//   return prev
		// })
	};

	const ChildComponent = () => {
		switch (widget) {
			case PARAMETER_SKIM.FIELD:
				return (
					<FieldComponent
						key={id}
						id={id}
						disabled={disabled}
						value={!FormatUtil.isEmpty(paramsValue[id]) ? paramsValue[id] : ''}
						paramData={paramData}
						setParamsValue={_setParamsValue}
						style={fieldStyle}
					/>
				);
				break;
			case PARAMETER_SKIM.SWITCH:
				return <SwitchComponent id={id} disabled={disabled} value={paramsValue[id]} paramData={paramData} setParamsValue={_setParamsValue} />;
				break;
			case PARAMETER_SKIM.CHOICE:
				return (
					<ChoiceComponent
						id={id}
						disabled={disabled}
						value={paramsValue[id]}
						paramData={paramData}
						setParamsValue={_setParamsValue}
						style={selectStyle()}
					/>
				);
				break;
			// case PARAMETER_SKIM.MULTI_CHOICE:
			//   return (
			//     <MultiChoiceComponent
			//       id={id}
			//       paramData={paramData}
			//       setParamsValue={setParamsValue}
			//       style={selectStyle()}
			//     />
			//   )
			//   break;
			default:
				return <></>;
				break;
		}
	};
	return (
		<ParameterRow>
			<Label>{paramData.display_name}</Label>
			<Spacer size={'sm'} />
			<ChildComponent />
		</ParameterRow>
	);
});
export default RightDynamicParam;

const ParameterRow = styled.div`
	width: 100%;
	padding: 5px 0;
`;
const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
