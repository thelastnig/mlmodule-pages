import React from 'react';
import styled from 'styled-components';

const Spacer = ({ size = 'md' }) => {
	let s;
	switch (size) {
		case 'xl':
			s = '24';
			break;
		case 'lg':
			s = '12';
			break;
		case 'sm':
			s = '4';
			break;
		case 'xs':
			s = '2';
			break;
		case 'md':
		default:
			s = '8';
	}

	return <StyledSpacer size={s} />;
};

const StyledSpacer = styled.div`
	height: ${(props) => props.size}px;
	width: ${(props) => props.size}px;
`;

export default Spacer;
