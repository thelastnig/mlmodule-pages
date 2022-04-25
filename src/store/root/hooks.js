import { useState, useCallback, useDebugValue } from 'react';
import FormatUtil from 'utils/FormatUtil';

export const useInput = (initialValue = null) => {
	const [value, setValue] = useState(initialValue);
	const handler = useCallback((e) => {
		setValue(e.target.value);
	}, []);
	return [value, handler, setValue];
};

export const useInputWithFiler = (isUserId) => {
	const [value, setValue] = useState('');
	const handler = useCallback((e) => {
		const value = FormatUtil.excludeSpecialChar(e.target.value, isUserId);
		setValue(value);
	}, []);
	return [value, handler, setValue];
};

export const useInputPercent = (initialValue = null) => {
	const [value, setValue] = useState(initialValue);
	const handler = useCallback((e) => {
		setValue(e.target.value >= 100 ? 100 : e.target.value < 0 ? 0 : e.target.value);
	}, []);
	return [value, handler, setValue];
};
export const useStateWithLabel = (initialValue, name) => {
	const [value, setValue] = useState(initialValue);
	useDebugValue(`${name}: ${value}`);
	return [value, setValue];
};
