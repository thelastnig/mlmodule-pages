import React, { useCallback, useEffect, useState } from 'react';

import agent from 'lib/apis';
import ListParamMaker from 'utils/ListParamMaker';
import { SEARCH_BAR_TYPE } from 'constants/common';
import PlusIcon from 'assets/icon/icon-plus.png';
import IconDelete from 'assets/icon/icon-delete.png';

import { useAlertAction } from 'store/alert/hooks';
import { useStateActionHandler, useHandleState } from 'store/user/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useDialogAction } from 'store/dialog/hooks';

import TableSelectComponent from 'components/common/TableSelectComponent';
import { BottomArea, MarginLeft, BottomButtonArea } from 'components/common/StyledComponent';
import Button from 'component/Button';
import SearchInputComponent from 'components/common/SearchInputComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import UserTable from 'components/userGroup/UserTable';
import PaginationComponent from 'components/common/PaginationComponent';
import { ContentWrapper, FilterBox, TableArea, WhiteBox } from 'views/userGroup';
import UserCreate from 'component/dialog/UserCreate';
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
];

export default function UserContentBody(props) {
	const { startDate, setStartDate, endDate, setEndDate, tabType } = props;

	const { showAlert } = useAlertAction();
	const { onFetchListCB, onInitDataCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn } = useAuthState();

	const [checkItems, setCheckItems] = useState([]);
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const [showUserCreate, setShowUserCreate] = useState(false);
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
		if (isLoggedIn && tabType === 'U') {
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

	const showToggleDelete = (v) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '선택한 User를\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	};
	const deleteOkClick = useCallback(() => {
		if (checkItems.length < 1) {
			return;
		}
		let user_id = [];
		for (let i = 0; i < checkItems.length; i++) {
			user_id.push(checkItems[i].user_id);
		}
		let params = {
			user_id: user_id,
		};
		agent
			.deleteUserList(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	}, [checkItems]);

	return (
		<>
			<UserCreate fetchList={fetchList} />
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
							type={SEARCH_BAR_TYPE.USER}
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
					<UserTable
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
						onClick={(e) => showDialog(dialogList.USER_CREATE)}
					>
						New User
					</Button>
				</BottomButtonArea>
			</BottomArea>
		</>
	);
}
