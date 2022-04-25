import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Checkbox from 'components/common/table/Checkbox';

const MyList = (props) => {
	const { title, my_yn, setMy_yn } = props;
	return (
		<FilterCheckBox>
			<CheckboxWrap>
				<Checkbox checked={my_yn} onChange={(e) => setMy_yn(!my_yn)} title={title} />
			</CheckboxWrap>
			<MarginLeft size={'7px'} />
		</FilterCheckBox>
	);
};
export default MyList;

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;

const FilterCheckBox = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
const CheckboxWrap = styled.div``;
