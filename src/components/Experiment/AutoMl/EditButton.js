import React from 'react';
import styled from 'styled-components';

import { text_black } from 'styles/colors';

import { EditBtn, SaveBtn } from 'views/expRunAutoML';

export default function EditButton(props) {
	const { isEdit, onClickedEditBtn, saveDisabled, editDisabled } = props;

	return (
		<>
			{isEdit ? (
				saveDisabled ? (
					<SaveDisabledBtn>Save</SaveDisabledBtn>
				) : (
					<SaveBtn onClick={onClickedEditBtn}>Save</SaveBtn>
				)
			) : editDisabled ? (
				<EditBtn>Edit</EditBtn>
			) : (
				<EditBtn onClick={onClickedEditBtn}>Edit</EditBtn>
			)}
		</>
	);
}

const SaveDisabledBtn = styled.div`
	width: 60px;
	height: 24px;
	padding: 2px 7px;
	border-radius: 2px;
	background-color: #e1e4e7;
	cursor: not-allowed;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	text-align: center;
	color: ${text_black};
`;
