import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import ImgInfo01 from 'assets/img/img-info-01.png';
import ImgInfo02 from 'assets/img/img-info-02.png';
import ImgInfo03 from 'assets/img/img-info-03.png';
import IconArrow from 'assets/icon/btn-see-all-n.png';

import { BodyContainer, MarginLeft, PageWrapper, TitleComponent } from 'components/common/StyledComponent';

const Information = () => {
	const platformClicked = () => {
		window.open(process.env.REACT_APP_PLATFORM_URL);
	};
	const questionClicked = () => {
		window.open(process.env.REACT_APP_QUESTION_URL);
	};
	const learningClicked = () => {
		window.open(process.env.REACT_APP_LEARNING_URL);
	};
	return (
		<PageWrapper>
			<TitleComponent text={'Information'} />
			<BodyContainer>
				<InfoContainer>
					<InfoBox onClick={(e) => platformClicked()}>
						<InfoBoxButton>
							<div style={{ width: '100px' }}>{'플랫폼 사용법'}</div>
							<MarginLeft size={'8px'} />
							<img src={IconArrow} style={{ width: '20px', height: '20px' }} alt="" />
						</InfoBoxButton>
						<MarginLeft size={'40px'} />
						<img src={ImgInfo01} width="168px" height="136px" alt="" />
					</InfoBox>
					<InfoBox onClick={(e) => questionClicked()}>
						<InfoBoxButton>
							<div style={{ width: '115px' }}>{'문제정의 가이드'}</div>
							<MarginLeft size={'8px'} />
							<img src={IconArrow} style={{ width: '20px', height: '20px' }} alt="" />
						</InfoBoxButton>
						<MarginLeft size={'30px'} />
						<img src={ImgInfo02} width="168px" height="136px" alt="" />
					</InfoBox>
					<InfoBox onClick={(e) => learningClicked()}>
						<InfoBoxButton>
							<div style={{ width: '130px' }}>{'머신러닝 알고리즘 가이드'}</div>
							<MarginLeft size={'8px'} />
							<img src={IconArrow} style={{ width: '20px', height: '20px' }} alt="" />
						</InfoBoxButton>
						<MarginLeft size={'10px'} />
						<img src={ImgInfo03} width="168px" height="136px" alt="" />
					</InfoBox>
				</InfoContainer>
			</BodyContainer>
		</PageWrapper>
	);
};

export default Information;

const InfoContainer = styled.div`
	width: 1232px;
	height: 164px;
	margin-top: 42px;
	display: flex;
	flex-direction: row;
`;

const InfoBox = styled.div`
	width: 400px;
	height: 164px;
	margin: 0 16px 0 0;
	padding: 14px 26px 14px 36px;
	border-radius: 4px;
	background-color: #7780f5;
	display: flex;
	flex-direction: row;
	align-items: center;
	cursor: pointer;
	:hover {
		background: #666dd2;
	}
	:active {
		background: #666dd2;
	}
`;

const InfoBoxButton = styled.div`
	font-family: NotoSans-Bold;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.bg_white};
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`;
