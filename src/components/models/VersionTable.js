import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { useHandleState, useStateActionHandler } from 'store/model_version_list/hooks';

import { makeEmptyRow, SortIcon, StyledTable, TableHeader, TableRow } from 'components/common/table/TableComponent';
import { ROUTER_MODELS } from 'components/layout/MenuConst';
import { SatusDot } from 'components/common/StyledComponent';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

export default function VersionTable(props) {
	const { list, model_nm, maxRowCnt } = props;

	const { updateSortingCB } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();

	let emptyRowCnt = maxRowCnt - list.length;
	const emptyRow = makeEmptyRow(emptyRowCnt);

	const history = useHistory();
	const onModelClicked = useCallback((data) => {
		let key = data.version;
		history.push('/' + ROUTER_MODELS + '/' + model_nm + '/' + key);
	});
	return (
		<>
			<StyledTable>
				<TableHeader>
					<tr>
						<th>
							<TD_1>
								<SortIcon
									columnName={'Version'}
									sortColumn={'version'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_1>
						</th>
						<th>
							<TD_2>
								<SortIcon
									columnName={'DEVELOPER'}
									sortColumn={'developer'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_2>
						</th>
						<th>
							<TD_3>
								<div>Status</div>
							</TD_3>
						</th>
						<th>
							<TD_4>
								<SortIcon
									columnName={'Created'}
									sortColumn={'create_date'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_4>
						</th>
						<th>
							<TD_5>
								<SortIcon
									columnName={'Updated'}
									sortColumn={'update_date'}
									sorting={sorting}
									sorting_type={sorting_type}
									updateSortingCB={updateSortingCB}
								/>
							</TD_5>
						</th>
					</tr>
				</TableHeader>
				<tbody>
					{list.map((data, index) => {
						const tooltipId = uuid();

						return (
							<div data-tip data-for={tooltipId}>
								<TableRow key={index} isChecked={false} onClick={(e) => onModelClicked(data, e)}>
									{
										<>
											<td>
												<TD_1>{data.version}</TD_1>
											</td>
											<td>
												<TD_2>{data.developer}</TD_2>
											</td>
											<td>
												<TD_3>
													<SatusDot type={data.status}></SatusDot>
													{data.status}
												</TD_3>
											</td>
											<td>
												<TD_4>{data.create_date}</TD_4>
											</td>
											<td>
												<TD_5>{data.update_date}</TD_5>
											</td>
										</>
									}
								</TableRow>
								<Tooltip id={tooltipId} text={'배포할 버전을 선택합니다.'}/>
							</div>
						);
					})}
					{emptyRow.map((data, index) => (
						<TableRow key={index}>
							{
								<>
									<td>
										<TD_1></TD_1>
									</td>
									<td>
										<TD_2></TD_2>
									</td>
									<td>
										<TD_3></TD_3>
									</td>
									<td>
										<TD_4></TD_4>
									</td>
									<td>
										<TD_5></TD_5>
									</td>
								</>
							}
						</TableRow>
					))}
				</tbody>
			</StyledTable>
		</>
	);
}

const TD_1 = styled.div`
	display: flex;
	width: 350px;
	padding-left: 32px;
	padding-right: 8px;
`;
const TD_2 = styled.div`
	display: flex;
	width: 320px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_3 = styled.div`
	display: flex;
	width: 240px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_4 = styled.div`
	display: flex;
	width: 240px;
	padding-left: 8px;
	padding-right: 8px;
`;
const TD_5 = styled.div`
	display: flex;
	width: 240px;
	padding-left: 8px;
	padding-right: 8px;
`;
