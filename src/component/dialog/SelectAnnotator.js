import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';
import closeIcon from 'assets/icon/btn-close-n.png';

import { useStateActionHandler } from 'store/annotator/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useCommonState } from 'store/common/hooks';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Spacer from 'components/spacer';
import DlgSelectAnnotatorTable from 'dialog/DlgSelectAnnotatorTable';
import { DataSetContext } from 'views/dataSet';
import DialogFooter from 'components/modal/DialogFooter';

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

export default function DlgSelectAnnotator({ data }) {
	const { dataset_id } = data;
	useHistory();
	const { loadProject } = useCommonState();
	const { onAllocateAnnotatorCB } = useStateActionHandler();
	const { currentUser } = useAuthState();
	const [list, set_list] = useState([]);
	const [num_instances, set_num_instances] = useState(0);

	const [checkItems, setCheckItems] = useState([]);
	const [instanceNum, setInstanceNum] = useState(0);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.DATA_SELECT_ANNOTATOR;

	const { fetchList: fetchDataListCB } = useContext(DataSetContext);
	useEffect(() => {
		if (checkItems.length > 0) {
			let num = parseInt(num_instances / checkItems.length);
			setInstanceNum(num);
		}
	}, [checkItems]);

	const classes = useStyles();
	const onConfirmClicked = (e) => {
		hideDialog();
		if (checkItems.length < 1) {
			return;
		}
		let annotator_list = [];
		for (let i = 0; i < checkItems.length; i++) {
			let data = checkItems[i];
			let result = {
				annotator_id: data.user_id,
				before_file_count: calculatorStart(data, checkItems, instanceNum, num_instances),
				after_file_count: calculatorEnd(data, checkItems, instanceNum, num_instances),
			};
			annotator_list.push(result);
		}

		let params = {
			project_id: loadProject.project_id,
			dataset_id: dataset_id,
			num_instances: num_instances,
			num_annotator: checkItems.length,
			annotator_list: annotator_list,
		};
		onAllocateAnnotatorCB(params)
			.then((response) => {
				fetchDataListCB();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	const onCancelClicked = (e) => {
		hideDialog();
	};
	const fetchAnnotatorList = () => {
		let params = {
			dataset_id: data.dataset_id,
		};
		agent
			.getAnnotatorList(params)
			.then((response) => {
				let { list, num_instances } = response.data;
				let myInfo = {
					role_nm: currentUser.role_nm,
					user_id: currentUser.user_id,
					user_nm: currentUser.user_nm + '(mine)',
				};
				let temp_list = [myInfo, ...list];
				set_list(temp_list);
				set_num_instances(num_instances);
			})
			.catch((error) => {
				hideDialog();
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	useEffect(() => {
		if (isShow) {
			fetchAnnotatorList();
		} else {
			setCheckItems([]);
		}
	}, [isShow]);

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'selectAnnotator_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Annotator'} toggle={hideDialog} num_instances={num_instances} />
				<DialogContent style={{ overflow: 'hidden' }}>
					<TextContent>선택한 Annotation의 수 만큼 자동으로 이미지 갯수를 분배합니다.</TextContent>
					<Spacer />
					<TableArea>
						<DlgSelectAnnotatorTable
							list={list}
							checkItems={checkItems}
							setCheckItems={setCheckItems}
							instanceNum={instanceNum}
							num_instances={num_instances}
						/>
					</TableArea>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} okDisabled={checkItems.length > 0 ? false : true} />
			</Dialog>
		</div>
	);
}

const DialogTitleComponent = (props) => {
	const { title, toggle, num_instances } = props;
	return (
		<>
			<DialogTitleWrapper>
				<TitleArea>
					<div>
						<Title>{title}</Title>
						<SubTitle>No. of instances : {num_instances}</SubTitle>
					</div>
					<CloseBtn onClick={(e) => toggle(false)}>
						<img src={closeIcon} alt="" />
					</CloseBtn>
				</TitleArea>
			</DialogTitleWrapper>
		</>
	);
};

export const calculatorStart = (data, checkItems, instanceNum, num_instances) => {
	let checked = checkItems.includes(data);
	if (checked) {
		let index = checkItems.indexOf(data);
		let start = instanceNum * index;
		if (start === 0) {
			if (num_instances !== 0) {
				start = 1;
			}
		} else {
			start = start + 1;
		}

		return start;
	}
	return 0;
};

export const calculatorEnd = (data, checkItems, instanceNum, num_instances) => {
	let checked = checkItems.includes(data);
	if (checked) {
		let index = checkItems.indexOf(data) + 1;
		let end = instanceNum * index;
		if (index === checkItems.length || end > num_instances) {
			end = num_instances;
		}
		return end;
	}
	return 0;
};
const DialogTitleWrapper = styled.div`
	height: 65px;
	padding: 15px 24px 5px 24px;
	border-bottom: 1px solid ${colors.gray_light_30};
`;

const CloseBtn = styled.div`
	cursor: pointer;
`;

const TableArea = styled.div`
	width: 570px;
	height: 400px;
`;
const TitleArea = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
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
`;
const SubTitle = styled.div`
	height: 16px;
	font-size: 12px;
	font-weight: 600;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spcing: -0.3px;
	color: ${colors.text_black};
`;
const TextContent = styled.div`
	height: 16px;
	font-size: 12px;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spcing: -0.3px;
	color: ${colors.text_black};
`;
