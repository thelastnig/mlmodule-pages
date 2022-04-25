import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import OpenedIcon from 'assets/icon/icon-dropdown-opened.png';
import ClosedIcon from 'assets/icon/icon-dropdown-closed.png';
import FormatUtil from 'utils/FormatUtil';

import { useInputWithFiler } from 'store/root/hooks';
import { useStateActionHandler } from 'store/models/hooks';

import { DropDownIcon, MoreTitle } from 'views/versionDetail';
import TagTable from 'components/models/TagTable';
import ValidationInput from 'components/common/ValidationInput';

export default function VersionDetailTag(props) {
	const { version_info, model_nm, version } = props;

	const { setVersionTag } = useStateActionHandler();
	const [tagOpen, setTagOpen] = useState(true);
	let [key, set_key] = useState('');
	let [value, change_value, set_value] = useInputWithFiler(false);
	const [tagList, setTagList] = useState([]);
	const [errorText, setErrorText] = useState('');

	useEffect(() => {
		setTagList(version_info.tag_list);
	}, [version_info]);

	const onChangeKey = useCallback((e) => {
		let value = FormatUtil.excludeSpecialChar(e.target.value);
		set_key(value);
		setErrorText('');
	});
	const checkValidation = useCallback(() => {
		let temp = tagList.filter((v) => {
			return v.key === key;
		});
		if (temp.length > 0) {
			let text = `Tag "${temp[0].key}" already exists.`;
			setErrorText(text);
			return false;
		}
		return true;
	});
	const onAddTagClicked = useCallback((data) => {
		if (!checkValidation()) {
			return;
		}
		let params = {
			name: model_nm,
			version: version,
			key: key,
			value: value,
		};
		setVersionTag(params)
			.then((response) => {
				setTagList((prev) => {
					return [...prev, params];
				});
				set_key('');
				set_value('');
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	return (
		<TagArea>
			<MoreTitle>
				{tagOpen ? (
					<DropDownIcon src={OpenedIcon} onClick={(e) => setTagOpen(!tagOpen)} />
				) : (
					<DropDownIcon src={ClosedIcon} onClick={(e) => setTagOpen(!tagOpen)} />
				)}
				<div>Tag</div>
			</MoreTitle>
			{tagOpen && (
				<TagBody>
					<TagTable data={tagList} setTagList={setTagList} model_nm={model_nm} version={version} />
					<TagAdd>
						<TagAddTitle style={{ marginTop: '10px' }}>Add Tag</TagAddTitle>
						<TagAddInput>
							<ValidationInput
								style={{ marginRight: '12px', width: '240px' }}
								errorText={errorText}
								value={key}
								onChangeValue={onChangeKey}
							/>
							<CustomInput
								style={{ marginRight: '12px', width: '240px' }}
								type="text"
								value={value}
								onChange={change_value}
								maxLength="40"
							/>
							<div className="button_area">
								<button className="button blue wd72 hi36 ml5" onClick={onAddTagClicked} disabled={!key}>
									OK
								</button>
							</div>
						</TagAddInput>
					</TagAdd>
				</TagBody>
			)}
		</TagArea>
	);
}

const TagArea = styled.div`
	padding: 10px 0;
	padding-bottom: 5px;
`;

const TagBody = styled.div`
	width: 636px;
`;

const TagAdd = styled.div``;

const TagAddTitle = styled.div`
	font-size: 16px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
	padding: 10px 0;
`;

const TagAddInput = styled.div`
	display: flex;
`;

const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
	${(props) =>
		props.hasError &&
		`
      border: solid 1.2px ${colors.fail};
    `}
`;
