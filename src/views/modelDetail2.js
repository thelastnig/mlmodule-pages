import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { colors } from 'styles';
import { text_black } from 'styles/colors';
import ListParamMaker from 'utils/ListParamMaker';
import SettingIcon from 'assets/icon/icon-setting.png';
import BackIconImg from 'assets/icon/btn-back-models-p.png';

import { useInput } from 'store/root/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useStateActionHandler, useHandleState } from 'store/models/hooks';
import { useStateActionHandler as versionHandler, useHandleState as versionState } from 'store/model_version_list/hooks';

import { PageWrapper, BodyContainer, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import Checkbox from 'components/common/table/Checkbox';
import Button from 'component/Button';
import VersionTable from 'components/models/VersionTable';
import PaginationComponent from 'components/common/PaginationComponent';
import { ROUTER_MODELS } from 'components/layout/MenuConst';

import Tooltip from 'components/common/Tooltip';

export default function DetailModel(props) {
	const model_nm = props.match.params.model_nm;
	const history = useHistory();
	const { isLoggedIn } = useAuthState();
	const { onFetchModelsDetailCB, onInitDetailCB, onSaveLimitVersionCB } = useStateActionHandler();
	const { detail } = useHandleState();
	const { onFetchVersionListCB } = versionHandler();
	const { list: version_list, row_count, total_row_count, sorting, sorting_type } = versionState();

	const [autoDelete, setAutoDelete] = useState(false);
	const [start_index, setStartIndex] = useState(0);
	let [maxVersion, change_maxVersion, set_maxVersion] = useInput(null);

	const saveClicked = useCallback(() => {
		let params = {
			name: model_nm,
			version_limit: maxVersion ? maxVersion : '0',
		};
		setRegisteredModelVersionLimit(params);
	});

	const setRegisteredModelVersionLimit = (params) => {
		onSaveLimitVersionCB(params)
			.then((response) => {
				fetchData();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const onChangeAutoDelete = () => {
		if (autoDelete) {
			let params = {
				name: model_nm,
				version_limit: '0',
			};
			setRegisteredModelVersionLimit(params);
		}
		setAutoDelete(!autoDelete);
	};

	useEffect(() => {
		if (detail) {
			set_maxVersion(detail.version_limit);
			setAutoDelete(detail.is_version_limit);
		}
	}, [detail]);

	const fetchData = () => {
		let params = {
			name: model_nm,
		};
		onFetchModelsDetailCB(params);
	};
	const fetchVersionList = useCallback(() => {
		if (isLoggedIn) {
			let params = ListParamMaker.make({
				start_index,
				row_count,
				sorting,
				sorting_type,
				model_name: model_nm,
			});

			onFetchVersionListCB(params);
		}
	});
	useEffect(() => {
		fetchVersionList();
	}, [start_index, sorting, sorting_type]);
	useEffect(() => {
		if (isLoggedIn) {
			fetchData();
			fetchVersionList();
		}
		return () => {
			// componentWillUnmount 역할
			onInitDetailCB();
		};
	}, [isLoggedIn, model_nm]);

	const backBtnClicked = () => {
		history.push('/' + ROUTER_MODELS);
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Models'} />
				<BodyContainer>
					<SubTitleBox>Model Repository</SubTitleBox>
					<WhiteBox>
						<WhiteBoxTitle>
							<span style={{ marginRight: '10px' }}>{detail.model_name}</span>
							<BackIcon src={BackIconImg} onClick={(e) => backBtnClicked()} />
						</WhiteBoxTitle>
						<ModelInfoArea>
							<SingleLine>
								<LeftItemArea>
									<InfoTitle>Created :</InfoTitle>
									<InfoDescription>{detail.create_date}</InfoDescription>
								</LeftItemArea>
								<RightItemArea>
									<InfoTitle>Updated :</InfoTitle>
									<InfoDescription>{detail.update_date}</InfoDescription>
								</RightItemArea>
							</SingleLine>
						</ModelInfoArea>
						<AutoDeleteArea>
							<img src={SettingIcon} style={{ width: '20px', height: '20px', marginRight: '5px' }} alt="" />
							<div>자동 삭제</div>
							<ChkBoxContainer>
								<Checkbox checked={autoDelete} onChange={(e) => onChangeAutoDelete()} />
							</ChkBoxContainer>
						</AutoDeleteArea>
						<VersionInputArea>
							<AutoDeleteText>최대 버전 수</AutoDeleteText>
							<div style={{ display: 'flex' }}>
								<InputBox disabled={!autoDelete} data-tip data-for={'model_detail_max_version_tooltip'}>
									<CustomInput type="number" disabled={!autoDelete} value={maxVersion} onChange={change_maxVersion} />
									{!autoDelete && (
										<Tooltip id={'model_detail_max_version_tooltip'} text={'‘자동 삭제’ 옵션 체크 후 활성화. 유지할 버전의 최대 개수를 지정합니다.'}/>
									)}
								</InputBox>
								<Button
									colorType={'blue'}
									size={'lowMedium'}
									disabled={!autoDelete}
									onClick={saveClicked}
									tooltipText={!autoDelete ? '‘자동 삭제’ 옵션 체크 후 활성화. 유지할 버전의 최대 개수를 지정합니다.' : ''}
								>
									Save
								</Button>
							</div>
							<AutoDeleteText>지정한 최대 버전 수 초과시 가장 오래된 버전부터 자동 삭제됩니다.</AutoDeleteText>
						</VersionInputArea>
						<TableArea>
							<VersionTable model_nm={model_nm} list={version_list} maxRowCnt={row_count} />
						</TableArea>
					</WhiteBox>
					<BottomArea>
						<PaginationComponent
							totalCnt={total_row_count}
							startIndex={start_index + 1}
							setStartIndex={setStartIndex}
							maxRowCnt={row_count}
						/>
					</BottomArea>
				</BodyContainer>
			</PageWrapper>
		</>
	);
}

const BackIcon = styled.img`
	width: 24px;
	height: 24px;
	cursor: pointer;
`;

const TableArea = styled.div`
	width: 100%;
	padding: 60px 0 0 0;
`;

const AutoDeleteText = styled.div`
	height: 19px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.gray_default};
	height: 40px;
	padding: 10px 0;
`;

const ChkBoxContainer = styled.div`
	margin-left: 10px;
`;

const InputBox = styled.div`
	width: 240px;
	height: 32px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 8px;
	${(props) =>
		props.disabled &&
		`
      cursor: not-allowed;
      background: ${colors.disable};
    `}
`;

const CustomInput = styled.input`
	width: 220px;
	height: 18px;
	font-size: 14px;
	color: ${text_black};
	text-align: left;
	border: none;
	outline: none;
`;

const AutoDeleteArea = styled.div`
	display: flex;
	padding: 10px 0;
	padding-bottom: 5px;
`;

const VersionInputArea = styled.div``;

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
	height: 620px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	padding: 32px;
`;
const ModelInfoArea = styled.div`
	padding: 15px 0;
	color: ${colors.text_black};
`;

const SingleLine = styled.div`
	display: flex;
	height: 25px;
	line-height: 25px;
`;

const LeftItemArea = styled.div`
	width: 338px;
	display: flex;
`;

const RightItemArea = styled.div`
	display: flex;
`;

const WhiteBoxTitle = styled.div`
	height: 24px;
	font-size: 18px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.45px;
	color: ${colors.text_black};
	display: flex;
`;
