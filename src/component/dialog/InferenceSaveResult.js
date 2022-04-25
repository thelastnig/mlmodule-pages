import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import { PROJECT_TYPE } from 'constants/common';

import { useCommonState } from 'store/common/hooks';
import { useAuthState } from 'store/auth/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import Spacer from 'components/spacer';
import DialogFooter from 'components/modal/DialogFooter';
import Checkbox from 'components/common/table/Checkbox';
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
		height: '308px',
	},
}));

const DOWNLOAD_TYPE = {
	CSV: 'csv',
	EXCEL: 'xlsx',
	PNG: 'png',
	JPG: 'jpg',
};
export default function DlgInferenceSaveResult(props) {
	const { inference_id } = props;

	const { currentUser, access_token, refresh_token } = useAuthState();

	const { loadProjectType } = useCommonState();

	const classes = useStyles();

	const [saveFormat, setSaveFormat] = useState('');

	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.INFERENCE_SAVE_RESULT;

	useEffect(() => {
		if (loadProjectType === PROJECT_TYPE.IMAGE) {
			setSaveFormat(DOWNLOAD_TYPE.PNG);
		} else {
			setSaveFormat(DOWNLOAD_TYPE.CSV);
		}
	}, [loadProjectType]);
	const onConfirmClicked = (e) => {
		hideDialog();

		let token = {
			access_token_value: access_token,
			refresh_token_value: refresh_token,
			user_id: currentUser.user_id,
			role: currentUser.role,
		};

		let link = document.createElement('a');
		let download_url =
			`${process.env.REACT_APP_API_ENDPOINT}/${process.env.REACT_APP_API_PREFIX}` +
			'/infer/downloadInferenceResult?' +
			'inference_id=' +
			inference_id +
			'&save_format=' +
			saveFormat +
			'&token=' +
			JSON.stringify(token);
		link.href = download_url;
		link.click();
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'inference_save_result_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Save Results'} toggle={hideDialog} />
				<DialogContent>
					<Spacer size={'xl'} />
					<SubTitle>Format</SubTitle>
					<Spacer size={'lg'} />
					<Spacer />
					{loadProjectType === PROJECT_TYPE.IMAGE ? (
						<FlexBox>
							<Checkbox checked={saveFormat === DOWNLOAD_TYPE.PNG} onChange={(e) => setSaveFormat(DOWNLOAD_TYPE.PNG)} />
							<Spacer />
							<Text selected={saveFormat === DOWNLOAD_TYPE.PNG}>PNG</Text>
							<Spacer size={'xl'} />
							<Spacer size={'xl'} />
							<Checkbox checked={saveFormat === DOWNLOAD_TYPE.JPG} onChange={(e) => setSaveFormat(DOWNLOAD_TYPE.JPG)} />
							<Spacer />
							<Text selected={saveFormat === DOWNLOAD_TYPE.JPG}>JPG</Text>
						</FlexBox>
					) : (
						<FlexBox>
							<Checkbox checked={saveFormat === DOWNLOAD_TYPE.CSV} onChange={(e) => setSaveFormat(DOWNLOAD_TYPE.CSV)} />
							<Spacer />
							<Text selected={saveFormat === DOWNLOAD_TYPE.CSV}>CSV</Text>
							<Spacer size={'xl'} />
							<Spacer size={'xl'} />
							<Checkbox checked={saveFormat === DOWNLOAD_TYPE.EXCEL} onChange={(e) => setSaveFormat(DOWNLOAD_TYPE.EXCEL)} />
							<Spacer />
							<Text selected={saveFormat === DOWNLOAD_TYPE.EXCEL}>EXCEL</Text>
						</FlexBox>
					)}
					<Spacer size={'xl'} />
					<Spacer size={'xl'} />
					<Spacer size={'lg'} />
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}
const Text = styled.div`
	color: ${(props) => (props.selected ? colors.text_black : '#b8babd')};
	font-size: 16px;
	font-weight: 500;
	margin-bottom: 5px;
`;

const FlexBox = styled.div`
	display: flex;
	align-items: center;
`;

const SubTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.text_black};
`;
