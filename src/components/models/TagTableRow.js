import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import tagEditIcon from 'assets/icon/btn-addtag-n.png';
import tagDeleteIcon from 'assets/icon/btn-deletetag-n.png';

import { useInput } from 'store/root/hooks';
import { useStateActionHandler } from 'store/models/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { TableRow } from 'components/common/StyledComponent';
import { TD_1, TD_2, TD_3 } from 'components/models/TagTable';
import { CustomInput } from 'views/versionDetail';
import Button from 'component/Button';

export default function TagTableRow(props) {
	const { data, setTagList, model_nm, version } = props;

	const { changeVersionTag, deleteVersionTag } = useStateActionHandler();
	const { showAlert } = useAlertAction();

	const [editMode, setEditMode] = useState(false);
	let [value, change_value, set_value] = useInput('');

	useEffect(() => {
		set_value(data.value);
	}, [data]);

	const onEditClicked = useCallback((data) => {
		setEditMode(true);
	});
	const doDelete = useCallback(() => {
		let params = {
			name: model_nm,
			version: version,
			key: data.key,
			value: value,
		};
		deleteVersionTag(params)
			.then((response) => {
				setTagList((prev) => {
					let temp = prev.filter((v) => {
						return v.key !== data.key;
					});
					return temp;
				});
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const onDeleteClick = useCallback((data) => {
		showAlert({
			message: 'Tag를 삭제하시겠습니까?',
			isConfirm: true,
			onOk: doDelete,
		});
	});
	const onSave = useCallback(() => {
		let params = {
			name: model_nm,
			version: version,
			key: data.key,
			value: value,
		};
		changeVersionTag(params)
			.then((response) => {
				showAlert({
					message: '완료 되었습니다.',
				});
				setEditMode(false);
				setTagList((prev) => {
					let temp = prev.map((t) => {
						return t.key === data.key ? { ...t, value: value } : t;
					});
					return temp;
				});
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const onCancel = useCallback(() => {
		setEditMode(false);
		set_value(data.value);
	});

	return (
		<TableRow key={data.key}>
			{
				<>
					<td>
						<TD_1>{data.key}</TD_1>
					</td>
					<td>
						<TD_2>{editMode ? <CustomInput type="text" value={value} onChange={change_value} /> : data.value}</TD_2>
					</td>
					<td>
						<TD_3>
							{editMode ? (
								<>
									<Button size={'lowSmall'} onClick={onSave}>Save</Button>
									<Button size={'lowSmall'} colorType={'cancel'} onClick={onCancel}>Cancel</Button>
								</>
							) : (
								<>
									<IconWrapper src={tagEditIcon} onClick={(e) => onEditClicked(data, e)} />
									<IconWrapper src={tagDeleteIcon} onClick={(e) => onDeleteClick(data, e)} />
								</>
							)}
						</TD_3>
					</td>
				</>
			}
		</TableRow>
	);
}

const IconWrapper = styled.img`
	width: 20px;
	height: 20px;
	margin-right: 15px;
	cursor: pointer;
`;
