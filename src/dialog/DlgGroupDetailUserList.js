import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import * as colors from 'styles/colors';
import agent from 'lib/apis';
import ListParamMaker from 'utils/ListParamMaker';

import { SortIcon, StyledTable } from 'components/common/table/TableComponent';
import { StyledTableHeader } from 'components/dataSet/Detail/TabularSelectedFeature';
import EmptyTable from 'components/common/table/EmptyTable';

const GroupDetailUserList = (props) => {
	const { data } = props;

	const [total_row_count, set_total_row_count] = useState(0);
	const [list, setList] = useState([]);
	const [sorting, setSorting] = useState('level_nm');
	const [sorting_type, setSorting_type] = useState(false);

	const updateSortingCB = ({ sorting, sorting_type }) => {
		setSorting(sorting);
		setSorting_type(sorting_type);
	};

	useEffect(() => {
		fetchUserGroupList();
	}, [sorting, sorting_type]);

	const fetchUserGroupList = () => {
		let params = ListParamMaker.make({
			sorting,
			sorting_type,
			group_id: data.group_id,
		});
		agent
			.getUserGroupList({ params })
			.then((response) => {
				const { total_row_count, list } = response.data;
				set_total_row_count(total_row_count);
				setList(list);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	useEffect(() => {
		if (data) {
			fetchUserGroupList();
		}
	}, [data]);
	return (
		<TableArea>
			<StyledTable>
				<StyledTableHeader>
					<HistoryTD_1></HistoryTD_1>
					<HistoryTD_2>
						<SortIcon
							columName={'User ID'}
							sortColumn={'user_id'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</HistoryTD_2>
					<HistoryTD_3>
						<SortIcon
							columName={'LEVEL'}
							sortColumn={'level_nm'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</HistoryTD_3>
				</StyledTableHeader>
				<tbody>
					{total_row_count !== 0 ? (
						<>
							{list.map((data, index) => (
								<>
									<TableRow
										key={index}
										noClickable={true}
										// isChecked={checkItems.includes(data)}
										// onClick={e=>checkOnlyOneClickCB(data, checkItems, setCheckItems)}
									>
										{
											<>
												<HistoryTD_1>{index + 1}</HistoryTD_1>
												<HistoryTD_2>{data.user_id}</HistoryTD_2>
												<HistoryTD_3>{data.level_nm}</HistoryTD_3>
											</>
										}
									</TableRow>
								</>
							))}
						</>
					) : (
						<EmptyTable />
					)}
				</tbody>
			</StyledTable>
		</TableArea>
	);
};
export default GroupDetailUserList;

const TableRow = styled.tr`
	width: 100%;
	height: 35px;
	padding: 1px 0 0 0;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
`;

const TableArea = styled.div`
	height: 100%;
	width: 320px;
	margin-left: 10px;
	overflow-y: overlay;
`;

const HistoryTD_1 = styled.div`
	width: 66px;
	display: flex;
	align-items: center;
	padding: 0 10px;
`;

const HistoryTD_2 = styled.div`
	display: flex;
	width: 150px;
	padding: 0 10px;
`;

const HistoryTD_3 = styled.div`
	display: flex;
	width: 80px;
	padding: 0 10px;
`;
