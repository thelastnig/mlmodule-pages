import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';

export default function DialogTitleComponent({ title, toggle }) {
	return (
		<>
			<DialogTitleWrapper>
				<div style={{ display: 'flex', justifyContent: 'space-between' }}>
					<div style={{ fontSize: '20px', fontWeight: 'bold' }}>{title}</div>
					<CloseBtn onClick={(e) => toggle(false)}>
						<img src={closeIcon} alt="" />
					</CloseBtn>
				</div>
			</DialogTitleWrapper>
		</>
	);
}

const DialogTitleWrapper = styled.div`
	height: 60px;
	padding: 24px 24px 9px 24px;
	border-bottom: 1px solid ${colors.gray_light_30};
`;

const CloseBtn = styled.div`
	cursor: pointer;
`;
