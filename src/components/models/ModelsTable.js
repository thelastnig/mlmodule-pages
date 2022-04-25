import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useHandleState, useStateActionHandler } from 'store/models/hooks';

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
import { ROUTER_MODELS } from 'components/layout/MenuConst';
import NewBadge from 'component/NewBadge';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

export default function ModelsTable(props) {
	const { list, maxRowCnt, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	const history = useHistory();
	const onModelClicked = useCallback((data) => {
		let key = data.model_name;
		history.push('/' + ROUTER_MODELS + '/' + key);
	});

	return (
		<StyledTable>
			<TableHeaderComponent>
				<TH_COMMON style={Cell1}>
					<SortIcon
						columnName={'Model'}
						sortColumn={'model_name'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TH_COMMON>
				<TH_COMMON style={Cell2}>
					<SortIcon
						columnName={'Group'}
						sortColumn={'group_name'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TH_COMMON>
				<TH_COMMON style={Cell3}>
					<SortIcon
						columnName={'Version(total)'}
						sortColumn={'version_num'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TH_COMMON>
				<TH_COMMON style={Cell4}>
					<SortIcon
						columnName={'Version (max no.)'}
						sortColumn={'version_limit'}
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
						columnName={'Updated'}
						sortColumn={'update_date'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TH_COMMON>
			</TableHeaderComponent>
			<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
				{list.map((data, index) => {
					const tooltipId = uuid();

					return (
						<div data-tip data-for={tooltipId}>
							<TableRow key={index} onClick={(e) => onModelClicked(data)}>
								{
									<>
										<TD_COMMON style={Cell1}>
											<TD_TEXT>{data.model_name}</TD_TEXT>
											<NewBadge date={data.update_date} />
										</TD_COMMON>
										<TD_COMMON style={Cell2}>
											<TD_TEXT>{data.group_name}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell3}>
											<TD_TEXT>{data.version_num}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell4}>
											<TD_TEXT>{data.version_limit}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell5}>
											<TD_TEXT>{data.create_date}</TD_TEXT>
										</TD_COMMON>
										<TD_COMMON style={Cell6}>
											<TD_TEXT>{data.update_date}</TD_TEXT>
										</TD_COMMON>
									</>
								}
							</TableRow>
							<Tooltip id={tooltipId} text={'배포할 모델을 선택합니다.'}/>
						</div>
					);
				})}
			</TableBodyComponent>
		</StyledTable>
	);
}

const Cell1 = {
	width: '400px',
	paddingLeft: '40px',
};
const Cell2 = {
	width: '392px',
};
const Cell3 = {
	width: '150px',
};
const Cell4 = {
	width: '180px',
};
const Cell5 = {
	width: '200px',
};
const Cell6 = {
	width: '200px',
};
