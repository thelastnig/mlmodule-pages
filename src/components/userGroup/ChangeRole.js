import React, { useCallback, useEffect, useState } from 'react';

import { useAlertAction } from 'store/alert/hooks';
import { useStateActionHandler } from 'store/user/hooks';

import TableSelectComponent from 'components/common/TableSelectComponent';

const SELECT_ROLE_TYPES = [
	{ column: 'ROD', label: 'Developer' },
	{ column: 'RON', label: 'Annotator' },
	// {column: 'ROA', label: 'Admin'},
];
// * 사용자 권한
// 1) ROD : 개발자 화면 전 메뉴 활성화
// 2) RON : annotation 메뉴만 활성화, 나머지 메뉴는 비활성화
// 3) ROA : 관리자 화면 전 메뉴 활성화
export default function ChangeRole(props) {
	const { data } = props;

	const { showAlert } = useAlertAction();
	const { setUserRole } = useStateActionHandler();

	const [_role, set_role] = useState(); //현 컴포넌트에서 사용하는 롤
	const [dataRole, setDataRole] = useState(); // 데이터가 가지고 있는 롤을 현 컴포넌트에 맞게 변경한 롤

	useEffect(() => {
		if (data) {
			let role = SELECT_ROLE_TYPES.find((v) => {
				return v.column === data.role;
			});
			setDataRole(role);
			set_role(role);
		}
	}, [data]);

	const handleSelectChangeRole = (e) => {
		if (e.column === dataRole.column) {
			return;
		}
		set_role(e);
		showAlert({
			message: '해당 유저의 Role을 변경하시겠습니까?',
			isConfirm: true,
			onOk: () => changeOkClick(e),
			onCancel: changeCancelClick,
		});
	};
	const changeOkClick = (role) => {
		// POST http://{{HOST}}/api/common/setUserRole
		// {
		//   "user_id": "yrkim",
		//   "role":"ROD"
		// }
		let params = {
			user_id: data.user_id,
			role: role.column,
		};
		setUserRole(params)
			.then((response) => {
				setDataRole(role);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};
	const changeCancelClick = useCallback(() => {
		set_role(dataRole);
	});

	return (
		<>
			<TableSelectComponent
				options={SELECT_ROLE_TYPES}
				onChange={handleSelectChangeRole}
				value={_role}
				style={{ width: '160px', height: '32px' }}
				isRemovePrefixCurrent={true}
			/>
		</>
	);
}
