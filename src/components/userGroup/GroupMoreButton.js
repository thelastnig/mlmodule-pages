import React, { useEffect, useState } from 'react';

import CommonMoreButton from 'components/common/MoreButton';

export default function DataMore(props) {
	const { data, showToggleDetail, showToggleChange } = props;

	const [menuList, setMenuList] = useState([]);
	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			item = {
				text: 'Detail',
				onClick: () => {
					showToggleDetail(data);
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
		}
		setMenuList(list);
	}, [data]);

	return <CommonMoreButton list={menuList} />;
}
