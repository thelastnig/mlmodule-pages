import React, { memo, useContext } from 'react';

import { colors } from 'styles';
import { PARAMETER_SKIM } from 'constants/common';

import FieldComponent from 'components/DynamicParameter_Experiment/FieldComponent';
import SwitchComponent from 'components/DynamicParameter_Experiment/SwtichComponent';
import ChoiceComponent from 'components/DynamicParameter_Experiment/ChoiceComponent';
import MultiChoiceComponent from 'components/DynamicParameter_Experiment/MultiChoiceComponent';
import { AutoMlContext, DataSingleLine, DataTitle } from 'views/expRunAutoML';

const AlgorithmDynamicParam = memo((props) => {
	const { algorithm_id, id, paramData, setParamsValue, readOnly } = props;
	const widget = paramData.widget;

	const { algorithmListObj } = useContext(AutoMlContext);

	const ChildComponent = () => {
		let item = algorithmListObj[algorithm_id];
		let customValue = '';
		if (item) {
			customValue = item[id];
		}
		switch (widget) {
			case PARAMETER_SKIM.FIELD:
				return (
					<FieldComponent
						id={id}
						customValue={customValue}
						paramData={paramData}
						setParamsValue={setParamsValue}
						readOnly={readOnly}
						style={readOnly ? fieldStyle_readOnly : fieldStyle}
					/>
				);
				break;
			case PARAMETER_SKIM.SWITCH:
				return (
					<SwitchComponent id={id} customValue={customValue} disabled={readOnly} paramData={paramData} setParamsValue={setParamsValue} />
				);
				break;
			case PARAMETER_SKIM.CHOICE:
				return (
					<ChoiceComponent
						id={id}
						customValue={customValue}
						disabled={readOnly}
						paramData={paramData}
						setParamsValue={setParamsValue}
						style={choiceStyle}
					/>
				);
				break;
			case PARAMETER_SKIM.MULTI_CHOICE:
				return <MultiChoiceComponent id={id} paramData={paramData} setParamsValue={setParamsValue} />;
				break;
			default:
				return <></>;
				break;
		}
	};

	return (
		<DataSingleLine>
			<DataTitle>{paramData.display_name}</DataTitle>
			<ChildComponent />
		</DataSingleLine>
	);
});
export default AlgorithmDynamicParam;

const fieldStyle = {
	width: '80px',
	height: '28px',
	padding: '5px 6px 5px 7px',
	borderRadius: '4px',
	border: 'solid 1px #ced4da',
	fontSize: '14px',
	fontWeight: 'normal',
	fontStretch: 'normal',
	fontStyle: 'normal',
	lineHeight: '18px',
	letterSacing: '-0.35px',
	textAlign: 'center',
	outline: 'none',
	color: `${colors.text_black}`,
};
const fieldStyle_readOnly = {
	width: '80px',
	height: '28px',
	padding: '5px 6px 5px 7px',
	borderRadius: '4px',
	border: 'solid 1px #004282',
	fontSize: '14px',
	fontWeight: 'normal',
	fontStretch: 'normal',
	fontStyle: 'normal',
	lineHeight: '18px',
	letterSacing: '-0.35px',
	textAlign: 'center',
	outline: 'none',
	color: `${colors.text_black}`,
};
const choiceStyle = {
	width: '80px',
	height: '28px',
	fontSize: '14px',
	color: `${colors.text_black}`,
};
