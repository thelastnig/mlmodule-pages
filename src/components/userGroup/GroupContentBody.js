import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';
import PlusIcon from 'assets/icon/icon-plus.png';
import IconDelete from 'assets/icon/icon-delete.png';

import { useAlertAction } from 'store/alert/hooks';
import { useHandleState, useStateActionHandler } from 'store/group/hooks';
import { useAuthState } from 'store/auth/hooks';

import TableSelectComponent from 'components/common/TableSelectComponent';
import { BottomArea, MarginLeft, BottomButtonArea } from 'components/common/StyledComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import PaginationComponent from 'components/common/PaginationComponent';
import { ContentWrapper, FilterBox, TableArea, WhiteBox } from 'views/userGroup';
import GroupTable from 'components/userGroup/GroupTable';
import Button from 'component/Button';
import { ROUTER_NEW_GROUPS } from 'components/layout/MenuConst';

const SELECT_FILTER_LIST = [
	{
		column: 'group_nm',
		label: 'Group',
	},
];

export default function GroupContentBody(props) {
	const { startDate, setStartDate, endDate, setEndDate } = props;

	const { showAlert } = useAlertAction();
	const { onFetchGroupListCB, onInitDataCB, deleteGroupList } = useStateActionHandler();
	const { group_list: list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn } = useAuthState();

	const [checkItems, setCheckItems] = useState([]);
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const history = useHistory();

	useEffect(() => {
		return () => {
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

			onFetchGroupListCB(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);

	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	}, []);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const showToggleDelete = (v) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '선택한 Group을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	};
	const deleteOkClick = useCallback(() => {
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
			.finally((v) => {});
	});
	useCallback((text) => {
		console.log('search Clicked text = ', text);
	});
	const newGroupClicked = useCallback(() => {
		history.push('/' + ROUTER_NEW_GROUPS);
	});

	return (
		<>
			<WhiteBox style={{ overflow: 'unset' }}>
				<FilterBox>
					<ContentWrapper>
						<TableSelectComponent
							disabled={true}
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
							type={SEARCH_BAR_TYPE.USER_GROUP}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
						<Button colorType={'gray'} size={'iconLarge'} disabled={checkItems.length < 1} onClick={showToggleDelete} iconSrc={IconDelete} tooltipText={'Delete Selected'}/>
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
					<GroupTable
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
				<PaginationComponent totalCnt={total_row_count} startIndex={start_index + 1} setStartIndex={setStartIndex} maxRowCnt={row_count} />
				<BottomButtonArea>
					<Button
						iconSrc={PlusIcon}
						onClick={newGroupClicked}
					>
						New Group
					</Button>
				</BottomButtonArea>
			</BottomArea>
		</>
	);
}
