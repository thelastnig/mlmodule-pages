import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import agent from 'lib/apis';
import OpenedIcon from 'assets/icon/icon-dropdown-opened.png';
import ClosedIcon from 'assets/icon/icon-dropdown-closed.png';
import SettingIcon from 'assets/icon/icon-setting.png';
import NextIcon from 'assets/icon/icon-arrow-next-n.png';

import { useAuthState } from 'store/auth/hooks';

import { DropDownIcon, FormatButtonArea, MoreTitle } from 'views/versionDetail';
import { ROUTER_MODELS } from 'components/layout/MenuConst';
import Tooltip from 'components/common/Tooltip';

const FormatComponent = (props) => {
	const { version_info } = props;
	const history = useHistory();
	const { isAdmin } = useAuthState();

	const [formatOpen, setFormatOpen] = useState(false);

	const [formatBtnEnabled, setFormatBtnEnabled] = useState(false);

	useEffect(() => {
		if (version_info.format_conversion && !version_info.status) {
			setFormatBtnEnabled(true);
		} else {
			setFormatBtnEnabled(false);
		}
	}, [version_info]);

	const gotoModelDetail = () => {
		history.push('/' + ROUTER_MODELS + '/' + version_info.model_name);
	};
	const postConvertVersionForamt = () => {
		let params = {
			name: version_info.model_name,
			version: version_info.model_version,
			run_id: version_info.run_id,
		};
		agent
			.convertVersionFormat(params)
			.then((response) => {
				console.log('then response = ', response);
				gotoModelDetail();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const formatBtnClicked = useCallback(() => {
		postConvertVersionForamt();
	});

	return (
		<FormatArea>
			<MoreTitle>
				{formatOpen ? (
					<DropDownIcon src={OpenedIcon} onClick={(e) => setFormatOpen(!formatOpen)} />
				) : (
					<DropDownIcon src={ClosedIcon} onClick={(e) => setFormatOpen(!formatOpen)} />
				)}
				<div>포맷 변환</div>
				<img src={SettingIcon} style={{ width: '20px', height: '20px', margin: '0 5px' }} alt="" />
			</MoreTitle>
			{formatOpen && (
				<FormatData>
					<FormatTitleArea>
						<FormatLeft>현재 포맷</FormatLeft>
						<FormatCenter></FormatCenter>
						<FormatRight>변환할 포맷</FormatRight>
					</FormatTitleArea>
					<FormatBody>
						<FormatLeft>
							<InputDisabled>{version_info.format}</InputDisabled>
						</FormatLeft>
						<FormatCenter>
							<img src={NextIcon} alt="" />
						</FormatCenter>
						<FormatRight>
							<InputDisabled>{'ONNX'}</InputDisabled>
							{!isAdmin && (
								<FormatButtonArea>
									{version_info.format &&
									version_info.format.length > 0 &&
									version_info.format === 'ONNX' ? (
										<ButtonGray>Stop</ButtonGray>
									) : formatBtnEnabled ? (
										<ButtonBlue onClick={formatBtnClicked}>Start</ButtonBlue>
									) : (
										<ButtonGray data-tip data-for={'model_format_btn_tooltip'}>
											Start
											<Tooltip
												id={'model_format_btn_tooltip'}
												text={'custom 기능이 포함되어 있어 포맷 변환이 지원되지 않습니다.'}
											/>
										</ButtonGray>
									)}
								</FormatButtonArea>
							)}
						</FormatRight>
					</FormatBody>
				</FormatData>
			)}
		</FormatArea>
	);
};
export default FormatComponent;

const FormatArea = styled.div`
	padding: 10px 0;
	padding-bottom: 5px;
`;

const FormatData = styled.div`
	padding: 10px 0;
	height: 140px;
`;

const FormatTitleArea = styled.div`
	display: flex;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	height: 25px;
	line-height: 25px;
`;

const FormatBody = styled.div`
	display: flex;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const FormatLeft = styled.div`
	width: 240px;
`;

const FormatCenter = styled.div`
	width: 36px;
	text-align: center;
	padding-top: 10px;
`;

const FormatRight = styled.div`
	width: 240px;
`;

const InputDisabled = styled.div`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	display: flex;
	align-items: center;
`;

const ButtonGray = styled.div`
	display: inline-block;
	width: 100px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: #d5d6d7;
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.bg_white};
	cursor: not-allowed;
`;

const ButtonBlue = styled.div`
	display: inline-block;
	width: 100px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	color: ${colors.bg_white};
	cursor: pointer;
	:hover {
		background: ${colors.light_blue_hover};
	}
	:active {
		background: ${colors.light_blue_press};
	}
`;
