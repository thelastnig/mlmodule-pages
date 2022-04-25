import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors } from 'styles';
import { SEARCH_BAR_TYPE } from 'constants/common';
import ListParamMaker from 'utils/ListParamMaker';
import ImgLogo1 from 'assets/img/img-logo-1.png';
import ImgLogo2 from 'assets/img/img-logo-rancher.png';
import IconBtnSeeAll from 'assets/icon/btn-see-all-n.png';
import IconDelete from 'assets/icon/icon-delete.png';

import { useAuthState } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useHandleState, useStateActionHandler } from 'store/resource/hooks';

import { PageWrapper, BodyContainer, MarginLeft, BottomArea, TitleComponent } from 'components/common/StyledComponent';
import DateSelectorWithTerm from 'component/date/DateSelectorWithTerm';
import ResourcesTable from 'components/resources/resourcesTable';
import SearchInputComponent from 'components/common/SearchInputComponent';
import PaginationComponent from 'components/common/PaginationComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import Button from 'component/Button';

const SELECT_FILTER_LIST = [
	{
		column: 'model_nm',
		label: 'Model',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'project_nm',
		label: 'Project',
	},
];
const ResourcesComponent = () => {
	const { showAlert } = useAlertAction();
	const { isLoggedIn } = useAuthState();
	const { onGetList, deleteExpCB, terminateExpCB } = useStateActionHandler();
	const { list, row_count, total_row_count, sorting, sorting_type } = useHandleState();

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
			});

			onGetList(params);
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

	const onTerminateClicked = useCallback((data, e) => {
		e.preventDefault();
		e.stopPropagation();
		showAlert({
			message: '자원을 회수하시겠습니까?\n회수하실 경우,\n해당 Experiment는 강제 정지 됩니다.',
			isConfirm: true,
			onOk: (e) => terminateOkClick(data),
		});
	});
	const terminateOkClick = useCallback((data) => {
		console.log('dsdsds data = ', data);
		let params = {
			experiment_id: data.experiment_id,
		};
		terminateExpCB(params)
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

	const onDeleteClicked = useCallback((data, e) => {
		if (checkItems.length < 1) {
			return;
		}
		showAlert({
			message: '선택한 model을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: (e) => deleteOkClick(),
		});
	});
	const deleteOkClick = useCallback(() => {
		if (checkItems.length < 1) {
			return;
		}
		let experiment_id = [];
		for (let i = 0; i < checkItems.length; i++) {
			experiment_id.push(checkItems[i].experiment_id);
		}
		let params = {
			experiment_id: experiment_id,
		};
		deleteExpCB(params)
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

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Resources'} />
				<BodyContainer>
					<TopBox>
						<TopBoxTitle>Monitor</TopBoxTitle>
						<TopBoxInner>
							<Mask onClick={(e) => window.open(process.env.REACT_APP_GRAFANA_URL)}>
								<MaskImageTitle>
									<img src={ImgLogo1} width="52px" height="52px" alt="" />
									<MarginLeft size={'4px'} />
									<MaskText>Grafana</MaskText>
								</MaskImageTitle>
								<MaskButtonBox>
									<MaskButton>
										<div>바로가기</div>
										<img src={IconBtnSeeAll} width="20px" height="20px" alt="" />
									</MaskButton>
								</MaskButtonBox>
							</Mask>
							<MarginLeft size={'23px'} />
							<Mask onClick={(e) => window.open(process.env.REACT_APP_RANCHER_URL)}>
								<MaskImageTitle>
									<img src={ImgLogo2} width="52px" height="52px" alt="" />
									<MarginLeft size={'4px'} />
									<MaskText>RANCHER</MaskText>
								</MaskImageTitle>
								<MaskButtonBox>
									<MaskButton>
										<div>바로가기</div>
										<img src={IconBtnSeeAll} width="20px" height="20px" alt="" />
									</MaskButton>
								</MaskButtonBox>
							</Mask>
						</TopBoxInner>
						<TopBoxTitle style={{ marginTop: '32px', marginBottom: '16px' }}>Manage / Resources</TopBoxTitle>
					</TopBox>
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
									type={SEARCH_BAR_TYPE.RESOURCE}
									start_index={start_index}
									setStartIndex={setStartIndex}
								/>
								<Button colorType={'gray'} size={'iconLarge'} disabled={checkItems.length < 1} onClick={onDeleteClicked} iconSrc={IconDelete} tooltipText={'Delete Selected'}/>
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
							<ResourcesTable
								list={list}
								checkItems={checkItems}
								setCheckItems={setCheckItems}
								maxRowCnt={row_count}
								onDeleteClicked={onDeleteClicked}
								onTerminateClicked={onTerminateClicked}
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

export default ResourcesComponent;
const TableArea = styled.div`
	width: 100%;
`;
const TopBox = styled.div`
	width: 100%;
	height: 256px;
	padding-top: 12px;
	display: flex;
	flex-direction: column;
`;
const TopBoxTitle = styled.div`
	margin-bottom: 8px;
	font-family: NotoSans;
	font-size: 16px;
	letter-spacing: -0.4px;
	color: #1e1f22;
`;
const TopBoxInner = styled.div`
	width: 100%;
	height: 144px;
	display: flex;
	flex-direction: row;
`;
const Mask = styled.div`
	width: 363px;
	height: 144px;
	padding: 16px 16px 16px 14px;
	border-radius: 4px;
	cursor: pointer;
	background-color: ${colors.brand};
	:hover {
		background: ${colors.blue_hover};
	}
	:active {
		background: ${colors.light_blue_press};
	}
`;
const MaskImageTitle = styled.div`
	height: 52px;
	display: flex;
	flex-direction: row;
	align-items: center;
`;
const MaskText = styled.div`
	height: 42px;
	display: contents;
	font-family: NotoSans;
	font-size: 24px;
	font-weight: 500;
	letter-spacing: -0.6px;
	text-align: center;
	color: ${colors.text_white};
`;
const MaskButtonBox = styled.div`
	margin-top: 39px;
	display: flex;
	flex-direction: row-reverse;
`;
const MaskButton = styled.div`
	height: 20px;
	align-items: center;
	display: flex;
	font-family: AppleSDGothicNeo;
	font-size: 16px;
	font-weight: 500;
	letter-spacing: -0.4px;
	color: ${colors.text_white};
`;

const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	//height:626px;
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
