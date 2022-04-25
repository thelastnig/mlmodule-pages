import React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import MoreButton from 'components/dataSet/MoreButton';
import {
	SortIcon,
	StyledTable,
	TableBodyComponent,
	TableHeaderComponent,
	TableRow,
	TD_COMMON,
	TH_COMMON,
} from 'components/common/table/TableComponent';
import TooltipComponent from 'components/common/TooltipComponent';
import NewBadge from 'component/NewBadge';
import LinkUnderline from 'components/dataSet/LinkUnderline';
import LabelWithEditBtn from 'components/dataSet/LabelWithEditBtn';

export default function TablePrivate(props) {
	const {
		list,
		checkItems,
		setCheckItems,
		emptyRowCnt,
		sorting,
		sorting_type,
		updateSortingCB,
		total_row_count,
		onClickAddLabel,
		onClickLabelEditBtn,
	} = props;
	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<TH_1>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_1>
					<TH_COMMON style={Cell2}>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell8}>
						<SortIcon
							columnName={'Version'}
							sortColumn={'version'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Type'}
							sortColumn={'dataset_type'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'Size'}
							sortColumn={'dataset_size'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell6}>
						<SortIcon
							columnName={'Label'}
							sortColumn={'label_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell7}>
						<div></div>
					</TH_COMMON>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => {
						const isAnnotating = data.label_nm === 'Working on Annotation';
						const isNoLabel = data.label_status === 0 && data.label_nm !== 'Working on Annotation';

						return (
							<TableRow
								key={index}
								isChecked={checkItems.includes(data)}
								onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
							>
								{
									<>
										<TD_1>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
												// NoClickable={true}
											/>
										</TD_1>
										<TD_COMMON style={Cell2}>
											{data.dataset_nm}
											<NewBadge date={data.create_date} />
										</TD_COMMON>
										<TD_COMMON style={Cell8}>{data.version}</TD_COMMON>
										<TD_COMMON style={Cell3}>{data.dataset_type}</TD_COMMON>
										<TD_COMMON style={Cell4}>{data.dataset_size}</TD_COMMON>
										<TD_COMMON style={{ ...Cell5, color: colors.light_blue }}>
											{DateUtil.parseDateToYYYYMMDD(data.create_date)}
										</TD_COMMON>
										<td>
											<TooltipComponent tooltip_key={'label' + index} text={data.label_nm}>
												{data.dataset_type === 'image' ? (
													data.label_status === 1 ? (
														<TD_6>
															<LabelWithEditBtn
																txt={data.label_nm}
																onClickEditBtn={(e) => onClickLabelEditBtn(e, data)}
															/>
														</TD_6>
													) : (
														<TD_6 isAnnotating={isAnnotating} isNoLabel={isNoLabel}>
															{isNoLabel ? (
																<LinkUnderline
																	onClick={() => onClickAddLabel(data)}
																	txt={'Add Label'}
																/>
															) : (
																data.label_nm
															)}
														</TD_6>
													)
												) : (
													<TD_6></TD_6>
												)}
											</TooltipComponent>
										</td>
										<TD_COMMON style={Cell7}>
											<MoreButton onRegister={null} data={data} isPrivate={true} />
										</TD_COMMON>
									</>
								}
							</TableRow>
						);
					})}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const TH_1 = styled.th`
	width: 100px;
	padding-left: 24px;
`;
const TD_1 = styled.td`
	width: 100px;
	padding-left: 24px;
`;
const Cell2 = {
	width: '480px',
	paddingLeft: '10px',
	paddingRight: '60px',
};
const Cell3 = {
	width: '160px',
	paddingLeft: '40px',
	paddingRight: '20px',
};
const Cell4 = {
	width: '220px',
	paddingLeft: '40px',
	paddingRight: '60px',
};
const Cell5 = {
	width: '180px',
	paddingLeft: '20px',
	paddingRight: '60px',
};
const Cell6 = {
	width: '200px',
	paddingLeft: '20px',
	paddingRight: '20px',
};
const Cell7 = {
	width: '70px',
	paddingLeft: '20px',
	paddingRight: '30px',
};
const Cell8 = {
	width: '120px',
	paddingLeft: '20px',
	paddingRight: '30px',
};
const TD_6 = styled.div`
	display: flex;
	width: 200px;
	padding-left: 20px;
	padding-right: 20px;
	${({ isAnnotating, isNoLabel }) => css`
		${isAnnotating ? 'color: #b8babd;' : ''};
	`}
`;
