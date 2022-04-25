import React, { useEffect } from 'react';

import DateUtil from 'utils/DateUtil';
import { useHandleState, useStateActionHandler } from 'store/template/hooks';
import { useCommonState } from 'store/common/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import {
	LoadMark,
	SortIcon,
	StyledTable,
	TableBodyComponent,
	TableHeaderComponent,
	TableRow,
	TD_COMMON,
	TD_TEXT,
	TH_COMMON,
} from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';

export default function ListTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, setTemplate, total_row_count } = props;
	const { updateSortingCB, updateExperimentId } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();
	const { loadTemplate } = useCommonState();

	let emptyRowCnt = maxRowCnt - list.length;
	const updateExpermentId = (data) => {
		let { experiment_id } = data;
		updateExperimentId(experiment_id);
	};

	useEffect(() => {
		if (checkItems.length > 0) {
			let item = checkItems[checkItems.length - 1];
			updateExpermentId(item);
			setTemplate(item);
		} else {
			updateExpermentId('');
		}
	}, [checkItems]);

	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<TH_COMMON style={Cell1}>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_COMMON>
					<TH_COMMON style={Cell2}>
						<div></div>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Template'}
							sortColumn={'template_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'Group'}
							sortColumn={'group_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'Dataset'}
							sortColumn={'dataset_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell6}>
						<SortIcon
							columnName={'Created'}
							sortColumn={'create_date'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell7}>
						<SortIcon
							columnName={'User ID'}
							sortColumn={'create_user'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => {
						let isLoaded = loadTemplate && loadTemplate.template_id === data.template_id;
						return (
							<TableRow
								key={index}
								isChecked={checkItems.includes(data)}
								onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
							>
								{
									<>
										<TD_COMMON style={Cell1}>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
												// NoClickable={true}
											/>
										</TD_COMMON>
										<TD_COMMON style={Cell2}>{isLoaded ? <LoadMark>Loaded</LoadMark> : <div></div>}</TD_COMMON>
										<TD_COMMON style={Cell3}>
											<TD_TEXT isLoaded={isLoaded}>{data.template_nm}</TD_TEXT>
											<NewBadge date={data.create_date} />
										</TD_COMMON>
										<TD_COMMON style={Cell4}>
											<TD_TEXT isLoaded={isLoaded}>{data.group_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell5}>
											<TD_TEXT isLoaded={isLoaded}>{data.dataset_nm}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell6}>
											<TD_TEXT isLoaded={isLoaded} isBlue={true}>
												{DateUtil.parseDateToYYYYMMDD(data.create_date)}
											</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell7}>
											<TD_TEXT isLoaded={isLoaded}>{data.create_user}</TD_TEXT>
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

const Cell1 = {
	width: '55px',
	paddingLeft: '24px',
};
const Cell2 = {
	width: '60px',
};
const Cell3 = {
	width: '230px',
};
const Cell4 = {
	width: '300px',
};
const Cell5 = {
	width: '230px',
};
const Cell6 = {
	width: '105px',
};
const Cell7 = {
	width: '105px',
};
