import React, { useCallback, useState, useEffect, createContext, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import './dataset.scss';
import { colors } from 'styles';
import { EXPERIMENT_STATUS, SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';
import LocalStorageManager from 'utils/LocalStorageManager';
import PlusIconBlue from 'assets/icon/icon-plus-blue.png';
import MergeIcon from 'assets/icon/icon-merge.png';
import ExportIcon from 'assets/icon/icon-export-n.png';
import IconDelete from 'assets/icon/icon-delete.png';

import { useCommonState, useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useStateActionHandler, useHandleState } from 'store/dataset/hooks';
import { useAuthState } from 'store/auth/hooks';

import {
	PageWrapper,
	BodyContainer,
	MarginLeft,
	BottomArea,
	BottomButtonArea,
	TitleComponent,
} from 'components/common/StyledComponent';
import Button from 'component/Button';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import ListTable from 'components/dataSet/dataSetList';
import { ROUTER_DATASET_UPLOAD, ROUTER_EXPERIMENT } from 'components/layout/MenuConst';
import DownloadDataErrorReport from 'component/dialog/DownloadDataErrorReport';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import DataMerge from 'component/dialog/DataMerge';

import { BACKGROUND_JOB_TYPE } from 'constants/common';

const SELECT_FILTER_LIST = [
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'dataset_type',
		label: 'Type',
	},
];

const MERGE_MAX = 3;

/*
다른 유저의 프로젝트를 로드할 경우 정책 설명
Data :
  - 하위 메뉴들 접근 불가,
  - More 팝업에서 Proprocess, Analyze 없어짐,
  - Remove, New dataset, Export to experiment 버튼 없어짐
 */

export const DataSetContext = createContext(null);
const DataComponent = () => {
	const history = useHistory();
	const { showAlert } = useAlertAction();
	const { loadProject, isMyProject, backgroundJobList } = useCommonState();
	const { onFetchListCB, onInitDataCB, exportDataCB, deleteDataCB, setMergeDataList } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type, replacedAnnotaionId, isDataMergeComplete } =
		useHandleState();

	const [tabType, setTabType] = useState('P'); //P: Private, S: Shared
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [checkItems, setCheckItems] = useState([]);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	const [start_index, setStartIndex] = useState(0);
	const [mergeItems, setMergeItems] = useState([]);
	const [guideTxt, setGuideTxt] = useState('');

	// 다른 유저의 프로젝트 혹은 “Completed”인 프로젝트를 로드했을 경우 - Data 화면
	// More버튼 - Details만 남음
	const [controlable, setControlable] = useState(false);

	const { isLoggedIn } = useAuthState();

	const { showDialog } = useDialogAction();

	useEffect(() => {
		if (loadProject) {
			if (isMyProject && loadProject.working_status_nm.toLowerCase() !== EXPERIMENT_STATUS.COMPLETED) {
				setControlable(true);
			} else {
				setControlable(false);
			}
		} else {
			setControlable(false);
		}
	}, [loadProject]);

	useEffect(() => {
		if (tabType === 'P') {
			setFilterType(SELECT_FILTER_LIST[0]);
		} else {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn]);

	useEffect(() => {
		setCheckItems([]);
	}, [start_index, tabType]);

	const fetchList = useCallback(() => {
		if (isLoggedIn) {
			let params = ListParamMaker.make({
				start_index,
				row_count,
				sorting,
				sorting_type,
				startDate,
				endDate,
				[filter_type.column]: filter_text,
				project_id: LocalStorageManager.getLoadedProjectId(),
				dataset_auth: tabType === 'P' ? 'Y' : 'N', // private:Y, shared:N
			});
			onFetchListCB(params);
			setCheckItems([]);
		}
	});

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type, tabType]);

	const changeTabType = (type) => {
		setFilterText('');
		if (type === 'P') {
			setFilterType(SELECT_FILTER_LIST[0]);
		} else {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
		setStartIndex(0);
		setTabType(type);
	};

	const newDatasetClicked = useCallback(() => {
		console.log('newDatasetClicked');
		history.push('/' + ROUTER_DATASET_UPLOAD);
	});

	const onClickDataMerge = useCallback(() => {
		if (
			backgroundJobList &&
			backgroundJobList.length > 0 &&
			backgroundJobList.includes(BACKGROUND_JOB_TYPE.DATA_MERGE)
		) {
			showAlert({
				message: '이미 데이터 병합 작업 진행중입니다.',
			});
			return;
		}
		const tabularData = mergeItems.filter((item) => item.dataset_type === 'tabular');
		if (tabularData.length > 0) {
			showAlert({
				message: '이미지 타입인 데이터만 병합할 수 있습니다.',
			});
			return;
		}

		if (!mergeItems || mergeItems.length <= 1) {
			showAlert({
				message: '병합할 데이터를 2개 이상 선택하세요.',
			});
			return;
		}
		if (mergeItems.length > MERGE_MAX) {
			showAlert({
				message: `병합 가능 최대 개수는 ${MERGE_MAX}개 입니다.`,
			});
			return;
		}
		setMergeDataList(mergeItems);
		showDialog(dialogList.DATA_MERGE);
	});

	const exportClicked = useCallback((type) => {
		let selected = checkItems[0];
		let params = {
			user_id: selected.user_id,
			project_id: LocalStorageManager.getLoadedProjectId(),
			dataset_id: selected.dataset_id,
		};

		exportDataCB(params)
			.then((response) => {
				console.log('then response = ', response);
				history.push('/' + ROUTER_EXPERIMENT);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const showToggleDelete = (v) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '선택한 DataSet을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	};

	const isExportToExperiment = (items) => {
		if (items.length !== 1) {
			return false;
		}
		let dataset = items[0];
		if (dataset.dataset_type === 'image') {
			if (dataset.label_status === 1) {
				return true;
			} else {
				return false;
			}
		} else {
			// tabular
			if (dataset.missing_value_status || dataset.type_nf_status) {
				return false;
			} else {
				return true;
			}
		}
	};

	const getGuideInfo = (items) => {
		if (!list || list.length <= 0) {
			return '';
		}

		if (items.length !== 1) {
			return '데이터셋 1개를 선택하세요.';
		}
		let dataset = items[0];
		if (dataset.dataset_type === 'image') {
			if (dataset.label_status === 1) {
				return '';
			} else {
				return '라벨링이 되어있지 않습니다.';
			}
		} else {
			// tabular
			if (dataset.missing_value_status || dataset.type_nf_status) {
				return '학습을 위해 결측치 제거 또는 \n유효하지 않은 Feature를 처리해 주세요.';
			} else {
				return '';
			}
		}
	};

	// const checkShowTooltip = () => {
	// 	if (checkItems.length !== 1) {
	// 		return false;
	// 	}
	// 	const dataset = checkItems[0];
	// 	if (dataset.dataset_type === 'tabular') {
	// 		if (dataset.missing_value_status || dataset.type_nf_status) {
	// 			return '학습을 위해 결측치 제거 또는 유효하지 않은 Feature를 처리해 주세요.';
	// 		}
	// 	}
	// 	return false;
	// };

	const deleteOkClick = useCallback(() => {
		let dataset_ids = [];
		for (let i = 0; i < checkItems.length; i++) {
			dataset_ids.push(checkItems[i].dataset_id);
		}
		let params = {
			dataset_id: dataset_ids,
		};
		deleteDataCB(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
		console.log('loadOkClick');
	});

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const refreshList = () => {
		if (start_index === 0) {
			fetchList();
		} else {
			setStartIndex(0);
		}
	};

	const onMergeData = () => {
		// setStartIndex(0);
		setMergeItems([]);
		setCheckItems([]);
		showAlert({
			message: '데이터 병합 작업이\n시작되었습니다.\n(작업이 완료되면 다시 알림 예정)',
		});
	};

	useEffect(() => {
		// 라벨 교체 작업이 사용자가 데이터 페이지에 머물러 있을 때 완료되면 리스트를 새로 불러온다.
		if (replacedAnnotaionId > 0) {
			refreshList();
		}
	}, [replacedAnnotaionId]);

	useEffect(() => {
		// 데이터 병합 작업이 사용자가 데이터 페이지에 머물러 있을 때 완료되면 리스트를 새로 불러온다.
		if (isDataMergeComplete) {
			refreshList();
		}
	}, [isDataMergeComplete]);

	const Store = useMemo(() => {
		return {
			controlable,
			fetchList,
		};
	}, [controlable]);

	const handleSetCheckItems = (items) => {
		setCheckItems(items);
		const otherPageMargeTarget = mergeItems.filter((item) => {
			let isOtherPageItem = true;
			list.forEach((listItem) => {
				if (item.dataset_id === listItem.dataset_id) {
					isOtherPageItem = false;
					return false;
				}
			});
			return isOtherPageItem;
		});
		setMergeItems([...otherPageMargeTarget, ...items]);
	};

	const handleOnClickClose = () => {
		setMergeItems([]);
		setCheckItems([]);
	};

	return (
		<DataSetContext.Provider value={Store}>
			<DownloadDataErrorReport />
			<PageWrapper>
				<TitleComponent text={'Data'} />
				<BodyContainer>
					<TabComponent>
						<TabItem active={tabType === 'P'} onClick={(e) => changeTabType('P')}>
							Private
						</TabItem>
						<TabItem active={tabType === 'S'} onClick={(e) => changeTabType('S')}>
							Shared
						</TabItem>
					</TabComponent>
					<WhiteBox>
						<FilterBox>
							<ContentWrapper>
								<TableSelectComponent
									disabled={tabType === 'P'}
									options={SELECT_FILTER_LIST}
									onChange={handleSelectChange}
									value={filter_type}
								/>
								<MarginLeft />
								<SearchInputComponent
									placeHolder={'검색어를 입력해주세요.'}
									doSearch={(e) => fetchList()}
									filter_text={filter_text}
									setFilterText={setFilterText}
									type={SEARCH_BAR_TYPE.DATASET}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								{controlable && tabType === 'P' && (
									<>
										<Button
											colorType={'gray'}
											size={'iconLarge'}
											disabled={checkItems.length < 1}
											onClick={showToggleDelete}
											iconSrc={IconDelete}
											tooltipText={'Delete Selected'}
										/>
									</>
								)}
								{controlable && (
									<Button
										iconSrc={PlusIconBlue}
										onClick={newDatasetClicked}
										colorType={'lightGray'}
										guideText={list && list.length > 0 ? '' : '새로운 데이터셋을 생성하세요.'}
									>
										New Dataset
									</Button>
								)}
							</ContentWrapper>
							<ContentWrapper>
								<DateSelectorWithTerm
									startDate={startDate}
									endDate={endDate}
									setStartDate={setStartDate}
									setEndDate={setEndDate}
								/>
							</ContentWrapper>
						</FilterBox>
						<TableArea>
							<ListTable
								list={list}
								checkItems={checkItems}
								setCheckItems={handleSetCheckItems}
								maxRowCnt={row_count}
								tabType={tabType}
								total_row_count={total_row_count}
								refresh={(e) => setStartIndex(0)}
							/>
						</TableArea>
					</WhiteBox>
					<BottomArea>
						<PaginationComponent
							totalCnt={total_row_count}
							startIndex={start_index + 1}
							setStartIndex={setStartIndex}
							maxRowCnt={row_count}
						/>
						{controlable && (
							<BottomButtonArea style={{ width: '392px' }}>
								{tabType === 'P' && (
									<Button
										iconSrc={MergeIcon}
										onClick={onClickDataMerge}
										size={'mediumLarge'}
										disabled={mergeItems.length <= 1 ? true : false}
										tooltipText={
											mergeItems.length <= 1 ? '데이터셋을 2~3개 선택 후 사용하세요.' : false
										}
										guideText={
											mergeItems.length > 1
												? mergeItems.reduce((accumulator, target) => {
														return `${accumulator}${accumulator === '' ? '' : '\n'}${
															target.dataset_nm
														}`;
												  }, '')
												: ''
										}
										handleOnClickClose={handleOnClickClose}
										isMustShowGuideTxt
									>
										Merge Data
									</Button>
								)}
								<Button
									size={'xlarge'}
									iconSrc={ExportIcon}
									disabled={!isExportToExperiment(checkItems)}
									onClick={exportClicked}
									guideText={getGuideInfo(checkItems)}
								>
									Export to Experiment
								</Button>
							</BottomButtonArea>
						)}
					</BottomArea>

					<DataMerge onMergeData={onMergeData} tabType={tabType} />
				</BodyContainer>
			</PageWrapper>
		</DataSetContext.Provider>
	);
};

export default DataComponent;

const TableArea = styled.div`
	width: 100%;
	height: 540px;
`;

const TabComponent = styled.div`
	height: 73px;
	display: flex;
	padding: 24px 0;
`;

const TabItem = styled.div`
	font-size: 16px;
	font-weight: 600;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	color: ${colors.gray_default};
	margin-right: 32px;
	cursor: pointer;
	${(props) =>
		props.active
			? `color: #004282;
    border-bottom: 2px solid #004282;`
			: ``}
`;

const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	height: 613px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
`;

const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 32px;
	justify-content: space-between;
`;

const ContentWrapper = styled.div`
	display: flex;
`;
