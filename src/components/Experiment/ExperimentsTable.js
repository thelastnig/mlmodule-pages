import React, { useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';
import { RUN_TYPE } from 'constants/common';
import SearchFile from 'assets/icon/group-2.png';

import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { useHandleState, useStateActionHandler } from 'store/experiments/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import Details from 'component/dialog/ExperimentDetail';
import MoreButton from 'components/Experiment/MoreButton';
import { SatusDot } from 'components/common/StyledComponent';
import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow, TD_COMMON, TH_COMMON } from 'components/common/table/TableComponent';
import { ROUTER_EXPERIMENT_RUN, ROUTER_EXPERIMENT_RUN_HPO, ROUTER_INFERENCE } from 'components/layout/MenuConst';
import DialogSaveAsATemplate from 'component/dialog/SaveAsATemplate';
import RegisterModal from 'component/dialog/RegisterModel';
import { checkInference } from 'views/Inference';
import ChangeModelName from 'component/dialog/ChangeModelName';
import { checkIsRunning } from 'views/expRun';
import NewBadge from 'component/NewBadge';

import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

/* Experiment의 Status
  Draft : Run 대기 상태
  Pending : 실행 전 상태
  Running : 실행 중
  Succeeded : 실험 완료
  Failed : 실패
  Aborted : 중단됨
  Published : 배포됨
*/
const HIDE_DETAIL_BUTTON_STATUS = ['draft'];
const showDetailButton = (data) => {
	let result = true;
	if (data) {
		if (HIDE_DETAIL_BUTTON_STATUS.includes(data.working_status_nm.toLowerCase())) {
			result = false;
		}
	}
	return result;
};

