import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { EXPERIMENT_STATUS, RUN_TYPE } from 'constants/common';

import { useCommonState } from 'store/common/hooks';

import { ROUTER_EXPERIMENT_RUN, ROUTER_EXPERIMENT_RUN_AUTOML, ROUTER_EXPERIMENT_RUN_HPO } from 'components/layout/MenuConst';
import CommonMoreButton from 'components/common/MoreButton';

const TOOLTIP_TEXT = {
	RUN: '데이터의 일반 학습모드입니다.',
	HPO: '데이터의 하이퍼 파라미터 최적화 학습모드입니다.',
	AUTO_ML: '머신러닝 모델 개발 자동화 학습모드입니다.',
	INFERENCE: '모델에 새로운 데이터를 입력하여 출력 결과를 확인합니다.',
	SAVE_TEMPLATE: '모델 학습 과정에 적용된 Preprocess, Experiment 설정을 재활용 가능한 템플릿으로 저장합니다.',
	REG_MODEL: '선택한 모델을 Models에 등록하여 배포 준비를 합니다.',
};

export default function MoreComponent(props) {
	const { data, handleToggleSaveTemplate, handleToggleRegisterModal, inferenceClicked, handleToggleChangeModelName, guideText } = props;
	const { experiment_id } = data;

	const { loadTemplate } = useCommonState();
	/*
  Status가 ‘Completed’인경우
  - Inference/Save as a template/Register model
  Status가 ‘Draft’인경우
  -  Run 만 표시됨
  */
	const status = data.working_status_nm.toLowerCase();

	const history = useHistory();

	const [menuList, setMenuList] = useState([]);
	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			switch (status) {
				case EXPERIMENT_STATUS.NONE:
				case EXPERIMENT_STATUS.DRAFT:
					item = {
						text: 'Run',
						onClick: () => {
							history.push('/' + ROUTER_EXPERIMENT_RUN + '/' + experiment_id);
						},
						tooltip: TOOLTIP_TEXT.RUN,
					};
					list.push(item);

					if (!loadTemplate) {
						item = {
							text: 'HPO',
							onClick: () => {
								history.push('/' + ROUTER_EXPERIMENT_RUN_HPO + '/' + experiment_id);
							},
							tooltip: TOOLTIP_TEXT.HPO,
						};
						list.push(item);
						item = {
							text: 'AutoML',
							onClick: () => {
								history.push('/' + ROUTER_EXPERIMENT_RUN_AUTOML + '/' + experiment_id);
							},
							tooltip: TOOLTIP_TEXT.AUTO_ML,
						};
						list.push(item);
					}
					break;
				case EXPERIMENT_STATUS.SUCCEEDED:
					item = {
						text: 'Inference',
						onClick: () => {
							inferenceClicked(experiment_id);
						},
						tooltip: TOOLTIP_TEXT.INFERENCE,
					};
					list.push(item);
					item = {
						text: 'Save as a template',
						onClick: () => {
							handleToggleSaveTemplate(data);
						},
						tooltip: TOOLTIP_TEXT.SAVE_TEMPLATE,
					};
					list.push(item);
					item = {
						text: 'Register Model',
						onClick: () => {
							handleToggleRegisterModal(data);
						},
						tooltip: TOOLTIP_TEXT.REG_MODEL,
					};
					list.push(item);
					break;
				case EXPERIMENT_STATUS.ABORTED:
					const { train_type } = data;
					if (train_type !== RUN_TYPE.HPO) {
						item = {
							text: 'Inference',
							onClick: () => {
								inferenceClicked(experiment_id);
							},
							tooltip: TOOLTIP_TEXT.INFERENCE,
						};
						list.push(item);
						item = {
							text: 'Save as a template',
							onClick: () => {
								handleToggleSaveTemplate(data);
							},
							tooltip: TOOLTIP_TEXT.SAVE_TEMPLATE,
						};
						list.push(item);
						item = {
							text: 'Register Model',
							onClick: () => {
								handleToggleRegisterModal(data);
							},
							tooltip: TOOLTIP_TEXT.REG_MODEL,
						};
						list.push(item);
					}
					break;
				case EXPERIMENT_STATUS.PUBLISHED:
					item = {
						text: 'Inference',
						onClick: () => {
							inferenceClicked(experiment_id);
						},
						tooltip: TOOLTIP_TEXT.INFERENCE,
					};
					list.push(item);
					item = {
						text: 'Save as a template',
						onClick: () => {
							handleToggleSaveTemplate(data);
						},
						tooltip: TOOLTIP_TEXT.SAVE_TEMPLATE,
					};
					list.push(item);
					break;
				default:
					break;
			}
		}
		item = {
			text: 'Change Model Name',
			onClick: () => {
				handleToggleChangeModelName(data);
			},
			tooltip: '모델 명을 수정합니다.',
		};
		list.push(item);

		setMenuList(list);
	}, [data]);

	return <CommonMoreButton style={{ width: '170px' }} list={menuList} guideText={guideText} />;
}
