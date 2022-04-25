import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import Arrow from 'assets/icon/icon-arrow-right.png';
import agent from 'lib/apis';

import Spacer from 'components/spacer';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { PreprocessContext } from 'views/PreProcess';

import { useAlertAction } from 'store/alert/hooks';

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

// TODO Redux 적용 필요
export default function DlgPreprocessResult(props) {
	const { show, toggle } = props;
	const classes = useStyles();
	const [before_dataset_info, set_before_dataset_info] = useState({});
	const [after_dataset_info, set_after_dataset_info] = useState({});
	const [resultOk, setResultOk] = useState(false);
	const { showAlert } = useAlertAction();

	const { isTabular, pipeline_name, getLatestPreprocess } = useContext(PreprocessContext);

	const getPreprocessResult = () => {
		if (!pipeline_name) {
			getLatestPreprocess();
		}
		let params = {
			pipeline_nm: pipeline_name, // sample : 'dev_test1_0309173539_tabular'
		};
		agent
			.getPreprocessResult(params)
			.then((response) => {
				console.log('then response = ', response);
				const { before_dataset_info, after_dataset_info } = response.data;
				set_before_dataset_info(before_dataset_info);
				set_after_dataset_info(after_dataset_info);
				setResultOk(true);
			})
			.catch((error) => {
				console.log('error ', error);
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
				getLatestPreprocess();
			} else {
				getPreprocessResult();
			}
		} else {
			set_before_dataset_info({});
			set_after_dataset_info({});
			setResultOk(false);
		}
	}, [show, pipeline_name]);
	const onConfirmClicked = (e) => {
		toggle(false);
	};

	return (
		<div>
			{resultOk && (
				<Dialog
					open={show}
					onClose={onConfirmClicked}
					aria-labelledby="alert-dialog-title"
					aria-describedby="alert-dialog-description"
					className={'data_prerocess_result_dlg dialog_layout'}
					classes={{ paper: classes.paper }}
				>
					<DialogTitleComponent title={'Data Preprocess Result'} toggle={toggle} />
					<DialogContent>
						<Spacer />
						<SubTitle>요청하신 작업이 완료되었습니다.</SubTitle>
						<Spacer />
						<Spacer />
						<ContentFelx>
							<DataSetInfoArea>
								<BoxTitle>DataSet Info</BoxTitle>
								<InfoRow dataset_info={before_dataset_info} isTabular={isTabular} />
							</DataSetInfoArea>
							<ArrowArea>
								<img src={Arrow} width="50px" height="50px" alt="" />
							</ArrowArea>
							<DataSetInfoArea>
								<BoxTitle result={true}>DataSet Info</BoxTitle>
								<InfoRow result={true} dataset_info={after_dataset_info} isTabular={isTabular} />
							</DataSetInfoArea>
						</ContentFelx>
					</DialogContent>
					<DialogFooter confirmClick={onConfirmClicked} />
				</Dialog>
			)}
		</div>
	);
}

const InfoRow = (props) => {
	const { result, dataset_info, isTabular } = props;
	return (
		<>
			<Divider />
			<DataRow>
				<RowName>Dataset</RowName>
				<RowValue result={result}>{dataset_info.dataset_nm}</RowValue>
			</DataRow>
			<DataRow>
				<RowName>Type</RowName>
				<RowValue result={result}>{dataset_info.dataset_type}</RowValue>
			</DataRow>
			{isTabular ? (
				<>
					<DataRow>
						<RowName>No. of features</RowName>
						<RowValue result={result}>{dataset_info.num_features}</RowValue>
					</DataRow>
					<DataRow>
						<RowName>No. of rows</RowName>
						<RowValue result={result}>{dataset_info.num_rows}</RowValue>
					</DataRow>
				</>
			) : (
				<DataRow>
					<RowName>No. of instances</RowName>
					<RowValue result={result}>{dataset_info.num_instances}</RowValue>
				</DataRow>
			)}
			<DataRow>
				<RowName>Size</RowName>
				<RowValue result={result}>{dataset_info.size}</RowValue>
			</DataRow>
			<DataRow>
				<RowName>Version</RowName>
				<RowValue result={result}>{dataset_info.version}</RowValue>
			</DataRow>
			<Divider />
		</>
	);
};

const DataSetInfoArea = styled.div`
	width: 380px;
	display: flex;
	flex-direction: column;
`;

const ArrowArea = styled.div`
	width: 74px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ContentFelx = styled.div`
	display: flex;
`;

const BoxTitle = styled.div`
	height: 29px;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${(props) => (props.result ? colors.text_black : '#b8babd')};
`;

const SubTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	color: ${colors.text_black};
`;

const Divider = styled.div`
	width: 100%;
	height: 1px;
	background: ${colors.gray_light};
`;

const RowValue = styled.div`
	width: 280px;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	overflow: hidden;
	word-break: break-all;
	color: ${(props) => (props.result ? colors.text_black : '#8f9ba6')};
`;

const RowName = styled.div`
	width: 151px;
	color: #3e5376;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
`;

const DataRow = styled.div`
	width: 100%;
	height: 44px;
	padding: 0px 16px 0px 16px;
	display: flex;
	align-items: center;
	background: ${(props) => (props.colored ? colors.bg_light_gray : null)};
	:nth-child(even) {
		background: ${colors.bg_light_gray};
	}
`;