export default function ExperimentsTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, fetchList, total_row_count, start_index } = props;

	const { showAlert } = useAlertAction();

	const history = useHistory();
	const { isMyProject } = useCommonState();
	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	const [detailModal, setDetailModal] = useState(false);
	const [saveTemplate, setSaveTemplate] = useState(false);
	const [registerModal, setRegisterModal] = useState(false);
	const [changeModelName, setChangeModelName] = useState(false);

	const { showDialog } = useDialogAction();

	const handleToggleSaveTemplate = (data) => {
		setSaveTemplate(data);
		showDialog(dialogList.EXPERIMENT_SAVE_TEMPLATE);
	};

	const handleToggleRegisterModal = (data) => {
		setRegisterModal(data);
		showDialog(dialogList.EXPERIMENT_REGISTER_MODEL);
	};

	const handleToggleChangeModelName = (data) => {
		setChangeModelName(data);
		showDialog(dialogList.EXPERIMENT_CHANGE_MODEL_NAME);
	};

	let emptyRowCnt = maxRowCnt - list.length;

	const handleToggleDetailModal = (data) => {
		if (data && checkIsRunning(data.working_status_nm)) {
			const { train_type } = data;
			let target = ROUTER_EXPERIMENT_RUN;
			if (train_type === RUN_TYPE.HPO) {
				target = ROUTER_EXPERIMENT_RUN_HPO;
			}
			history.push('/' + target + '/' + data.experiment_id);
		} else {
			setDetailModal(data);
			showDialog(dialogList.EXPERIMENT_DETAIL);
		}
	};

	const goToInference = (experiment_id) => {
		history.push('/' + ROUTER_INFERENCE + '/' + experiment_id);
	};
	const inferenceFail = () => {
		showAlert({
			message: '현재 다른 추론이 진행되고 있습니다.',
		});
	};

	const inferenceClicked = (experiment_id) => {
		checkInference(experiment_id, goToInference, inferenceFail);
	};

	let firstDraftIdx = -1;
	for(let i=0; i<list.length; i++) {
		if(list[i].working_status_nm.toLowerCase() === 'draft') {
			firstDraftIdx = i;
			break;
		}
	}	

	return (
		<>
			<RegisterModal fetchList={fetchList} data={registerModal} />
			<DialogSaveAsATemplate data={saveTemplate} />
			<Details data={detailModal} />
			<ChangeModelName fetchList={fetchList} data={changeModelName} />
			<StyledTable>
				<TableHeaderComponent>
					<TH_1>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_1>
					<TH_COMMON style={Cell2}>
						<SortIcon
							columnName={'ID'}
							sortColumn={'experiment_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Model'}
							sortColumn={'model_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'Algorithm'}
							sortColumn={'algorithm_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell6}>
						<SortIcon
							columnName={'Status'}
							sortColumn={'working_status_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell7}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell8}>
						<SortIcon
							columnName={'Runtime'}
							sortColumn={'run_time'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell9}>
						<div>Details</div>
					</TH_COMMON>
					<TH_COMMON>
						<div></div>
					</TH_COMMON>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => {
						const tooltipId = uuid();						

						return (
							<TableRow
								key={index}
								isChecked={checkItems.includes(data)}
								onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
							>
								{
									<>
										<TD_1>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
											/>
										</TD_1>
										<TD_COMMON style={Cell2}>{data.experiment_id}</TD_COMMON>
										<TD_COMMON style={Cell3}>
											<div>{data.model_nm}</div>
											<NewBadge date={data.create_date} />
										</TD_COMMON>
										<TD_COMMON style={Cell4}>{data.algorithm_nm}</TD_COMMON>
										<TD_COMMON style={Cell5}>
											{data.dataset_nm} / v{data.dataset_version}
										</TD_COMMON>
										<TD_COMMON style={Cell6}>
											<SatusDot type={data.working_status_nm.toLowerCase()}></SatusDot>
											{data.working_status_nm}
										</TD_COMMON>
										<TD_COMMON style={{ ...Cell7, color: colors.light_blue }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_COMMON>
										<TD_COMMON style={{ ...Cell8, color: colors.gray_dark }}>{DateUtil.parseTimeToDHM(data.run_time)}</TD_COMMON>
										<TD_COMMON style={Cell9}>
											<div style={{ width: '55px', textAlign: 'center' }}>
												{showDetailButton(data) && (
													<DetailBtn
														onClick={(e) => {
															e.preventDefault();
															e.stopPropagation();
															handleToggleDetailModal(data, e);
														}}
													>
														<img src={SearchFile} width="20px" height="20px" alt="" />
													</DetailBtn>
												)}
											</div>
										</TD_COMMON>
										<TD_COMMON style={Cell10}>
											{isMyProject && (
												<div data-tip data-for={tooltipId}>
													<MoreButton
														data={data}
														handleToggleRegisterModal={handleToggleRegisterModal}
														handleToggleSaveTemplate={handleToggleSaveTemplate}
														inferenceClicked={inferenceClicked}
														handleToggleChangeModelName={handleToggleChangeModelName}
														guideText={(
																		start_index === 0 && 
																		index === firstDraftIdx && 
																		data.working_status_nm.toLowerCase() === 'draft'
																	) ? '학습 모드를 선택합니다.' : ''}
													/>
												</div>
											)}
										</TD_COMMON>
									</>
								}
							</TableRow>
						);
					})}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const Cell2 = {
	width: '50px',
};
const Cell3 = {
	width: '310px',
	paddingLeft: '10px',
	paddingRight: '20px',
};
const Cell4 = {
	width: '320px',
	paddingLeft: '60px',
	paddingRight: '40px',
};
const Cell5 = {
	width: '318px',
	paddingLeft: '20px',
	paddingRight: '18px',
};
const Cell6 = {
	width: '126px',
	paddingLeft: '18px',
	paddingRight: '18px',
};
const Cell7 = {
	width: '118px',
	paddingLeft: '18px',
	paddingRight: '20px',
};
const Cell8 = {
	width: '124px',
	paddingLeft: '20px',
	paddingRight: '4px',
};
const Cell9 = {
	width: '66px',
	paddingLeft: '4px',
	paddingRight: '8px',
};
const Cell10 = {
	width: '40px',
	paddingLeft: '6px',
	paddingRight: '8px',
};
const TD_1 = styled.td`
	width: 52px;
	padding-left: 23px;
`;
const TH_1 = styled.th`
	width: 52px;
	padding-left: 23px;
`;
const DetailBtn = styled.div`
	width: 20px;
	display: inline-block;
	cursor: pointer;
`;
