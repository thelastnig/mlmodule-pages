import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import 'views/inference.scss';

import { colors } from 'styles';
import agent from 'lib/apis';

import { useAlertAction } from 'store/alert/hooks';
import { useDialogAction } from 'store/dialog/hooks';

import ResultImage from 'components/inference/ResultImage';
import ResultTabluar from 'components/inference/ResultTabular';
import { InferenceContext } from 'views/Inference';
import { checkIsCompleted, checkIsFailed, checkIsRunning, checkIsSucceed } from 'views/expRun';

import IconInfo from 'assets/icon/icon-info.png';
import { dialogList } from 'constants/dialog';
import InferenceResultExample from 'component/dialog/InferenceResultExample';

const TIME_INTERVAL = 3000;

const InferenceResult = () => {
	const { showAlert } = useAlertAction();
	const { inference_id, isTabular, status, setStatus } = useContext(InferenceContext);
	const timeInterval = useRef(null);
	const [result_data, set_result_data] = useState([]);

	const { showDialog } = useDialogAction();

	useEffect(() => {
		if (checkIsRunning(status)) {
			fetchInferenceResult();
			fetchInferenceResultInterval();
		} else {
			clearFetchInterval();
		}
		if (checkIsSucceed(status)) {
			fetchInferenceResult();
		}
		return () => {
			// componentWillUnmount 역할
			clearFetchInterval();
			set_result_data([]);
		};
	}, [status, inference_id]);

	const clearFetchInterval = useCallback(() => {
		clearInterval(timeInterval.current);
	});

	const fetchInferenceResultInterval = useCallback(() => {
		if (timeInterval.current) {
			clearFetchInterval();
		}
		timeInterval.current = setInterval(() => {
			fetchInferenceResult();
		}, TIME_INTERVAL);
	});

	const fetchInferenceResult = useCallback(() => {
		if (!inference_id) {
			clearFetchInterval();
			return;
		}
		let params = {
			noSpinner: true,
			inference_id: inference_id, //37,
		};
		agent
			.getInferenceResult(params)
			.then((response) => {
				let { pod_status, result_data } = response.data;
				if (checkIsFailed(pod_status)) {
					showAlert({
						message: '추론 중 오류가 발생했습니다. 알람을 확인해 주세요.',
					});
				}
				setStatus(pod_status);
				set_result_data(result_data);
				console.log('fetchInferenceResult -> ', pod_status);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	return (
		<>
			<div style={{ display: "flex" }}>
				<BottomTitle>Results</BottomTitle>
				<InferenceResultInfo
					onClick={(e) => showDialog(dialogList.INFERENCE_RESULT_EXAMPLE)}
					src={IconInfo}
					alt="Inference result"
				/>
			</div>
			<ResultsBox>
				{!isTabular && result_data.length > 0 ? (
					<ResultImage list={result_data} />
				) : isTabular && result_data.tabular_list && result_data.tabular_list.length > 0 ? (
					<ResultTabluar data={result_data} />
				) : checkIsSucceed(status) || checkIsCompleted(status) ? (
					<ResultsBoxTextHolderArea>
						<ResultsBoxTextHolder>추론 결과가 없습니다.</ResultsBoxTextHolder>
					</ResultsBoxTextHolderArea>
				) : checkIsRunning(status) ? (
					<ResultsBoxTextHolderArea>
						<ResultsBoxTextHolder>processing...</ResultsBoxTextHolder>
					</ResultsBoxTextHolderArea>
				) : (
					<ResultsBoxTextHolderArea>
						<ResultsBoxTextHolder>추론할 모델과 데이터를 선택해주세요.</ResultsBoxTextHolder>
					</ResultsBoxTextHolderArea>
				)}
			</ResultsBox>
			<InferenceResultExample />
		</>
	);
};

export default InferenceResult;

const BottomTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: 500;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
	margin-bottom: 12px;
`;

const ResultsBox = styled.div`
	background: ${colors.bg_white};
	width: 1524px;
	height: 400px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: overlay;
	padding: 24px 0 24px 32px;
`;

const ResultsBoxTextHolderArea = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const ResultsBoxTextHolder = styled.div`
	width: 270px;
	height: 22px;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: #b8babd;
`;

const InferenceResultInfo = styled.img`
	width: 20px;
	height: 20px;
	margin-top: 2px;
	margin-left: 5px;
	vertical-align: middle;
	cursor: pointer;
`;