import React, { useState, useEffect, useCallback, useRef } from 'react';
import styled from 'styled-components';

import ListParamMaker from 'utils/ListParamMaker';
import { SEARCH_BAR_TYPE } from 'constants/common';

import { useAuthState } from 'store/auth/hooks';
import { useHandleState, useStateActionHandler } from 'store/annotation/hooks';

import AnnotationTable from 'components/annotation/AnnotationTable';
import { PageWrapper, SubTitleBox, WhiteBox, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import PaginationComponent from 'components/common/PaginationComponent';
import MyList from 'components/common/MyList';

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
		column: 'type',
		label: 'Type',
	},
	{
		column: 'model',
		label: 'Model',
	},
	{
		column: 'annotator_id',
		label: 'Annotator',
	},
];

export default function Annotation() {
	const { onFetchListCB, onInitDataCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn, currentUser } = useAuthState();

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [checkItems, setCheckItems] = useState([]);
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	//나에게 할당된 일감 보기 체크 박스
	const [my_yn, setMy_yn] = useState(true);
	const ref = useRef(my_yn);

	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn]);
	const fetchList = useCallback(() => {
		if (isLoggedIn) {
			let annotator_id = '';
			if (my_yn) {
				annotator_id = currentUser.user_id;
			}
			let params = ListParamMaker.make({
				start_index,
				row_count,
				sorting,
				sorting_type,
				startDate,
				endDate,
				[filter_type.column]: filter_text,
				annotator_id,
			});
			// params.group_id = selectGroup.group_id
			// params.project_id = loadProject.project_id

			onFetchListCB(params);
			setCheckItems([]);
		}
	});

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);
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

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	}, []);

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Annotation'} />
				<SubTitleBox>Data</SubTitleBox>
				<WhiteBox style={{ height: '662px' }}>
					<FilterBox2>
						<ContentWrapper className={'ContentWrapper'}>
							<TableSelectComponent
								options={SELECT_FILTER_LIST}
								onChange={handleSelectChange}
								value={filter_type}
							/>
							<MarginLeft />
							<SearchInputComponent
								placeHolder={'검색어를 입력해주세요.'}
								doSearch={() => fetchList()}
								filter_text={filter_text}
								setFilterText={setFilterText}
								type={SEARCH_BAR_TYPE.ANNOTATION}
								start_index={start_index}
								setStartIndex={setStartIndex}
							/>
							<MarginLeft />
							<MyList title={'나에게 할당된 일감 보기'} my_yn={my_yn} setMy_yn={setMy_yn} />
						</ContentWrapper>
						<ContentWrapper>
							<DateSelectorWithTerm
								startDate={startDate}
								endDate={endDate}
								setStartDate={setStartDate}
								setEndDate={setEndDate}
							/>
						</ContentWrapper>
					</FilterBox2>
					<AnnotationTable
						list={list}
						checkItems={checkItems}
						setCheckItems={setCheckItems}
						maxRowCnt={row_count}
						total_row_count={total_row_count}
					/>
				</WhiteBox>
				<BottomArea>
					<PaginationComponent
						totalCnt={total_row_count}
						startIndex={start_index + 1}
						setStartIndex={setStartIndex}
						maxRowCnt={row_count}
					/>
				</BottomArea>
			</PageWrapper>
		</>
	);
}

const FilterBox2 = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 32px;
	justify-content: space-between;
`;

const ContentWrapper = styled.div`
	display: flex;
`;

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;
