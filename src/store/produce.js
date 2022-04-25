import { enableES5, produce } from 'immer';

const produceStore = (...args) => {
	enableES5();
	return produce(...args);
};
export default produceStore;
