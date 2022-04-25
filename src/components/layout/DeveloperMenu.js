import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Collapse from '@material-ui/core/Collapse';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';
import agent from 'lib/apis';
import { RUN_TYPE } from 'constants/common';

import { useCommonState } from 'store/common/hooks';

import { ListSubheaderSt, WrapDivider } from 'components/layout/MenuComponent';
import {
	checkSelected,
	ROUTER_ANALYZE,
	ROUTER_ANNOTATION,
	ROUTER_DATASET,
	ROUTER_EXPERIMENT,
	ROUTER_EXPERIMENT_RUN,
	ROUTER_EXPERIMENT_RUN_HPO,
	ROUTER_GROUPS,
	ROUTER_HOME,
	ROUTER_INFERENCE,
	ROUTER_MODELS,
	ROUTER_MONITOR,
	ROUTER_PREPROCESS,
	ROUTER_TEMPLATE,
} from 'components/layout/MenuConst';
import { checkIsCompleted } from 'views/expRun';
import MenuItemComponent, { EmptyProjectTooltip, MenuArrowIcon, StatusTooltip, GeneralTootip } from 'components/layout/MenuItemComponent';

const TOOLTIP_TYPE = {
	GENERAL: 'GENERAL',
	EMPTY_PROJECT: 'EMPTY_PROJECT',
	STATUS: 'STATUS',
};

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: 'white',
		color: colors.brand,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));

