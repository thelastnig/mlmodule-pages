import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';

const MethodAbout = (props) => {
	const { value } = props;

	return (
		<>
			<Spacer />
			<ParameterRow>
				<Label>About</Label>
				<Spacer size={'sm'} />
				<AboutComponent data-tip data-for="about_tooltip">
					{value}
				</AboutComponent>
			</ParameterRow>
			<Spacer />
			<Spacer />
		</>
	);
};

export default MethodAbout;

const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
const ParameterRow = styled.div`
	width: 100%;
	padding: 5px 0;
`;
const AboutComponent = styled.div`
	width: 512px;
	height: 60px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1px #e1e2e3;
	background-color: #f9f9f9;
	overflow: hidden;
	white-space: pre-line;
	/* text-overflow: ellipsis; */
`;
