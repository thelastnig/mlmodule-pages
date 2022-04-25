import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import CheckBoxDefault from 'assets/icon/checkbox-default.png';
import CheckBoxDefault_white_head from 'assets/icon/checkbox-white-head.png';
import CheckBoxDefault_white from 'assets/icon/checkbox-white.png';
import CheckBoxSelect from 'assets/icon/checkbox-sel.png';
import CheckBoxDisabled from 'assets/icon/checkbox-disable.png';
import CheckBoxSelectDisabled from 'assets/icon/checkbox-sel-disable.png';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

const CheckboxContainer = styled.div`
	display: flex;
	vertical-align: middle;
	cursor: pointer;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
	border: 0;
	clip: rect(0 0 0 0);
	clip-path: inset(50%);
	height: 1px;
	margin: -1px;
	overflow: hidden;
	padding: 0;
	position: absolute;
	white-space: nowrap;
	width: 1px;
`;

const StyledCheckbox = styled.div`
	cursor: pointer;
	display: inline-block;
	width: 16px;
	height: 16px;
`;
export const checkClickCB = (data, checkItems, setCheckItems, rowClicked) => {
	if (rowClicked) {
		let checked = [];
		checked.push(data);
		setCheckItems(checked);
	} else {
		if (checkItems.includes(data)) {
			removeCheck(data, checkItems, setCheckItems);
		} else {
			addCheck(data, checkItems, setCheckItems);
		}
	}
};

export const checkOnlyOneClickCB = (data, checkItems, setCheckItems) => {
	if (checkItems.includes(data)) {
		removeCheck(data, checkItems, setCheckItems);
	} else {
		let checked = [];
		checked.push(data);
		setCheckItems(checked);
	}
};

export const addCheck = (data, checkItems, setCheckItems) => {
	let checked = [...checkItems];
	checked.push(data);
	setCheckItems(checked);
};
const removeCheck = (data, checkItems, setCheckItems) => {
	let checked = checkItems.filter((item) => item !== data);
	setCheckItems(checked);
};

const Checkbox = (props) => {
	const {
		title,
		data,
		className,
		checked,
		disabled,
		onChange,
		checkItems,
		setCheckItems,
		NoClickable,
		colorType,
		checkMaxCount,
		tooltipText,
	} = props;

	const tooltipId = uuid();

	const [checkBoxIcon, setCheckboxIcon] = useState(CheckBoxDefault);
	useEffect(() => {
		let icon = CheckBoxDefault;
		if (colorType === 'white_head') {
			icon = CheckBoxDefault_white_head;
		} else if (colorType === 'white') {
			icon = CheckBoxDefault_white;
		}
		if (checked) {
			if (disabled) {
				icon = CheckBoxSelectDisabled;
			} else {
				icon = CheckBoxSelect;
			}
		} else {
			if (disabled) {
				icon = CheckBoxDisabled;
			}
		}
		setCheckboxIcon(icon);
	}, [checked, disabled]);

	const handleChangeCheck = (e) => {
		e.preventDefault();
		e.stopPropagation();
		if (checkMaxCount && !checkMaxCount()) {
			return;
		}
		if (disabled) {
			return;
		}
		if (NoClickable) {
			return;
		} else if (onChange) {
			onChange();
		} else {
			if (checkItems.includes(data)) {
				removeCheck(data, checkItems, setCheckItems);
			} else {
				addCheck(data, checkItems, setCheckItems);
			}
		}
	};
	return (
		<CheckboxContainer className={className} onClick={(e) => handleChangeCheck(e)} >
			<HiddenCheckbox id={'common_checkbox'} checked={checked} {...props} readOnly={true} />
			<StyledCheckbox checked={checked} data-tip data-for={tooltipId}>
				<CheckIcon src={checkBoxIcon} disabled={disabled} colorType={colorType} />
				{tooltipText && (
					<Tooltip id={tooltipId} text={tooltipText}/>
				)}
			</StyledCheckbox>
			<label style={{ cursor: 'pointer' }} htmlFor="common_checkbox">
				{title}
			</label>			
		</CheckboxContainer>
	);
};

export default Checkbox;

export const CheckBoxHeader = (props) => {
	const { checkItems, list, setCheckItems, colorType, maxCount } = props;

	const onClickHeaderCheck = () => {
		if (checkItems.length === list.length || (maxCount && checkItems.length === maxCount)) {
			setCheckItems([]);
			return;
		}
		let checked = [...list];
		if (maxCount) {
			checked = checked.slice(0, maxCount);
		}
		setCheckItems(checked);
	};
	return (		
		<Checkbox
			checked={checkItems.length > 0 && checkItems.length === list.length}
			onChange={(e) => onClickHeaderCheck()}
			colorType={colorType}
		/>
	);
};

const CheckIcon = styled.img`
	width: 16px;
	height: 16px;
	cursor: pointer;
	${(props) =>
		props.disabled &&
		`
      cursor: not-allowed;
    `}
	${(props) =>
		props.colorType === 'white' &&
		`
    width: 24px;
    height: 24px;
    `}
`;
