import React, { useEffect, useMemo, useState } from 'react';

import { parseTextListToLabelList } from 'dtos/Label'

import SelectCustom from 'components/common/SelectCustom';
import Tooltip from 'components/common/Tooltip';

function parseValue(list) {
	let result = [];
	list.forEach((v) => {
		result.push(v.value);
	});
	return result;
}

export default function MultiChoiceComponent(props) {
	const { id, paramData, setParamsValue, style } = props;
	const options = useMemo(() => parseTextListToLabelList(paramData.range), []);
	const defaultValue = paramData.default;
	const [selectValue, setSelectValue] = useState(() => {
		const initialState = parseTextListToLabelList(defaultValue);
		return initialState;
	});

	useEffect(() => {
		setParamsValue((prev) => {
			let data = { ...prev };
			let value = parseValue(selectValue);
			data[id] = value;
			return data;
		});
	}, [selectValue]);

	const changeHandler = (e) => {
		let index = selectValue.findIndex((i) => i.value === e.value);

		if (index < 0) {
			let data = [...selectValue];
			data.push(e);
			setSelectValue(data);
		} else {
			if (selectValue.length < 2) {
				return;
			}
			let data = selectValue.filter((item) => item.value !== e.value);
			setSelectValue(data);
		}
	};
	return (
		<>
			<div data-tip data-for={id}>
				<SelectCustom
					styleOptions={{
						...style,
					}}
					id={id}
					isMulti
					isDisabled={false}
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
}
