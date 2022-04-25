import React, { useState, useEffect, useCallback } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { THEME } from 'styles/theme/theme';
import { ROLE, BACKGROUND_JOB_TYPE } from 'constants/common';
import infoIcon from 'assets/icon/btn-info-p.png';
import projectIcon from 'assets/icon/icon-project.png';

import { useCommonState, useCommonAction } from 'store/common/hooks';
import { useHandleState as useDatasetState, useStateActionHandler as useDatasetActionHandler } from 'store/dataset/hooks';

import TemplateMode from 'components/layout/TemplateMode';
import AlarmIconComponent from 'components/layout/AlarmIcon';
import { useAuthState } from 'store/auth/hooks';
import { ROUTER_INFORMATION } from 'components/layout/MenuConst';
import Tooltip from 'components/common/Tooltip';
import { useAlertAction } from 'store/alert/hooks';
import { goAnnotationPage } from 'utils/NavigateUtil';
import LoadingDot from 'components/common/LoadingDot';

import LocalStorageManager from 'utils/LocalStorageManager';

const Header = () => {
	const history = useHistory();
	const { loadProject, backgroundJobList, backgroundErrorTxt } = useCommonState();
	const { finishBackgroundJob, initBackgroundErrTxt } = useCommonAction();
	const { replacedAnnotaionId, isDataMergeComplete } = useDatasetState();
	const { initAnnotationId, initMergeState } = useDatasetActionHandler();
	const { currentUser, access_token, refresh_token } = useAuthState();
	const { showAlert } = useAlertAction();

	const [projectName, setProjectName] = useState('');

	useEffect(() => {
		let project_nm = '';
		if (loadProject) {
			project_nm = loadProject.project_nm;
		} else {
			project_nm = '프로젝트를 로드해주세요.';
		}
		setProjectName(project_nm);
	}, [loadProject]);

	const gotoInfoPage = useCallback(() => {
		history.push('/' + ROUTER_INFORMATION);
	});

	useEffect(() => {
		if(replacedAnnotaionId > 0) {
			const annotationId = replacedAnnotaionId;
			initAnnotationId();
			finishBackgroundJob(BACKGROUND_JOB_TYPE.LABEL_REPLACE);

			showAlert({
				message: '데이터 라벨 교체 작업이 완료되었습니다.\nAnnotation 화면을 띄우시겠습니까?',
				isConfirm: true,
				onOk: () => {
					const token = {
						access_token_value: access_token,
						refresh_token_value: refresh_token,
						user_id: currentUser.user_id,
						role: currentUser.role,
					};
					goAnnotationPage(annotationId, token);
				},
			});
		}
	}, [replacedAnnotaionId]);

	useEffect(() => {
		if(isDataMergeComplete) {
			initMergeState();
			finishBackgroundJob(BACKGROUND_JOB_TYPE.DATA_MERGE);

			showAlert({
				message: '데이터 병합 작업이 완료되었습니다.',
			});
		}
	}, [isDataMergeComplete]);

	useEffect(() => {
		if(backgroundErrorTxt && backgroundErrorTxt.length > 0) {
			initBackgroundErrTxt();
			showAlert({
				message: backgroundErrorTxt,
			});
		}
	}, [backgroundErrorTxt]);

	const renderWorkingJobTxt = (type) => {
		let text = '';
		switch(type) {
			case BACKGROUND_JOB_TYPE.DATA_MERGE:
				text = '데이터 병합 작업 중';
				break;
			case BACKGROUND_JOB_TYPE.LABEL_REPLACE:
				text = '데이터셋 라벨 교체 작업 중';
				break;
			default:
		}

		return (
			<>
				{text && (
					<>
						<BackgroundJobDescTxt>{text}</BackgroundJobDescTxt>
						<LoadingDot style={{ marginRight: "25px", marginTop: "12px" }} color={'#ffffff'} size={7}></LoadingDot>
					</>
				)}				
			</>
		);
	};

	const isAnnotator = currentUser && currentUser.role === ROLE.ANNOTATOR ? true : false;
	const isDeveloper = currentUser && currentUser.role === ROLE.DEVELOPER ? true : false;
	return (
		<>
			<HeaderWrapper>
				<LeftComponent>
					<Link to={isDeveloper ? '/home' : '/userGroup'}>
						<HeaderIcon src={THEME.getImageURL('logo-header')} />
						<HeaderTitle>{THEME.headerTitle}</HeaderTitle>
					</Link>
				</LeftComponent>

				<RightComponent>
					{isDeveloper && (
						<>
							<ProjectNameComponent>
								{backgroundJobList && backgroundJobList.length > 0 
									&& backgroundJobList.map(job => renderWorkingJobTxt(job))
								}								
								<IconProject src={projectIcon} />
								<ProjectTitle>Project :</ProjectTitle>
								<ProjectValue data-tip data-for="projecNameTip">
									{projectName}
								</ProjectValue>
								{/* <Tooltip id={'projecNameTip'} text={projectName} /> */}
							</ProjectNameComponent>
							<TemplateMode />
						</>
					)}
					<IconComponent src={infoIcon} onClick={gotoInfoPage} />
					{!isAnnotator && <AlarmIconComponent />}
				</RightComponent>
			</HeaderWrapper>
		</>
	);
};

export default Header;

const ProjectNameComponent = styled.div`
	display: flex;
	text-align: right;
	padding: 0;
`;
const ProjectTitle = styled.div`
	margin-right: 5px;
	margin-top: 2px;
`;
const ProjectValue = styled.div`
	max-width: 1000px;
	margin-top: 3px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
`;
const LeftComponent = styled.div`
	display: flex;
	width: 200px;
	align-items: center;
	padding-left: 32px;
`;
const RightComponent = styled.div`
	width: 1720px;
	display: flex;
	justify-content: flex-end;
	padding-right: 64px;
`;
const HeaderIcon = styled.img`
	width: 128px;
	height: 20px;
`;
const IconComponent = styled.img`
	width: 20px;
	height: 20px;
	margin-left: 24px;
	margin-top: 2px;
	cursor: pointer;
`;

const IconProject = styled.img`
	width: 18px;
	height: 18px;
	margin-right: 5px;
	margin-top: 3px;
`;
const HeaderTitle = styled.div`
	font-size: 12px;
`;

const HeaderWrapper = styled.div`
	display: flex;
	align-items: center;
	width: 1920px;
	height: 64px;
	top: 0px;
	background: ${THEME.background};
	color: white;
	font-size: 1rem;
	letter-spacing: -0.3px;
	font-weight: normal;
`;

const BackgroundJobDescTxt = styled.div`
	margin-right: 22px;
	margin-top: 2px;
`;