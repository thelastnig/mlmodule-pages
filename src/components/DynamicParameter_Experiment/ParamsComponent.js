import React, { memo } from 'react';

import { PARAMETER_SKIM } from 'constants/common';

import FieldComponent from 'components/DynamicParameter_Experiment/FieldComponent';
import SwitchComponent from 'components/DynamicParameter_Experiment/SwtichComponent';
import ChoiceComponent from 'components/DynamicParameter_Experiment/ChoiceComponent';
import MultiChoiceComponent from 'components/DynamicParameter_Experiment/MultiChoiceComponent';

const ParamsComponent = memo((props) => {
	const { id, paramData, setParamsValue } = props;
	const widget = paramData.widget;

	const ChildComponent = () => {
		switch (widget) {
			case PARAMETER_SKIM.FIELD:
				return <FieldComponent id={id} paramData={paramData} setParamsValue={setParamsValue} />;
				break;
			case PARAMETER_SKIM.SWITCH:
				return <SwitchComponent id={id} paramData={paramData} setParamsValue={setParamsValue} />;
				break;
			case PARAMETER_SKIM.CHOICE:
				return <ChoiceComponent id={id} paramData={paramData} setParamsValue={setParamsValue} />;
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
		<div>
			<ChildComponent />
		</div>
	);
});

export default ParamsComponent;
