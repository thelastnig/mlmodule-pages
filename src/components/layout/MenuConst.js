export const ROUTER_HOME = 'home';
export const ROUTER_NEW_PROJECT = 'newproject';
const HOME_MENUS = [ROUTER_HOME, ROUTER_NEW_PROJECT];

export const ROUTER_TEMPLATE = 'template';
const TEMPLATE_MENUS = [ROUTER_TEMPLATE];

export const ROUTER_DATASET = 'dataset';
export const ROUTER_DATASET_UPLOAD = 'datasetUpload';
const DATASET_MENUS = [ROUTER_DATASET, ROUTER_DATASET_UPLOAD];

export const ROUTER_PREPROCESS = 'preprocess';
const PREPROCESS_MENUS = [ROUTER_PREPROCESS];

export const ROUTER_ANALYZE = 'analyze';
const ANALYZE_MENUS = [ROUTER_ANALYZE];

export const ROUTER_EXPERIMENT = 'experiment';
const EXPERIMENT_MENUS = [ROUTER_EXPERIMENT];
export const ROUTER_EXPERIMENT_RUN = 'experimentRun';
export const ROUTER_EXPERIMENT_RUN_AUTOML = 'run_automl';
export const ROUTER_EXPERIMENT_RUN_HPO = 'run_hpo';
const EXPERIMENT_RUN_MENUS = [ROUTER_EXPERIMENT_RUN, ROUTER_EXPERIMENT_RUN_AUTOML, ROUTER_EXPERIMENT_RUN_HPO];
export const ROUTER_INFERENCE = 'inference';
const INFERENCE_MENUS = [ROUTER_INFERENCE];

export const ROUTER_MODELS = 'models';
const MODEL_MENUS = [ROUTER_MODELS];

export const ROUTER_MONITOR = 'monitor';
const MONITOR_MENUS = [ROUTER_MONITOR];

export const ROUTER_GROUPS = 'group';
export const ROUTER_NEW_GROUPS = 'newgroup';
const GROUPS_MENUS = [ROUTER_GROUPS, ROUTER_NEW_GROUPS];

export const ROUTER_ANNOTATION = 'annotation';
const ANNOTATION_MENUS = [ROUTER_ANNOTATION];

export const ROUTER_USER_GROUP = 'userGroup';
const USER_GROUP_MENUS = [ROUTER_USER_GROUP];

export const ROUTER_RESOURCES = 'resources';
const RESOURCES_MENUS = [ROUTER_RESOURCES];

export const ROUTER_DATA_REPOSITORY = 'dataRepository';
const DATA_REPOSITORY_MENUS = [ROUTER_DATA_REPOSITORY];

export const ROUTER_PROJECT_REPOSITORY = 'projectRepository';
const PROJECT_REPOSITORY_MENUS = [ROUTER_PROJECT_REPOSITORY];

export const ROUTER_MODEL_REPOSITORY = 'modelRepository';
const MODEL_REPOSITORY_MENUS = [ROUTER_MODEL_REPOSITORY, ROUTER_MODELS];

export const ROUTER_INFORMATION = 'information';
const INFORMATION_MENUS = [ROUTER_INFORMATION];

export function checkSelected(pathname, menu) {
	let menu_array = [];
	switch (menu) {
		case ROUTER_HOME:
			menu_array = HOME_MENUS;
			break;
		case ROUTER_TEMPLATE:
			menu_array = TEMPLATE_MENUS;
			break;
		case ROUTER_DATASET:
			menu_array = DATASET_MENUS;
			break;
		case ROUTER_PREPROCESS:
			menu_array = PREPROCESS_MENUS;
			break;
		case ROUTER_ANALYZE:
			menu_array = ANALYZE_MENUS;
			break;
		case ROUTER_EXPERIMENT:
			menu_array = EXPERIMENT_MENUS;
			break;
		case ROUTER_EXPERIMENT_RUN:
			menu_array = EXPERIMENT_RUN_MENUS;
			break;
		case ROUTER_INFERENCE:
			menu_array = INFERENCE_MENUS;
			break;
		case ROUTER_MODELS:
			menu_array = MODEL_MENUS;
			break;
		case ROUTER_MONITOR:
			menu_array = MONITOR_MENUS;
			break;
		case ROUTER_GROUPS:
			menu_array = GROUPS_MENUS;
			break;
		case ROUTER_ANNOTATION:
			menu_array = ANNOTATION_MENUS;
			break;
		case ROUTER_USER_GROUP:
			menu_array = USER_GROUP_MENUS;
			break;
		case ROUTER_RESOURCES:
			menu_array = RESOURCES_MENUS;
			break;
		case ROUTER_DATA_REPOSITORY:
			menu_array = DATA_REPOSITORY_MENUS;
			break;
		case ROUTER_PROJECT_REPOSITORY:
			menu_array = PROJECT_REPOSITORY_MENUS;
			break;
		case ROUTER_MODEL_REPOSITORY:
			menu_array = MODEL_REPOSITORY_MENUS;
			break;
		case ROUTER_INFORMATION:
			menu_array = INFORMATION_MENUS;
			break;
		default:
			break;
	}

	let result = false;
	if (menu_array.includes(pathname)) {
		result = true;
	}
	return result;
}
