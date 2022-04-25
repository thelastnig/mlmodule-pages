import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useCommonState } from 'store/common/hooks';
import { useHandleState, useStateActionHandler } from 'store/inference/hooks';
import { useAuthState } from 'store/auth/hooks';

import Spacer from 'components/spacer';
import TableSelectComponent from 'components/common/TableSelectComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import { BottomArea, MarginLeft } from 'components/common/StyledComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import DataSetTable from 'components/inference/DataSetTable';
import MiddleButtonsArea from 'components/inference/MiddleButtonsArea';

const SELECT_FILTER_LIST = [
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
];

export default function DataSetComponent(props) {
	const { checkItems, setCheckItems, tabType, startInferenceClicked, selectModel } = props;
	const { onFetchDataListCB, onInitDataCB } = useStateActionHandler();
	const { loadProject } = useCommonState();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();

	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	const { isLoggedIn } = useAuthState();

	useEffect(() => {
		if (tabType === 'P') {
			setFilterType(SELECT_FILTER_LIST[0]);
		} else {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
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
				[filter_type.column]: filter_text,
				project_id: loadProject.project_id,
				dataset_auth: tabType === 'P' ? 'Y' : 'N', // private:Y, shared:N
			});
			onFetchDataListCB(params);
		}
	});

	useEffect(() => {
		fetchList();
	}, [start_index, sorting, sorting_type, tabType]);

	useEffect(() => {
		setCheckItems([]);
	}, [start_index, tabType]);

	useEffect(() => {
		setFilterText('');
		setStartIndex(0);
		if (tabType === 'P') {
			setFilterType(SELECT_FILTER_LIST[0]);
		} else {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	}, [tabType]);

	useEffect(() => {}, [checkItems]);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	return (
		<>
			<WhiteBox>
				<FilterBox>
					<ContentWrapper>
						<TableSelectComponent
							disabled={tabType === 'P'}
							options={SELECT_FILTER_LIST}
							onChange={handleSelectChange}
							value={filter_type}
						/>
						<Spacer />
						<SearchInputComponent
							placeHolder={'검색어를 입력해주세요.'}
							doSearch={(e) => fetchList()}
							filter_text={filter_text}
							setFilterText={setFilterText}
							type={SEARCH_BAR_TYPE.INFERENCE}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
						<MarginLeft />
					</ContentWrapper>
				</FilterBox>
				<TableArea>
					<DataSetTable
						list={list}
						checkItems={checkItems}
						setCheckItems={setCheckItems}
						maxRowCnt={row_count}
						isPrivate={tabType === 'P'}
					/>
				</TableArea>
			</WhiteBox>
			<BottomArea
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'center',
					paddingTop: '16px',
				}}
			>
				<PaginationComponent totalCnt={total_row_count} startIndex={start_index + 1} setStartIndex={setStartIndex} maxRowCnt={row_count} />
				<BottomButtons>
					<MiddleButtonsArea startInferenceClicked={startInferenceClicked} startDisabled={checkItems.length !== 1 || !selectModel} />
				</BottomButtons>
			</BottomArea>
		</>
	);
}

const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 1524px;
	height: 319px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
`;

const TableArea = styled.div`
	width: 100%;
`;

const ContentWrapper = styled.div`
	display: flex;
`;

const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 32px;
	justify-content: space-between;
`;
const BottomButtons = styled.div`
	display: flex;
	justify-content: flex-end;
	position: absolute;
	right: 0;
`;
