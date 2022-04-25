import React, { useCallback, useEffect, useState } from 'react';

import { useStateActionHandler } from 'store/experiments/hooks';
import { useAlertAction } from 'store/alert/hooks';
import IconDelete from 'assets/icon/icon-delete.png';

import Button from 'component/Button';

export default function ExpDeleteComponent(props) {
	const { checkItems, fetchList } = props;

	const { deleteExpCB } = useStateActionHandler();
	const { showAlert } = useAlertAction();

	const [deletable, setDeletable] = useState(false);

	useEffect(() => {
		let disableDeleteItem = checkItems.filter((t) => {
			return false;
		});
		setDeletable(checkItems.length > 0 && disableDeleteItem.length < 1);
	}, [checkItems]);

	const deleteClicked = useCallback((type) => {
		showAlert({
			message: '선택한 model을\n삭제하시겠습니까?',
			isConfirm: true,
			onOk: deleteOkClick,
		});
	});
	const deleteOkClick = useCallback(() => {
		let experiment_id = [];
		for (let i = 0; i < checkItems.length; i++) {
			experiment_id.push(checkItems[i].experiment_id);
		}
		let params = {
			experiment_id: experiment_id,
		};
		deleteExpCB(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});

	return <Button colorType={'gray'} size={'iconLarge'} iconSrc={IconDelete} disabled={!deletable} onClick={deleteClicked} tooltipText={'Select delete'}/>;
}
