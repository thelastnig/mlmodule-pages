import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled, { css } from 'styled-components';

import './home.scss';
import agent from 'lib/apis';
import history from 'lib/history';
import LocalStorageManager from 'utils/LocalStorageManager';
import ListParamMaker from 'utils/ListParamMaker';
import { SEARCH_BAR_TYPE } from 'constants/common';
import PlusIcon from 'assets/icon/icon-plus.png';
import IconDelete from 'assets/icon/icon-delete.png';
import IconLoadProjectWhite from 'assets/icon/icon-load-project-disable.png';
import IconLoadProjectBlue from 'assets/icon/icon-load-project.png';

import { useStateActionHandler as useProjectStateActionHandler, useHandleState as useProjectHandleState } from 'store/project/hooks';
import { useCommonAction, useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useLocation } from 'react-router';

import { PageWrapper, SubTitleBox, WhiteBox, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import HomeTable from 'components/home/HomeTable';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import SearchInputComponent from 'components/common/SearchInputComponent';
import BoardComponent from 'components/home/BoardComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import MyList from 'components/common/MyList';
import Button from 'component/Button';


/*
 * TODO key값은 쿼리용 column으로 변경
 * */

const SELECT_FILTER_LIST = [
	{
		column: 'project_nm',
		label: 'Project',
	},
	{
		column: 'group_nm',
		label: 'Group',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'type_nm',
		label: 'Type',
	},
	{
		column: 'model_nm',
		label: 'Model',
	},
];
export default function Home() {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const { isLoggedIn, currentUser } = useAuthState();
	const { list, counts, row_count, total_row_count, sorting, sorting_type } = useProjectHandleState();
	const [checkItems, setCheckItems] = useState([]);
	const { onFetchProjectsListCallback, onInitDataCB } = useProjectStateActionHandler();
	const commonState = useCommonState();
	const { setLoadProject } = useCommonAction();
	const { showAlert } = useAlertAction();
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	const [boardType, setBoardType] = useState('');
	const [my_yn, setMy_yn] = useState(true);
	const ref = useRef(my_yn);
	const location = useLocation();

	if (location.firstCreatedProject) {
		const fistCreatedProjectName = location.firstCreatedProject.projectName;
		for (let data in list) {
			if (list[data].project_nm === fistCreatedProjectName) {
				setLoadProject(list[data]);
				delete location.firstCreatedProject;
				break;
			}
		}
	}

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});

	const showToggleDelete = (v) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '프로젝트를 삭제하시면 모든 data 전처리 history와 experiment 들이 삭제됩니다.\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteProject,
		});
	};

	const deleteProject = () => {
		let projectList = [];
		let isloadedProject = false;
		let loadedProjectId;
		try {
			loadedProjectId = LocalStorageManager.getLoadedProjectId();
		} catch(error) {
			loadedProjectId = '';
		}
		for (let i = 0; i < checkItems.length; i++) {
			projectList.push(checkItems[i].project_id);
			if (loadedProjectId === checkItems[i].project_id) {
				isloadedProject = true;
			}
		}
		const params = {
			project_id: projectList,
		};
		agent
			.delProjectList(params)
			.then((response) => {
				if (isloadedProject) {
					setLoadProject('');
				}
				showAlert({
					message: '삭제 완료 되었습니다.',
				});
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally(() => {});
	};

	useEffect(() => {
		if (!(isLoggedIn && currentUser.access_token_value) && !Boolean(LocalStorageManager.getLoggedInUser())) {
			history.push('/login');
		}
		return () => {
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn && currentUser.access_token_value]);

	const fetchList = useCallback(() => {
		if (isLoggedIn) {
			let user_id = '';
			if (my_yn) {
				user_id = currentUser.user_id;
			}
			const data = {
				start_index,
				row_count,
				sorting,
				sorting_type,
				startDate,
				endDate,
				[filter_type.column]: filter_text,
				user_id,
			}
			if (boardType !== 'total') data.working_status_nm = boardType;

			let params = ListParamMaker.make(data);
			onFetchProjectsListCallback(params);
			setCheckItems([]);
		}
	});

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type, boardType]);

	useEffect(() => {
		if (start_index > 0) {
			setStartIndex(0);
		} else {
			if (ref.current !== my_yn) {
				fetchList();
				ref.current = my_yn;
			}
		}
	}, [my_yn]);

	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	const boardClick = useCallback((type) => {
		setBoardType(type);
		setFilterType(SELECT_FILTER_LIST[0]);
		setFilterText('');
		setStartDate(new Date());
		setEndDate('');
		setStartIndex(0);
	});
	const loadProject = useCallback((project) => {
		setLoadProject(project);
		let message = `"${project.project_nm}" 프로젝트가 로드되었습니다.`;
		showAlert({
			message: message,
		});
	});
	const onLoadProject = useCallback((type) => {
		let project = checkItems[0];
		if (currentUser.user_id === project.create_user) {
			loadProject(project);
		} else {
			const loadOkClick = () => {
				loadProject(project);
			};
			showAlert({
				message: '해당 Project는 로그인된 계정으로 생성하지 않아 조회만 가능합니다. 로드하시겠습니까?',
				isConfirm: true,
				onOk: loadOkClick,
			});
		}
	});

	useEffect(() => {}, [checkItems]);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Project'} />
				<SubTitleBox>Statistics</SubTitleBox>
				<BoardComponent counts={counts} boardClick={boardClick} boardType={boardType} />

				<WhiteBox style={{ marginTop: '24px', height: '515px' }}>
					<FilterBox2>
						<ContentWrapper className={'ContentWrapper'}>
							<TableSelectComponent options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
							<MarginLeft />
							<SearchInputComponent
								placeHolder={'검색어를 입력해주세요.'}
								doSearch={(e) => fetchList()}
								filter_text={filter_text}
								setFilterText={setFilterText}
								type={SEARCH_BAR_TYPE.HOME}
								start_index={start_index}
								setStartIndex={setStartIndex}
							/>
							<Button
								colorType={'gray'}
								size={'iconLarge'}
								disabled={checkItems.length < 1}
								onClick={showToggleDelete}
								iconSrc={IconDelete}
								tooltipText={'Delete Selected'}
							/>
							<MarginLeft />
							<MyList title={'내가 생성한 프로젝트만 표시'} my_yn={my_yn} setMy_yn={setMy_yn} />
						</ContentWrapper>

						<ContentWrapper>
							<DateSelectorWithTerm startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
						</ContentWrapper>
					</FilterBox2>
					<HomeTable
						list={list}
						checkItems={checkItems}
						setCheckItems={setCheckItems}
						maxRowCnt={row_count}
						fetchList={fetchList}
						total_row_count={total_row_count}
						currentUser={currentUser}
						onLoadProject={onLoadProject}
					/>
				</WhiteBox>
				<BottomArea style={{ width: '100%', display: 'flex', justifyContent: 'center', paddingLeft: '64px', paddingRight: '64px' }}>
					<PaginationComponent
						totalCnt={total_row_count}
						startIndex={start_index + 1}
						setStartIndex={setStartIndex}
						maxRowCnt={row_count}
					/>
					<BottomButtonArea>
						<Button size={'large'} colorType={'blue'} iconSrc={PlusIcon} onClick={() => history.push('/newproject')}>
							New Project
						</Button>
						<LoadProjectWrapper disabled={checkItems.length !== 1}>
							<Button 
								size={'large'} 
								colorType={'whiteBlue'} 
								disabled={checkItems.length !== 1} 
								onClick={onLoadProject}
								guideText={(checkItems.length !== 1 && !commonState.loadProject) ? '프로젝트 1개를 선택 후 로드하세요.' : ''}
							>
								Load project
								<ButtonIcon className={'icon_load_white'} src={IconLoadProjectWhite} />
								<ButtonIcon className={'icon_load_blue'} src={IconLoadProjectBlue} />
							</Button>
						</LoadProjectWrapper>
					</BottomButtonArea>
				</BottomArea>
			</PageWrapper>
		</>
	);
}

const BottomButtonArea = styled.div`
	display: flex;
	width: 522px;
	justify-content: flex-end;
	position: absolute;
	right: 64px;
`;

const ContentWrapper = styled.div`
	display: flex;
`;

const FilterBox2 = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 32px;
	justify-content: space-between;
`;

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;

const LoadProjectWrapper = styled.div`
	${(props) => props.disabled
		&& css`
			.icon_load_white {
				display: inline-block;
			}
			.icon_load_blue {
				display: none;
			}
		`
		|| css`
			.icon_load_white {
				display: none;
			}
			.icon_load_blue {
				display: inline-block;
			}
			:hover {
				.icon_load_white {
					display: inline-block;
				}
				.icon_load_blue {
					display: none;
				}
			}
		`
	}
`;

const ButtonIcon = styled.img`
	width: 20px;
	height: 20px;
`;
