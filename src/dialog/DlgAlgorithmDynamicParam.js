import React, { memo } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { PARAMETER_SKIM } from 'constants/common';

import FieldComponent from 'components/DynamicParameter_Experiment/FieldComponent';
import SwitchComponent from 'components/DynamicParameter_Experiment/SwtichComponent';
import ChoiceComponent from 'components/DynamicParameter_Experiment/ChoiceComponent';
import MultiChoiceComponent from 'components/DynamicParameter_Experiment/MultiChoiceComponent';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

export const getToolTipTextByName = (alName) => {
	switch(alName) {
		case 'batch_size':
			return '한번에 학습하는 데이터 묶음 단위이며, 2의 배수로 지정. 클수록 학습이 빠르지만, GPU 메모리를 많이 차지합니다.';
		case 'epoch':
			return '전체 데이터의 반복 학습 횟수. 클수록 성능이 향상되지만 과적합에 주의해야 합니다.';
		case 'learning_rate':
			return '학습률. 경사하강법에 따라 파라미터를 조정하는 정도를 결정합니다.';
		case 'momentum':
			return '경사하강법에 따라 파라미터를 조정할 때 반영할 관성의 정도를 결정합니다.';
		case 'weight_decay':
			return '학습시 가중치 파라미터의 값이 급격하게 증가하는 것을 막기 위한 감쇠계수입니다.'
		default:
			return '';
	}
}

const fieldStyle = {
	// background: 'red'
};
const selectStyle = {
	width: '120px',
	height: '28px',
};
const DlgAlgorithmDynamicParam = memo((props) => {
	const { id, paramData, setParamsValue } = props;
	const widget = paramData.widget;

	const tooltipId = uuid();

	const ChildComponent = () => {
		switch (widget) {
			case PARAMETER_SKIM.FIELD:
				return <FieldComponent id={id} paramData={paramData} setParamsValue={setParamsValue} style={fieldStyle} />;
				break;
			case PARAMETER_SKIM.SWITCH:
				return <SwitchComponent id={id} paramData={paramData} setParamsValue={setParamsValue} />;
				break;
			case PARAMETER_SKIM.CHOICE:
				return <ChoiceComponent id={id} paramData={paramData} setParamsValue={setParamsValue} style={selectStyle} />;
				break;
			case PARAMETER_SKIM.MULTI_CHOICE:
				return <MultiChoiceComponent id={id} paramData={paramData} setParamsValue={setParamsValue} style={selectStyle} />;
				break;
			default:
				return <></>;
				break;
		}
	};

	return (
		<TableRowParameter>
			<TD_1_NAME data-tip data-for={tooltipId}>
				{paramData.display_name}
				{getToolTipTextByName(paramData.display_name) && (
					<Tooltip id={tooltipId} text={getToolTipTextByName(paramData.display_name)}/>
				)}
			</TD_1_NAME>
			<ChildComponent />
		</TableRowParameter>
	);
});
export default DlgAlgorithmDynamicParam;

const TableRowParameter = styled.div`
	width: 930px;
	height: 36px;
	margin: 1px 0 0;
	padding: 2px 0;
	font-size: 13px;
	color: ${colors.text_black};
	display: flex;
	align-items: center;
`;
const TD_1_NAME = styled.div`
	width: 428px;
	padding-left: 20px;
	color: #82878b;
`;
