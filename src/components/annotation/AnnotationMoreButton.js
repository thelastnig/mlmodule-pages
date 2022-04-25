import $ from 'jquery';
import React, { useCallback, useEffect, useState } from 'react';

import { useAuthState } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';

import CommonMoreButton from 'components/common/MoreButton';
import { useCommonAction } from 'store/common/hooks';

import { goAnnotationPage } from 'utils/NavigateUtil';

export default function MoreButton({ data }) {
	const { currentUser, access_token, refresh_token } = useAuthState();

	const { showAlert } = useAlertAction();

	const [menuList, setMenuList] = useState([]);
	const { onHideSpinnerCB, onShowSpinnerCB } = useCommonAction();

	const showClicked = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			const token = {
				access_token_value: access_token,
				refresh_token_value: refresh_token,
				user_id: currentUser.user_id,
				role: currentUser.role,
			};
			goAnnotationPage(data.annotation_id, token);			
		},
		[access_token, refresh_token, currentUser.user_id, currentUser.role, data.annotation_id],
	);

	const downloadLabel = useCallback(
		(e) => {
			e.preventDefault();
			e.stopPropagation();
			const token = {
				access_token_value: access_token,
				refresh_token_value: refresh_token,
				user_id: currentUser.user_id,
				role: currentUser.role,
			};
			const base_url = `${process.env.REACT_APP_API_ENDPOINT}/${process.env.REACT_APP_API_PREFIX}`;
			const download_url = `${base_url}/annotation/downloadLabel?annotation_id=${data.annotation_id}&token=${JSON.stringify(token)}`;
			const link = document.createElement('a');

			$.ajax({
				method: 'GET',
				contentType: 'application/octet-stream',
				url: download_url,
				beforeSend: function () {
					onShowSpinnerCB();
					link.href = download_url;
					link.click();
					link.remove();
				},
				success: function() {
					onHideSpinnerCB();
				},
				fail: function(xhr, status, error) {
					showAlert({
						message: 'annotation 결과 파일이 존재하지 않습니다.',
					});
				},
				complete: function() {
					onHideSpinnerCB();
				}
			});
		},
		[access_token, refresh_token, currentUser.user_id, currentUser.role, data.annotation_id, showAlert],
	);

	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			item = {
				text: 'Show annotations',
				onClick: (e) => {
					showClicked(e);
				},
			};
			list.push(item);

			// item = {
			// 	text: 'Download label',
			// 	onClick: (e) => {
			// 		downloadLabel(e);
			// 	},
			// };
			// list.push(item);
		}
		setMenuList(list);
	}, [data, showClicked, downloadLabel]);

	return <CommonMoreButton list={menuList} />;
}
