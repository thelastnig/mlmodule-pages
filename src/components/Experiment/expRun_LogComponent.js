import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import styled from 'styled-components';

import FormatUtil from 'utils/FormatUtil';

import { useStateActionHandler as useLogActionHandler } from 'store/log/hooks';
import { useStateActionHandler as useGraphActionHandler } from 'store/graph/hooks';

import { checkIsRunning, checkIsSucceed, ExpRunContext } from 'views/expRun';

import Tooltip from 'components/common/Tooltip';

const TIME_INTERVAL = 10000;
const regex = /\r/gi;

const POLLING_SHOW_SPINNER = false;
const POLLING_USE_INTERVAL = true;

export default function LogComponent(props) {
	const { data, experiment_id, status, setStatus } = props;
	const { setPercent } = useContext(ExpRunContext);
	const model_nm = data.model_nm;
	const { onFetchLogCB } = useLogActionHandler();
	const { addGraphData } = useGraphActionHandler();
	const [logList, setLogList] = useState([]);
	const timeout = useRef(status);
	const statusRef = useRef(status);
	statusRef.current = status;

	const fetchLog = useCallback(() => {
		console.log('timeinterval fetchLog ', timeout.current, statusRef.current);
		if (!experiment_id || !model_nm) {
			clearLogInterval();
			return;
		}
		let params = {
			experiment_id: experiment_id,
			noSpinner: !POLLING_SHOW_SPINNER,
			noErrorPopup: true,
			// run_id: run_id, //'3b20c181-69df-45ed-bd53-3cd77395b29e',
			// model_nm: model_nm, //'ResNet_Yper-car model classification_14_07_53',
		};
		onFetchLogCB(params)
			.then((response) => {
				console.log('then response = ', response);
				let { log, status, time } = response.data;
				const resultData = response.data;
				const resultKeys = Object.keys(resultData);
				let trainKeys = [];
				resultKeys.map((key) => {
					if (key.includes('train')) {
						trainKeys.push(key);
					}
				});
				let valKeys = [];
				resultKeys.map((key) => {
					if (key.includes('val')) {
						valKeys.push(key);
					}
				});

				let trainGraphData = {};
				trainKeys.forEach((item) => {
					trainGraphData[item] = resultData[item];
				});

				let valGraphData = {};
				valKeys.forEach((item) => {
					valGraphData[item] = resultData[item];
				});

				const graphData = {
					trainGraphData: trainGraphData,
					valGraphData: valGraphData,
				};
				addGraphData(graphData);

				setStatus(status.toLowerCase());
				let percent = isNaN(parseInt(time)) ? 0 : parseInt(time);
				setPercent(percent);
				setLogList((prevList) => {
					// prevList[0] = log
					prevList[0] = log.replace(regex, '\n');
					return [prevList];
					// return [...prevList, log];
				});
			})
			.catch((error) => {
				console.log('error ', error);
				// clearTimeout(timeInterval.current);
			})
			.finally((v) => {
				console.log('timeinterval finally ', timeout.current, statusRef.current);
				if (POLLING_USE_INTERVAL && checkIsRunning(statusRef.current)) {
					clearLogInterval();
					timeout.current = setTimeout(() => {
						console.log('timeinterval do timeout ', timeout.current, statusRef.current);
						fetchLog();
					}, TIME_INTERVAL);
					console.log('timeinterval make timeout ', timeout.current);
				}
			});
	}, [status]);
	const clearLogInterval = () => {
		console.log('timeinterval clearLogInterval = ', timeout.current);
		clearTimeout(timeout.current);
	};

	useEffect(() => {
		if (checkIsSucceed(status) || checkIsRunning(status)) {
			fetchLog();
		} else {
			clearLogInterval();
		}
	}, [status]);
	useEffect(() => {
		return () => {
			clearLogInterval();
			console.log('timeinterval willunmount = ', statusRef.current);
			statusRef.current = '';
		};
	}, []);

	useEffect(() => {
		if (FormatUtil.isEmpty(data)) {
			return;
		}
	}, [data]);

	return (
		<LogItemList data-tip data-for={'run_log_tooltip'}>
			{logList.map((v, i) => (
				<LogItem key={i}>{v}</LogItem>
			))}
			<Tooltip id={'run_log_tooltip'} text={'학습 과정 중 발생하는 에러나 학습 중간 결과를 확인합니다.'}/>
		</LogItemList>
	);
}

const LogItemList = styled.div`
	width: 614px;
	background: black;
	height: 264px;
	padding: 5px;
	overflow-y: scroll;
	overflow-x: hidden;
	white-space: pre-wrap;
	// ::-webkit-scrollbar {
	// -webkit-appearance: unset;
	//   width: unset;
	//   height: unset;
	//   }
	&::-webkit-scrollbar {
		/* 세로 스크롤 넓이 */
		width: 8px;

		/* 가로 스크롤 높이 */
		height: 5px;

		border-radius: 2px;
		background: gray;
	}
	&::-webkit-scrollbar-thumb {
		background-color: black;
		border-radius: 6px;
	}
`;
const LogItem = styled.div`
	color: #ffffff;
	padding: 5px 0;
`;
