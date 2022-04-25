import React from 'react';
import styled from 'styled-components';

import SelectCustom from 'components/common/SelectCustom';

export default function TableSelectComponent(props) {
	const { options, onChange, value, style, disabled, isRemovePrefixCurrent } = props;
	return (
		<SelectContainer className={'SelectContainer'} style={{ display: 'flex' }}>
			<SelectCustom
				styleOptions={{
					width: '220px',
					height: '40px',
					...style,
				}}
				isDisabled={disabled}
				isLoading={false}
				isClearable={false}
				isRtl={false}
				isSearchable={false}
				options={options}
				getOptionLabel={(option) => option.label}
				getOptionValue={(option) => option.column}
				onChange={onChange}
				value={value}
				isRemovePrefixCurrent={isRemovePrefixCurrent}
			/>
		</SelectContainer>
	);
}

const SelectContainer = styled.div``;
