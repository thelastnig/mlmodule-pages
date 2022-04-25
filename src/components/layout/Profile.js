import React, { useCallback } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';
import history from 'lib/history';

import { useAuthState } from 'store/auth/hooks';

export default function Profile() {
	const { currentUser } = useAuthState();
	const myPageClick = useCallback(() => {
		history.push('/mypage');
	});
	return (
		<ProfileBox>
			<ImgBox onClick={myPageClick}></ImgBox>
			<NameContainer onClick={myPageClick}>{currentUser?.user_nm}</NameContainer>
		</ProfileBox>
	);
}

const ProfileBox = styled.div`
	height: 144px;
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	align-content: center;
	flex-direction: column;
`;

const ImgBox = styled.div`
	width: 56px;
	height: 56px;
	background: url(${THEME.getImageURL('icon-user')});
	background-size: contain;
	color: ${colors.bg_white};
	font-size: 24px;
	align-items: center;
	display: flex;
	justify-content: center;
	cursor: pointer;
`;

const NameContainer = styled.div`
	width: 106px;
	height: 19px;
	margin-top: 6px;
	font-size: 14px;
	letter-spacing: -0.35px;
	text-align: center;
	color: ${colors.text_black};
	text-decoration: underline;
	cursor: pointer;
`;
