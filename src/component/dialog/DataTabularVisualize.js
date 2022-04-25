import React from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';

// Graph 구현
import HistogramGraphComponent from 'components/common/graph/HistogramGraphComponent';
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
		height: '935px',
	},
}));

export default function DataTabularVisualize({ graphValues }) {
	const classes = useStyles();
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.DATA_TABULAR_VISUALIZE;

	let graphs = [];
	const graphWidth = 220;
	const graphHeight = 220;
	const layoutLeft = 10;
	const layoutRight = 10;
	const layoutTop = 0;
	const layoutBottom = 20;
	const layoutPadding = 0;
	const showticklabels = false;

	if (graphValues === null) {
		graphs.push(<div>No Graph Available</div>);
	} else {
		const jsonRawKeys = Object.keys(graphValues);
		let jsonValidKeys = [];
		jsonRawKeys.map((key) => {
			if (graphValues[key].length > 0) {
				jsonValidKeys.push(key);
			}
		});

		jsonValidKeys.map((jsonKey, index) => {
			graphs.push(
				<GraphContent key={index} isLast={false}>
					<GraphNameBox>{jsonKey}</GraphNameBox>
					<GraphBox>
						<Graph>
							<HistogramGraphComponent
								graphData={graphValues[jsonKey]}
								graphWidth={graphWidth}
								graphHeight={graphHeight}
								layoutLeft={layoutLeft}
								layoutRight={layoutRight}
								layoutTop={layoutTop}
								layoutBottom={layoutBottom}
								layoutPadding={layoutPadding}
								showticklabels={showticklabels}
							/>
						</Graph>
					</GraphBox>
				</GraphContent>,
			);
			if (index + 1 === jsonValidKeys.length) {
				const additionalDivNum = 5 - (jsonValidKeys.length % 5);
				for (let i = 0; i < additionalDivNum; i++) {
					graphs.push(<GraphContent isLast={true} />);
				}
			}
		});
	}

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'visualize_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Visualize All'} toggle={hideDialog} />
				<DialogContent>
					<SubTitle></SubTitle>

					<Spacer />

					<GraphContainer center={true}>{graphs}</GraphContainer>
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const Graph = styled.div`
	width: 220px;
	height: 220px;
	background: ${colors.silver};
`;

const GraphBox = styled.div`
	width: 100%;
	height: 253px;
	padding: 16px;
`;

const GraphNameBox = styled.div`
	width: 100%;
	height: 40px;
	background: ${colors.silver};
	border-top-left-radius: 4px;
	border-top-right-radius: 4px;
	padding: 10px 16px 10px 16px;
`;

const GraphContent = styled.div`
	width: 252px;
	height: 293px;
	border-radius: 4px;
	box-shadow: 1px 2px 6px 0 rgba(0, 0, 0, 0.04);
	border: solid 1px ${colors.gray_light};
	background-color: ${colors.bg_white};
	margin-bottom: 20px;
	${(props) =>
		props.isLast &&
		`
border: none;
box-shadow: none;
background-color: white;
`}
`;

const SubTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.text_black};
`;

const GraphContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
`;
