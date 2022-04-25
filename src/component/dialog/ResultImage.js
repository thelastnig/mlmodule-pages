import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import 'views/inference.scss';
import { colors } from 'styles';
import closeIcon from 'assets/icon/btn-close-n.png';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function DlgResultImage(props) {
	const { data } = props;
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.INFERENCE_RESULT_ITEM;
	
	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'preview_dlg dialog_layout'}
			>
				<DialogTitleComponent title={'Results'} toggle={hideDialog} data={data} />
				<ImgArea>
					<PreviewImg src={data.url} />
				</ImgArea>
			</Dialog>
		</div>
	);
}

const DialogTitleComponent = (props) => {
	const { title, toggle, data } = props;
	return (
		<>
			<DialogTitleWrapper>
				<TitleArea>
					<div>
						<Title>{title}</Title>
						<SubTitle>{data.file_name}</SubTitle>
					</div>
					<CloseBtn onClick={(e) => toggle(false)}>
						<img src={closeIcon} alt="" />
					</CloseBtn>
				</TitleArea>
			</DialogTitleWrapper>
		</>
	);
};
const DialogTitleWrapper = styled.div`
	height: 60px;
	padding: 24px 24px 0 24px;
	border-bottom: 1px solid ${colors.gray_light_30};
`;
const Title = styled.div`
	height: 27px;
	font-size: 20px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.5px;
	color: ${colors.text_black};
	display: inline-block;
	margin-right: 10px;
`;
const CloseBtn = styled.div`
	cursor: pointer;
`;
const TitleArea = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;
const ImgArea = styled.div`
	height: 488px;
	padding: 24px;
	display: flex;
`;
const PreviewImg = styled.img`
	width: 100%;
	height: 100%;
`;

const SubTitle = styled.div`
	font-size: 12px;
	font-weight: 400;
	color: ${colors.text_black};
	display: inline-block;
`;
