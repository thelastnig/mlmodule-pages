import React, { useEffect, useState } from 'react';

import CommonMoreButton from 'components/common/MoreButton';

/*
  Status가 ‘Working’ 또는 'Completed'인 경우
  - Details / Change Status 표시.
  Status가 그 이외인 경우
  - Details 만 표시됨
  */
const ENABLE_CHANGE_STATUS = ['working', 'completed', 'ready'];

export default function HomeDataMore(props) {
	const { onToggleDetailModal, handleToggleChangeModal, data } = props;

	const [menuList, setMenuList] = useState([]);
	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			item = {
				text: 'Details',
				onClick: () => {
					onToggleDetailModal(data);
				},
			};
			list.push(item);
			if (ENABLE_CHANGE_STATUS.includes(data.working_status_nm.toLowerCase())) {
				item = {
					text: 'Change Status',
					onClick: () => {
						handleToggleChangeModal(data);
					},
				};
				list.push(item);
			}
		}
		setMenuList(list);
	}, [data]);

	return <CommonMoreButton list={menuList} />;
}
