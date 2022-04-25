import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useHandleState, useStateActionHandler } from 'store/resource/hooks';

import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import { SatusDot } from 'components/common/StyledComponent';
import { SortIcon, StyledTable, TableRow, TableHeaderComponent, TableBodyComponent } from 'components/common/table/TableComponent';
import NewBadge from 'component/NewBadge';
import Button from 'component/Button';

export default function ResourcesTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, onTerminateClicked, total_row_count } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;

	return (
		<>
			<StyledTable>
				<TableHeaderComponent>
					<th>
						<TD_1>
							<CheckBoxHeader checkItems={checkItems} list={list} setCheckItems={setCheckItems} />
						</TD_1>
					</th>
					<th>
						<TD_2>
							<SortIcon
								columnName={'Model'}
								sortColumn={'model_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_2>
					</th>
					<th>
						<TD_3>
							<SortIcon
								columnName={'User ID'}
								sortColumn={'create_user'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_3>
					</th>
					<th>
						<TD_4>
							<SortIcon
								columnName={'Project'}
								sortColumn={'project_nm'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_4>
					</th>
					<th>
						<TD_5>
							<SortIcon
								columnName={'Status'}
								sortColumn={'working_status'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_5>
					</th>
					<th>
						<TD_6>
							<SortIcon
								columnName={'Resources'}
								sortColumn={'gpu_size'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_6>
					</th>
					<th>
						<TD_7>
							<SortIcon
								columnName={'Created'}
								sortColumn={'create_date'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_7>
					</th>
					<th>
						<TD_8>
							<SortIcon
								columnName={'Runtime'}
								sortColumn={'run_time'}
								sorting={sorting}
								sorting_type={sorting_type}
								updateSortingCB={updateSortingCB}
							/>
						</TD_8>
					</th>
					<th>
						<TD_9></TD_9>
					</th>
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
									<td>
										<TD_1>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
											/>
										</TD_1>
									</td>
									<td>
										<TD_2>
											{data.model_nm}
											<NewBadge date={data.create_date} />
										</TD_2>
									</td>
									<td>
										<TD_3>{data.create_user}</TD_3>
									</td>
									<td>
										<TD_4>{data.project_nm}</TD_4>
									</td>
									<td>
										<TD_5>
											<SatusDot type={data.working_status_nm.toLowerCase()}></SatusDot>
											{data.working_status_nm}
										</TD_5>
									</td>
									<td>
										<TD_6>
											{data.gpu_size} MiB | {data.cpu_size} Cores | {data.memory_size} GB
										</TD_6>
									</td>
									<td>
										<TD_7 style={{ color: `${colors.light_blue}` }}>{DateUtil.parseDateToYYYYMMDD(data.create_date)}</TD_7>
									</td>
									<td>
										<TD_8>{DateUtil.parseTimeToDHM(data.run_time)}</TD_8>
									</td>
									<td>
										<TD_9>
											{(
												<Button
													style={{
														width: '80px',
														fontSize: '12px',
													}}
													size={'lowMedium'}
													colorType={'gray'}
													onClick={(e) => {
														onTerminateClicked(data, e);
													}}
												>
													Terminate
												</Button>
											)}
										</TD_9>
									</td>
								</>
							}
						</TableRow>
					))}
				</TableBodyComponent>
			</StyledTable>
		</>
	);
}
const TD_1 = styled.div`
	width: 63px;
	padding-left: 20px;
	padding-right: 24px;
	text-align: left;
`;
const TD_2 = styled.div`
	display: flex;
	width: 346px;
	padding-left: 20px;
	padding-right: 20px;
	word-break: break-all;
`;
const TD_3 = styled.div`
	display: flex;
	width: 136px;
	padding-right: 20px;
	word-break: break-all;
`;
const TD_4 = styled.div`
	display: flex;
	width: 320px;
	padding-right: 20px;
	word-break: break-all;
`;
const TD_5 = styled.div`
	display: flex;
	width: 121px;
	padding-right: 20px;
	word-break: break-all;
`;
const TD_6 = styled.div`
	display: flex;
	width: 207px;
	padding-right: 20px;
	word-break: break-all;
`;
const TD_7 = styled.div`
	display: flex;
	width: 106px;
	padding-right: 20px;
`;
const TD_8 = styled.div`
	display: flex;
	width: 105px;
	padding-right: 10px;
`;
const TD_9 = styled.div`
	display: flex;
	width: 101px;
	padding-right: 17px;
`;
