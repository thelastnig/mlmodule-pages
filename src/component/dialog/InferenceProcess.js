import React, { useState, useEffect, useContext, useRef } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import agent from 'lib/apis';
import { inferData2DParser, strToJsonConverter } from 'utils/graphUtil';

import DialogTitleComponent from 'components/modal/DialogTitle';
import Spacer from 'components/spacer';
import DialogFooter from 'components/modal/DialogFooter';
import ProgressBar from 'components/common/ProgressBar';
import { InferenceContext } from 'views/Inference';
import { checkIsRunning } from 'views/expRun';
import GraphComponent from 'components/common/graph/Scatter2DGraphComponent';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '1656px', maxWidth: '1656px' },
		height: '645px',
	},
}));

const POLLING_INTERVAL = 3 * 1000;
const POLLING_USE_INTERVAL = true;
const POLLING_SHOW_SPINNER = false;

export default function DlgInferenceProcess() {
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.INFERENCE_PROCESS;
	const classes = useStyles();
	const { inference_id, status } = useContext(InferenceContext);
	const [complete_count, set_complate_count] = useState('');
	const [total_count, set_total_count] = useState('');
	const [inference_time_per_data, set_inference_time_per_data] = useState('');
	const [inference_log, set_inference_log] = useState([]);
	const [rest_time, set_rest_time] = useState('');
	const [percent, setPercent] = useState(0);
	const timeout = useRef(null);
	const showRef = useRef(isShow);
	showRef.current = isShow;
	const statusRef = useRef(status);
	statusRef.current = status;

	// Graph 정보
	const [graphData, setGraphData] = useState([]);
	const [isTabular, setIsTabular] = useState(false);
	const graphWidth = 402;
	const graphHeight = 478;
	const layoutLeft = 30;
	const layoutRight = 30;
	const layoutTop = 0;
	const layoutBottom = 100;
	const layoutPadding = 4;

	useEffect(() => {
		if (isShow) {
			fetchInferenceLog();
		} else {
			clearTimeout(timeout.current);
			showRef.current = null;
		}
	}, [isShow]);

	useEffect(() => {
		let percent = parseInt((complete_count / total_count) * 100);
		if (isNaN(percent)) {
			percent = 0;
		}
		setPercent(percent);
	}, [complete_count, total_count]);

	useEffect(() => {
		setGraphData([]);
	}, [inference_id]);

	const fetchInferenceLog = () => {
		if (!inference_id) {
			return;
		}
		let params = {
			noSpinner: !POLLING_SHOW_SPINNER,
			inference_id: inference_id,
		};
		agent
			.getInferenceLog(params)
			.then((response) => {
				let { complete_count, total_count, inference_time_per_data, inference_log, rest_time, inference_metric } = response.data;
				set_complate_count(complete_count);
				set_total_count(total_count);
				set_inference_time_per_data(inference_time_per_data);
				set_inference_log(inference_log);
				set_rest_time(rest_time);
				const metricJsonArray = strToJsonConverter(inference_metric);
				if (typeof metricJsonArray === 'string' && metricJsonArray === 'tabular') {
					setIsTabular(true);
				} else {
					setGraphData(inferData2DParser(metricJsonArray));
				}
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {
				if (POLLING_USE_INTERVAL && showRef.current && checkIsRunning(statusRef.current)) {
					clearTimeout(timeout.current);
					timeout.current = setTimeout(() => {
						fetchInferenceLog();
					}, POLLING_INTERVAL);
				}
			});
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'inference_process_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Inference Details'} toggle={hideDialog} />
				<ProgressBarArea>
					<SubTitle>Progress</SubTitle>
					<Spacer size={'lg'} />
					<ProgressBar bgcolor={'#00CF9C'} completed={percent} width={100} height={10} />
				</ProgressBarArea>
				<Spacer size={'sm'} />
				<ProgressStatus>
					{percent}% [ {rest_time} ({inference_time_per_data}) ]
				</ProgressStatus>
				<DialogContent style={{ padding: '8px 23px 9px 24px' }}>
					<FlexBox>
						<LeftArea>
							<SubTitle>Inference Summary</SubTitle>
							<Spacer />
							{isTabular ? (
								<div className="notAvailableDivWrapper">
									<div className="notAvailableDiv">Not Available</div>
								</div>
							) : !graphData || graphData.length === 0 || (graphData && graphData['xList'].length === 0) ? null : (
								<GraphComponent
									graphData={graphData}
									graphWidth={graphWidth}
									graphHeight={graphHeight}
									layoutLeft={layoutLeft}
									layoutRight={layoutRight}
									layoutTop={layoutTop}
									layoutBottom={layoutBottom}
									layoutPadding={layoutPadding}
								/>
							)}
						</LeftArea>
						<Spacer size={'lg'} />
						<RightArea>
							<SubTitle>Log</SubTitle>
							<Spacer />
							<LogItemList>
								{inference_log.map((v, i) => (
									<LogItem key={i}>{v[0]}</LogItem>
								))}
							</LogItemList>
						</RightArea>
					</FlexBox>
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const LogItemList = styled.div`
	width: 554px;
	height: 478px;
	background: black;
	padding: 5px;
	overflow-y: overlay;
	overflow-x: hidden;
	white-space: pre-wrap;
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
const RightArea = styled.div`
	width: 554px;
	height: 100%;
`;

const LeftArea = styled.div`
	width: 402px;
	height: 100%;
	.notAvailableDivWrapper {
		width: 100%;
		height: 478px;
		background-color: #f0f1f3;
		display: flex;
		justify-content: center;
		align-items: center;
	}
`;

const FlexBox = styled.div`
	display: flex;
`;

const ProgressStatus = styled.div`
	width: 100%;
	padding: 0px 24px;
	display: flex;
	justify-content: flex-end;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const ProgressBarArea = styled.div`
	width: 100%;
	height: 96px;
	padding: 16px 24px;
	background-color: #f0f1f3;
`;

const SubTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.text_black};
`;
