import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useHandleState, useStateActionHandler } from 'store/models/hooks';

import { SortIcon, StyledTable, TableBodyComponent, TableHeaderComponent, TableRow } from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';

export default function ModelsTable(props) {
	const { list, maxRowCnt, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;

	const history = useHistory();
	const onModelClicked = useCallback((data) => {
		let key = data.model_name;
		history.push('/modelRepository' + '/' + key);
	});

	return (
		<StyledTable>
			<TableHeaderComponent>
				<TD_1>
					<SortIcon
						columnName={'Model'}
						sortColumn={'model_name'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_1>
				<TD_2>
					<SortIcon
						columnName={'Group'}
						sortColumn={'group_name'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_2>
				<TD_3>
					<SortIcon
						columnName={'Version'}
						sortColumn={'version_num'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_3>
				<TD_4>
					<SortIcon
						columnName={'Version (max no.)'}
						sortColumn={'version_limit'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_4>
				<TD_5>
					<SortIcon
						columnName={'Created'}
						sortColumn={'create_date'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_5>
				<TD_6>
					<SortIcon
						columnName={'Updated'}
						sortColumn={'update_date'}
						sorting={sorting}
						sorting_type={sorting_type}
						updateSortingCB={updateSortingCB}
					/>
				</TD_6>
			</TableHeaderComponent>
			<TableBodyComponent total_row_count={total_row_count} emptyRowCnt={emptyRowCnt}>
				{list.map((data, index) => (
					<TableRow key={index} onClick={(e) => onModelClicked(data)}>
						{
							<>
								<TD_1>
									<div>{data.model_name}</div>
									<NewBadge date={data.create_date} />
								</TD_1>
								<TD_2>{data.group_name}</TD_2>
								<TD_3>{data.version_num}</TD_3>
								<TD_4>{data.version_limit}</TD_4>
								<TD_5>{data.create_date}</TD_5>
								<TD_6>{data.update_date}</TD_6>
							</>
						}
					</TableRow>
				))}
			</TableBodyComponent>
		</StyledTable>
	);
}

const TD_1 = styled.td`
	display: flex;
	width: 400px;
	padding-left: 40px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_2 = styled.td`
	display: flex;
	width: 392px;
	padding-left: 8px;
	padding-right: 8px;
	word-break: break-all;
`;
const TD_3 = styled.td`
	display: flex;
	width: 150px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_4 = styled.td`
	display: flex;
	width: 180px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_5 = styled.td`
	display: flex;
	width: 200px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_6 = styled.td`
	display: flex;
	width: 200px;
	padding-left: 8px;
	padding-right: 8px;
`;
