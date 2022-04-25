import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import icon from 'assets/icon/icon-compare-n.png';
import ListParamMaker from 'utils/ListParamMaker';
import { SEARCH_BAR_TYPE } from 'constants/common';

import { useStateActionHandler, useHandleState } from 'store/experiments/hooks';
import { useCommonState } from 'store/common/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import ExperimentsTable from 'components/Experiment/ExperimentsTable';
import { WhiteBox, SubTitleBox, PageWrapper, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import CompareExperiment from 'component/dialog/CompareExperiment';
import TableSelectComponent from 'components/common/TableSelectComponent';
import ExpDeleteComponent from 'components/Experiment/ExpDeleteComponent';

// compare 가능
//   : succeeded / published / aborted
// compare 불가
//   : draft / peding / running / failed / created
let DisableCompareStatus = ['draft', 'pending', 'running', 'failed', 'created'];
let HpoDisableCompareStatus = ['draft', 'pending', 'running', 'failed', 'created', 'aborted'];

const SELECT_FILTER_LIST = [
	{
		column: 'model_nm',
		label: 'Model ',
	},
	{
		column: 'algorithm_nm',
		label: 'Algorithm',
	},
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
];
/*
다른 유저의 프로젝트 로드 - Experiment 화면
Experiments :
  - 리스트에서 More 버튼 없어짐,
  - Remove 버튼 없어짐
 */

export default function Exp() {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const { onFetchExperimentsListCallback, onInitDataCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { loadProject } = useCommonState();
	const [checkItems, setCheckItems] = useState([]);
	const [comparable, setComparable] = useState(false);
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	const { showDialog } = useDialogAction();

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});

	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);

	const compareClicked = useCallback(() => {
		console.log('compareClicked');
		if (checkItems.length < 1 || !comparable) {
			return;
		}
		showDialog(dialogList.EXPERIMENT_COMPARE);
	});

	useEffect(() => {
		let disableCompareItem = checkItems.filter((t) => {
			if (t.train_type === 'HPO') {
				return HpoDisableCompareStatus.includes(t.working_status_nm.toLowerCase());
			}
			return DisableCompareStatus.includes(t.working_status_nm.toLowerCase());
		});
		setComparable(checkItems.length > 1 && disableCompareItem.length < 1);
	}, [checkItems]);

	const fetchList = () => {
		setCheckItems([]);
		let params = ListParamMaker.make({
			start_index,
			row_count,
			sorting,
			sorting_type,
			startDate,
			endDate,
			[filter_type.column]: !filter_text ? undefined : filter_text,
			project_id: loadProject.project_id,
		});
		onFetchExperimentsListCallback(params);
	};
	useEffect(() => {
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
			onInitDataCB();
		};
	}, [loadProject]);
	useEffect(() => {
		if (loadProject) {
			fetchList();
		}
	}, [startDate, endDate, start_index, sorting, sorting_type]);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};
	return (
		<PageWrapper>
			<CompareExperiment checkItems={checkItems} />
			<TitleComponent text={'Experiment'} />
			<SubTitleBox />
			<WhiteBox style={{ overflowY: 'auto' }}>
				<FilterBox>
					<ContentWrapper>
						<TableSelectComponent options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
						<MarginLeft />
						<SearchInputComponent
							placeHolder={'검색어를 입력해주세요.'}
							doSearch={(e) => fetchList()}
							filter_text={filter_text}
							setFilterText={setFilterText}
							type={SEARCH_BAR_TYPE.EXPERIMENT}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
						<ExpDeleteComponent checkItems={checkItems} fetchList={fetchList} />
						<Button
							colorType={'gray'}
							size={'iconLarge'}
							disabled={!comparable}
							onClick={compareClicked}
							iconSrc={icon}
							tooltipText={'Compare'}
						/>

						<MarginLeft size={'112px'} />
					</ContentWrapper>
					<ContentWrapper>
						<DateSelectorWithTerm startDate={startDate} endDate={endDate} setStartDate={setStartDate} setEndDate={setEndDate} />
					</ContentWrapper>
				</FilterBox>
				<ExperimentsTable
					list={list}
					checkItems={checkItems}
					setCheckItems={setCheckItems}
					maxRowCnt={row_count}
					fetchList={fetchList}
					total_row_count={total_row_count}
					start_index={start_index}
				/>
			</WhiteBox>
			<BottomArea>
				<PaginationComponent totalCnt={total_row_count} startIndex={start_index + 1} setStartIndex={setStartIndex} maxRowCnt={row_count} />
			</BottomArea>
		</PageWrapper>
	);
}

const ContentWrapper = styled.div`
	display: flex;
`;
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
