import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';
import IconGroupChangeN from 'assets/icon/icon-groupchange-n.png';

import { useHandleState, useStateActionHandler } from 'store/usergroup/hooks';
import { useAuthState } from 'store/auth/hooks';

import TableSelectComponent from 'components/common/TableSelectComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import { BottomArea, MarginLeft } from 'components/common/StyledComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import PaginationComponent from 'components/common/PaginationComponent';
import { ContentWrapper, FilterBox, TableArea, WhiteBox } from 'views/userGroup';
import GroupChange from 'component/dialog/GroupChange';
import UserGroupTable from 'components/userGroup/UserGroupTable';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const SELECT_FILTER_LIST = [
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'user_nm',
		label: 'User Name',
	},
	{
		column: 'group_nm',
		label: 'Group',
	},
];

export default function UserGroupContentBody(props) {
	const { startDate, setStartDate, endDate, setEndDate, tabType } = props;
	const { onFetchListCB, onInitDataCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn } = useAuthState();

	const [checkItems, setCheckItems] = useState([]);
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const [showChangeGroup, setShowChangeGroup] = useState(false);
	const { showDialog } = useDialogAction();

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	}, []);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn]);
	const fetchList = useCallback(() => {
		if (isLoggedIn && tabType === 'UG') {
			let params = ListParamMaker.make({
				start_index,
				row_count,
				sorting,
				sorting_type,
				startDate,
				endDate,
				[filter_type.column]: filter_text,
			});

			onFetchListCB(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);
	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	const groupChangeClick = useCallback(() => {
		if (checkItems.length !== 1) {
			return;
		}
		showDialog(dialogList.GROUP_CHANGE);
	});

	return (
		<>
			<GroupChange data={checkItems[0]} fetchList={fetchList} />
			<WhiteBox style={{ overflow: 'unset' }}>
				<FilterBox>
					<ContentWrapper>
						<TableSelectComponent
							options={SELECT_FILTER_LIST}
							onChange={handleSelectChange}
							value={filter_type}
							// isRemovePrefixCurrent={true}
						/>
						<MarginLeft />
						<SearchInputComponent
							placeHolder={'검색어를 입력해주세요.'}
							doSearch={(e) => fetchList()}
							filter_text={filter_text}
							setFilterText={setFilterText}
							type={SEARCH_BAR_TYPE.USER_GROUP_CONTENT}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
						<MarginLeft />
						<GroupChangeButton disabled={checkItems.length !== 1} onClick={groupChangeClick}>
							<div style={{ width: '118px', height: '22px' }}>{'Change Group'}</div>
							<img src={IconGroupChangeN} style={{ width: '20px', height: '20px' }} alt="" />
						</GroupChangeButton>
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
					<UserGroupTable
						list={list}
						checkItems={checkItems}
						setCheckItems={setCheckItems}
						maxRowCnt={row_count}
						total_row_count={total_row_count}
					/>
				</TableArea>
			</WhiteBox>
			<BottomArea>
				<PaginationComponent totalCnt={total_row_count} startIndex={start_index + 1} setStartIndex={setStartIndex} maxRowCnt={row_count} />
			</BottomArea>
		</>
	);
}

const GroupChangeButton = styled.div`
	width: 168px;
	height: 40px;
	border-radius: 2px;
	padding: 9px 12px 9px 16px;
	background-color: ${colors.button_gray_bg};
	outline: none;
	border: none;
	font-family: NotoSans;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	font-size: 16px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
	cursor: pointer;
	&:hover:not([disabled]) {
		background: #b5bcc4;
	}
	:active:not([disabled]) {
		background: #e1e4e7;
	}
	${(props) =>
		props.disabled &&
		`
      cursor: not-allowed;
    `}
`;
