import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import CheckBoxDefault from 'assets/icon/checkbox-default.png';
import CheckBoxSelect from 'assets/icon/checkbox-sel.png';

export default function SwitchComponent(props) {
	const { id, setParamsValue, disabled, makeDefault, customValue } = props;

	const defaultValue = customValue ? customValue : 'False';
	const [checked, setChecked] = useState(defaultValue);

	useEffect(() => {
		if (makeDefault > 0) {
			makeDefaultValue();
		}
	}, [makeDefault]);
	const makeDefaultValue = () => {
		setChecked(defaultValue);
	};

	useEffect(() => {
		setParamsValue((prev) => {
			if (prev[id] !== checked && prev[id] !== 'hpo_check_metric') {
				let data = { ...prev };
				data[id] = checked;
				return data;
			} else {
				return prev;
			}
		});
	}, [checked]);

	const handleChangeCheck = () => {
		if (disabled) {
			return;
		}
		if (checked === 'True') {
			setChecked('False');
		} else {
			setChecked('True');
		}
	};

	return (
		<CheckboxContainer onClick={handleChangeCheck}>
			<HiddenCheckbox checked={checked === 'True' ? true : false} {...props} />
			<StyledCheckbox checked={checked === 'True' ? true : false}>
				<CheckIcon src={checked === 'True' ? CheckBoxSelect : CheckBoxDefault} disabled={disabled} />
			</StyledCheckbox>
		</CheckboxContainer>
	);
}
const CheckboxContainer = styled.div`
	display: inline-block;
	vertical-align: middle;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
	border: 0;
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
	display: none;
`;

const StyledCheckbox = styled.div`
	display: inline-block;
	width: 20px;
	height: 20px;
`;

const CheckIcon = styled.img`
	width: 20px;
	height: 20px;
	cursor: pointer;
	${(props) =>
		props.disabled &&
		`
      cursor: not-allowed;
    `}
`;
