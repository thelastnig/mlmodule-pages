import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';
import linearUp from 'assets/img/img-linear-up.png';
import linearDown from 'assets/img/img-linear-down.png';
import linearCurve from 'assets/img/img-linear-curve.png';

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

export default function TabularRegression() {
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.INFO_TABULAR_REGRESSION;
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
				<DialogTitleComponent toggle={hideDialog}/>
				<ImgArea>
					<div>
						<img src={linearUp} width="138px" alt="" />
						<ImgTitle>{'Linear'}</ImgTitle>
					</div>
					<div style={{ margin: '0 24px' }}>
						<img src={linearDown} width="138px" alt="" />
						<ImgTitle>{'Linear'}</ImgTitle>
					</div>
					<div>
						<img src={linearCurve} width="138px" alt="" />
						<ImgTitle>{'No linear relationship'}</ImgTitle>
					</div>
				</ImgArea>
				<TextArea>
					<Title style={{ marginBottom: '8px' }}>Regression</Title>
					<Content>주어진 데이터를 바탕으로 변수 사이의 관계를 도출합니다.</Content>
					<Content>특정 값으로 결과를 예측하고자 할 때 사용합니다.</Content>
					<SubTitle style={{ marginTop: '16px', marginBottom: '4px' }}>활용 분야</SubTitle>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						미래를 예측하는 분야
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						가격 예측, 성능 예측
					</Content>
					<Content style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
						<Oval />
						최적화 분야
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
