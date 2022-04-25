import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import 'components/Experiment/experiment.scss';
import { colors } from 'styles';
import DataParser from 'utils/DataParser';
import { useStateActionHandler as useSettingActionHandler } from 'store/setting/hooks';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { ExperimentAlgorithm, ExperimentParameter, ExperimentDataSplit } from 'components/common/ExperimentComponent';
import { SortIcon, StyledTable } from 'components/common/table/TableComponent';
import { checkOnlyOneClickCB } from 'components/common/table/Checkbox';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function DlgResource(props) {
	const { dataSplit, dataAlgorithm, dataParam, setResourceCB, experiment_id, algorithm } = props;

	const { onFetchPresetListCCB } = useSettingActionHandler();

	const [presetList, setPresetList] = useState([]);
	const [preset, setPreset] = useState('');
	const [checkItems, setCheckItems] = useState([]);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_RESOURCE;

	const onConfirmClicked = (e) => {
		setResourceCB(preset);
		hideDialog();
	};

	const onCancelClicked = (e) => {
		hideDialog();
	};

	useEffect(() => {
		if (isShow) {
			let params = {
				experiment_id: experiment_id,
				algorithm_id: dataAlgorithm.algorithm_id,
				batch_size: dataParam.batch_size || 32,
			};
			onFetchPresetListCCB(params)
				.then((response) => {
					console.log('then response = ', response);
					const { list } = response.data;
					setPresetList(list);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		} else {
			setPresetList([]);
			setPreset('');
			setCheckItems([]);
		}
	}, [isShow]);

	return (
		<div>
			<Dialog
				className={'resource_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Resources'} toggle={hideDialog} />
				<DialogContent>
					<div>
						<ContentItemTitle>Configuration</ContentItemTitle>
						<ConfigurationItemArea>
							<ConfigurationItemTitleArea>
								<div style={{ width: '287px' }}>
									<ExperimentDataSplit data={dataSplit} />
								</div>
								<div style={{ width: '287px' }}>
									<ExperimentAlgorithm data={dataAlgorithm} />
								</div>
								<div style={{ width: '287px' }}>
									<ExperimentParameter data={dataParam} algorithm={algorithm} />
								</div>
							</ConfigurationItemTitleArea>
						</ConfigurationItemArea>
					</div>
					<div>
						<ContentItemTitle>Presets</ContentItemTitle>
						<TableArea>
							<StyledTable>
								<StyledTableHeader>
									<TH_1>
										<div>No.</div>
									</TH_1>
									<TH_2>
										<div>GPU</div>
										<SortIcon />
									</TH_2>
									<TH_3>
										<div>CPU</div>
										<SortIcon />
									</TH_3>
									<TH_4>
										<div>RAM</div>
										<SortIcon />
									</TH_4>
								</StyledTableHeader>
								<Tbody>
									{presetList.map((data, index) => (
										<StyledTableRow
											key={index}
											isChecked={checkItems.includes(data)}
											onClick={(e) => {
												setPreset(data);
												checkOnlyOneClickCB(data, checkItems, setCheckItems);
											}}
										>
											{
												<>
													<TH_1>{index + 1}</TH_1>
													<TH_2>{DataParser.parseGPU(data)}</TH_2>
													<TH_3>{DataParser.parseCPU(data)}</TH_3>
													<TH_4>{DataParser.parseRAM(data)}</TH_4>
												</>
											}
										</StyledTableRow>
									))}
								</Tbody>
							</StyledTable>
						</TableArea>
					</div>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 0 24px;
	height: 480px;
`;

const ContentItemTitle = styled.div`
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

const ConfigurationItemArea = styled.div`
	width: 863px;
	height: 190px;
	border-radius: 4px;
	border: solid 1px ${colors.gray_blue_gray};
`;

const ConfigurationItemTitleArea = styled.div`
	background-color: #f8f9fa;
	width: 100%;
	height: 36px;
	border-bottom: solid 1px #d5dce4;
	border-radius: 4px 4px 0 0;
	display: flex;
`;

const TableArea = styled.div`
	height: 180px;
`;

const TH_1 = styled.div`
	width: 210px;
	display: flex;
	padding-left: 30px;
	padding-right: 8px;
`;

const TH_2 = styled.div`
	width: 280px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TH_3 = styled.div`
	width: 180px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
`;

const TH_4 = styled.div`
	width: 180px;
	display: flex;
	padding-left: 8px;
	padding-right: 8px;
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
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;
