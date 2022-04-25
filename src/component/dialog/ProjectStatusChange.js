import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitleComponent from 'components/modal/DialogTitle';
import Select from 'react-select';

import { colors } from 'styles';

import { useStateActionHandler } from 'store/project/hooks';
import { useAlertAction } from 'store/alert/hooks';

import DialogFooter from 'components/modal/DialogFooter';
import { InputDisabled } from 'components/common/StyledComponent';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const SELECT_FILTER_LIST = [
	{
		column: 'PSW',
		label: 'Working',
	},
	{
		column: 'PSC',
		label: 'Completed',
	},
];
// working -> completed 변경시 "PSC",
//   completed -> working 변경시 "PSW"로 보내주시면 됩니다
export default function ProjectStatusChange(props) {
	const { data, fetchList } = props;

	const { showAlert } = useAlertAction();
	const { setProjectStatus } = useStateActionHandler();

	const [selectStatus, setSelectStatus] = useState('');
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.PROJECT_STATUS_CHANGE;

	useEffect(() => {
		if (isShow) {
			setSelectStatus(SELECT_FILTER_LIST[0]);
		}
	}, [isShow]);
	const handleSelectChange = (e) => {
		setSelectStatus(e);
	};

	const onConfirmClicked = useCallback(() => {
		hideDialog();
		if (selectStatus.column === 'PSC') {
			showAlert({
				message: 'Completed를 하게 되면 프로젝트가 완전히 종료되며, Read Only mode로 바뀌게 됩니다.',
				isConfirm: true,
				onOk: postStatus,
			});
		} else {
			postStatus();
		}
	});
	const postStatus = useCallback(() => {
		// POST http://175.197.4.214:8005/api/common/setProjectStatus
		let params = {
			project_id: data.project_id,
			working_status: selectStatus.column,
		};
		setProjectStatus(params)
			.then((response) => {
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const onCancelClicked = (e) => {
		hideDialog();
	};

	const selectStyles = {
		control: (styles, state) => ({
			...styles,
			paddingLeft: '6px',
			border: '1px solid #ced4da',
			boxShadow: 'none',
			'&:hover': {
				border: state.isFocused ? '1px solid #d5dce4' : '1px solid #d5dce4',
			},
		}),
		indicatorsContainer: (styles) => ({ ...styles }),
		indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
		menuList: (styles) => ({
			...styles,
			maxHeight: '145px',
			boxShadow: '7px 8px 20px 0 rgba(0, 0, 0, 0.12)',
			border: '1px solid #d5d6d7',
			padding: 0,
			backgroundColor: '#ffffff',
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			let isButton = data.isButton;
			return {
				...styles,
				height: '36px',
				backgroundColor: isSelected ? 'rgba(0, 66, 130, 0.1)' : '#ffffff',
				color: isButton ? '#005cb5' : '#1e1f22',
				letterSpacing: '-0.3px',
				fontSize: '14px',
				':hover': {
					...styles[':hover'],
					backgroundColor: 'rgba(0, 66, 130, 0.1)',
				},
			};
		},
	};
	return (
		<div>
			<Dialog
				className={'home_change_model_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Change Project Status'} toggle={hideDialog} />
				<DialogContent>
					<Sesstion>
						<SessionTitle>Project</SessionTitle>
						<InputDisabled style={{ textAlign: 'left', paddingLeft: '16px', backgroundColor: '#f9f9f9', border: 'solid, 1px, #e1e2e3' }}>
							{data.project_nm}
						</InputDisabled>
					</Sesstion>
					<Sesstion>
						<SessionTitle>Current Status</SessionTitle>
						<InputDisabled style={{ textAlign: 'left', paddingLeft: '16px', backgroundColor: '#f9f9f9', border: 'solid, 1px, #e1e2e3' }}>
							{data.working_status_nm}
						</InputDisabled>
					</Sesstion>
					<Sesstion>
						<SessionTitle>Change status to:</SessionTitle>
						<ModelSelect>
							<Select
								className="basic-single"
								classNamePrefix="select"
								isDisabled={false}
								isLoading={false}
								isClearable={false}
								isRtl={false}
								isSearchable={false}
								options={SELECT_FILTER_LIST}
								styles={selectStyles}
								getOptionLabel={(option) => option.label}
								getOptionValue={(option) => option.column}
								// components={{ Menu: CustomMenu }}
								onChange={handleSelectChange}
								value={selectStatus}
							/>
						</ModelSelect>
					</Sesstion>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 0 24px;
	height: 287px;
`;
const Sesstion = styled.div``;
const SessionTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
	padding-top: 12px;
`;

const ModelSelect = styled.div``;
