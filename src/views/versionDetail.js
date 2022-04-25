import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import OpenedIcon from 'assets/icon/icon-dropdown-opened.png';
import ClosedIcon from 'assets/icon/icon-dropdown-closed.png';
import BackIconImg from 'assets/icon/btn-back-models-p.png';
import IconDownload from 'assets/icon/btn-download-n.png';
import IconInfo from 'assets/icon/btn-info-p.png';

import { useHandleState, useStateActionHandler } from 'store/models/hooks';
import { useAuthState } from 'store/auth/hooks';

import { PageWrapper, BodyContainer, TitleComponent } from 'components/common/StyledComponent';
import LogTable from 'components/models/LogTable';
import VersionDetailDescription from 'components/models/VersionDetailDescription';
import VersionDetailTag from 'components/models/VersionDetailTag';
import Button from 'component/Button';
import FormatComponent from 'components/models/FormatComponent';
import { ROUTER_MODEL_REPOSITORY, ROUTER_MODELS } from 'components/layout/MenuConst';
import Tooltip from 'components/common/Tooltip';

export default function VersionDetail(props) {
	const model_nm = props.match.params.model_nm;
	const version = props.match.params.version;
	const history = useHistory();
	const { isLoggedIn, isAdmin } = useAuthState();
	const { onFetchModelVersionDetailCB, onInitVersionDetailCB } = useStateActionHandler();
	const { version_info } = useHandleState();
	const [logList, setLogList] = useState([]);
	const [logOpen, setLogOpen] = useState(false);

	useEffect(() => {
		if (isLoggedIn) {
			let params = {
				name: model_nm,
				version: version,
			};
			onFetchModelVersionDetailCB(params);
		}
		return () => {
			// componentWillUnmount 역할
			onInitVersionDetailCB();
		};
	}, [isLoggedIn]);
	useEffect(() => {
		if (version_info.log_list && version_info.log_list.length > 0) {
			setLogList(version_info.log_list);
		}
	}, [version_info]);
	const getTitle = () => {
		// 형식 “모델명”-Version”버전명”
		return model_nm + '-Version' + version;
	};
	const downloadClicked = () => {
		let { download_url } = version_info;
		let link = document.createElement('a');
		link.download = model_nm;
		link.href = download_url;
		link.click();
	};
	const backBtnClicked = () => {
		if (isAdmin) {
			history.push('/' + ROUTER_MODEL_REPOSITORY + '/' + model_nm);
		} else {
			history.push('/' + ROUTER_MODELS + '/' + model_nm);
		}
	};

	const handleOnClickInfoIcon = () => {
		window.open(process.env.REACT_APP_MANUAL_URL);
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Models'} />
				<BodyContainer>
					<SubTitleBox>Model Repository</SubTitleBox>
					<WhiteBox>
						<WhiteBoxTitle>
							<div>{getTitle()}</div>
							<MarginLeft />
							<Button colorType={'gray'} size={'iconLarge'} onClick={downloadClicked} iconSrc={IconDownload} tooltipText={'배포용 모델을 다운로드합니다.'}/>
							<MarginLeft />
							<Button colorType={'brandDark'} size={'iconLarge'} onClick={handleOnClickInfoIcon} iconSrc={IconInfo} tooltipText={'배포 안내'} />
							<MarginLeft />
							<span data-tip data-for={'back_btn_tooltip'}>
								<BackIcon src={BackIconImg} onClick={(e) => backBtnClicked()} />
								<Tooltip id={'back_btn_tooltip'} text={'모델 버전 목록 페이지로 돌아갑니다.'}/>
							</span>
						</WhiteBoxTitle>
						<ModelInfoArea>
							<SingleLine>
								<LeftItemArea>
									<InfoTitle>Date added :</InfoTitle>
									<InfoDescription>{version_info.create_date}</InfoDescription>
								</LeftItemArea>
								<RightItemArea>
									<InfoTitle>Python ver. :</InfoTitle>
									<InfoDescription>{version_info.python_version}</InfoDescription>
								</RightItemArea>
							</SingleLine>
							<SingleLine>
								<LeftItemArea>
									<InfoTitle>Modified date :</InfoTitle>
									<InfoDescription>{version_info.update_date}</InfoDescription>
								</LeftItemArea>
								<RightItemArea>
									<InfoTitle>Framework :</InfoTitle>
									<InfoDescription>{version_info.framework}</InfoDescription>
								</RightItemArea>
							</SingleLine>
							<SingleLine>
								<LeftItemArea>
									<InfoTitle>ID :</InfoTitle>
									<InfoDescription>{version_info.run_id}</InfoDescription>
								</LeftItemArea>
								<RightItemArea>
									<InfoTitle>Developer :</InfoTitle>
									<InfoDescription>{version_info.developer}</InfoDescription>
								</RightItemArea>
							</SingleLine>
						</ModelInfoArea>
						<VersionDetailDescription version_info={version_info} model_nm={model_nm} version={version} />
						<FormatComponent version_info={version_info} />
						<VersionDetailTag version_info={version_info} model_nm={model_nm} version={version} />
						<LogArea>
							<MoreTitle>
								{logOpen ? (
									<DropDownIcon src={OpenedIcon} onClick={(e) => setLogOpen(!logOpen)} />
								) : (
									<DropDownIcon src={ClosedIcon} onClick={(e) => setLogOpen(!logOpen)} />
								)}
								<div>Log</div>
							</MoreTitle>
							{logOpen && (
								<TableArea>
									<LogTable data={logList} />
								</TableArea>
							)}
						</LogArea>
					</WhiteBox>
				</BodyContainer>
			</PageWrapper>
		</>
	);
}

export const MoreTitle = styled.div`
	display: flex;
	padding: 10px 0;
`;

const BackIcon = styled.img`
	width: 24px;
	height: 24px;
	cursor: pointer;
`;

const TableArea = styled.div`
	width: 100%;
`;
export const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
`;

export const FormatButtonArea = styled.div`
	margin-top: 8px;
	width: 100%;
	height: 36px;
	text-align: right;
`;

const LogArea = styled.div`
	padding: 10px 0;
	padding-bottom: 5px;
`;

const InfoTitle = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	margin-right: 5px;
	font-weight: 500;
`;

const InfoDescription = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	font-weight: 400;
`;

const SubTitleBox = styled.div`
	padding: 12px 0 8px 0;
	height: 42px;
	font-size: 16px;
	color: ${colors.text_black};
`;

const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	padding: 24px 32px 32px 32px;
`;

export const DropDownIcon = styled.img`
	width: 20px;
	height: 20px;
	cursor: pointer;
`;

const ModelInfoArea = styled.div`
	padding: 15px 0;
	color: ${colors.text_black};
`;

const SingleLine = styled.div`
	display: flex;
	height: 25px;
	line-height: 25px;
	padding: 5px 0;
`;

const LeftItemArea = styled.div`
	width: 338px;
	display: flex;
`;

const RightItemArea = styled.div`
	display: flex;
`;

const WhiteBoxTitle = styled.div`
	height: 40px;
	display: flex;
	align-items: center;
	font-size: 18px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.45px;
	color: ${colors.text_black};
`;

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;

const InfoImage = styled.img`
	width: 24px;	
	vertical-align: middle;
	cursor: pointer;
`;