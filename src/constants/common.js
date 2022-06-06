// export const CONSTANT = '';
// export * from '..some';

export const ROLE = {
	DEVELOPER: 'ROD',
	ADMIN: 'ROA',
	ANNOTATOR: 'RON',
};

export const ROLE_LIST = [
	// 1) ROD : 개발자 화면 전 메뉴 활성화
	// 2) RON : annotation 메뉴만 활성화, 나머지 메뉴는 비활성화
	// 3) ROA : 관리자 화면 전 메뉴 활성화
	{
		value: 'ROD',
		label: 'Model Developer',
	},
	{
		value: 'RON',
		label: 'Annotator',
	},
];

export const PARAMETER_SKIM = {
	FIELD: 'field',
	CHOICE: 'choice',
	MULTI_CHOICE: 'multichoice',
	SWITCH: 'switch',
};

export const GROUP_STATUS = [
	{
		column: 'GSU',
		label: 'Using',
	},
	{
		column: 'GSS',
		label: 'Stopped',
	},
];
export const USER_STATUS = [
	{
		column: 'STU',
		label: 'Using',
	},
	{
		column: 'STS',
		label: 'Expired / Stopped',
	},
];
export const USER_GROUP_STATUS = [
	{
		column: 'STJ',
		label: 'Joined',
	},
	{
		column: 'STL',
		label: 'Leaved',
	},
];

export const EXPERIMENT_DELETABLE = ['EX1', 'EX2', 'EX4', 'EX5', 'EX6'];
// ['draft', 'pending', 'succeeded', 'failed', 'aborted']

export const DATASET_TYPE = {
	IMAGE: 'image',
	TABULAR: 'tabular',
};

export const PROJECT_TYPE = {
	IMAGE: 'TYI',
	TABULAR: 'TYS',
};

export const EXPERIMENT_STATUS = {
	// draft(EX1),pending(EX2),Running(EX3),succeeded(EX4),failed(EX5),aborted(EX6),Published(EX7), Created(EX8)
	NONE: '',
	DRAFT: 'draft', //EX1
	PENDING: 'pending', //EX2
	RUNNING: 'running', //EX3
	SUCCEEDED: 'succeeded', //EX4
	COMPLETED: 'completed',
	FAILED: 'failed', //EX5
	ABORTED: 'aborted', //EX6
	PUBLISHED: 'published', //EX7
};

export const RUN_TYPE = {
	RUN: 'Run',
	AUTOML: 'AutoML',
	HPO: 'HPO',
};

export const SEARCH_BAR_TYPE = {
	HOME: 'HOME',
	ALARM: 'ALARM',
	ADMIN_ALARM: 'ADMIN_ALARM',
	ANNOTATION: 'ANNOTATION',
	DATA_REPOSITORY: 'DATA_REPOSITORY',
	DATASET: 'DATASET',
	DATA_UPLOAD_SHARED: 'DATA_UPLOAD_SHARED',
	EXPERIMENT: 'EXPERIMENT',
	AUTOML: 'AUTOML',
	GROUP: 'GROUP',
	INFERENCE: 'INFERENCE',
	MODEL_REPOSITORY: 'MODEL_REPOSITORY',
	MODEL: 'MODEL',
	MONITOR: 'MONITOR',
	PROJECT_REPOSITORY: 'PROJECT_REPOSITORY',
	Resources: 'Resources',
	USER_GROUP: 'USER_GROUP',
	USER: 'USER',
	USER_GROUP_CONTENT: 'USER_GROUP_CONTENT',
	TEMPLATE: 'TEMPLATE',
};

export const INPUT_TYPE = {
	NUMBER: 'NUMBER',
	NUMBER_INT: 'NUMBER_INT',
	NUMBER_FLOAT: 'NUMBER_FLOAT',
};

export const BACKGROUND_JOB_TYPE = {
	DATA_MERGE: 'DATA_MERGE',
	LABEL_REPLACE: 'LABEL_REPLACE',
};

export const BACKGROUND_JOB_DESC = {
	[BACKGROUND_JOB_TYPE.DATA_MERGE]: '데이터 병합',
	[BACKGROUND_JOB_TYPE.LABEL_REPLACE]: '라벨 교체',
};

export const DATA_DETAIL_IMAGE_TYPE = {
	IMAGE: 'IMAGE',
	IMAGE_WITH_LABEL: 'IMAGE_WITH_LABEL',
};

export const TEACHABLE_COLOR_LIST = {
	LIGHT_MAIN_COLOR: '#E8F0FE', 
	MIDDLE_LIGHT_MAIN_COLOR: '#D2E3FC', 
	MIDDLE_MAIN_COLOR: '#AECBFA',
	HEAVY_MAIN_COLOR: '#1967D2',
	HEAVY_STRONG_MAIN_COLOR: '#185ABC',
	LIGHT_GRAY: '#F1F3F4', 
	GRAY: '#adb5bd', 
	HEAVY_GRAY: '#495057',
	PURPLE: '#6741d9',
	GRID_BACKGROUND: '#060C0F',
	COMPONENT_BACKGROUND: '#343a40',
	COMPONENT_BACKGROUND_HARD: '#212529',
	COMPONENT_BACKGROUND_DEEP: '#252B2F',
	COMPONENT_BACKGROUND_LIGHT: '#868e96',
	MAIN_THEME_COLOR: '#f76707',
	MAIN_THEME_COLOR_LIGHT: '#ff922b',
	GREEN_COLOR: '#37b24d',
};

export const TEACHABLE_MODEL_CONSTANT_LIST = {
	MODEL_ROOT_KEY: 'tensorflowjs_models',
	IMAGE_MODEL_DEFAUT_NAME: 'my-image-model',
	MODEL_WEIGHT_SPEC_KEY: 'weight_specs',
	MODEL_WEIGHT_DATA_KEY: 'weight_data',
	MODEL_TOPOLOGY_KEY: 'model_topology',
	MODEL_METADATA_KEY: 'model_metadata',
};