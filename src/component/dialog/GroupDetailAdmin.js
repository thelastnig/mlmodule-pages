import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import GroupDetailUserList from 'dialog/DlgGroupDetailUserList';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
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

export default function GroupDetailAdmin(props) {
	const { data } = props;
	const classes = useStyles();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.GROUP_DETAIL_ADMIN;

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'group_detail_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Details'} toggle={hideDialog} />
				<DialogContent style={{ display: 'flex' }}>
					<Detail data={data} />
					<GroupDetailUserList data={data} />
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const Detail = (props) => {
	const { data } = props;
	return (
		<DetailWrapper>
			<div>{data.description}</div>
		</DetailWrapper>
	);
};

const DetailWrapper = styled.div`
	width: 320px;
	display: flex;
	// align-items: center;
	// flex-direction: column;
	// justify-content: center;
	height: 100%;
`;
