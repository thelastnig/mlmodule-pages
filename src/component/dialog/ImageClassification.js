import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';
import imageDog from 'assets/img/img-tutorial-image-dog.png';
import imageCat from 'assets/img/img-tutorial-image-cat.png';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '1656px', maxWidth: '1656px' },
		height: '554px',
	},
}));

export default function ImageClassification() {
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.INFO_IMAGE_CLASSIFICATION;
	const classes = useStyles();

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'tutorial_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent toggle={hideDialog} />
				<ImgArea>
					<div>
						<img src={imageDog} width="232px" height="142px" alt="" />
						<ImgTitle>{'Dog'}</ImgTitle>
					</div>
					<div style={{ marginLeft: '10px' }}>
						<img src={imageCat} width="232px" height="142px" alt="" />
						<ImgTitle>{'Cat'}</ImgTitle>
					</div>
				</ImgArea>
				<TextArea>
					<Title style={{ marginBottom: '8px' }}>Image Classification</Title>
					<Content>입력 이미지로부터 해당하는 클래스의 라벨을 추출합니다.</Content>
					<SubTitle style={{ marginTop: '16px', marginBottom: '4px' }}>활용 분야</SubTitle>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						사물 인식 활용 분야
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						클라우드 기반 솔루션
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						효과적인 이미지 인덱싱과 탐색
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						비주얼 스토리텔링
					</Content>
				</TextArea>
				<ButtonArea>
					<ConfirmBtn onClick={hideDialog}>Close</ConfirmBtn>
				</ButtonArea>
			</Dialog>
		</div>
	);
}

const DialogTitleComponent = ({ title, toggle }) => {
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
};

const ButtonArea = styled.div`
	width: 100%;
	padding: 0px 21px;
	display: flex;
	justify-content: flex-end;
`;

const TextArea = styled.div`
	width: 100%;
	height: 221px;
	padding: 25px 35px;
`;

const Title = styled.div`
	font-family: NotoSans;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

const Content = styled.div`
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const SubTitle = styled.div`
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const Oval = styled.div`
	width: 4px;
	height: 4px;
	margin-right: 6px;
	background-color: ${colors.text_black};
	border-radius: 50%;
`;

const ImgArea = styled.div`
	height: 210px;
	padding: 6px 30px 0px 30px;
	background: #f0f1f3;
	display: flex;
	flex-direction: row;
`;

const ImgTitle = styled.div`
	font-family: NotoSans;
	font-size: 12px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.text_black};
`;

const DialogTitleWrapper = styled.div`
	height: 60px;
	padding: 24px 24px 9px 24px;
	background: #f0f1f3;
`;

const CloseBtn = styled.div`
	cursor: pointer;
`;

const ConfirmBtn = styled.div`
	display: inline-block;
	width: 100px;
	height: 40px;
	border-radius: 2px;
	background: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	color: ${colors.text_white};
	text-align: center;
	line-height: 40px;
	cursor: pointer;
	:hover {
		background: ${colors.light_blue_hover};
	}
	:active {
		background: ${colors.light_blue_hover};
	}
	:disabled {
		background: ${colors.gray_default};
	}
`;
