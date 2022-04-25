import produce from '../produce';

export const SHOW_DIALOG = 'dialog/SHOW_DIALOG';
export const HIDE_DIALOG = 'dialog/HIDE_DIALOG';

const showDialog = (data) => ({ type: SHOW_DIALOG, payload: data });
const hideDialog = (data) => ({ type: HIDE_DIALOG, payload: data });

export const actions = {
	showDialog,
	hideDialog,
};

const initialState = {
	dialogName: '',
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case SHOW_DIALOG:
				draft.dialogName = action.payload;
				break;
			case HIDE_DIALOG:
				draft.dialogName = '';
				break;
			default:
				return state;
		}
	});

export default reducer;
