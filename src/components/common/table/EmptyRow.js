import React from 'react';

import { TableRow } from 'components/common/table/TableComponent';

const EmptyRow = (key) => {
	return (
		<TableRow key={key} NoClickable={true}>
			{<></>}
		</TableRow>
	);
};
export default EmptyRow;
