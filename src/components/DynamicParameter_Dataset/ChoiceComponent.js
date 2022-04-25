import React, { memo, useEffect, useMemo, useState } from 'react';

import { parseTextListToLabelList } from 'dtos/Label'

import SelectCustom from 'components/common/SelectCustom';
import Tooltip from 'components/common/Tooltip';

const CSelect = memo((props) => {
	const { id, paramData, style, disabled, isOpen, value, setParamsValue } = props;
	const options = useMemo(() => parseTextListToLabelList(paramData.range), []);
	const [selectValue, setSelectValue] = useState({
		label: value,
		value: value,
	});

	useEffect(() => {
		if (value === selectValue.value) {
			return;
		}
		setParamsValue(id, selectValue.value);
	}, [selectValue]);

	const changeHandler = (e) => {
		setSelectValue(e);
	};

	return (
		<>
			<div data-tip data-for={id}>
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
					onChange={changeHandler}
					value={selectValue}
					isRemovePrefixCurrent={true}
				/>
			</div>
			<Tooltip id={id} text={paramData.description} />
		</>
	);
});
export default CSelect;
