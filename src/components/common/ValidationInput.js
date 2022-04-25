import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

export default function ValidationInput(props) {
	const { value, onChangeValue, errorText, style } = props;
	return (
		<InputComponent style={style}>
			<CustomInput className={'mr12'} hasError={errorText} type="text" value={value} onChange={onChangeValue} maxLength="40" />
			<ErrorText>{errorText}</ErrorText>
		</InputComponent>
	);
}

const InputComponent = styled.div`
	display: block;
	${(props) => props.style};
`;
const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
	${(props) =>
		props.hasError &&
		`
        border: solid 1.2px ${colors.fail};
      `}
`;
const ErrorText = styled.div`
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.fail};
	height: 20px;
	padding-top: 5px;
`;
