import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';

import IconDelete from 'assets/icon/icon-delete.png';

import { colors } from 'styles';
import agent from 'lib/apis';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';

import { useAuthState } from 'store/auth/hooks';
import { useHandleState, useStateActionHandler } from 'store/projectRepository/hooks';
import { useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import ProjectRepositoryTable from 'components/projectRepository/ProjectRepositoryTable';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import Checkbox from 'components/common/table/Checkbox';

const SELECT_FILTER_LIST = [
	{
		column: 'project_nm',
		label: 'Project',
	},
	{
		column: 'group_nm',
		label: 'Group',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'type_nm',
		label: 'Type',
	},
	{
		column: 'model_nm',
		label: 'Model',
	},
];

const ProjectRepository = () => {
	const [not_completed, set_not_completed] = useState(false);
	const { isLoggedIn } = useAuthState();
	const { onGetList } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();
	const { showAlert } = useAlertAction();

	const [checkItems, setCheckItems] = useState([]);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');
	const [start_index, setStartIndex] = useState(0);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	useEffect(() => {
		return () => {
			console.log('종료');
		};
	}, [isLoggedIn]);
	useEffect(() => {
		setCheckItems([]);
	}, [start_index]);
	const fetchList = useCallback(() => {
		if (isLoggedIn) {
			setCheckItems([]);
			let params = ListParamMaker.make({
				start_index,
				row_count,
				sorting,
				sorting_type,
				startDate,
				endDate,
				[filter_type.column]: filter_text,
				not_completed: 1,
			});

			onGetList(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [startDate, endDate, start_index, sorting, sorting_type, not_completed]);
	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const onChangeIncomplete = () => {
		set_not_completed(!not_completed);
	};

	const showToggleDelete = () => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '프로젝트를 삭제하시면 모든 data 전처리 history와 experiment 들이 삭제됩니다.\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteProject,
		});
	};

	const deleteProject = () => {
			if (checkItems.length < 1) {
				return;
			}
			let projectList = [];
			for (let i = 0; i < checkItems.length; i++) {
				projectList.push(checkItems[i].project_id);
			}
			const params = {
				project_id: projectList,
			};
			agent
				.delProjectList(params)
				.then((response) => {
					showAlert({
						message: '삭제 완료 되었습니다.',
						onOk: fetchList,
					});
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
	};

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Project Repository'} />
				<BodyContainer>
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
									type={SEARCH_BAR_TYPE.PROJECT_REPOSITORY}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								<Button colorType={'gray'} size={'iconLarge'} disabled={checkItems.length < 1} onClick={showToggleDelete} iconSrc={IconDelete} tooltipText={'Delete Selected'}/>
								<MarginLeft size={'19px'} />
								<FilterCheckBox>
									<CheckboxWrap>
										<Checkbox checked={not_completed} onChange={(e) => onChangeIncomplete()} />
									</CheckboxWrap>
									<MarginLeft size={'7px'} />
									<label>{'미완료 조회'}</label>
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
							<ProjectRepositoryTable
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
		</>
	);
};

export default ProjectRepository;

const FilterCheckBox = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	font-family: AppleSDGothicNeo;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
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
const CheckboxWrap = styled.div`
	margin-top: 5px;
`;
