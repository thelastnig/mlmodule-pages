import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import IconDelete from 'assets/icon/icon-delete.png';

import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useAuthState } from 'store/auth/hooks';
import { useHandleState, useStateActionHandler } from 'store/dataRepository/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import Button from 'component/Button';
import DataRepositoryTable from 'components/dataRepository/dataRepositoryTable';

const SELECT_FILTER_LIST = [
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
	{
		column: 'project_nm',
		label: 'Project',
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

const DataRepository = () => {
	useHistory();
	const { isLoggedIn } = useAuthState();
	const { showAlert } = useAlertAction();
	const { onGetList, deleteDataCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();

	const [checkItems, setCheckItems] = useState([]);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
		};
	}, [isLoggedIn]);
	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);
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
			});

			onGetList(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);
	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	useEffect(() => {
		console.log('dsds useEffect checkItems = ', checkItems);
	}, [checkItems]);

	const onDeleteClicked = useCallback((type) => {
		showAlert({
			message: '선택한 Dataset을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	});
	const deleteOkClick = useCallback(() => {
		let dataset_ids = [];
		for (let i = 0; i < checkItems.length; i++) {
			dataset_ids.push(checkItems[i].dataset_id);
		}
		let params = {
			// "project_id": [1,2,3,4,5,6]
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

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Data Repository'} />
				<BodyContainer>
					<WhiteBox>
						<FilterBox>
							<ContentWrapper>
								<TableSelectComponent options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
								<MarginLeft />
								<SearchInputComponent
									placeHolder={'검색어를 입력해주세요.'}
									doSearch={(e) => fetchList()}
									filter_text={filter_text}
									setFilterText={setFilterText}
									type={SEARCH_BAR_TYPE.DATA_REPOSITORY}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								<Button colorType={'gray'} size={'iconLarge'} disabled={checkItems.length < 1} onClick={onDeleteClicked} iconSrc={IconDelete} tooltipText={'Delete Selected'}/>
								<MarginLeft size={'19px'} />
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
							<DataRepositoryTable
								list={list}
								checkItems={checkItems}
								setCheckItems={setCheckItems}
								maxRowCnt={row_count}
								total_row_count={total_row_count}
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
					</BottomArea>
				</BodyContainer>
			</PageWrapper>
		</>
	);
};

export default DataRepository;

const TableArea = styled.div`
	width: 100%;
`;
const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	height: 662px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
	margin-top: 42px;
`;

const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 20px;
	justify-content: space-between;
`;
const ContentWrapper = styled.div`
	display: flex;
`;
