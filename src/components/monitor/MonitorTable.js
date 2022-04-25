import React from 'react';

import DateUtil from 'utils/DateUtil';

import { useHandleState } from 'store/monitor/hooks';
import { useStateActionHandler } from 'store/monitor/hooks';

import {
	SortIcon,
	StyledTable,
	TableBodyComponent,
	TableHeaderComponent,
	TableRow,
	TD_COMMON,
	TD_TEXT,
	TH_COMMON,
} from 'components/common/table/TableComponent';
import { SatusDot } from 'components/common/StyledComponent';
import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import NewBadge from 'component/NewBadge';

export default function MonitorTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<TH_COMMON style={Cell1}>
						<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
					</TH_COMMON>
					<TH_COMMON style={Cell2}>
						<SortIcon
							columnName={'Model'}
							sortColumn={'model_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell3}>
						<SortIcon
							columnName={'Project'}
							sortColumn={'project_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell4}>
						<SortIcon
							columnName={'Status'}
							sortColumn={'working_status'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
					<TH_COMMON style={Cell5}>
						<SortIcon
							columnName={'Resources'}
							sortColumn={'gpu_size'}
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
							columnName={'Runtime'}
							sortColumn={'run_time'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</TH_COMMON>
				</TableHeaderComponent>
				<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
					{list.map((data, index) => (
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
									<TD_COMMON style={Cell2}>
										<TD_TEXT>{data.model_nm}</TD_TEXT>
										<NewBadge date={data.create_date} />
									</TD_COMMON>
									<TD_COMMON style={Cell3}>
										<TD_TEXT>{data.project_nm}</TD_TEXT>
									</TD_COMMON>
									<TD_COMMON style={Cell4}>
										<SatusDot type={data.working_status_nm.toLowerCase()}></SatusDot>
										<TD_TEXT>{data.working_status_nm}</TD_TEXT>
									</TD_COMMON>
									<TD_COMMON style={Cell5}>
										<TD_TEXT>
											{data.gpu_size} MiB | {data.cpu_size} Cores | {data.memory_size} GB
										</TD_TEXT>
									</TD_COMMON>
									<TD_COMMON style={Cell6}>
										<TD_TEXT isBlue={true}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_TEXT>
									</TD_COMMON>
									<TD_COMMON style={Cell7}>
										<TD_TEXT isGray={true}>{DateUtil.parseTimeToDHM(data.run_time)}</TD_TEXT>
									</TD_COMMON>
								</>
							}
						</TableRow>
					))}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}

const Cell1 = {
	width: '76px',
	paddingLeft: '26px',
	paddingRight: '36px',
};
const Cell2 = {
	width: '364px',
};
const Cell3 = {
	width: '364px',
};
const Cell4 = {
	width: '131px',
};
const Cell5 = {
	width: '316px',
};
const Cell6 = {
	width: '131px',
};
const Cell7 = {
	width: '141px',
};
