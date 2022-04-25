import React, { useEffect, useState } from 'react';

import CommonMoreButton from 'components/common/MoreButton';

export default function DataMore(props) {
	const { data, showToggleChange, resetPWClicked, groupChangeClick } = props;

	const [menuList, setMenuList] = useState([]);
	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			item = {
				text: 'Rest PW',
				onClick: () => {
					resetPWClicked(data);
				},
			};
			list.push(item);

			item = {
				text: 'Change Status',
				onClick: () => {
					showToggleChange(data);
				},
			};
			list.push(item);

			item = {
				text: 'Change Group',
				onClick: () => {
					groupChangeClick(data);
				},
			};
			list.push(item);
		}
		setMenuList(list);
	}, [data]);

	return <CommonMoreButton list={menuList} />;
}
