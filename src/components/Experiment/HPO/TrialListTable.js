import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import agent from 'lib/apis';
import { EXPERIMENT_STATUS } from 'constants/common';
import SearchFile from 'assets/icon/group-2.png';

import { StyledTable } from 'components/common/table/TableComponent';
import { SatusDot } from 'components/common/StyledComponent';
import { HPOContext } from 'views/expRunHPO';
import { checkIsRunning } from 'views/expRun';

const POLLING_SHOW_SPINNER = false;
const POLLING_USE_INTERVAL = true;
const TIME_INTERVAL = 10000; //10초
const FIRST_TIME_INTERVAL = 1000 * 60; //10분

const getThs = (item) => {
	let result = [];
	Object.keys(item).forEach((key, index) => {
		if (key === 'trialName' || key === 'Status') {
			return;
		}
		result.push(key);
	});
	return result;
};
export default function TrialListTable(props) {
	const { show, onDetailsClick, projectType } = props;
	const {
		experiment_id,
		model_name,
		trial,
		setTrial,
		status,
		setStatus,
		total_trial_num,
		set_total_trial_num,
		current_trial_num,
		set_current_trial_num,
		trialList,
		setTrialList,
	} = useContext(HPOContext);

	const [ths, setThs] = useState([]);
	const timeout = useRef(status);
	const statusRef = useRef(status);
	statusRef.current = status;

	useEffect(() => {
		let ths = [];
		if (trialList.length > 0) {
			ths = getThs(trialList[0]);
		}
		setThs(ths);
	}, [trialList]);

	const fetchTrailList = () => {
		let params = {
			experiment_id,
			model_name,
			noSpinner: !POLLING_SHOW_SPINNER,
			noErrorPopup: true,
		};
		agent
			.getHpoTrialList(params)
			.then((response) => {
				const { total_trial_num, current_trial_num, list, hpo_status } = response.data;
				set_total_trial_num(total_trial_num);
				set_current_trial_num(current_trial_num);
				setTrialList(list);
				setStatus(hpo_status);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {
				startTimeInterval();
			});
	};
	useEffect(() => {
		if (show) {
			if (POLLING_USE_INTERVAL && checkIsRunning(statusRef.current)) {
				clearTimeout(timeout.current);
				timeout.current = setTimeout(() => {
					fetchTrailList();
				}, FIRST_TIME_INTERVAL);
			}
		} else {
			clearTimeout(timeout.current);
		}
		return () => {
			clearTimeout(timeout.current);
			statusRef.current = '';
		};
	}, [show]);

	const startTimeInterval = () => {
		if (timeout.current) {
			clearTimeout(timeout.current);
		}
		if (POLLING_USE_INTERVAL && checkIsRunning(statusRef.current)) {
			clearTimeout(timeout.current);
			timeout.current = setTimeout(() => {
				fetchTrailList();
			}, TIME_INTERVAL);
		}
	};
	const showDetailButton = (data) => {
		let result = false;
		if (data.Status.toLowerCase() === EXPERIMENT_STATUS.SUCCEEDED) {
			result = true;
		}

		return result;
	};

	return (
		<>
			<TableTitleArea>
				<BetweenContent>
					<TableTitle>Trial List</TableTitle>
					<RightContentArea>
						<SubmitInfoArea>
							학습 완료 후 Trial List에서 하나의 Trial을 선택하고 하단의 Submit 버튼을 누르면 해당 Trial이 등록됩니다.
						</SubmitInfoArea>
						<CountArea>
							{current_trial_num}/{total_trial_num}
						</CountArea>
					</RightContentArea>
				</BetweenContent>
			</TableTitleArea>
			<TableArea>
				<StyledTable>
					<TableHeader>
						<HeaderTh>
							<TD_1>
								<div>Name</div>
								{/*<SortIcon/>*/}
							</TD_1>
							<TD_2>
								<div>Status</div>
								{/*<SortIcon/>*/}
							</TD_2>
							{ths.map((data, index) => (
								<TD_Dynamic key={index}>
									<div>{data.toUpperCase()}</div>
								</TD_Dynamic>
							))}
							{projectType !== 'tabular' && (
								<TD_Detail>
									<div>Details</div>
								</TD_Detail>
							)}
						</HeaderTh>
					</TableHeader>
					<Tbody>
						{trialList.map((data, index) => (
							<TableRow key={index} isChecked={trial === data} onClick={(e) => setTrial(data)}>
								{
									<>
										<TD_1>{data.trialName}</TD_1>
										<TD_2>
											<div style={{ display: 'flex' }}>
												<SatusDot type={data.Status.toLowerCase()}></SatusDot>
												{data.Status}
											</div>
										</TD_2>
										{ths.map((key, index) => (
											<TD_Dynamic key={index}>
												<div>{data[key]}</div>
											</TD_Dynamic>
										))}
										{projectType !== 'tabular' && (
											<TD_Detail>
												<div style={{ width: '55px', textAlign: 'center' }}>
													{showDetailButton(data) && (
														<DetailBtn onClick={(e) => onDetailsClick(data)}>
															<img src={SearchFile} width="20px" height="20px" alt="" />
														</DetailBtn>
													)}
												</div>
											</TD_Detail>
										)}
									</>
								}
							</TableRow>
						))}
					</Tbody>
				</StyledTable>
			</TableArea>
		</>
	);
}

const TableArea = styled.div`
	height: 296px;
	overflow: overlay;
`;

const TableHeader = styled.thead`
	width: 100%;
	height: 46px;
	margin: 1px 0 0 0;
	padding: 13px 0px 0px 0px;
	background-color: #f8f9fa;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const HeaderTh = styled.tr`
	height: 46px;
	border-top: 1px solid #dfe2e5;
	border-bottom: 1px solid #dfe2e5;
`;

const TableRow = styled.tr`
	height: 48px;
	border-top: 1px solid #dfe2e5;
	width: 100%;
	height: 49px;
	padding: 1px 0 0 0;
	align-items: center;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;

const TD_1 = styled.td`
	width: 353px;
	padding-left: 35px;
	padding-right: 8px;
	word-break: break-all;


`;

const TD_2 = styled.td`
	width: 180px;
	padding-left: 8px;
`;
const TD_Dynamic = styled.td``;

const TD_Detail = styled.td``;

const DetailBtn = styled.div`
	width: 20px;
	display: inline-block;
	cursor: pointer;
`;

const TableTitleArea = styled.div`
	height: 64px;
	display: flex;
	align-items: center;
	padding: 0 32px;
`;

const BetweenContent = styled.div`
	display: flex;
	justify-content: space-between;
	padding: 4px 0px;
	width: 100%;
`;

const TableTitle = styled.div`
	width: 70px;
	height: 20px;
	font-size: 15px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const CountArea = styled.div`
	height: 20px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const Tbody = styled.tbody``;

const RightContentArea = styled.div`
	display: flex;
	justify-content: space-between;
`;

const SubmitInfoArea = styled.div`
	margin-right: 70px;
`;
