const THEME_STYLE = {
	headerTitle: {
		hyundae: '디지털 혁신을 통해 고객의 성장을 견인하는 Value Creator',
		surro: ''
	},
	loginTitle: {
		hyundae: 'HYUNDAI AutoEver AI Platform',
		surro: 'SURROMIND AI Studio'
	},
	titleFont: {
		hyundae: 'NotoSans !important',
		surro: 'cursive !important'
	},
	background: {
		hyundae: '#004282',
		surro: '#061c43'
	},
	hover: {
		hyundae: 'rgba(0, 66, 130, 0.1)',
		surro: '#EFF0F2'
	},
	selected: {
		hyundae: 'rgba(0, 66, 130, 0.18)',
		surro: '#FEEFE5'
	},
};

export const THEME = {
	headerTitle: THEME_STYLE.headerTitle[process.env.REACT_APP_THEME_INDEX],
	loginTitle: THEME_STYLE.loginTitle[process.env.REACT_APP_THEME_INDEX],
	titleFont: THEME_STYLE.titleFont[process.env.REACT_APP_THEME_INDEX],
	background: THEME_STYLE.background[process.env.REACT_APP_THEME_INDEX],
	hover: THEME_STYLE.hover[process.env.REACT_APP_THEME_INDEX],
	selected: THEME_STYLE.selected[process.env.REACT_APP_THEME_INDEX],
	getImageURL: (name) => `/theme/${process.env.REACT_APP_THEME_INDEX}/${name}.png`,
}