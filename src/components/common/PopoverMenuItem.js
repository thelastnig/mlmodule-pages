import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Tooltip from 'components/common/Tooltip';

const PopoverMenuItem = (props) => {
	const { index, text, onClick, disabled, tooltip } = props;

	return (
		<div data-tip data-for={'tooltip' + index}>
			<MenuItem key={index} onClick={onClick} disabled={disabled}>
				{text}
			</MenuItem>
			{tooltip && <Tooltip id={'tooltip' + index} text={tooltip} />}
		</div>
	);
};

export default PopoverMenuItem;

const MenuItem = styled.div`
	${(props) =>
		props.disabled &&
		`
            opacity: 0.25;
            pointer-events: none;
        `}
	height: 36px;
	padding: 0 8px;
	line-height: 36px;
	color: ${colors.gray_dark};
	font-size: 14px;
	letter-spacing: -0.35px;
	&:hover {
		color: ${colors.text_black};
		border-radius: 2px;
		background-color: rgba(0, 66, 130, 0.1);
		cursor: pointer;
	}
`;
