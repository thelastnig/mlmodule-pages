import React, { memo, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';

const overFlowStyle = {
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	display: 'block',
};

const TooltipComponent = memo((props) => {
	const { tooltip_key, children, text, disabled } = props;
	const element = useRef(null);
	const [hasEllipsis, setEllipsis] = useState(false);

	const clones = React.Children.map(children, (child) => {
		return React.cloneElement(child, { style: hasEllipsis ? overFlowStyle : {} });
	});

	useEffect(() => {
		if (!element.current) {
			return;
		}
		if (element.current.scrollWidth > element.current.offsetWidth) {
			setEllipsis(true);
		} else {
			setEllipsis(false);
		}
	}, [tooltip_key, text]);

	return (
		<TooltipWrapper
			ref={(el) => {
				element.current = el;
			}}
			data-tip
			data-for={tooltip_key}
		>
			{clones}
			{!disabled && hasEllipsis && (
				<ReactTooltip id={tooltip_key} effect="solid" place={'top'}>
					<div> {text}</div>
				</ReactTooltip>
			)}
		</TooltipWrapper>
	);
});
export default TooltipComponent;

const TooltipWrapper = styled.div``;
