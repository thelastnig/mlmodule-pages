import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { uuid } from 'uuidv4';

import { colors } from 'styles';
import Tooltip from 'components/common/Tooltip';
import TooltipCustom from 'components/common/TooltipCustom';

export default function Button({ children, colorType, size, onClick, iconSrc, disabled, tooltipText, guideText, handleOnClickClose, isMustShowGuideTxt, ...rest }) {
	const tooltipId = uuid();
	const buttonRef = useRef();

	return (
		<div data-tip data-for={tooltipId} ref={buttonRef}>
			<StyledButton colorType={colorType} size={size} onClick={onClick} disabled={disabled} {...rest}>
				{children}
				{iconSrc && (
					<ButtonImage src={iconSrc} alt={children} />
				)}
			</StyledButton>
			{guideText && (				
				<TooltipCustom text={guideText} parent={buttonRef} isUpSide={true} margin={1} handleOnClickClose={handleOnClickClose} isMustShow={isMustShowGuideTxt} />				
			)}
			{tooltipText && (
				<Tooltip id={tooltipId} text={tooltipText}/>
			)}
		</div>
	);
};

Button.defaultProps = {
	colorType: 'blue',
	size: 'large',
}

const commonBtn = css`
	margin: 0 4px;
	border-radius: 2px;
	outline: none;
	border: none;
	display: flex;
	font-family: NotoSans;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	justify-content: space-evenly;
	align-items: center;
	cursor: pointer;
	:disabled {
		cursor: not-allowed;
	}
`;

const blueBtn = css`
    color: ${colors.bg_white};
	background-color: ${colors.light_blue};
	&:hover:not([disabled]) {
		background: ${colors.blue_hover};
	}
	&:active:not([disabled]) {
		background: ${colors.blue_press};
	}
	:disabled {
		background: ${colors.light_blue_disabled};
	}
`;

const grayBtn = css`
	color: ${colors.text_black};
	background-color: ${colors.button_gray_bg};
	&:hover:not([disabled]) {
		background: ${colors.button_gray_bg_hover};
	}
	&:active:not([disabled]) {
		background: ${colors.button_gray_bg_press};
	}
	:disabled {
		opacity: 0.4;
	}
`;

const lightGrayBtn = css`
	color: ${colors.light_blue};
	background-color: ${colors.button_gray_bg};
	&:hover:not([disabled]) {
		background: ${colors.button_gray_bg};
	}
	&:active:not([disabled]) {
		background: ${colors.button_white_bg_press};
	}
	:disabled {
		opacity: 0.4;
	}
`;

const whiteBlueBtn = css`
	color: ${colors.light_blue};
	background-color: ${colors.bg_white};
	border-radius: 2px;
	border: solid 1px ${colors.light_blue};
	:hover {
		color: #ffffff;
		background-color: ${colors.blue_hover};
	}
	:active {
		color: #ffffff;
		background-color: ${colors.blue_press};
	}
	:disabled {
		color: #ffffff;
		border: solid 1px ${colors.button_disabled_bg};
		cursor: not-allowed;
		background: ${colors.button_disabled_bg};
	}
`;

const redBtn = css`
	color: ${colors.bg_white};
	background-color: ${colors.fail};
`;

const cancelBtn = css`
	color: ${colors.button_cancel_color};
	background-color: transparent;
	:hover {
		background: ${colors.button_cancel_bg_hover};
	}
	:active {
		background: ${colors.button_cancel_bg_press};
	}
	:disabled {
		background: ${colors.button_cancel_bg_disabled};
	}
`;

const brandDark = css`
	color: ${colors.bg_white};
	background-color: ${colors.brand_dark};
`;

const sizes = {
	fullWidth: {
		width: '100%',
		height: '40px',
	},
	xlarge: {
		width: '220px',
		height: '40px',
	},
	large: {
		width: '168px',
		height: '40px',
	},
	mediumLarge: {
		width: '144px',
		height: '40px',
	},
	medium: {
		width: '140px',
		height: '40px',
	},
	small: {
		width: '120px',
		height: '40px',
	},
	xsmall: {
		width: '100px',
		height: '40px',
	},
	lowLarge: {
		width: '120px',
		height: '32px',
	},
	lowMedium: {
		width: '100px',
		height: '32px',
	},
	lowSmall: {
		width: '60px',
		height: '32px',
	},
	iconLarge: {
		width: '40px',
		height: '40px',
	},
	iconSmall: {
		width: '20px',
		height: '20px',
	}
}

const sizeStyles = css`
	${({ size }) => css`
		width: ${sizes[size].width};
		height: ${sizes[size].height};
		margin: ${sizes[size].margin};
	`}
`;

const colorTypes = {
	blue: blueBtn,
	gray: grayBtn,
	lightGray: lightGrayBtn,
	whiteBlue: whiteBlueBtn,
	red: redBtn,
	cancel: cancelBtn,
	brandDark: brandDark,
};

const colorStyles = css`
	${({ colorType }) => css`
		${colorTypes[colorType]};
	`}
`;

const StyledButton = styled.button`
	${commonBtn}
	${colorStyles}
	${sizeStyles}
`;

const ButtonImage = styled.img`
	width: 20px;
	vertical-align: middle;
`;