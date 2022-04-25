import { useContext, useEffect, useRef } from 'react';

import agent from 'lib/apis';
import { PreprocessContext } from 'views/PreProcess';
import { checkIsAbort, checkIsRunning } from 'views/expRun';

const POLLING_SHOW_SPINNER = false;
const POLLING_USE_INTERVAL = true;
const TIME_INTERVAL = 3000;

const TimeIntervalComponent = () => {
	const { status, setStatus, preprocess_status, pipeline_name, getLatestPreprocess } = useContext(PreprocessContext);

	const timeout = useRef(status);
	const statusRef = useRef(status);
	statusRef.current = status;

	const canPolling = (_status) => {
		if (checkIsRunning(_status) || checkIsAbort(_status)) {
			return true;
		}
		return false;
	};

	const checkPreprocessStatus = () => {
		if (!pipeline_name) {
			getLatestPreprocess();
			clearLogInterval();
			return;
		}
		let params = {
			pipeline_name: pipeline_name,
			noSpinner: !POLLING_SHOW_SPINNER,
		};
		agent
			.checkPreprocessStatus(params)
			.then((response) => {
				console.log('then response = ', response);
				const { pipeline_status } = response.data;
				setStatus(pipeline_status.toLowerCase());
			})
			.catch((error) => {
				console.log('error ', error);
				setStatus('failed');
			})
			.finally((v) => {
				console.log('timeinterval finally ', timeout.current, statusRef.current);
				if (POLLING_USE_INTERVAL && canPolling(statusRef.current)) {
					clearLogInterval();
					timeout.current = setTimeout(() => {
						console.log('timeinterval do timeout ', timeout.current, statusRef.current);
						checkPreprocessStatus();
					}, TIME_INTERVAL);
					console.log('timeinterval make timeout ', timeout.current);
				}
			});
	};

	useEffect(() => {
		if (preprocess_status) {
			if (!pipeline_name) {
				getLatestPreprocess();
			} else if (!status || canPolling(status)) {
				checkPreprocessStatus();
			}
		} else {
			// clear polling
			clearLogInterval();
		}
	}, [status, preprocess_status, pipeline_name]);

	useEffect(() => {
		return () => {
			clearLogInterval();
			console.log('timeinterval willunmount = ', statusRef.current);
			statusRef.current = '';
		};
	}, []);

	const clearLogInterval = () => {
		console.log('timeinterval clearLogInterval = ', timeout.current);
		clearTimeout(timeout.current);
	};

	return <> </>;
};
export default TimeIntervalComponent;
