import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import DialogFooter from 'components/modal/DialogFooter';
import DialogTitleComponent from 'components/modal/DialogTitle';

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
		height: '935px',
	},
}));

export default function GroupDetailDeveloper(props) {
	const { data } = props;
	const classes = useStyles();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.GROUP_DETAIL_DEVELOPER;

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'user_delete_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Details'} toggle={hideDialog} />
				<DialogContent>
					<div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
						<div>{data.description}</div>
					</div>
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}
