import React, { Fragment, useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import { colors } from 'styles';
import agent from 'lib/apis';
import { analyzedData2DParser, analyzedData3DParser } from 'utils/graphUtil';
import { useAlertAction } from 'store/alert/hooks';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { AnalyzeContext } from 'views/Analyze';
import GraphComponent from 'components/common/graph/Scatter2DGraphComponent';
import Graph3DComponent from 'components/common/graph/Scatter3DGraphComponent';

// TODO Redux 적용 필요
export default function AnalayzeResult(props) {
	const { show, toggle } = props;
	const [analyze_result, set_analyze_result] = useState('');
	const [graphData, setGraphData] = useState(null);
	const [graph3DData, setGraph3DData] = useState(null);
	const { showAlert } = useAlertAction();
	const graphWidth = 655;
	const graphHeight = 595;
	const layoutLeft = 50;
	const layoutRight = 40;
	const layoutTop = 5;
	const layoutBottom = 50;
	const layoutPadding = 4;

	const { pipeline_name, getLatestAnalyze, method } = useContext(AnalyzeContext);

	const onConfirmClicked = (e) => {
		toggle(false);
	};

	const getAnalyticResult = () => {
		if (!pipeline_name) {
			getLatestAnalyze();
		}
		let params = {
			pipeline_nm: pipeline_name,
		};
		agent
			.getAnalyticResult(params)
			.then((response) => {
				console.log('then response = ', response);
				const { analyze_result } = response.data;
				set_analyze_result(analyze_result);
				setGraphData(analyzedData2DParser(analyze_result));
				setGraph3DData(analyzedData3DParser(analyze_result));
			})
			.catch((error) => {
				toggle(false);
				const msg_desc = error.data.detail;
				showAlert({
					message: msg_desc ? msg_desc : error.statusText,
				});
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (show) {
			if (!pipeline_name) {
				getLatestAnalyze();
			} else {
				getAnalyticResult();
			}
		} else {
			set_analyze_result('');
		}
	}, [show, pipeline_name]);

	return (
		<div>
			<Dialog className={'data_analyze_result_dialog dialog_layout'} open={show} onClose={onConfirmClicked} >
				<DialogTitleComponent title={'Data Analyze Result'} toggle={toggle} />
				<DialogContent>
					<ContentItemTitle>요청하신 작업이 완료되었습니다.</ContentItemTitle>
					<Spacer />
					<Spacer />
					{method.analyze_call_function === 'PCA' ? (
						<Back>
							{graphData !== null ? (
								graphData['labelLength'] > 3 ? (
									<Fragment>
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
										<Graph3DComponent
											graphData={graph3DData}
											graphWidth={graphWidth}
											graphHeight={graphHeight}
											layoutLeft={layoutLeft}
											layoutRight={layoutRight}
											layoutTop={layoutTop}
											layoutBottom={layoutBottom}
											layoutPadding={layoutPadding}
										/>
									</Fragment>
								) : (
									<GraphComponent
										graphData={graphData}
										graphWidth={graphWidth * 2}
										graphHeight={graphHeight}
										layoutLeft={layoutLeft}
										layoutRight={layoutRight}
										layoutTop={layoutTop}
										layoutBottom={layoutBottom}
										layoutPadding={layoutPadding}
									/>
								)
							) : null}
						</Back>
					) : (
						<BlackLog>{analyze_result}</BlackLog>
					)}

					<Spacer />
					<Spacer />
					<Spacer />
					<Spacer size={'xs'} />
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} />
			</Dialog>
		</div>
	);
}

const Back = styled.div`
	background: #d8d8d8;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 596px;
	font-size: 56px;
	font-weight: bold;
	color: ${colors.text_black};
`;
const BlackLog = styled.div`
	background: #000000;
	height: 596px;
	font-size: 15px;
	font-weight: bold;
	color: ${colors.bg_white};
	overflow: auto;
	white-space: pre;
	padding: 20px 30px;
	&::-webkit-scrollbar {
		width: 8px;
		height: 5px;
		border-radius: 2px;
		background: gray;
	}
	&::-webkit-scrollbar-thumb {
		background-color: black;
		border-radius: 6px;
	}
`;

const DialogContent = styled.div`
	padding: 0 24px;
`;

const ContentItemTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
	padding-top: 12px;
`;