export default function DeveloperMenu() {
	const classes = useStyles();

	const { loadProject, run, inference, preprocess, analyze, deploy, isMyProject, isToolTipHide } = useCommonState();

	const [openDataMenu, setOpenDataMenu] = React.useState(true);
	const [openExpMenu, setOpenExpMenu] = React.useState(true);
	const location = useLocation();
	const history = useHistory();
	const pathname = location.pathname.split('/')[1];

	const handleClick = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setOpenDataMenu(!openDataMenu);
	};

	const handleClick2 = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setOpenExpMenu(!openExpMenu);
	};

	const preProcessClicked = useCallback((path, enable) => {
		if (!enable) {
			return;
		}
		let params = {
			project_id: loadProject.project_id,
		};
		agent
			.getPreprocessSetting(params)
			.then((response) => {
				const { dataset_id } = response.data;
				path = path + '/' + dataset_id;
				menuClicked(path, enable);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	const analyzeClicked = useCallback((path, enable) => {
		if (!enable) {
			return;
		}
		let params = {
			project_id: loadProject.project_id,
		};
		agent
			.getAnalyzeSetting(params)
			.then((response) => {
				const { dataset_id } = response.data;
				path = path + '/' + dataset_id;
				menuClicked(path, enable);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	const runClicked = useCallback((path, enable) => {
		if (!enable) {
			return;
		}
		let params = {
			project_id: loadProject.project_id,
		};
		agent
			.getRunSetting(params)
			.then((response) => {
				const { experiment_id, train_type } = response.data;
				let target = ROUTER_EXPERIMENT_RUN;
				if (train_type === RUN_TYPE.HPO) {
					target = ROUTER_EXPERIMENT_RUN_HPO;
					// } else if (train_type === RUN_TYPE.AUTOML) {   //run을 이용해서 automl로 가는 동작은 없다
					//   target = ROUTER_EXPERIMENT_RUN_AUTOML
				}
				let path = target + '/' + experiment_id;
				menuClicked(path, enable);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const inferenceClicked = useCallback((path, enable) => {
		if (!enable) {
			return;
		}
		let params = {
			project_id: loadProject.project_id,
		};
		agent
			.hasOtherInferenceRunning({ params })
			.then((response) => {
				const { experiment_id } = response.data;
				let path = ROUTER_INFERENCE + '/' + experiment_id;
				menuClicked(path, enable);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const modelClicked = useCallback((path, enable) => {
		if (enable) {
			agent
				.getModelSetting()
				.then((response) => {
					const {
						// start_date,
						// status,
						model_name,
					} = response.data;
					let path = ROUTER_MODELS + '/' + model_name;
					menuClicked(path, true);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		} else {
			menuClicked(path, true);
		}
	});
	const menuClicked = useCallback((path, enable) => {
		console.log('menuClicked ', path, enable);
		if (enable) {
			history.push('/' + path);
		}
	});

	/*
  menuValue : preprocess , analyze, run, inference
  */
	const checkSubMenuUsable = (menuValue) => {
		if (!loadProject) {
			return false;
		}
		if (checkIsCompleted(loadProject.working_status_nm.toLowerCase())) {
			return false;
		}
		if (!isMyProject) {
			return false;
		}
		return menuValue;
	};

	const renderTooltip = (type, key, texts, startDate, load) => {
		if(!isToolTipHide) {
			if(type === TOOLTIP_TYPE.GENERAL) {
				return <GeneralTootip tooltip_key={key} texts={texts} />;
			} else if(type === TOOLTIP_TYPE.EMPTY_PROJECT) {
				return <EmptyProjectTooltip enable={!loadProject} tooltip_key={key} texts={texts} />;
			} else if(type === TOOLTIP_TYPE.STATUS) {
				return <StatusTooltip startDate={startDate} tooltip_key={key} loadProject={load} texts={texts} />;
			} else {
				return <></>;
			}
		} else {
			return <></>;
		}
	};

	return (
		<>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheaderSt component="div" id="nested-list-subheader">
						Main
					</ListSubheaderSt>
				}
				className={classes.root}
			>
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_HOME, true)}
					isSelected={checkSelected(pathname, ROUTER_HOME)}
					itemIcon={THEME.getImageURL('icon-home')}
					text={'Home'}
					tooltip_key={'home_tooltip'}
				>
					{renderTooltip(TOOLTIP_TYPE.GENERAL, 'home_tooltip', ['프로젝트를 조회 및 선택합니다.'], null, null)}
				</MenuItemComponent>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_TEMPLATE, !!loadProject)}
					isSelected={checkSelected(pathname, ROUTER_TEMPLATE)}
					isDisabed={!loadProject}
					tooltip_key={'template_tooltip'}
					itemIcon={THEME.getImageURL('icon-template')}
					text={'Template'}
				>					
					{renderTooltip(TOOLTIP_TYPE.EMPTY_PROJECT, 'template_tooltip', ['저장된 머신러닝 템플릿을 사용합니다.', '저장된 Preprocess, Experiment 설정을 사용합니다.'], null, null)}
				</MenuItemComponent>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_DATASET, !!loadProject)}
					isSelected={checkSelected(pathname, ROUTER_DATASET)}
					isDisabed={!loadProject}
					tooltip_key={'data_tooltip'}
					itemIcon={THEME.getImageURL('icon-data')}
					text={'Data'}
				>
					<MenuArrowIcon onClick={handleClick} isMenuOpen={openDataMenu} />					
					{renderTooltip(TOOLTIP_TYPE.EMPTY_PROJECT, 'data_tooltip', ['Dataset을 관리합니다.'], null, null)}
				</MenuItemComponent>

				<Collapse in={openDataMenu} timeout="auto" unmountOnExit>
					<MenuItemComponent
						onClick={(e) => preProcessClicked(ROUTER_PREPROCESS, checkSubMenuUsable(preprocess))}
						isSelected={checkSelected(pathname, ROUTER_PREPROCESS)}
						isDisabed={!checkSubMenuUsable(preprocess)}
						tooltip_key={'preprocess_tooltip'}
						itemIcon={''}
						text={'Preprocess'}
						hasStatus={true}
					>
						<StatusImage status={loadProject && preprocess} />						
						{renderTooltip(TOOLTIP_TYPE.STATUS, 'preprocess_tooltip', ['Dataset을 가공 진행 현황을 확인합니다.'], preprocess, loadProject)}
					</MenuItemComponent>

					<MenuItemComponent
						onClick={(e) => analyzeClicked(ROUTER_ANALYZE, checkSubMenuUsable(analyze))}
						isSelected={checkSelected(pathname, ROUTER_ANALYZE)}
						isDisabed={!checkSubMenuUsable(analyze)}
						tooltip_key={'analyze_tooltip'}
						itemIcon={''}
						text={'Analyze'}
						hasStatus={true}
					>
						<StatusImage status={loadProject && analyze} />						
						{renderTooltip(TOOLTIP_TYPE.STATUS, 'analyze_tooltip', ['Dataset을 분석 진행 현황을 확인합니다.'], analyze, loadProject)}
					</MenuItemComponent>
				</Collapse>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_EXPERIMENT, !!loadProject)}
					isSelected={checkSelected(pathname, ROUTER_EXPERIMENT)}
					isDisabed={!loadProject}
					tooltip_key={'experiments_tooltip'}
					itemIcon={THEME.getImageURL('icon-experiment')}
					text={'Experiment'}
				>
					<MenuArrowIcon onClick={handleClick2} isMenuOpen={openExpMenu} />					
					{renderTooltip(TOOLTIP_TYPE.EMPTY_PROJECT, 'experiments_tooltip', ['모델 학습/평가/선별을 위한 Experiment를 관리합니다.'], null, null)}
				</MenuItemComponent>

				<Collapse in={openExpMenu} timeout="auto" unmountOnExit>
					<MenuItemComponent
						onClick={(e) => runClicked(ROUTER_EXPERIMENT_RUN, checkSubMenuUsable(run))}
						isSelected={checkSelected(pathname, ROUTER_EXPERIMENT_RUN)}
						isDisabed={!checkSubMenuUsable(run)}
						tooltip_key={'run_tooltip'}
						itemIcon={''}
						text={'Run'}
						hasStatus={true}
					>
						<StatusImage status={loadProject && run} />						
						{renderTooltip(TOOLTIP_TYPE.STATUS, 'run_tooltip', ['학습 중인 모델의 진행 현황을 확인합니다.'], run, loadProject)}
					</MenuItemComponent>

					<MenuItemComponent
						onClick={(e) => inferenceClicked(ROUTER_INFERENCE, checkSubMenuUsable(inference))}
						isSelected={checkSelected(pathname, ROUTER_INFERENCE)}
						isDisabed={!checkSubMenuUsable(inference)}
						tooltip_key={'inference_tooltip'}
						itemIcon={''}
						text={'Inference'}
						hasStatus={true}
					>
						<StatusImage status={loadProject && inference} />						
						{renderTooltip(TOOLTIP_TYPE.STATUS, 'inference_tooltip', ['모델의 추론 진행 현황을 확인합니다.'], inference, loadProject)}
					</MenuItemComponent>
				</Collapse>

				<WrapDivider />
				<MenuItemComponent
					onClick={(e) => modelClicked(ROUTER_MODELS, deploy)}
					isSelected={checkSelected(pathname, ROUTER_MODELS)}
					tooltip_key={'model_tooltip'}
					itemIcon={THEME.getImageURL('icon-model')}
					text={'Models'}
					hasStatus={true}
				>
					<StatusImage status={deploy} />					
					{renderTooltip(TOOLTIP_TYPE.STATUS, 'model_tooltip', ['선별된 모델을 확인하고 배포합니다.'], deploy, deploy)}
				</MenuItemComponent>
				<WrapDivider />

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_MONITOR, true)}
					isSelected={checkSelected(pathname, ROUTER_MONITOR)}
					itemIcon={THEME.getImageURL('icon-monitor')}
					text={'Monitor'}
					tooltip_key={'monitor_tooltip'}
				>					
					{renderTooltip(TOOLTIP_TYPE.GENERAL, 'monitor_tooltip', ['Experiment를 모니터링합니다.'], null, null)}
				</MenuItemComponent>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_GROUPS, true)}
					isSelected={checkSelected(pathname, ROUTER_GROUPS)}
					itemIcon={THEME.getImageURL('icon-group')}
					text={'Group'}
					tooltip_key={'group_tooltip'}
				>					
					{renderTooltip(TOOLTIP_TYPE.GENERAL, 'group_tooltip', ['사용자 그룹을 조회합니다.'], null, null)}
				</MenuItemComponent>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_ANNOTATION, true)}
					isSelected={checkSelected(pathname, ROUTER_ANNOTATION)}
					itemIcon={THEME.getImageURL('icon-annotation')}
					text={'Annotation'}
					tooltip_key={'annotation_tooltip'}
				>					
					{renderTooltip(TOOLTIP_TYPE.GENERAL, 'annotation_tooltip', ['Data를 Labeling 합니다.'], null, null)}
				</MenuItemComponent>
			</List>
		</>
	);
}

const StatusImage = styled.div`
	width: 8px;
	height: 8px;
	background: #97a1ac;
	border-radius: 4px;
	${(props) =>
		props.status &&
		`
    background: #0069cf;
  `}
`;
