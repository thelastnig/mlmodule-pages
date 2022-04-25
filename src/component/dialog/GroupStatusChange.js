import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import { GROUP_STATUS } from 'constants/common';

import { useStateActionHandler } from 'store/group/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';

import Spacer from 'components/spacer';
import SelectCustom from 'components/common/SelectCustom';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
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

export default function DlgGroupStateChange(props) {
	const { data, fetchList } = props;
	const classes = useStyles();

	const { setGroupStatus } = useStateActionHandler();

	const [selectValue, setSelectValue] = useState({});
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.GROUP_STATUS_CHANGE;

	useEffect(() => {
		if (isShow) {
			let item = {
				column: data.working_status,
				label: data.working_status_nm,
			};
			setSelectValue(item);
		}
	}, [isShow]);

	const onConfirmClicked = (e) => {
		let params = {
			group_id: data.group_id,
			working_status: selectValue.column,
		};
		setGroupStatus(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {
				hideDialog();
			});
	};

	const handleSelectChange = (e) => {
		setSelectValue(e);
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'group_state_change_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Change Group Status'} toggle={hideDialog} />
				<DialogContent>
					<Spacer />
					<Label>Group</Label>
					<Spacer />
					<DisabledInput>{data.group_nm}</DisabledInput>

					<Spacer size={'lg'} />
					<Label>Creator</Label>
					<Spacer />
					<DisabledInput>{data.create_user}</DisabledInput>

					<Spacer size={'lg'} />
					<Label>Current Status</Label>
					<Spacer />
					<DisabledInput>{data.working_status_nm}</DisabledInput>

					<Spacer size={'lg'} />
					<Label>Change status to:</Label>
					<Spacer />
					<SelectCustom
						styleOptions={{
							width: '428px',
							height: '36px',
						}}
						isDisabled={false}
						isLoading={false}
						isClearable={false}
						isRtl={false}
						isSearchable={false}
						disabledColor={true}
						options={GROUP_STATUS}
						getOptionLabel={(option) => option.label}
						getOptionValue={(option) => option.column}
						onChange={handleSelectChange}
						value={selectValue}
						isRemovePrefixCurrent={true}
					/>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const DisabledInput = styled.div`
	width: 428px;
	height: 36px;
	border-radius: 4px;
	background-color: #f0f1f3;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: #9ea1a4;
	padding: 8px 16px;
`;

const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
