import React, { memo, useEffect, useMemo, useState } from 'react';

import { parseTextListToLabelList } from 'dtos/Label'

import SelectCustom from 'components/common/SelectCustom';

const CSelect = memo((props) => {
	const { id, paramData, setParamsValue, style, disabled, isOpen, customValue } = props;
	const options = useMemo(() => parseTextListToLabelList(paramData.range), []);
	const defaultValue = customValue ? customValue : paramData.default;
	const [selectValue, setSelectValue] = useState({
		label: defaultValue,
		value: defaultValue,
	});

	useEffect(() => {
		setParamsValue((prev) => {
			if (prev[id] !== selectValue.value && prev[id] !== 'hpo_check_metric') {
				let data = { ...prev };
				data[id] = selectValue.value;
				return data;
			} else {
				return prev;
			}
		});
	}, [selectValue]);

	const changeHandler = (e) => {
		setSelectValue(e);
	};
	return (
		<SelectCustom
			styleOptions={{
				...style,
			}}
			id={id}
			isOpen={isOpen}
			isDisabled={disabled}
			isLoading={false}
			isClearable={false}
			isRtl={false}
			isSearchable={false}
			getOptionLabel={(option) => option.label}
			getOptionValue={(option) => option.value}
			options={options}
			onChange={(e) => changeHandler(e)}
			value={selectValue}
			isRemovePrefixCurrent={true}
		/>
	);
});
export default CSelect;
