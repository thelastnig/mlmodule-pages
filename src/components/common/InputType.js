import React from 'react';
import styled from 'styled-components';

import { text_black } from 'styles/colors';
import { INPUT_TYPE } from 'constants/common';
import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

const InputType = (props) => {
	const {
		style,
		type,
		// min = 0,
		max = 100,
		minValue,
		maxValue,
		value,
		setValue,
		disabled,
		tooltipText,
	} = props;

	const tooltipId = uuid();

	const onChangeValue = (e) => {
		let value = e.target.value;
		switch (type) {
			case INPUT_TYPE.NUMBER:
				value = value.replace(/[^0-9]/gi, '');
				if (maxValue && parseInt(value) > maxValue) {
					value = maxValue;
				}
				break;
			case INPUT_TYPE.NUMBER_INT:
				value = value.replace(/[^0-9]/gi, '');
				if (maxValue && parseInt(value) > maxValue) {
					value = maxValue;
				}
				if (minValue && parseInt(value) < minValue) {
					value = '';
				}
				break;
			case INPUT_TYPE.NUMBER_FLOAT:
				value = value.replace(/[^0-9.]/gi, '');
				//소수점 앞에 2자리 숫자 나오는것 제거
				if (value.length === 2) {
					if (value !== '0.') {
						value = '0.';
						break;
					}
				}
				//소수점 4자리까지 표시
				if (value.length > 6) {
					value = value.slice(0, -1);
				}
				if (maxValue && parseFloat(value) > maxValue) {
					value = maxValue;
				}
				break;
			default:
				break;
		}
		setValue(value);
	};

	return (
		<span data-tip data-for={tooltipId}>
			<CustomInput style={style} className={'mr12'} type={'text'} value={value} onChange={onChangeValue} maxLength={max} disabled={disabled} data-tip data-for={tooltipId}/>
			{tooltipText && (
				<Tooltip id={tooltipId} text={tooltipText}/>
			)}
		</span>
	);
};
export default InputType;

const CustomInput = styled.input`
	width: 80px;
	height: 36px;
	font-size: 14px;
	color: ${text_black};
	text-align: center;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
`;
