import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useStateActionHandler, useHandleState } from 'store/models/hooks';
import { useAuthState } from 'store/auth/hooks';

import ModelsTable from 'components/models/ModelsTable';
import { PageWrapper, WhiteBox, SubTitleBox, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
const SELECT_FILTER_LIST = [
	{
		column: 'model_name',
		label: 'Model',
	},
	{
		column: 'group_name',
		label: 'Group',
	},
];

export default function Models() {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const { onFetchModelsListCallback, onInitDataCB } = useStateActionHandler();
	const { registered_model_list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const [checkItems, setCheckItems] = useState([]);
	const { isLoggedIn } = useAuthState();
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			onInitDataCB();
		};
	}, [isLoggedIn]);
	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});

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

			onFetchModelsListCallback(params);
		}
	});

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	return (
		<PageWrapper>
			<TitleComponent text={'Models'} />
			<SubTitleBox>Model Repository</SubTitleBox>
			<WhiteBox style={{ height: '661px' }}>
				<FilterBox>
					<ContentWrapper>
						<TableSelectComponent disabled={false} options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
						<MarginLeft />
						<SearchInputComponent
							placeHolder={'검색어를 입력해주세요.'}
							doSearch={(e) => fetchList()}
							filter_text={filter_text}
							setFilterText={setFilterText}
							type={SEARCH_BAR_TYPE.MODEL}
							disableHangul={true}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
					</ContentWrapper>
					<ContentWrapper>
						<DateSelectorWithTerm startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
					</ContentWrapper>
				</FilterBox>
				<ModelsTable
					list={registered_model_list}
					checkItems={checkItems}
					setCheckItems={setCheckItems}
					maxRowCnt={row_count}
					total_row_count={total_row_count}
				/>
			</WhiteBox>
			<BottomArea>
				<PaginationComponent totalCnt={total_row_count} startIndex={start_index + 1} setStartIndex={setStartIndex} maxRowCnt={row_count} />
			</BottomArea>
		</PageWrapper>
	);
}

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
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
