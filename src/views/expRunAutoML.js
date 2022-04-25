import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import ListParamMaker from 'utils/ListParamMaker';
import agent from 'lib/apis';
import { SEARCH_BAR_TYPE } from 'constants/common';
import NextIcon from 'assets/icon/icon-arrow-next-middle.png';

import { useAuthState } from 'store/auth/hooks';
import { useHandleState, useStateActionHandler } from 'store/algorithm/hooks';

import { SubTitleBox } from 'components/common/StyledComponent';
import TableSelectComponent from 'components/common/TableSelectComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import Spacer from 'components/spacer';
import ListTable from 'components/Experiment/AutoMl/expRunAutoMLListTable';
import AutoMLConfiguration from 'component/dialog/AutoMLConfiguration';
import AutoMlDataInfoArea from 'components/Experiment/AutoMl/expRunAutoMlDataInfoArea';
import AutoMLAlgorithmInfo from 'components/Experiment/AutoMl/AutoMLAlgorithmInfo';

import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const SELECT_FILTER_LIST = [
	{
		column: 'algorithm_nm',
		label: 'Algorithm',
	},
];
export const AutoMlContext = createContext(null);
export default function ExprunAutoML(props) {
	const experiment_id = props.match.params.experiment_id;

	const { isLoggedIn } = useAuthState();
	const { onFetchAlgorithmListCB } = useStateActionHandler();

	const { list, sorting, sorting_type, dataset_info, total_row_count } = useHandleState();
	const [checkItems, setCheckItems] = useState([]);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');

	const [selectAlgorithm, setSelectAlgorithm] = useState('');
	// 모드 알고리즘 리스트의 파람값들 key: algorithm_id
	const [algorithmListObj, setAlgorithmListObj] = useState({});

	const [trainValue, setTrainValue] = useState(80);
	const [validationValue, setValidationValue] = useState(10);
	const [testValue, setTestValue] = useState(10);
	const [showConfiguration, setShowConfiguration] = React.useState(false);
	const { showDialog } = useDialogAction();

	useEffect(() => {
		list.forEach((v) => {
			let { algorithm_id: _id, parameter: p } = v;
			let value = {};
			p.forEach((t) => {
				value[t.name] = t.default;
			});
			updateAlgorithmList(_id, value);
		});
	}, [list]);

	const algorithmStore = useMemo(() => {
		return {
			trainValue,
			setTrainValue,
			validationValue,
			setValidationValue,
			testValue,
			setTestValue,
			algorithmListObj,
			setAlgorithmListObj,
			selectAlgorithm,
			setSelectAlgorithm,
		};
	}, [
		trainValue,
		setTrainValue,
		validationValue,
		setValidationValue,
		testValue,
		setTestValue,
		algorithmListObj,
		setAlgorithmListObj,
		selectAlgorithm,
	]);

	const fetchDetail = () => {
		let params = {
			experiment_id: experiment_id,
		};
		agent
			.getExperimentConfig(params)
			.then((response) => {
				console.log('then response = ', response);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	useEffect(() => {
		fetchDetail();
		return () => {
			// componentWillUnmount 역할
			console.log('종료');
		};
	}, [isLoggedIn]);
	const fetchList = useCallback(() => {
		if (isLoggedIn) {
			setCheckItems([]);
			setSelectAlgorithm('');
			setAlgorithmListObj({});
			let params = ListParamMaker.make({
				sorting,
				sorting_type,
				[filter_type.column]: filter_text,
				experiment_id: experiment_id,
			});

			onFetchAlgorithmListCB(params);
		}
	});
	useEffect(() => {
		fetchList();
	}, [sorting, sorting_type]);
	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});
	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	const updateAlgorithmList = (algorithm_id, value) => {
		setAlgorithmListObj((prev) => {
			let data = { ...prev };
			if (value) {
				data[algorithm_id] = value;
			} else {
				delete data[algorithm_id];
			}
			return data;
		});
	};

	return (
		<AutoMlContext.Provider value={algorithmStore}>
			<AutoMLConfiguration
				experiment_id={experiment_id}
				data={{ checkItems, algorithmListObj, dataset_info }}
			/>
			<div style={{ display: 'flex', flexDirection: 'column', width: '1652px' }}>
				<div style={{ height: '80px', backgroundColor: colors.brand, display: 'flex', alignItems: 'center' }}>
					<TitleBox>Run / AutoML</TitleBox>
				</div>
				<SubTitleBox>Algorithm List</SubTitleBox>
				<DashBoardContainer>
					<WhiteBox style={{ paddingBottom: '24px' }}>
						<ContentContainer>
							<SearchArea>
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
									type={SEARCH_BAR_TYPE.AUTOML}
								/>
							</SearchArea>
							<BodyArea>
								<BodyLeftArea>
									<TableArea>
										<ListTable
											list={list}
											checkItems={checkItems}
											setCheckItems={setCheckItems}
											maxRowCnt={''}
											total_row_count={total_row_count}
										></ListTable>
									</TableArea>
									<ButtonArea style={{ padding: '12px 0' }}>
										<ButtonBlue disabled={checkItems.length < 1} onClick={(e) => showDialog(dialogList.EXPERIMENT_AUTOML_CONFIGURATION)}>
											Start AutoML
										</ButtonBlue>
									</ButtonArea>
								</BodyLeftArea>
								<div style={{ width: '32px', height: '32px', margin: '0px 16px 0px 16px' }}>
									<img src={NextIcon} style={{ display: 'block', margin: 'auto' }} alt="" />
								</div>
								<BodyRightArea>
									<AutoMlDataInfoArea selectAlgorithm={selectAlgorithm} dataset_info={dataset_info} />
									<Spacer size={'lg'} />
									<AutoMLAlgorithmInfo selectAlgorithm={selectAlgorithm} updateAlgorithmList={updateAlgorithmList} />
								</BodyRightArea>
							</BodyArea>
						</ContentContainer>
					</WhiteBox>
				</DashBoardContainer>
			</div>
		</AutoMlContext.Provider>
	);
}

const WhiteBox = styled.div`
	width: 100%;
	height: 100%;
`;

const TitleBox = styled.div`
	margin-left: 64px;
	color: ${colors.text_white};
	font-size: 28px;
	font-weight: bold;
	letter-spacing: -0.7px;
`;

const DashBoardContainer = styled.div`
	width: 100%;
	height: 144px;
	padding: 0px 63px 0 64px;
`;

const ContentContainer = styled.div`
	width: 100%;
	height: 681px;
	align-items: center;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	background-color: ${colors.bg_white};
`;

const SearchArea = styled.div`
	width: 100%;
	height: 72px;
	display: flex;
	align-items: center;
	padding-left: 20px;
`;

const BodyArea = styled.div`
	width: 100%;
	height: 609px;
	display: flex;
	align-items: center;
`;

const BodyLeftArea = styled.div`
	width: 1025px;
	height: 100%;
	padding-left: 20px;
`;

export const InfoTitle = styled.div`
	width: 100%;
	height: 47px;
	display: flex;
	align-items: center;
	padding: 14px 0px 13px 19px;
	background: ${colors.list_header};
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

export const DataArea = styled.div`
	width: 100%;
	padding: 12px 19px;
`;

export const DataTitle = styled.div`
	width: 260px;
	height: 19px;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

export const DataName = styled.div`
	width: 354px;
	height: 38px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

export const DataSingleLine = styled.div`
	display: flex;
	height: 34px;
	align-items: center;
`;

export const DataInputBox = styled.div`
	width: 80px;
	height: 28px;
	display: flex;
	align-items: center;
	padding: 5px 6px 5px 7px;
	border-radius: 4px;
	border: solid 1px #004282;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 18px;
	letter-spacing: -0.35px;
	text-align: center;
	justify-content: center;
	color: ${colors.text_black};
	${(props) => (props.readOnly ? `border: solid 1px #004282;` : `border: solid 1px #ced4da;`)}
`;

export const StyledInput = styled.input`
	width: 20px;
	height: 18px;
	border: none;
	outline: none;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: 18px;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
`;

const BodyRightArea = styled.div`
	width: 394px;
	height: 609px;
`;

const TableArea = styled.div`
	width: 100%;
	height: 537px;
	border: solid 1px #eaebec;
	overflow: hidden;
`;

const ButtonArea = styled.div`
	width: 100%;
	height: 72px;
	position: relative;
	text-align: right;
	padding: 11px 478px;
`;

const ButtonBlue = styled.button`
	display: inline-block;
	width: 160px;
	height: 40px;
	padding: 9px 19px;
	border-radius: 2px;
	background-color: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	text-align: center;
	outline: none;
	border: none;
	color: ${colors.bg_white};
	cursor: pointer;
	:disabled {
		cursor: not-allowed;
		background: ${colors.gray_default};
	}
`;

const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;

export const SaveBtn = styled.div`
	width: 60px;
	height: 24px;
	padding: 2px 7px;
	border-radius: 2px;
	background-color: ${colors.point_blue};
	cursor: pointer;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	text-align: center;
	color: ${colors.bg_white};
`;

export const EditBtn = styled.div`
	width: 60px;
	height: 24px;
	padding: 2px 7px;
	border-radius: 2px;
	background-color: #e1e4e7;
	cursor: pointer;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	text-align: center;
	color: ${colors.text_black};
`;

export const Divider = styled.div`
	height: 1px;
	background-color: #d8d8d8;
`;
