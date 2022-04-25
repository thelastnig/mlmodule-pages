import React, { useState, useEffect, useCallback } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import ListParamMaker from 'utils/ListParamMaker';
import { useHandleState, useStateActionHandler } from 'store/algorithm/hooks';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import AlgorithmTable from 'dialog/DlgHPOAlgorithmTable';
import DlgAlgorithmDynamicParam from 'dialog/DlgHPOAlgorithmDynamicParam';
import DlgAlgorithmDynamicTabularParam from 'dialog/DlgAlgorithmDynamicTabularParam';
import styled from 'styled-components';
import * as colors from 'styles/colors';
import Checkbox from 'components/common/table/Checkbox';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';
import { getToolTipTextByName } from 'dialog/DlgAlgorithmDynamicParam';

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

/*
체크박스에 체크 시 해당 항목의 VALUE input은 사용자의 입력을 받을 수 없게 비활성화됩니다.
3가지 항목 중 최소 1가지 항목에는 체크가 되어야 합니다.
만약 3가지 항목 모두 체크를 하지 않으면 하단의 "OK"의 버튼이 비활성화되어 다음 단계로 진행할 수 없습니다.
체크 박스에 체크를 하게 되면 "hpo"가 붙은 파라미터가 "true"가 됩니다.
예) learning rate 체크 박스에 체크를 하면 "learning_rate_hpo"의 값은 true
체크 박스에 체크 시 값은 내부에서 정한 값을 사용하게 되므로 빈 문자열로 보내주시면 됩니다.
예) learning rate 체크 박스에 체크를 하면 "learning_rate"의 값은 ""(빈 문자열)
 */

