import React, { useState, useEffect, useContext, memo } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import 'components/Experiment/experiment.scss';
import { colors } from 'styles';
import agent from 'lib/apis';
import { EXPERIMENT_STATUS, INPUT_TYPE } from 'constants/common';
import { parseTextListToLabelList } from 'dtos/Label';
import Label from 'dtos/Label';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import SelectCustom from 'components/common/SelectCustom';
import { HPOContext } from 'views/expRunHPO';
import InputType from 'components/common/InputType';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';

import Tooltip from 'components/common/Tooltip';

const getDefaulItem = (datas) => {
	let objectDefault = datas.find((v) => {
		return v.is_default;
	});
	return objectDefault;
};

const DlgHpoSetting = memo((props) => {
	const { dataSplit, dataAlgorithm, dataParam, dataResource, setDataHpoSettings } = props;

	const { experiment_id, setStatus, set_model_name } = useContext(HPOContext);

	const [parallel_trial_count, set_parallel_trial_count] = useState('');
	const [max_trial_count, set_max_trial_count] = useState('');
	const [max_failed_trial_count, set_max_failed_trial_count] = useState('');
	const [objective_type, set_objective_type] = useState('');
	const [objective_goal, set_objective_goal] = useState('');
	const [objective_metric_name, set_objective_metric_name] = useState('');
	const [additional_metric, set_additional_metric] = useState('');
	const [objective_type_list, set_objective_type_list] = useState([]);
	const [objective_metric_list, set_objective_metric_list] = useState([]);
	const [additional_metric_list, set_additional_metric_list] = useState([]);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_HPO_SETTINGS;
	const { showAlert } = useAlertAction();
	const { currentUser } = useAuthState();
	

	useEffect(() => {
		if (objective_metric_name) {
			let object_type = objective_metric_name.objective_type;
			set_objective_type(new Label(object_type));
			let goal = objective_metric_name.objective_goal;
			set_objective_goal(goal);
		}
	}, [objective_metric_name]);
	useEffect(() => {
		if (!isShow) {
			return;
		}
		let params = {
			experiment_id,
		};
		agent
			.getHpoSpecData(params)
			.then((response) => {
				const {
					parallel_trial_count,
					max_trial_count,
					max_failed_trial_count,
					objective_metric_list,
					objective_type,
					additional_metric_list,
				} = response.data;
				set_parallel_trial_count(parallel_trial_count);
				set_max_trial_count(max_trial_count);
				set_max_failed_trial_count(max_failed_trial_count);

				set_objective_metric_list(objective_metric_list);
				let objectDefault = getDefaulItem(objective_metric_list);
				set_objective_metric_name(objectDefault);
				set_objective_goal(objectDefault.objective_goal);

				set_objective_type_list(parseTextListToLabelList(objective_type.objective_type_list));
				set_objective_type(new Label(objectDefault.objective_type));

				set_additional_metric_list(additional_metric_list);
				let additionalDefault = getDefaulItem(additional_metric_list);
				set_additional_metric(additionalDefault);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	}, [isShow]);
	const onConfirmClicked = (e) => {
		hideDialog();
		let parameter = { ...dataParam };
		parameter.batch_size = parameter.batch_size_hpo ? '' : parameter.batch_size;
		parameter.learning_rate = parameter.learning_rate_hpo ? '' : parameter.learning_rate;
		parameter.weight_decay = parameter.weight_decay_hpo ? '' : parameter.weight_decay;
		parameter.parallel_trial_count = parallel_trial_count;
		parameter.max_trial_count = max_trial_count;
		parameter.max_failed_trial_count = max_failed_trial_count;
		parameter.objective_type = objective_type.value;
		parameter.objective_goal = objective_goal;
		parameter.objective_metric_name = objective_metric_name.objective_metric;
		parameter.additional_metric_name = additional_metric.additional_metric;
		let params = {
			user_id: currentUser.user_id,
			experiment_id: experiment_id,
			algorithm_id: dataAlgorithm.algorithm_id,
			split_type: dataSplit.split_type,
			split_training: dataSplit.split_training,
			split_validation: dataSplit.split_validation,
			split_test: dataSplit.split_test,
			split_seed: dataSplit.split_seed,
			split_stratify: dataSplit.t_split_stratify,
			preset_id: dataResource.preset_id,
			parameter,
		};
		const data = {
			max_trial_count: max_trial_count,
			parallel_trial_count: parallel_trial_count,
			max_failed_trial_count: max_failed_trial_count,
			objective_type: objective_type.value,
			objective_goal: objective_goal,
			objective_metric_name: objective_metric_name.objective_metric,
			additional_metric_name: additional_metric.additional_metric,
		};
		setDataHpoSettings(data);
		agent
			.startHpo(params)
			.then((response) => {
				let { model_name } = response.data;
				set_model_name(model_name);
				setStatus(EXPERIMENT_STATUS.RUNNING);
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
	const onCancelClicked = (e) => {
		hideDialog();
	};

	const isParallelCountErrror = parseInt(parallel_trial_count) <= parseInt(max_trial_count) ? false : true;
	const isFailedCountErrror = parseInt(max_failed_trial_count) <= parseInt(max_trial_count) ? false : true;

	// "", null, undefined, 0, NaN => false
	const okDisabled = () => {
		return !(
			parallel_trial_count &&
			max_trial_count &&
			max_failed_trial_count &&
			objective_type &&
			objective_goal &&
			objective_metric_name &&
			additional_metric &&
			!isParallelCountErrror &&
			!isFailedCountErrror
		);
	};

	return (
		<div>
			<Dialog
				className={'exp_run_hpo_setting_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'HPO Settings'} toggle={hideDialog} />
				<DialogContentArea>
					<ContentTitle>HPO Settings</ContentTitle>
					<SingleLine style={{ borderTop: 'solid 1px #d2d7db' }}>
						<ItemTitle>
							<div className="itemTitleLeft">MaxTrialCount</div>
							<div className="itemTitleRight">(Max. 10)</div>
						</ItemTitle>
						<InputType
							style={{
								width: '180px',
								height: '28px',
								textAlign: 'left',
								fontSize: '14px',
								padding: '5px 8px 5px 12px',
							}}
							type={INPUT_TYPE.NUMBER_INT}
							max={2}
							step={1}
							value={max_trial_count}
							minValue={1}
							maxValue={10}
							setValue={set_max_trial_count}
						/>
						<ItemInfo isParallelCountErrror={isParallelCountErrror} isFailedCountErrror={isFailedCountErrror}>
							<div className="textArea">실행되는 Trial의 최대 개수</div>
						</ItemInfo>
					</SingleLine>
					<SingleLine>
						<ItemTitle>
							<div className="itemTitleLeft">ParallelTrialCount</div>
							<div className="itemTitleRight">(Max. 10)</div>
						</ItemTitle>
						<InputType
							style={{
								width: '180px',
								height: '28px',
								textAlign: 'left',
								fontSize: '14px',
								padding: '5px 8px 5px 12px',
							}}
							type={INPUT_TYPE.NUMBER_INT}
							max={2}
							step={1}
							value={parallel_trial_count}
							minValue={1}
							maxValue={10}
							setValue={set_parallel_trial_count}
						/>
						<ItemInfo isParallelCountErrror={isParallelCountErrror} isFailedCountErrror={isFailedCountErrror}>
							<div className="textArea">병렬로 처리할 수 있는 Trial의 개수</div>
							<div className="errorTextArea parallel">&#8251; MaxTrialCount와 같거나 작아야 합니다.</div>
						</ItemInfo>
					</SingleLine>
					<SingleLine style={{ borderBottom: 'solid 1px #d2d7db' }}>
						<ItemTitle>
							<div className="itemTitleLeft maxFailed">MaxFailedTrialCount</div>
							<div className="itemTitleRight">(Max. 10)</div>
						</ItemTitle>
						<InputType
							style={{
								width: '180px',
								height: '28px',
								textAlign: 'left',
								fontSize: '14px',
								padding: '5px 8px 5px 12px',
							}}
							type={INPUT_TYPE.NUMBER_INT}
							max={2}
							step={1}
							value={max_failed_trial_count}
							minValue={1}
							maxValue={10}
							setValue={set_max_failed_trial_count}
						/>
						<ItemInfo isParallelCountErrror={isParallelCountErrror} isFailedCountErrror={isFailedCountErrror}>
							<div className="textArea">Trial의 최대 실패 개수</div>
							<div className="errorTextArea failed">&#8251; MaxTrialCount와 같거나 작아야 합니다.</div>
						</ItemInfo>
					</SingleLine>
					<div style={{ height: '30px' }} />
					<ContentTitle>Objective</ContentTitle>
					<SingleLineObject style={{ borderTop: 'solid 1px #d2d7db' }}>
						<ItemTitle data-tip data-for={'hpo_objective_metric_name_tooltip'}>
							ObjectiveMetricName
							<Tooltip id={'hpo_objective_metric_name_tooltip'} text={'최적 여부를 평가할 척도를 선택합니다.\n 일반적으로 검증(validation) 데이터의 평가척도 최대화 또는 손실함수 최소화 중 하나를 선택합니다.'}/>
						</ItemTitle>
						<SelectCustom
							styleOptions={optionStyle}
							isDisabled={false}
							isLoading={false}
							isClearable={false}
							isRtl={false}
							isSearchable={false}
							options={objective_metric_list}
							getOptionLabel={(option) => option.objective_metric}
							getOptionValue={(option) => option.objective_metric}
							onChange={set_objective_metric_name}
							value={objective_metric_name}
							isRemovePrefixCurrent={true}
							isSingleData={true}
							label_key={'objective_metric'}
							value_key={'objective_metric'}
						/>
					</SingleLineObject>
					<SingleLineObject>
						<ItemTitle>Type</ItemTitle>
						<SelectCustom
							styleOptions={optionStyle}
							isDisabled={false}
							isLoading={false}
							isClearable={false}
							isRtl={false}
							isSearchable={false}
							options={objective_type_list}
							getOptionLabel={(option) => option.label}
							getOptionValue={(option) => option.value}
							onChange={set_objective_type}
							value={objective_type}
							isRemovePrefixCurrent={true}
							isSingleData={true}
						/>
					</SingleLineObject>
					<SingleLineObject>
						<ItemTitle data-tip data-for={'hpo_goal_tooltip'}>
							Goal
							<Tooltip id={'hpo_goal_tooltip'} text={'ObjectiveMetricName에서 선택한 척도의 최대 또는 최소 목표값입니다.\n해당 값 도달시 탐색을 종료합니다.'}/>
						</ItemTitle>
						{objective_metric_name &&
						(objective_metric_name.objective_metric.includes('loss') || objective_metric_name.objective_metric.includes('rmse')) ? (
							<InputType
								style={{
									width: '380px',
									height: '28px',
									textAlign: 'left',
									fontSize: '14px',
									padding: '5px 8px 5px 12px',
									background: '#fff',
								}}
								type={INPUT_TYPE.NUMBER_FLOAT}
								max={10}
								value={objective_goal}
								minValue={0}
								maxValue={1}
								setValue={set_objective_goal}
								disabled={false}
							/>
						) : (
							<InputType
								style={{
									width: '380px',
									height: '28px',
									textAlign: 'left',
									fontSize: '14px',
									padding: '5px 8px 5px 12px',
									background: '#fff',
								}}
								type={INPUT_TYPE.NUMBER_INT}
								max={3}
								value={objective_goal}
								minValue={1}
								maxValue={100}
								setValue={set_objective_goal}
								disabled={false}
							/>
						)}
					</SingleLineObject>
					<SingleLineObject style={{ borderBottom: 'solid 1px #d2d7db' }}>
						<ItemTitle data-tip data-for={'hpo_additional_metric_names_tooltip'}>
							AdditionalMetricNames
							<Tooltip id={'hpo_additional_metric_names_tooltip'} text={'ObjectiveMetricName 외에 추가로 확인할 평가 척도를 선택합니다.'}/>
						</ItemTitle>
						<SelectCustom
							styleOptions={optionStyle}
							isDisabled={false}
							isLoading={false}
							isClearable={false}
							isRtl={false}
							isSearchable={false}
							options={additional_metric_list}
							getOptionLabel={(option) => option.label}
							getOptionValue={(option) => option.value}
							onChange={set_additional_metric}
							value={additional_metric}
							isRemovePrefixCurrent={true}
							isSingleData={true}
							label_key={'additional_metric'}
							value_key={'additional_metric'}
						/>
					</SingleLineObject>
				</DialogContentArea>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} okDisabled={okDisabled()} />
			</Dialog>
		</div>
	);
});

export default DlgHpoSetting;

const optionStyle = {
	width: '380px',
	height: '36px',
};

const DialogContentArea = styled.div`
	width: 660px;
	height: 456px;
	padding: 16px 24px 24px 16px;
`;

const ContentTitle = styled.div`
	height: 19px;
	margin-bottom: 8px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const SingleLine = styled.div`
	width: 614px;
	height: 45px;
	display: flex;
	align-items: center;
`;

const SingleLineObject = styled.div`
	width: 614px;
	height: 50px;
	display: flex;
	align-items: center;
`;

const ItemTitle = styled.div`
	width: 160px;
	height: 100%;
	margin-left: 16px;
	margin-right: 42px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #82878b;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.itemTitleRight {
		font-size: 8px;
	}
`;

const ItemInfo = styled.div`
	width: 196px;
	height: 45px;
	margin-left: 10px;
	font-size: 11px;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.textArea {
		font-weight: 500;
		font-stretch: normal;
		font-style: normal;
		line-height: normal;
		color: #82878b;
	}

	.errorTextArea {
		display: none;
		font-size: 7px;
		color: red;

		&.parallel {
			${(props) =>
				props.isParallelCountErrror &&
				`
        display: block;
      `}
			${(props) =>
				!props.isParallelCountErrror &&
				`
        display: none;
      `}
		}

		&.failed {
			${(props) =>
				props.isFailedCountErrror &&
				`
        display: block;
      `}
			${(props) =>
				!props.isFailedCountErrror &&
				`
        display: none;
      `}
		}
	}
`;
