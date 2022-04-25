import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import DialogTitleComponent from 'components/modal/DialogTitle';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';
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

export default function PreviewDlg({ file }) {
	const classes = useStyles();
	const [preview, setPreview] = useState();
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.DATA_UPLOAD_PREVIEW;
	useEffect(() => {
		if (file) {
			setPreview(URL.createObjectURL(file));
		}
	}, [file]);
	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'preview_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Image Preview'} toggle={hideDialog} />
				<ImgArea>
					<PreviewImg src={preview} />
				</ImgArea>
			</Dialog>
		</div>
	);
}

const ImgArea = styled.div`
	height: 480px;
	padding: 24px;
	display: flex;
`;

const PreviewImg = styled.img`
	width: 100%;
	height: 100%;
	object-fit: contain;
`;
