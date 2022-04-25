import React, { memo } from 'react';

import { PARAMETER_SKIM } from 'constants/common';

import FieldComponent from 'components/DynamicParameter_Experiment/FieldComponent';
import SwitchComponent from 'components/DynamicParameter_Experiment/SwtichComponent';
import ChoiceComponent from 'components/DynamicParameter_Experiment/ChoiceComponent';

const fieldStyle = {
	// background: 'red'
};
const selectStyle = {
	width: '120px',
	height: '28px',
};

const DlgAlgorithmDynamicTabularParam = memo((props) => {
	const { id, paramData, setParamsValue, checked } = props;
	const widget = paramData.widget;

	const ChildComponent = () => {
		switch (widget) {
			case PARAMETER_SKIM.FIELD:
				return (
					<FieldComponent
						id={id}
						disabled={checked}
						paramData={paramData}
						setParamsValue={setParamsValue}
						style={fieldStyle}
					/>
				);
				break;
			case PARAMETER_SKIM.SWITCH:
				return (
					<SwitchComponent
						id={id}
						disabled={checked}
						paramData={paramData}
						setParamsValue={setParamsValue}
						style={fieldStyle}

					/>
				);
				break;
			case PARAMETER_SKIM.CHOICE:
				return (
					<ChoiceComponent
						id={id}
						disabled={checked}
						paramData={paramData}
						setParamsValue={setParamsValue}
						style={selectStyle}

					/>
				);
				break;
			default:
				return null;
				break;
		}
	};
	return (<ChildComponent />);
});
export default DlgAlgorithmDynamicTabularParam;
