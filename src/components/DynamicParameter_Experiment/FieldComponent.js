import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

const TYPES = {
	STRING: 'str',
	INT: 'int',
	FLOAT: 'float',
};

const checkRange = (value, range) => {
	if (range) {
		let maxValue = range[range.length - 1];
		if (maxValue !== 'Infinity') {
			if (value > maxValue) {
				return false;
			}
		}
	}
	return true;
};

const FieldComponent = memo((props) => {
	const { id, paramData, setParamsValue, style, readOnly, customValue, disabled, makeDefault } = props;
	const defaultValue = customValue ? customValue : paramData.default;
	const type = paramData.type;
	const [value, setValue] = useState(defaultValue);
	const range = paramData.range;

	useEffect(() => {
		if (makeDefault > 0) {
			makeDefaultValue();
		}
	}, [makeDefault]);
	const makeDefaultValue = () => {
		setValue(defaultValue);
	};
	useEffect(() => {
		setParamsValue((prev) => {
			if (prev[id] !== value && prev[id] !== 'hpo_check_metric') {
				let data = { ...prev };
				data[id] = value;
				return data;
			}
			return prev;
		});
	}, [value]);
	const onChangeHandler = (e) => {
		let value = e.target.value;
		let target = '';
		if (type === TYPES.INT) {
			if (e.target.validity.valid) {
				target = parseInt(value);
				if (isNaN(target)) {
					setValue('');
				} else {
					if (checkRange(target, range)) {
						setValue(target);
					}
				}
			}
		} else if (type === TYPES.FLOAT) {
			target = parseFloat(value);
			if (isNaN(target)) {
				setValue('');
			} else {
				if (checkRange(target, range)) {
					setValue(target);
				}
			}
		} else {
			setValue(value);
		}
	};
	return (
		<CustomInput
			style={style}
			readOnly={readOnly}
			disabled={disabled}
			type={type === TYPES.FLOAT ? 'number' : 'text'}
			step={type === TYPES.INT ? '1' : type === TYPES.FLOAT ? '0.1' : ''}
			pattern={type === TYPES.INT ? '[0-9]*' : ''}
			onChange={onChangeHandler}
			value={value}
			placeholder={paramData.description}
		/>
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
