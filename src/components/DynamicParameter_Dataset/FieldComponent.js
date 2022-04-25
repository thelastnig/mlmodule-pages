import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import Tooltip from 'components/common/Tooltip';

const TYPES = {
	STRING: 'str',
	INT: 'int',
	FLOAT: 'float',
};

const checkRange = (value, range) => {
	if (range) {
		// let minValue = range[0]
		let maxValue = range[1];
		// if (minValue != '-Infinity') {
		//   if (value < minValue) {
		//     return false
		//   }
		// }
		if (maxValue !== 'Infinity') {
			if (value > maxValue) {
				return false;
			}
		}
	}
	return true;
};

const FieldComponent = memo((props) => {
	const { id, paramData, style, readOnly, disabled, value, setParamsValue } = props;
	const type = paramData.type;

	const [_value, _setValue] = useState(value);
	const range = paramData.range;

	useEffect(() => {
		setParamsValue(id, _value);
	}, [_value]);

	const onChangeHandler = (e) => {
		let value = e.target.value;
		let target = '';
		if (type === TYPES.INT) {
			if (e.target.validity.valid) {
				target = parseInt(value);
				if (isNaN(target)) {
					_setValue('');
				} else {
					if (checkRange(target, range)) {
						_setValue(target);
					}
				}
			}
		} else if (type === TYPES.FLOAT) {
			target = parseFloat(value);
			if (isNaN(target)) {
				_setValue('');
			} else {
				if (checkRange(target, range)) {
					_setValue(target);
				}
			}
		} else {
			_setValue(value);
		}
	};

	return (
		<>
			<CustomInput
				key={id}
				style={style}
				readOnly={readOnly}
				disabled={disabled}
				type={type === TYPES.FLOAT ? 'number' : 'text'}
				step={type === TYPES.INT ? '1' : type === TYPES.FLOAT ? '0.1' : ''}
				pattern={type === TYPES.INT ? '[0-9]*' : ''}
				onChange={onChangeHandler}
				value={_value}
				placeholder={paramData.description}
				data-tip
				data-for={id}
			/>
			<Tooltip id={id} text={paramData.description} />
		</>
	);
});
export default FieldComponent;

const CustomInput = styled.input`
	width: 120px;
	height: 28px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5 !important;
	}
`;
