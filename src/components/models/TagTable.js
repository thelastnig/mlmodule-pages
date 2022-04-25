import React from 'react';
import styled from 'styled-components';

import TagTableRow from 'components/models/TagTableRow';
import { TableHeader, StyledTable } from 'components/common/StyledComponent';

export default function TagTable({ data, setTagList, model_nm, version }) {
	return <TableMarkup data={data} setTagList={setTagList} model_nm={model_nm} version={version} />;
}

const TableMarkup = ({ data, setTagList, model_nm, version }) => {
	return (
		<StyledTable>
			<TableHeader>
				<TD_1>
					<div>KEY</div>
				</TD_1>
				<TD_2>
					<div>VALUE</div>
				</TD_2>
				<TD_3>
					<div>ACTION</div>
				</TD_3>
			</TableHeader>
			<div>
				{data &&
					data.map((data, index) => (
						<>
							<TagTableRow data={data} setTagList={setTagList} model_nm={model_nm} version={version} />
						</>
					))}
			</div>
		</StyledTable>
	);
};
export const TD_1 = styled.div`
	display: flex;
	width: 212px;
	padding-left: 32px;
	padding-right: 8px;
`;
export const TD_2 = styled.div`
	display: flex;
	width: 180px;
	padding-left: 8px;
	padding-right: 8px;
`;
export const TD_3 = styled.div`
	display: flex;
	width: 256px;
	padding-left: 8px;
	padding-right: 8px;
`;
