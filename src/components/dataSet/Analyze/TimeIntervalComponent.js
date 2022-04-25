import { useContext, useEffect, useRef } from 'react';
import agent from 'lib/apis';

import { checkIsAbort, checkIsRunning } from 'views/expRun';
import { AnalyzeContext } from 'views/Analyze';

const POLLING_SHOW_SPINNER = false;
const POLLING_USE_INTERVAL = true;
const TIME_INTERVAL = 3000;

const TimeIntervalComponent = () => {
	const { status, setStatus, analyze_status, pipeline_name, getLatestAnalyze } = useContext(AnalyzeContext);

	const timeout = useRef(status);
	const statusRef = useRef(status);
	statusRef.current = status;

	const canPolling = (_status) => {
		if (checkIsRunning(_status) || checkIsAbort(_status)) {
			return true;
		}
		return false;
	};

	const checkAnalyticStatus = () => {
		if (!pipeline_name) {
			getLatestAnalyze();
			clearLogInterval();
			return;
		}
		let params = {
			pipeline_name: pipeline_name,
			noSpinner: !POLLING_SHOW_SPINNER,
		};
		agent
			.checkAnalyticStatus(params)
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
						checkAnalyticStatus();
					}, TIME_INTERVAL);
					console.log('timeinterval make timeout ', timeout.current);
				}
			});
	};

	useEffect(() => {
		if (analyze_status) {
			if (!pipeline_name) {
				getLatestAnalyze();
			} else if (!status || canPolling(status)) {
				checkAnalyticStatus();
			}
		} else {
			// clear polling
			clearLogInterval();
		}
	}, [status, analyze_status, pipeline_name]);

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
