import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import './group.scss';
import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useStateActionHandler } from 'store/group/hooks';
import { useHandleState } from 'store/group/hooks';
import { useAuthState } from 'store/auth/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import DataTable from 'components/group/DataTable';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import { ROUTER_NEW_GROUPS } from 'components/layout/MenuConst';


const SELECT_FILTER_LIST = [
	{
		column: 'group_nm',
		label: 'Group',
	},
];

const GroupComponent = () => {
	const history = useHistory();
	const { onFetchGroupListCB, onInitDataCB, deleteGroupList } = useStateActionHandler();
	const { group_list: list, row_count, total_row_count, sorting, sorting_type } = useHandleState();

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [checkItems, setCheckItems] = useState([]);
	const { isLoggedIn } = useAuthState();
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn]);
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
			// params.group_id = selectGroup.group_id
			// params.project_id = loadProject.project_id

			onFetchGroupListCB(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);
	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	useEffect(() => {}, [checkItems]);
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	useCallback(() => {
		history.push('/' + ROUTER_NEW_GROUPS);
	});
	useCallback(() => {
		let group_ids = [];
		for (let i = 0; i < checkItems.length; i++) {
			group_ids.push(checkItems[i].group_id);
		}
		let params = {
			group_id: group_ids,
		};
		deleteGroupList(params)
			.then((response) => {
				console.log('then response = ', response);
				setCheckItems([]);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally(() => {});
	});
	return (
		<PageWrapper>
			<TitleComponent text={'Group'} />
			<BodyContainer>
				<WhiteBox>
					<FilterBox>
						<ContentWrapper>
							<TableSelectComponent disabled={true} options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
							<MarginLeft />
							<SearchInputComponent
								placeHolder={'검색어를 입력해주세요.'}
								doSearch={(e) => fetchList()}
								filter_text={filter_text}
								setFilterText={setFilterText}
								type={SEARCH_BAR_TYPE.GROUP}
								start_index={start_index}
								setStartIndex={setStartIndex}
							/>
							<MarginLeft />
						</ContentWrapper>
						<ContentWrapper>
							<DateSelectorWithTerm startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
						</ContentWrapper>
					</FilterBox>
					<TableArea>
						<DataTable
							list={list}
							checkItems={checkItems}
							setCheckItems={setCheckItems}
							maxRowCnt={row_count}
							fetchList={fetchList}
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
	);
};

export default GroupComponent;

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
