import produce from '../produce';

export const SHOW_ALERT = 'alert/SHOW_ALERT';
export const HIDE_ALERT = 'alert/HIDE_ALERT';

const showAlert = (data) => ({ type: SHOW_ALERT, payload: data });
const hideAlert = (data) => ({ type: HIDE_ALERT, payload: data });

export const actions = {
	showAlert,
	hideAlert,
};

const initialState = {
	message: '',
	isConfirm: false,
	onOk: null,
	onCancel: null,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case SHOW_ALERT:
				draft.message = action.payload.message;
				draft.isConfirm = action.payload.isConfirm;
				draft.onOk = action.payload.onOk;
				draft.onCancel = action.payload.onCancel;
				break;
			case HIDE_ALERT:
				draft.message = '';
				draft.isConfirm = false;
				draft.onOk = null;
				draft.onCancel = null;
				break;
			default:
				return state;
		}
	});

export default reducer;
