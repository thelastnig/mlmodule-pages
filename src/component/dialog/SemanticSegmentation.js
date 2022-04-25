import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';
import imgSemanticCow from 'assets/img/img-semantic-seg-cow.png';

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

export default function SemanticSegmentation() {
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.INFO_SEMANTIC_SEGMENTATION;
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
				<TextArea>
					<Title style={{ marginBottom: '8px' }}>Semantic Segmentation</Title>
					<Content>
						객체의 형태와 경계를 나누어 픽셀 단위로 식별한 결과를 나타냅니다. 이때 객체별로 따로 구분하지 않고 종류별로 구분합니다.
					</Content>
					<SubTitle style={{ marginTop: '16px', marginBottom: '4px' }}>활용 분야</SubTitle>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						이미지 기반 검색
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						의료 영상 분석
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						공정 내 결함 검출 및 품질 검사
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

const DialogTitleWrapper = styled.div`
	height: 270px;
	background-image: url(${imgSemanticCow});
	background-size: contain;
`;

const CloseBtn = styled.div`
	cursor: pointer;
	margin: 21px;
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
