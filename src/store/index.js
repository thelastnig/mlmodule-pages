import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from 'redux-devtools-extension';

import agent from 'lib/apis';

import rootSaga from 'store/root/saga';
import rootReducer from 'store/root/reducer';

export const configureStore = () => {
	const sagaMiddleware = createSagaMiddleware();
	const loggerMiddleware =
		({ dispatch, getState }) =>
		(next) =>
		(action) => {
			// console.log('loggerMiddleware = ', action);
			return next(action);
		};
	const authMiddleware =
		({ getState }) =>
		(next) =>
		(action) => {
			const { currentUser, access_token } = getState().auth;
			if (currentUser && global.agent) {
				if (access_token) {
					agent.setToken(currentUser, true);
				}
			}
			return next(action);
		};

	const middlewares = [sagaMiddleware, loggerMiddleware, authMiddleware];
	const enhancer =
		process.env.NODE_ENV === 'production' ? compose(applyMiddleware(...middlewares)) : composeWithDevTools(applyMiddleware(...middlewares));
	const store = createStore(rootReducer, enhancer);
	store.sagaTask = sagaMiddleware.run(rootSaga);
	agent.interceptor(store);
	return store;
};
const Store = { rootReducer, rootSaga, configureStore };
export default Store;
