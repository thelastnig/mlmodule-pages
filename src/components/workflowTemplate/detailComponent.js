import React, { useEffect, useCallback } from 'react';
import styled from 'styled-components';
import moment from 'moment';

import { colors } from 'styles';
import agent from 'lib/apis';
import DataParser from 'utils/DataParser';
import { graphDataParser } from 'utils/graphUtil';

import { useCommonState, useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useHandleState, useStateActionHandler } from 'store/template/hooks';

import Button from 'component/Button';
import { AlgorithmSize } from 'components/common/ExperimentComponent';
import GraphComponent from 'components/common/graph/GraphComponent';

const START_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const POLLING_SHOW_SPINNER = false;

export default function Detail(props) {
	const { checkItems, template } = props;

	const { setLoadTemplate } = useCommonAction();
	const { showAlert } = useAlertAction();
	const { isMyProject, loadProject } = useCommonState();
	const { experiment_id, detail } = useHandleState();
	const { onFetchDetailCB, onInitDetailCB } = useStateActionHandler();
	const dataGraph = (detail && detail.graph) ? detail.graph : null;
	const parsedGraphData = graphDataParser(dataGraph);
	const graphWidth = 394;
	const graphHeight = 178;
	const layoutLeft = 40;
	const layoutRight = 30;
	const layoutTop = 5;
	const layoutBottom = 5;
	const layoutPadding = 4;
	const legendX = 0;
	const legendY = -0.2;

	useEffect(() => {
		if (experiment_id) {
			let params = {
				experiment_id: experiment_id,
				// project_id: project_id,
			};
			onFetchDetailCB(params);
		} else {
			onInitDetailCB();
		}
	}, [experiment_id]);

	const loadClicked = useCallback((type) => {
		fetchCommonStatus();
	});
	const fetchCommonStatus = useCallback(() => {
		let params = {
			noSpinner: !POLLING_SHOW_SPINNER,
			project_id: loadProject.project_id,
		};
		agent
			.getCommonStatus({ params })
			.then((response) => {
				let { list } = response.data;
				let isRun = false;
				let isPreprocess = false;
				for (let i = 0; i < list.length; i++) {
					let item = list[i];
					if (item.menu === 'run') {
						isRun = item.status;
					}
					if (item.menu === 'preprocess') {
						isPreprocess = item.status;
					}
				}
				if (!isRun && !isPreprocess) {
					doLoadTemplate();
				} else {
					showAlert({
						message: '현재 run/preprocess가 진행 중입니다. 작업 완료 후 Load하실 수 있습니다.',
					});
				}
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const doLoadTemplate = useCallback((type) => {
		let item = { ...detail };
		item.start_date = moment().format(START_DATE_FORMAT);
		item.template_id = template.template_id;
		setLoadTemplate(item);
		let message = `해당 Template이 로드되었습니다. 각 메뉴를 클릭하여 세팅값들을 확인해 보시기 바랍니다.`;

		showAlert({
			message: message,
		});
	});

	return (
		<>
			<DetailArea>
				<TitleArea>
					<MainTitle>Detail</MainTitle>
				</TitleArea>
				<BODY_AREA isMyProject={isMyProject}>
					<DetailItemTitle>Result</DetailItemTitle>
					<ResultArea>
						{parsedGraphData !== null ? (
							<GraphComponent
								graphData={parsedGraphData}
								graphWidth={graphWidth}
								graphHeight={graphHeight}
								layoutLeft={layoutLeft}
								layoutRight={layoutRight}
								layoutTop={layoutTop}
								layoutBottom={layoutBottom}
								layoutPadding={layoutPadding}
								legendX={legendX}
								legendY={legendY}
							/>
						) : null}
					</ResultArea>
					<DetailItemTitle>Model</DetailItemTitle>
					<ModelArea>
						<SingleLine>
							<ItemTitle>Name :</ItemTitle>
							<ItemDescription>{(detail.model_nm) ? detail.model_nm : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>Size(model) :</ItemTitle>
							<ItemDescription>{(detail.model_size) ? `${detail.model_size} MB` : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>Algorithm :</ItemTitle>
							<ItemDescription>{(detail.algorithm) ? detail.algorithm.algorithm_nm : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>No. of Parameters :</ItemTitle>
							<ItemDescription>
								<AlgorithmSize data={detail.algorithm} />
							</ItemDescription>
						</SingleLine>
					</ModelArea>
					<DetailItemTitle>Resources</DetailItemTitle>
					<ResourceArea>
						<SingleLine>
							<ItemTitle>Name :</ItemTitle>
							<ItemDescription>{(detail.resource) ? detail.resource.preset_nm : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>GPU :</ItemTitle>
							<ItemDescription>{(detail.resource) ? DataParser.parseGPU(detail.resource) : '-' }</ItemDescription>
						</SingleLine>
						{/*<SingleLine>*/}
						{/*  <ItemTitle>*/}
						{/*    VRAM :*/}
						{/*  </ItemTitle>*/}
						{/*  <ItemDescription>*/}
						{/*    32G*/}
						{/*  </ItemDescription>*/}
						{/*</SingleLine>*/}
						<SingleLine>
							<ItemTitle>CPU :</ItemTitle>
							<ItemDescription>{(detail.resource) ? DataParser.parseCPU(detail.resource) : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>RAM :</ItemTitle>
							<ItemDescription>{(detail.resource) ? DataParser.parseRAM(detail.resource) : '-'}</ItemDescription>
						</SingleLine>
					</ResourceArea>
					<DetailItemTitle>Parameter</DetailItemTitle>
					<ParemeterArea>
						<SingleLine>
							<ItemTitle>Learning Rate :</ItemTitle>
							<ItemDescription>{(detail.params) ? detail.params.learning_rate : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>Weight Decay :</ItemTitle>
							<ItemDescription>{(detail.params) ? detail.params.weight_decay : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>Batch Size :</ItemTitle>
							<ItemDescription>{(detail.params) ? detail.params.batch_size : '-'}</ItemDescription>
						</SingleLine>
						<SingleLine>
							<ItemTitle>Epoch :</ItemTitle>
							<ItemDescription>{(detail.params) ? detail.params.epoch : '-'}</ItemDescription>
						</SingleLine>
					</ParemeterArea>
				</BODY_AREA>
				{isMyProject && (
					<BottomArea>
						<Button
							colorType={'whiteBlue'}
							size={'fullWidth'}
							onClick={loadClicked}
							disabled={checkItems.length !== 1 || !detail}
						>
							Load Template
						</Button>
					</BottomArea>
				)}
			</DetailArea>
		</>
	);
}

const DetailArea = styled.div`
	width: 100%;
	height: 100%;
	padding: 23px 0;
	border-radius: 1px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	border: solid 1px #dfe2e5;
	background-color: ${colors.bg_white};
`;

const TitleArea = styled.div`
	height: 30px;
	padding: 0 23px;
`;
const BODY_AREA = styled.div`
	overflow-y: overlay !important;
	padding: 0 23px;
	margin-bottom: 10px;
	${(props) =>
		props.isMyProject
			? `height: 534px;
    `
			: `height: 590px;`}
	overflow-y: auto;
	padding-right: 13px;
`;

const MainTitle = styled.div`
	height: 30px;
	line-height: 30px;
	font-size: 16px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;
const SingleLine = styled.div`
	display: flex;
	height: 25px;
	line-height: 25px;
`;
const ItemTitle = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	margin-right: 5px;
	white-space: nowrap;
`;

const ItemDescription = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #3e5376;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const DetailItemTitle = styled.div`
	width: 100%;
	height: 36px;
	margin: 0 0 4px;
	padding: 0 8px;
	background-color: #f8f9fa;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	line-height: 36px;
`;
const ResourceArea = styled.div`
	width: 100%;
	padding: 0 16px;
`;
const ModelArea = styled.div`
	width: 100%;
	padding: 0 16px;
`;
const ParemeterArea = styled.div`
	width: 100%;
	height: 100px;
	padding: 0 16px;
`;
const ResultArea = styled.div`
	width: 100%;
	height: 208px;
	background-color: #d8d8d8;
`;

const BottomArea = styled.div`
	height: 52px;
	padding-top: 12px;
	padding: 0 23px;
`;
