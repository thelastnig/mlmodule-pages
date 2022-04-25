import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

import IconMailReadDisable from 'assets/icon/btn-mail-read-disable.png';
import IconMailReadNormal from 'assets/icon/btn-mail-read-n.png';
import IconMailUnreadNormal from 'assets/icon/btn-mail-unread-small-n.png';

import { colors } from 'styles';
import ListParamMaker from 'utils/ListParamMaker';

import { useHandleState, useStateActionHandler } from 'store/alarm/hooks';
import { useAuthState } from 'store/auth/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import AlarmTable from 'components/alarm/AlarmTable';
import Checkbox from 'components/common/table/Checkbox';

const SELECT_FILTER_LIST = [
	{
		column: 'group_nm',
		label: 'Group',
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
		column: 'part_nm',
		label: 'Stage',
	},
	{
		column: 'alarm_id',
		label: 'Alarm ID',
	},
	{
		column: 'message',
		label: 'Message',
	},
];

const Alarm = (props) => {
	const { searchType } = props;

	const { onFetchListCB, setAlarmCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn } = useAuthState();

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const [checkItems, setCheckItems] = useState([]);
	const [read_yn, set_read_yn] = useState(true);
	const refRead = useRef(read_yn);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};
	const onChangeReadSet = (e) => {
		set_read_yn(!read_yn);
	};

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[5]);
		}
	}, []);

	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);
	useEffect(() => {
		if (start_index > 0) {
			setStartIndex(0);
		} else {
			if (refRead.current !== read_yn) {
				fetchList();
				refRead.current = read_yn;
			}
		}
	}, [read_yn]);

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
				read_yn: '0',
			});

			// GET http://175.197.4.214:8005/api/common/getAlarmList?start_index=0&row_count=100&sorting=create_date&sorting_type=asc&filters={"read_yn":1, "all":"password"}
			onFetchListCB(params);
		}
	});

	/*
  # CONCEPT
  알람을 읽음/읽지않음 상태로 변경
  읽은 알람 체크 후 버튼 클릭시 읽지않음으로 변경
  읽지 않은 알람 체크 후 버튼 클릭시 읽은 알람으로 변경
  읽지않은 알람, 읽은 알람 동시에 체크 후 클릭시 읽음으로 변경
   */

	const toggleAlarm = () => {
		if (checkItems.length < 1) {
			return;
		}
		let readAlarms = checkItems.filter((v) => {
			return v.read_yn === 1;
		});
		let read_yn = 1;
		if (checkItems.length === readAlarms.length) {
			// 읽지 않음으로 변경
			read_yn = 0;
		} else {
			// 읽음으로 변경
		}
		// POST http://175.197.4.214:8005/api/common/setAlarml

		let error_no = [];
		checkItems.forEach((item) => {
			error_no.push(item.error_no);
		});
		let params = {
			error_no: error_no,
			read_yn: read_yn,
		};
		setAlarmCB(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
				setCheckItems([]);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const readAlarm = (errorNo) => {
		let error_no = [];
		error_no.push(errorNo);
		let params = {
			error_no: error_no,
			read_yn: 1,
		};
		setAlarmCB(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
				setCheckItems([]);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	const checkHaveUnreadAlarms = () => {
		if (checkItems.length < 1) {
			return false;
		}
		let readAlarms = checkItems.filter((v) => {
			return v.read_yn === 0;
		});

		if (readAlarms.length > 0) {
			return false;
		} else {
			return true;
		}
	};

	const disabled = checkItems.length < 1;
	const hasUnreadAlarm = checkHaveUnreadAlarms();

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Alarm'} />
				<BodyContainer>
					<WhiteBox>
						<FilterBox>
							<ContentWrapper>
								<TableSelectComponent
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
									type={searchType}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								<div>
									<Button
										colorType={'gray'}
										size={'iconLarge'}
										disabled={disabled}
										onClick={toggleAlarm}
										iconSrc={disabled ? IconMailReadDisable : hasUnreadAlarm ? IconMailUnreadNormal : IconMailReadNormal}
										tooltipText={disabled ? 'Set Read / Set Unread' : hasUnreadAlarm ? 'Set Unread' : 'Set Read'}/>
								</div>
								<MarginLeft size={'19px'} />
								<FilterCheckBox>
									<CheckboxWrap>
										<Checkbox
											checked={read_yn}
											onChange={(e) => onChangeReadSet()}
											title={'읽지 않은 Alarm만 표시'}
										/>
										<MarginLeft size={'7px'} />
									</CheckboxWrap>
								</FilterCheckBox>
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
							<AlarmTable
								list={list}
								checkItems={checkItems}
								setCheckItems={setCheckItems}
								maxRowCnt={row_count}
								total_row_count={total_row_count}
								readAlarm={readAlarm}
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

export default Alarm;

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

const FilterCheckBox = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const CheckboxWrap = styled.div`
	display: flex;
	margin-top: 5px;
`;
