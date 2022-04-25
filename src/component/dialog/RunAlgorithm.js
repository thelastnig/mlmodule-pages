import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import ListParamMaker from 'utils/ListParamMaker';
import FormatUtil from 'utils/FormatUtil';
import { useStateActionHandler, useHandleState } from 'store/algorithm/hooks';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import AlgorithmTable from 'dialog/DlgAlgorithmTable';
import DlgAlgorithmDynamicParam from 'dialog/DlgAlgorithmDynamicParam';

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
		paper: { minWidth: '911px', maxWidth: '911px' },
		height: '695px',
	},
}));

export default function DlgAlgorithm(props) {
	const { setAlgorithmCB, experiment_id } = props;
	const { onFetchAlgorithmListCB, initAlgorithmListCB } = useStateActionHandler();
	const { list, sorting, sorting_type } = useHandleState();
	const classes = useStyles();

	const [checkItems, setCheckItems] = useState([]);

	const [algorithm, setAlgorithm] = useState('');
	const [algorithmParam, setAlgorithmParam] = useState({});

	const [okDisabled, setOkDisabled] = useState(true);

	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_RUN_ALGORITHM;

	const fetchList = useCallback(() => {
		if (isShow) {
			let params = ListParamMaker.make({
				sorting,
				sorting_type,
				experiment_id: experiment_id,
			});
			onFetchAlgorithmListCB(params);
		} else {
			initAlgorithmListCB();
		}
	});
	useEffect(() => {
		fetchList();
	}, [sorting, sorting_type]);
	const setInitValue = () => {
		setAlgorithmParam({});
	};
	const algorithmClicked = (data) => {
		if (data) {
			const defaultData = Object.assign({}, ...data.parameter.map((item) => ({[item.name]: item.default})));

			setAlgorithmParam(defaultData);
			setAlgorithm(data);
		}
	};

	useEffect(() => {
		let emptyValue = false;

		if(Object.keys(algorithmParam).length <= 0) {
			emptyValue = true;
		}

		Object.keys(algorithmParam).forEach((key, index) => {
			let value = algorithmParam[key];
			if (FormatUtil.isEmpty(value)) {
				emptyValue = true;
				return;
			}
		});
		setOkDisabled(emptyValue);
	}, [algorithmParam]);

	useEffect(() => {
		if (isShow) {
			fetchList();
		}
	}, [isShow]);

	const onConfirmClicked = (e) => {
		if (!algorithm) {
			hideDialog();
			return;
		}
		let algorithmData = {
			algorithm_id: algorithm.algorithm_id,
			algorithm_nm: algorithm.algorithm_nm,
			complexity: algorithm.complexity,
		};
		let data = {
			algorithmData,
			paramsData: algorithmParam,
			algorithm: algorithm,
		};
		setAlgorithmCB(data);
		hideDialog();
	};

	const onCancelClicked = (e) => {
		setAlgorithm('');
		setInitValue();
		hideDialog();
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				classes={{ paper: classes.paper }}
				className={'algorithm_dialog dialog_layout'}
				maxWidth="xl"
			>
				<DialogTitleComponent title={'Algorithm'} toggle={hideDialog} />
				<DialogContent>
					<DialogContentText>
						<AlgorithmTable
							list={list}
							checkItems={checkItems}
							setCheckItems={setCheckItems}
							maxRowCnt={''}
							algorithmClicked={algorithmClicked}
						/>
						<Spacer />
						<SubTitle>Parameters</SubTitle>
						<StyledTableHeader algorithm={algorithm}>
							<TD_1>NAME</TD_1>
							<TD_2>VALUE</TD_2>
						</StyledTableHeader>
						<TableBodyArea>
							{algorithm ? (
								algorithm.parameter.map((param) => (
									<DlgAlgorithmDynamicParam id={param.name} paramData={param} setParamsValue={setAlgorithmParam} />
								))
							) : (
								<TableBodyTextHolderArea>
									<TableBodyTextHolder>Algorithm을 선택해 주세요.</TableBodyTextHolder>
								</TableBodyTextHolderArea>
							)}
						</TableBodyArea>
					</DialogContentText>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} okDisabled={okDisabled} tooltipText={okDisabled ? 'Algorithm과 Parameter를 선택 후 클릭이 가능합니다.' : ''} />
			</Dialog>
		</div>
	);
}

const TD_1 = styled.div`
	width: 428px;
	padding-left: 20px;
`;
const TD_2 = styled.div`
	width: 402px;
`;
const SubTitle = styled.div`
	height: 19px;
	margin: 12px 0px 8px 0px;
	font-size: 14px;
	color: ${colors.text_black};
`;
const TableBodyArea = styled.div`
	height: 160px;
	overflow: hidden;
	overflow-y: auto;
`;
const TableBodyTextHolderArea = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	border-bottom: 1px solid #eaebec;
`;
const TableBodyTextHolder = styled.div`
	width: 170px;
	height: 19px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	text-align: center;
	color: ${colors.gray_default};
`;
const StyledTableHeader = styled.thead`
	width: 100%;
	height: 35px;
	padding: 6px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: -0.3px;
	color: #82878b;
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
	${(props) =>
		props.algorithm &&
		`font-weight:bold;
      color: ${colors.text_black}
     `}
`;
