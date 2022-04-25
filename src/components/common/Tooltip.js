import React from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

import { colors } from 'styles';

import { useCommonState } from 'store/common/hooks';

const Tooltip = (props) => {
	const { id, text } = props;
	const { isToolTipHide } = useCommonState();

	const texts = text ? text.split('\n') : ['내용없음'];

	return (
		<>
			{!isToolTipHide && text !== '' && (
				<ReactTooltip id={id} effect="solid">
					{texts &&
						texts.length > 0 &&
						texts.map((text) => (
							<>
								<ToolTipComponent> {text} </ToolTipComponent>
								<br />
							</>
						))}
				</ReactTooltip>
			)}
		</>
	);
};

const ToolTipComponent = styled.span`
	height: 17px;
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.bg_white};
	padding: 5px;
`;

export default Tooltip;
