import produce from '../produce';

export const ADD_GRAPH_DATA = 'graph/ADD_GRAPH_DATA';
export const INIT_GRAPH_DATA = 'graph/INIT_GRAPH_DATA';
export const ADD_GRAPH_EPOCH = 'graph/ADD_GRAPH_EPOCH';
export const INIT_GRAPH_EPOCH = 'graph/INIT_GRAPH_EPOCH';

const addGraphData = (data) => ({ type: ADD_GRAPH_DATA, payload: data });
const initGraphData = () => ({ type: INIT_GRAPH_DATA });
const addGraphEpoch = (data) => ({ type: ADD_GRAPH_EPOCH, payload: data });
const initGraphEpoch = () => ({ type: INIT_GRAPH_EPOCH });
export const actions = {
	addGraphData,
	initGraphData,
	addGraphEpoch,
	initGraphEpoch,
};

const initialState = {
	graphData: null,
	graphEpoch: 0,
};

const reducer = (state = initialState, action) =>
	produce(state, (draft) => {
		switch (action.type) {
			case ADD_GRAPH_DATA:
				draft.graphData = action.payload;
				break;
			case INIT_GRAPH_DATA:
				draft.graphData = null;
				break;
			case ADD_GRAPH_EPOCH:
				draft.graphEpoch = action.payload;
				break;
			case INIT_GRAPH_EPOCH:
				draft.graphEpoch = 0;
				break;
			default:
				return state;
		}
	});

export default reducer;
