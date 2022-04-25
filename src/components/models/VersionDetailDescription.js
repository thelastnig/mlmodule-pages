import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import OpenedIcon from 'assets/icon/icon-dropdown-opened.png';
import ClosedIcon from 'assets/icon/icon-dropdown-closed.png';
import EditBtnIcon from 'assets/icon/btn-edit-p.png';

import { useInput } from 'store/root/hooks';
import { useStateActionHandler } from 'store/models/hooks';

import { DropDownIcon, FormatButtonArea, MoreTitle } from 'views/versionDetail';

export default function VersionDetailDescription(props) {
	const { version_info, model_nm, version } = props;

	const { setDescription } = useStateActionHandler();
	const [descriptionOpen, setDescriptionOpen] = useState(false);
	const [descriptionEditMode, setDescriptionEditMode] = useState(false);
	const [description, set_description] = useState('');
	const [descriptionEdit, change_descriptionEdit, set_descriptionEdit] = useInput('');

	useEffect(() => {
		set_description(version_info.description);
		set_descriptionEdit(version_info.description);
	}, [version_info]);
	const descriptionBtnClicked = useCallback((v) => {
		if (v) {
			let params = {
				name: model_nm,
				version: version,
				description: descriptionEdit,
			};
			setDescription(params)
				.then((response) => {
					set_description(descriptionEdit);
					set_descriptionEdit(descriptionEdit);
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		} else {
			set_descriptionEdit(description);
		}
		setDescriptionEditMode(false);
	});
	const onDescriptionEditMode = useCallback(() => {
		let v = !descriptionEditMode;
		setDescriptionEditMode(v);
		if (v) {
			setDescriptionOpen(true);
		}
	});
	return (
		<DescriptionArea>
			<MoreTitle>
				{descriptionOpen ? (
					<DropDownIcon src={OpenedIcon} onClick={(e) => setDescriptionOpen(!descriptionOpen)} />
				) : (
					<DropDownIcon src={ClosedIcon} onClick={(e) => setDescriptionOpen(!descriptionOpen)} />
				)}
				<div>Description</div>
				<EditBtn src={EditBtnIcon} onClick={(e) => onDescriptionEditMode()} />
			</MoreTitle>
			{descriptionOpen && (
				<Description>
					{descriptionEditMode ? (
						<>
							<CustomDescription value={descriptionEdit} onChange={change_descriptionEdit} maxLength="5000" />
							<FormatButtonArea>
								<div className={'button_area'}>
									<span
										style={{ lineHeight: '36px' }}
										className="button gray wd72 hi36"
										onClick={(e) => descriptionBtnClicked(false)}
									>
										Cancel
									</span>
									<span
										style={{ lineHeight: '36px' }}
										className="button blue wd72 hi36 ml5"
										onClick={(e) => descriptionBtnClicked(true)}
									>
										OK
									</span>
								</div>
							</FormatButtonArea>
						</>
					) : description ? (
						<CustomDescription value={description} disabled />
					) : (
						<div>None</div>
					)}
				</Description>
			)}
		</DescriptionArea>
	);
}

const DescriptionArea = styled.div`
	padding: 10px 0;
	padding-bottom: 5px;
`;

const Description = styled.div`
	width: 636px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const EditBtn = styled.img`
	width: 20px;
	height: 20px;
	cursor: pointer;
`;

const CustomDescription = styled.textarea`
	width: 100%;
	height: 180px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_default};
	resize: none;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
`;
