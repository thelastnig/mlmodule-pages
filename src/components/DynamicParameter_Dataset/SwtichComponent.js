import React, { memo, useEffect, useState } from 'react';
import styled from 'styled-components';

import CheckBoxDefault from 'assets/icon/checkbox-default.png';
import CheckBoxSelect from 'assets/icon/checkbox-sel.png';

import Tooltip from 'components/common/Tooltip';

const SwitchComponent = memo((props) => {
	const { id, disabled, value, paramData, setParamsValue } = props;
	const [checked, setChecked] = useState(!!value);

	useEffect(() => {
		if (value === checked) {
			return;
		}
		setParamsValue(id, checked);
	}, [checked]);

	const handleChangeCheck = () => {
		if (disabled) {
			return;
		}
		setChecked(!checked);
	};

	return (
		<CheckboxContainer onClick={handleChangeCheck}>
			<HiddenCheckbox checked={checked} {...props} />
			<StyledCheckbox checked={checked}>
				<CheckIcon src={checked ? CheckBoxSelect : CheckBoxDefault} disabled={disabled} data-tip data-for={id} />
				<Tooltip id={id} text={paramData.description} />
			</StyledCheckbox>
		</CheckboxContainer>
	);
});
export default SwitchComponent;
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
