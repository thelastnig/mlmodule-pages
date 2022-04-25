import React from 'react';
import styled from 'styled-components';
import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

const RadioButton = (props) => {
	const { data, name, children, selected, onClick, disabled, tooltipText } = props;

	const tooltipId = uuid();

	const RadioClick = (e) => {
		if (disabled) {
			return;
		}
		onClick && onClick(e, data);
	};
	return (
		<RadioWrapper onClick={RadioClick} data-tip data-for={tooltipId}>
			<Label disabled={disabled}>
				<Input name={name} type="radio" checked={selected} readOnly={true} />
				<Mark />
				{children}
			</Label>
			{tooltipText && (
				<Tooltip id={tooltipId} text={tooltipText}/>
			)}
		</RadioWrapper>
	);
};

export default RadioButton;



const RadioWrapper = styled.div`
	display: inline-block;
`;

const Mark = styled.span`
	display: inline-block;
	position: relative;
	border: 1px solid #d2d7db;
	width: 20px;
	height: 20px;
	left: 0;
	border-radius: 50%;
	margin-right: 5px;
	vertical-align: middle;
	background: #d2d7db;
	&::after {
		content: '';
		display: block;
		width: 0;
		height: 0;
		border-radius: 50%;
		background-color: #005cb5;
		opacity: 0;
		left: 50%;
		top: 50%;
		position: absolute;
		transition: all 110ms;
	}
`;

const Input = styled.input`
	position: absolute;
	visibility: hidden;
	display: none;
	&:checked + ${Mark} {
		&::after {
			width: 10px;
			height: 10px;
			opacity: 1;
			left: 23%;
			top: 23%;
		}
	}
`;

const Label = styled.label`
	display: flex;
	cursor: pointer;
	position: relative;
	${(props) =>
		props.disabled &&
		`
      	cursor: not-allowed;
      	opacity: 0.4;
    `
	}
`;
