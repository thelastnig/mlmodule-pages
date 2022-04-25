import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import IconDelete from 'assets/icon/icon-delete.png';

import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import agent from 'lib/apis';
import ListParamMaker from 'utils/ListParamMaker';

import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useHandleState, useStateActionHandler } from 'store/template/hooks';

import { BottomArea, PageWrapper, BodyContainer, MarginLeft, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import ListTable from 'components/workflowTemplate/ListTable';
import Detail from 'components/workflowTemplate/detailComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';

const SELECT_FILTER_LIST = [
	{
		column: 'template_nm',
		label: 'Template Name',
	},
	{
		column: 'group_nm',
		label: 'Group',
	},
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
	{
		column: 'create_user',
		label: 'Creator',
	},
];

const TemplateComponent = () => {
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [checkItems, setCheckItems] = useState([]);
	const { showAlert } = useAlertAction();
	const { onFetchTemplateListCB, onInitDataCB, onInitDetailCB } = useStateActionHandler();
	const { loadProject, isMyProject } = useCommonState();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { isLoggedIn } = useAuthState();
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const [template, setTemplate] = useState('');

	useEffect(() => {
		return () => {
			console.log('종료');
			onInitDataCB();
		};
	}, [isLoggedIn]);

	useEffect(() => {
		setCheckItems([]);
		onInitDetailCB();
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
				// group_id: loadProject.group_id,
				project_id: loadProject.project_id,
			});

			onFetchTemplateListCB(params);
		}
	});

	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type]);

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const showToggleDelete = (v) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '선택한 Template을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	};
	const deleteOkClick = useCallback(() => {
		console.log('loadOkClick');
		let template_ids = [];
		for (let i = 0; i < checkItems.length; i++) {
			template_ids.push(checkItems[i].template_id);
		}
		let params = {
			template_id: template_ids,
		};
		agent
			.deleteTemplateList(params)
			.then((response) => {
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	return (
		<>
			<PageWrapper>
				<TitleComponent text={'WorkFlow Template'} />
				<BodyContainer>
					<SubTitleBox></SubTitleBox>
					<BetweenContainer>
						<LeftArea>
							<WhiteBox style={{ height: '100%' }}>
								<FilterBox>
									<ContentWrapper style={{ width: '360px' }}>
										<TableSelectComponent options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
										<MarginLeft />
										<SearchInputComponent
											placeHolder={'검색어를 입력해주세요.'}
											doSearch={(e) => fetchList()}
											filter_text={filter_text}
											setFilterText={setFilterText}
											type={SEARCH_BAR_TYPE.TEMPLATE}
											start_index={start_index}
											setStartIndex={setStartIndex}
										/>
										{isMyProject && (
											<div>
												<Button colorType={'gray'} size={'iconLarge'} disabled={checkItems.length < 1} onClick={showToggleDelete} iconSrc={IconDelete} tooltipText={'Delete Selected'}/>
											</div>
										)}
									</ContentWrapper>
									<ContentWrapper>
										<DateSelectorWithTerm
											startDate={startDate}
											endDate={endDate}
											setStartDate={setStartDate}
											setEndDate={setEndDate}
											isShort={true}
										/>
									</ContentWrapper>
								</FilterBox>
								<TableArea>
									<ListTable
										list={list}
										checkItems={checkItems}
										setCheckItems={setCheckItems}
										maxRowCnt={row_count}
										setTemplate={setTemplate}
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
						</LeftArea>
						<RightArea>
							<Detail checkItems={checkItems} template={template} />
						</RightArea>
					</BetweenContainer>
				</BodyContainer>
			</PageWrapper>
		</>
	);
};

export default TemplateComponent;
const BetweenContainer = styled.div`
	display: flex;
	justify-content: space-between;
	height: 662px;
`;
const LeftArea = styled.div`
	// width: calc(100% - 440px - 15px);
	width: 1086px;
	height: 100%;
`;
const RightArea = styled.div`
	width: 426px;
	height: 100%;
`;
const TableArea = styled.div`
	width: 100%;
`;
const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	height: 626px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
`;

const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	// margin: 0px 27px 0px 32px;
	padding: 0 20px;
	justify-content: space-between;
`;
const ContentWrapper = styled.div`
	display: flex;
`;
