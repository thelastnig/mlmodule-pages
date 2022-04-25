import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useStateActionHandler, useHandleState } from 'store/monitor/hooks';
import { useAuthState } from 'store/auth/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import MonitorTable from 'components/monitor/MonitorTable';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import RadioButton from 'component/RadioButton';
import ExpDeleteComponent from 'components/Experiment/ExpDeleteComponent';

const SELECT_FILTER_LIST = [
	{
		column: 'model_nm',
		label: 'Model',
	},
	{
		column: 'project_nm',
		label: 'Project',
	},
];

const STATUS_ALL = '';
const STATUS_HOLD = 'EX2';
const STATUS_RUNNING = 'EX3';

const MonitorComponent = () => {
	const { isLoggedIn } = useAuthState();
	const { onGetList } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();

	const [working_status, set_working_status] = useState(STATUS_ALL);

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
				working_status,
			});

			onGetList(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type, working_status]);
	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const handleRadioAll = (e) => {
		setStartIndex(0);
		set_working_status(STATUS_ALL);
	};
	const handleRadioRun = (e) => {
		setStartIndex(0);
		set_working_status(STATUS_RUNNING);
	};
	const handleRadioReady = (e) => {
		setStartIndex(0);
		set_working_status(STATUS_HOLD);
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Monitor'} />
				<BodyContainer>
					<RadioBox>
						<RadioButton
							selected={working_status === STATUS_ALL}
							onClick={handleRadioAll}>
							전체
						</RadioButton>
						<RadioButton
							selected={working_status === STATUS_RUNNING}
							onClick={handleRadioRun}>
							실행 중
						</RadioButton>
						<RadioButton
							selected={working_status === STATUS_HOLD}
							onClick={handleRadioReady}>
							대기 중
						</RadioButton>
					</RadioBox>
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
									type={SEARCH_BAR_TYPE.MONITOR}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								<ExpDeleteComponent checkItems={checkItems} fetchList={fetchList} />
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
							<MonitorTable
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

export default MonitorComponent;

const TableArea = styled.div`
	width: 100%;
`;
const RadioBox = styled.div`
	width: 230px;
	height: 60px;
	padding-top: 5px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;
const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	height: 612px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
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
