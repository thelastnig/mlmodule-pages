import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { useHistory } from 'react-router-dom';

import 'components/Experiment/experiment.scss';
import { colors } from 'styles';
import agent from 'lib/apis';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { StyledTable } from 'components/common/table/TableComponent';
import Checkbox, { checkClickCB } from 'components/common/table/Checkbox';
import { AutoMlContext } from 'views/expRunAutoML';
import { ROUTER_EXPERIMENT } from 'components/layout/MenuConst';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';

const parseAlgorithmList = (checkItems, obj) => {
	let result = [];
	checkItems.forEach((v) => {
		let algorithm_id = v.algorithm_id;
		let item = {
			algorithm_id,
			parameter: obj[algorithm_id],
		};
		result.push(item);
	});
	return result;
};
export default function AutoMLConfiguration(props) {
	const { data, experiment_id } = props;

	const history = useHistory();
	const { checkItems: list, algorithmListObj, dataset_info } = data;

	const [checkItems, setCheckItems] = useState([]);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_AUTOML_CONFIGURATION;
	const { showAlert } = useAlertAction();
	const { currentUser } = useAuthState();

	useEffect(() => {
		if (isShow) {
			setCheckItems(list);
		} else {
			setCheckItems([]);
		}
	}, [isShow]);
	const { trainValue, validationValue, testValue } = useContext(AutoMlContext);

	const onConfirmClicked = (e) => {
		hideDialog();
		let params = {
			user_id: currentUser.user_id,
			experiment_id,
			split_type: 'T',
			split_training: trainValue,
			split_validation: validationValue,
			split_test: testValue,
			split_seed: '50',
			split_cross: null,
			split_stratify: true,
			algorithm_list: parseAlgorithmList(checkItems, algorithmListObj),
		};
		agent
			.startAutoMl(params)
			.then((response) => {
				/*
        guide
        confirm 을 누르게 되면 해당 알고리즘의 목록을 백엔드에 넘겨주고, experiment 화면으로 이동 (EX-001)
        */
				history.push('/' + ROUTER_EXPERIMENT);
			})
			.catch((error) => {
				console.log('error ', error);
				if (error.data.detail)
					showAlert({
						message: error.data.detail,
					});
				else
					showAlert({
						message: error.statusText,
					});
			})
			.finally((v) => {});
	};

	return (
		<div>
			<Dialog
				className={'exp_run_automl_configuration_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'AutoML Configuration'} toggle={hideDialog} />
				<DialogContentArea>
					<ConfigurationArea>
						<SingleLine>
							<ItemTitle>Dataset :</ItemTitle>
							<ItemDescription style={{ width: '400px' }}>{dataset_info.dataset_nm}</ItemDescription>
						</SingleLine>
						<SingleLine style={{ marginTop: '8px' }}>
							<ItemTitle>Train :</ItemTitle>
							<ItemDescription style={{ width: '60px' }}>{trainValue}(%)</ItemDescription>
							<ItemTitle>Validation :</ItemTitle>
							<ItemDescription style={{ width: '60px' }}>{validationValue}(%)</ItemDescription>
							<ItemTitle>Test :</ItemTitle>
							<ItemDescription style={{ width: '60px' }}>{testValue}(%)</ItemDescription>
						</SingleLine>
					</ConfigurationArea>
					<TableArea>
						<StyledTable>
							<StyledTableHeader>
								<TD_1></TD_1>
								<TD_2>
									<div>No.</div>
								</TD_2>
								<TD_3>
									<div>Algorithm</div>
								</TD_3>
							</StyledTableHeader>
							<Tbody>
								{list.map((data, index) => (
									<StyledTableRow
										key={index}
										isChecked={checkItems.includes(data)}
										onClick={(e) => checkClickCB(data, checkItems, setCheckItems)}
									>
										{
											<>
												<TD_1>
													<div style={{ marginTop: '5px' }}>
														<Checkbox
															data={data}
															checked={checkItems.includes(data)}
															checkItems={checkItems}
															setCheckItems={setCheckItems}
															// NoClickable={true}
														/>
													</div>
												</TD_1>
												<TD_2>{index + 1}</TD_2>
												<TD_3>{data.algorithm_nm}</TD_3>
											</>
										}
									</StyledTableRow>
								))}
							</Tbody>
						</StyledTable>
					</TableArea>
				</DialogContentArea>
				<DialogFooter confirmClick={onConfirmClicked} okDisabled={checkItems.length < 1} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const DialogContentArea = styled.div`
	width: 582px;
	height: 300px;
	padding: 12px 24px 12px 24px;
`;

const ConfigurationArea = styled.div`
	height: 76px;
`;

const SingleLine = styled.div`
	width: 100%;
	height: 20px;
	display: flex;
	align-items: center;
`;

const ItemTitle = styled.div`
	margin-right: 8px;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const ItemDescription = styled.div`
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const TableArea = styled.div`
	height: 182px;
`;

const TD_1 = styled.td`
	width: 60px;
	padding-left: 19px;
`;

const TD_2 = styled.td`
	display: flex;
	width: 80px;
	padding-left: 8px;
	padding-right: 8px;
`;

const TD_3 = styled.td`
	display: flex;
	width: 380px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;

const Tbody = styled.div`
	width: 100%;
	height: 150px;
	overflow-y: auto;
`;

const StyledTableHeader = styled.thead`
	width: 100%;
	height: 35px;
	padding: 7px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	border-bottom: 1px solid #eaebec;
`;

const StyledTableRow = styled.tr`
	width: 100%;
	height: 37px;
	padding: 1px 0 0 0;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;
