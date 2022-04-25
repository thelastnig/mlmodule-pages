import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import agent from 'lib/apis';

import { colors } from 'styles';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useStateActionHandler } from 'store/project/hooks';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { dialogList } from 'constants/dialog';
import { useAuthState } from 'store/auth/hooks';

import editIcon from 'assets/icon/btn-edit-n.png';

export default function ProjectDetail({ data, fetchList }) {
	const [descriptionDisabled, setDescriptionDisabled] = useState(true);
	const [isVisibleEditIcon, setIsVisibleEditIcon] = useState(false);
	const { setProjectDesc } = useStateActionHandler();
	const descriptionInput = useRef();
	const { showAlert } = useAlertAction();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const { isAdmin, currentUser } = useAuthState();
	const isShow = dialogName === dialogList.PROJECT_DETAIL;

	useEffect(() => {
		setDescriptionDisabled(true);
		if (currentUser && data) {
			setIsVisibleEditIcon(currentUser.user_id === data['user_id'] || isAdmin);
		}
	}, [currentUser, data]);
	
	const onConfirmClicked = useCallback(() => {
		hideDialog();
		if (data.description === descriptionInput.current.value) {
			return;
		}
		
		let params = {
			project_id: data.project_id,
			description: descriptionInput.current.value,
		};
		
		setProjectDesc(params)
			.then((response) => {
				showAlert({
					message: 'Description이 변경되었습니다.',
				});
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	function toggleDescription() {
		setDescriptionDisabled(!descriptionDisabled)
	}

	return (
		<div>
			<Dialog
				className={'home_detail_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Details'} toggle={hideDialog} />
				<DialogContent>
					<div>
						<ContentItemTitle>Project</ContentItemTitle>
						<ContentItem>{data.project_nm}</ContentItem>

						<ContentItemTitle>Project ID</ContentItemTitle>
						<ContentItem>{data.project_id}</ContentItem>

						<ContentItemTitle>Framework</ContentItemTitle>
						<ContentItem>{data.framework_nm}</ContentItem>
						
						<ContentItemTitle>
							Description
							{isVisibleEditIcon &&
								<IconEdit src={editIcon} onClick={toggleDescription}/>
							}
						</ContentItemTitle>
						<DescriptionItem disabled={descriptionDisabled} ref={descriptionInput} >{data.description}</DescriptionItem>
					</div>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 0 24px;
	height: 529px;
`;

const ContentItemTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	margin-top: 12px;
`;

const ContentItem = styled.div`
	width: 720px;
	height: ${(props) => (props.large ? '120px' : '36px')};
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	padding: 8px 16px 9px 16px;
	border: solid 1px ${colors.gray_blue_gray};
	border-radius: 4px;
	margin-top: 8px;
	background-color: #f9f9f9;
`;

const DescriptionItem = styled.textarea`
	width: 720px;
	height: 120px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	padding: 8px 16px 9px 16px;
	border: solid 1px ${colors.gray_blue_gray};
	border-radius: 4px;
	margin-top: 8px;
	background-color: white;
	cursor: pointer;
	:disabled {
		cursor: not-allowed;
		background-color: #f9f9f9;	
	}
`;

const IconEdit = styled.img`
	width: 20px;
	vertical-align: middle;
	cursor: pointer;
`;