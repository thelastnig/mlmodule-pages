import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';
import settingIcon from 'assets/icon/icon-setting-n.png';
import downBtnIcon from 'assets/icon/btn-down-n.png';
import upBtnIcon from 'assets/icon/btn-up-n.png';

import { useCommonState, useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { ROUTER_TEMPLATE } from 'components/layout/MenuConst';

/*
PJ-001
- 현재 Template mode 상태 표시
- Template을 로드했을 경우 : Status에 ‘동작 중’이라고 표시, 버튼명은 ‘Template mode 취소’
- Template을 로드하지 않았을 경우 : Status에 ‘미동작’이라고 표시, 버튼명은 ‘Template load 하기’
    Template mode로 변경 클릭 시 -> 팝업출력 -> 확인 -> Template 페이지로 이동됩니다.
- Template을 로드한 뒤 Experiment - Run 화면에서 ‘Start Train’을 클릭하는 순간 Template mode 해제

* */
export default function TemplateMode() {
	const history = useHistory();
	const { loadProject } = useCommonState();
	const [enableTemplate, setEnableTemplate] = useState(true);
	const [anchorEl, setAnchorEl] = useState(null);
	const [open, setOpen] = useState(false);
	const [isTemplateMode, setIsTemplateMode] = useState(false);
	const { loadTemplate } = useCommonState();
	const { setLoadTemplate } = useCommonAction();
	const { showAlert } = useAlertAction();

	useEffect(() => {
		setEnableTemplate(!!loadProject);
	}, [loadProject]);
	useEffect(() => {
		setIsTemplateMode(!!loadTemplate);
	}, [loadTemplate]);
	const handleClick = (event) => {
		if (!enableTemplate) {
			return;
		}
		setAnchorEl(event.currentTarget);
		setOpen(true);
	};
	const loadTemplateClicked = () => {
		handleClose();
		history.push('/' + ROUTER_TEMPLATE);
	};
	const cancelTemplateClicked = () => {
		handleClose();
		fetchCommonStatus();
	};
	const fetchCommonStatus = useCallback(() => {
		let params = {
			noSpinner: true,
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
					setLoadTemplate('');
				} else {
					showAlert({
						message: '현재 template을 사용 중인 run/preprocess가 진행 중입니다. 작업 완료 후 취소하실 수 있습니다.',
					});
				}
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	const handleClose = () => {
		setAnchorEl(null);
		setOpen(false);
	};
	return (
		<>
			<IconSetting src={settingIcon} />

			<TemplateInputComponent enableTemplate={enableTemplate} onClick={handleClick}>
				<TemplateName isTemplateMode={isTemplateMode}>
					<div>{'Template Mode'}</div>
					{isTemplateMode ? <ModeDot /> : <div></div>}
				</TemplateName>
				<ArrowDown src={open ? upBtnIcon : downBtnIcon} />
			</TemplateInputComponent>
			<StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={open} onClose={handleClose}>
				<PopoverMenu>
					{isTemplateMode ? <StatusOnArea>Status: 동작중</StatusOnArea> : <StatusArea>Status: Template Mode 중지</StatusArea>}
					<DateArea>Start date : {loadTemplate && loadTemplate.start_date}</DateArea>
					{isTemplateMode ? (
						<BlueButton onClick={() => cancelTemplateClicked()}>Template mode 취소</BlueButton>
					) : (
						<BlueButton onClick={() => loadTemplateClicked()}>Template mode로 변경</BlueButton>
					)}
				</PopoverMenu>
			</StyledMenu>
		</>
	);
}

const StyledMenu = withStyles({
	paper: {
		// border: '1px solid red',
		background: 'transparent',
		marginTop: '5px',
	},
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center',
		}}
		{...props}
	/>
));
const ArrowDown = styled.img`
	width: 20px;
	height: 20px;
	margin-left: 24px;
`;
const StatusOnArea = styled.div`
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
const StatusArea = styled.div`
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #b5bcc4;
`;
const DateArea = styled.div`
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #8f9ba6;
	margin: 4px 0;
`;
const BlueButton = styled.div`
	width: 100%;
	height: 28px;
	line-height: 28px;
	border-radius: 2px;
	background-color: ${colors.light_blue};
	font-size: 12px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.bg_white};
	margin-top: 10px;
	cursor: pointer;
`;

const PopoverMenu = styled.div`
	background: red;
	width: 224px;
	height: 104px;
	border-radius: 4px;
	border: solid 1px #d5d6d7;
	background-color: ${colors.bg_white};
	padding: 12px;
	:focus {
		outline: none;
	}
`;
const TemplateInputComponent = styled.div`
	width: 224px;
	height: 24px;
	color: #b5bcc4;
	background-color: ${colors.bg_white};
	padding: 0 12px;
	display: flex;
	// padding-top: 3px;
	line-height: 22px;
	border-radius: 1px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	border: solid 1px #dfe2e5;
	cursor: not-allowed;
	${(props) =>
		props.enableTemplate &&
		`
      cursor: pointer;
      color:${colors.text_black};
    `}
`;

const TemplateName = styled.div`
	width: calc(100% - 15px);
	display: flex;
	${(props) =>
		!props.isTemplateMode &&
		`
     color:#b5bcc4;
  `}
`;

const IconSetting = styled.img`
	width: 20px;
	height: 20px;
	margin-right: 5px;
	margin-left: 20px;
	margin-top: 2px;
`;

const ModeDot = styled.div`
	width: 5px;
	height: 5px;
	border-radius: 4px;
	background: #005cb5;
	margin-top: 6px;
	margin-left: 3px;
`;