const DlgHPOAlgorithm = (props) => {
	const { setAlgorithmCB, experiment_id } = props;
	const { onFetchAlgorithmListCB } = useStateActionHandler();
	const { list, sorting, sorting_type, project_type } = useHandleState();
	const classes = useStyles();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_HPO_ALGORITHM;

	const [checkItems, setCheckItems] = useState([]);

	const [algorithm, setAlgorithm] = useState('');
	const [algorithmParam, setAlgorithmParam] = useState({
		learning_rate_hpo: false,
		weight_decay_hpo: false,
		batch_size_hpo: false,
	});

	const fetchList = useCallback(() => {
		if (isShow) {
			let params = ListParamMaker.make({
				sorting,
				sorting_type,
				experiment_id: experiment_id,
			});
			onFetchAlgorithmListCB(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [sorting, sorting_type]);

	useEffect(() => {
		setInitValue();
	}, [isShow]);

	const setInitValue = () => {
		setCheckItems([]);
		setAlgorithm('');
		setAlgorithmParam({
			learning_rate_hpo: false,
			weight_decay_hpo: false,
			batch_size_hpo: false,
		});
	};
	const algorithmClicked = (data) => {
		if (data) {
			const defaultData = Object.assign({}, ...data.parameter.map((item) => ({[item.name]: item.default})));

			setAlgorithmParam((prev) => {
				return { ...prev, ...defaultData };
			});
			setAlgorithm(data);
		}
	};

	useEffect(() => {
		if (isShow) {
			fetchList();
		}
	}, [isShow]);

	const onConfirmClicked = (e) => {
		if (!algorithm) {
			// 알고리즘을 선택하지 않고 OK버튼을 누른 경우
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

	// 3가지 항목 중 최소 1가지 항목에는 체크가 되어야 합니다.
	// 만약 3가지 항목 모두 체크를 하지 않으면 하단의 "OK"의 버튼이 비활성화되어 다음 단계로 진행할 수 없습니다.
	const okDisabled = () => {
		let tabularCheck = true;
		if (project_type === 'tabular') {
			for (let key in algorithmParam) {
				if (key.includes('_hpo') && algorithmParam[key] === true) {
					tabularCheck = false;
				}
			}
			return tabularCheck;
		} else {
			return !(algorithmParam.learning_rate_hpo || algorithmParam.weight_decay_hpo || algorithmParam.batch_size_hpo);
		}
	};

	const HPO_CHECKBOX_LIST = ['learning_rate', 'weight_decay', 'batch_size'];

	const updateParamValue = (id, value) => {
		setAlgorithmParam((prev) => {
			let data = { ...prev };
			data[id] = value;
			return data;
		});
	};

	const updateCheckValue = (key) => {
		setAlgorithmParam((prev) => {
			let data = { ...prev };
			data[key] = !prev[key];
			return data;
		});
	};

	const onChangeLearningRate = (id) => {
		updateCheckValue('learning_rate_hpo');
		let value = '';
		if (algorithmParam.learning_rate_hpo) {
			value = (algorithmParam && algorithmParam.learning_rate) ? algorithmParam.learning_rate.default : '';
		}
		updateParamValue(id, value);
	};

	const onChangeWeightDecay = (id) => {
		updateCheckValue('weight_decay_hpo');
		let value = '';
		if (algorithmParam.weight_decay_hpo) {
			value = (algorithmParam && algorithmParam.weight_decay) ? algorithmParam.weight_decay.default : '';
		}
		updateParamValue(id, value);
	};

	const onChangeBatchSize = (id) => {
		updateCheckValue('batch_size_hpo');
		let value = '32';
		if (algorithmParam.batch_size_hpo) {
			value = (algorithmParam && algorithmParam.batch_size) ? algorithmParam.batch_size.default : '';
		}
		updateParamValue(id, value);
	};

	const setCheckValue = (id) => {
		if (id === 'learning_rate') {
			onChangeLearningRate(id);
		} else if (id === 'weight_decay') {
			onChangeWeightDecay(id);
		} else if (id === 'batch_size') {
			onChangeBatchSize(id);
		}
	};

	const setTabularCheckValue = (paramData) => {
		const hpoCheckParamName = paramData.name + '_hpo';
		const hpoRangeName = paramData.name + '_hrange';
		if (algorithmParam[hpoCheckParamName]) {
			setAlgorithmParam((prev) => {
				let data = { ...prev };
				data[hpoCheckParamName] = !algorithmParam[hpoCheckParamName];
				data[hpoRangeName] = paramData.hpo_range;
				data[paramData.name] = paramData.default;
				return data;
			});
		} else {
			setAlgorithmParam((prev) => {
				let data = { ...prev };
				data[hpoCheckParamName] = true;
				data[hpoRangeName] = paramData.hpo_range;
				data[paramData.name] = 'hpo_check_metric';
				return data;
			});
		}
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
							<TD_3>HPO</TD_3>
						</StyledTableHeader>
						<TableBodyArea>
							{algorithm ? (
								project_type === 'tabular' ? (
									algorithm.parameter.map((param, index) => {
										const hpoCheckParamName = param.name + '_hpo';
										return (
											<TableRowParameter>
												<TD_1_NAME>{param.display_name}</TD_1_NAME>
												<DlgAlgorithmDynamicTabularParam
													id={param.name}
													paramData={param}
													algorithm={algorithm}
													setParamsValue={setAlgorithmParam} 	
													checked={
														(algorithmParam[hpoCheckParamName] && algorithmParam[hpoCheckParamName] === true)
														?
														true
														:
														false
													} 
												/>
												{
													param.hpo === 'True'
													?
													<CheckBoxArea>
														<Checkbox 	
															checked={
																(algorithmParam[hpoCheckParamName] && algorithmParam[hpoCheckParamName] === true)
																?
																true
																:
																false
															} 
															onChange={() => setTabularCheckValue(param)} />
													</CheckBoxArea>
													:
													null
												}
											</TableRowParameter>
										);
									})
								) : (
									algorithm.parameter.map((param, index) => {
										const tooltipId = uuid();
										return (
											<TableRowParameter>
												<TD_1_NAME data-tip data-for={tooltipId}>
													{param.display_name}
													{getToolTipTextByName(param.display_name) && (
														<Tooltip id={tooltipId} text={getToolTipTextByName(param.display_name)}/>
													)}
												</TD_1_NAME>
												<DlgAlgorithmDynamicParam
													id={param.name}
													paramData={param}
													algorithm={algorithm}
													setParamsValue={setAlgorithmParam}
													checked={
														param.name === 'learning_rate'
														?
														algorithmParam.learning_rate_hpo
														:
														(
															param.name === 'weight_decay'
															?
															algorithmParam.weight_decay_hpo
															:
															(
																param.name === 'batch_size'
																?
																algorithmParam.batch_size_hpo
																:
																false
															)
														)
													} 
												/>
													{HPO_CHECKBOX_LIST.includes(param.name) && (
														<CheckBoxArea>
															<Checkbox 	
																checked={
																	param.name === 'learning_rate'
																	?
																	algorithmParam.learning_rate_hpo
																	:
																	(
																		param.name === 'weight_decay'
																		?
																		algorithmParam.weight_decay_hpo
																		:
																		(
																			param.name === 'batch_size'
																			?
																			algorithmParam.batch_size_hpo
																			:
																			false
																		)
																	)
																} 
																onChange={() => setCheckValue(param.name)} />
														</CheckBoxArea>
													)}
											</TableRowParameter>
										);
									})
								)
							) : (
								<TableBodyTextHolderArea>
									<TableBodyTextHolder>Algorithm을 선택해 주세요.</TableBodyTextHolder>
								</TableBodyTextHolderArea>
							)}
						</TableBodyArea>
					</DialogContentText>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} okDisabled={okDisabled()} cancelClick={onCancelClicked} tooltipText={okDisabled() ? '최적값을 탐색할 파라미터를 HPO 열에서 하나 이상 선택해야 진행 가능합니다.' : ''} />
			</Dialog>
		</div>
	);
};
export default DlgHPOAlgorithm;

const SubTitle = styled.div`
	height: 19px;
	margin: 12px 0px 8px 0px;
	font-size: 14px;
	color: ${colors.text_black};
`;
const TD_1 = styled.div`
	width: 428px;
	padding-left: 20px;
`;

const TD_2 = styled.div`
	width: 402px;
`;
const TD_3 = styled.div`
	width: 113px;
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
	letter-spacing: -0.3px;
	color: #82878b;
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
	${(props) =>
		props.algorithm &&
		`
      font-weight:bold;
      color: ${colors.text_black}
    `}
`;

const TableRowParameter = styled.div`
	width: 930px;
	height: 36px;
	margin: 1px 0 0;
	padding: 2px 0;
	font-size: 13px;
	color: ${colors.text_black};
	display: flex;
	align-items: center;
`;

const TD_1_NAME = styled.div`
	width: 428px;
	padding-left: 20px;
	color: #82878b;
`;

const CheckBoxArea = styled.div`
	margin-left: 300px;
	padding-top: 2px;
`;

