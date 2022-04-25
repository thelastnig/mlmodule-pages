import Select, { components } from 'react-select';
import React from 'react';

import * as colors from 'styles/colors';

export default function SelectCustom(props) {
	const {
		isDisabled,
		isLoading,
		isClearable,
		isRtl,
		isSearchable,
		options,
		getOptionLabel,
		getOptionValue,
		onChange,
		value,
		styleOptions,
		label_key,
		value_key,
		placeholder,
		isRemovePrefixCurrent,
		isOpen,
	} = props;
	const selectStyles = {
		singleValue: (styles, { isDisabled }) => {
			let color = '';
			if (styleOptions.color) {
				color = styleOptions.color;
			}
			return {
				...styles,
				// background: 'red',
				color: color ? color : isDisabled ? `#ffffff` : '',
				cursor: isDisabled ? 'not-allowed' : 'pointer',
			};
		},
		control: (styles, { isDisabled, menuIsOpen }) => {
			let activeBorder = `1px solid ${colors.gray_blue_gray}`;
			let defaultBorder = `1.2px solid #ced4da`;
			let backgroundColor = '';
			if (isDisabled) {
				backgroundColor = '#dcdee0';
			}
			if (styleOptions.backgroundColor) {
				backgroundColor = styleOptions.backgroundColor;
			}
			return {
				...styles,
				width: styleOptions.width || '356px',
				height: styleOptions.height || '38px',
				minHeight: styleOptions.height || '38px',
				border: menuIsOpen ? activeBorder : styleOptions.border || defaultBorder,
				borderRadius: '2px',
				boxShadow: 'none',
				// '&:active': {
				//   border: `1px solid ${colors.brand}`,
				// },
				'&:hover': {
					border: menuIsOpen ? activeBorder : styleOptions.border || defaultBorder,
				},
				cursor: isDisabled ? 'not-allowed' : 'pointer',
				background: backgroundColor,
			};
		},
		indicatorsContainer: (styles) => ({
			...styles,
			height: styleOptions.height || '38px',
		}),
		dropdownIndicator: (styles, { isDisabled }) => {
			return {
				...styles,
				color: isDisabled ? '#ffffff' : '',
			};
		},
		indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
		menu: (styles) => ({ ...styles, width: styleOptions.width || '100%' }),
		menuList: (styles) => ({
			...styles,
			width: styleOptions.width || '356px',
			maxHeight: styleOptions.maxHeight || '445px',
			boxShadow: '7px 8px 20px 0 rgba(0, 0, 0, 0.12)',
			border: '1px solid #d5d6d7',
			padding: 0,
			backgroundColor: '#ffffff',
			overflowX: 'hidden',
			overflowY: 'auto',
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			let isButton = data.isButton;
			return {
				...styles,
				height: styleOptions.height || '36px',
				backgroundColor: isSelected ? 'rgba(0, 66, 130, 0.1)' : '#ffffff',
				color: isButton ? '#005cb5' : '#1e1f22',
				letterSpacing: '-0.3px',
				fontSize: '14px',
				paddingTop: '0',
				lineHeight: styleOptions.height,
				':hover': {
					...styles[':hover'],
					backgroundColor: 'rgba(0, 66, 130, 0.1)',
					cursor: 'pointer',
				},
				cursor: isDisabled ? 'not-allowed' : 'default',
				...styleOptions,
			};
		},
	};

	return (
		<Select
			className="basic-single"
			classNamePrefix="select"
			isDisabled={isDisabled || false}
			isLoading={isLoading || false}
			isClearable={isClearable || false}
			isRtl={isRtl || false}
			isSearchable={isSearchable || false}
			options={options || []}
			styles={selectStyles}
			getOptionLabel={getOptionLabel || ((option) => option.label)}
			getOptionValue={getOptionValue || ((option) => option.value)}
			onChange={onChange || (() => '')}
			value={value || {}}
			menuPlacement={'auto'}
			placeholder={placeholder || {}}
			menuIsOpen={isOpen}
			formatOptionLabel={(option, { context, selectValue }) => {
				let label = option.label;
				if (label_key) {
					label = option[label_key];
				}
				if (context === 'value') {
					if (!label && placeholder) {
						label = placeholder;
					}
				}
				return label
			}}
			components={{
				SingleValue: ({ children, ...props }) => {
					let value = '';
					if (children) {
						value = children;
					}
					return <components.SingleValue {...props}>{value}</components.SingleValue>;
				},
			}}
		/>
	);
}
