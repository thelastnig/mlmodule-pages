import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import Spacer from 'components/spacer';
import { DataArea, DataName, DataTitle, Divider, InfoTitle } from 'views/expRunAutoML';
import { AutoMlContext } from 'views/expRunAutoML';
import EditButton from 'components/Experiment/AutoMl/EditButton';
import AlgorithmDynamicParam from 'components/Experiment/AutoMl/AlgorithmDynamicParam';

import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

const getAlgorithmName = (data) => {
	let v = '-';
	if (data) {
		v = data.algorithm_nm;
	}
	return v;
};

const checkRange = (value, range) => {
	if (range) {
		let minValue = range[0];
		let maxValue = range[1];
		if (minValue !== '-Infinity') {
			if (value < minValue) {
				return false;
			}
		}
		if (maxValue !== 'Infinity') {
			if (value > maxValue) {
				return false;
			}
		}
	}
	return true;
};
export default function AutoMlAlgorithmInfo(props) {
	const { selectAlgorithm, updateAlgorithmList } = props;
	const [algorithmParam, setAlgorithmParam] = useState({});

	const [isEdit, setIsEdit] = useState(false);

	useEffect(() => {
		setAlgorithmParam({});
		setIsEdit(false);
	}, [selectAlgorithm]);

	// eslint-disable-next-line no-empty-pattern
	const {} = useContext(AutoMlContext);

	const onClickedEditBtn = () => {
		if (isEdit) {
			//save clicked
			updateAlgorithmList(selectAlgorithm.algorithm_id, algorithmParam);
		}
		setIsEdit(!isEdit);
	};

	const checkValidation = useCallback(() => {
		if (!isEdit) {
			return true;
		}
		if (!selectAlgorithm) {
			return true;
		}
		let { parameter } = selectAlgorithm;
		for (let i = 0; i < parameter.length; i++) {
			let item = parameter[i];
			let { name, type, range, widget } = item;
			let value = algorithmParam[name];
			if (widget === 'field') {
				if (type === 'int') {
					if (!value) {
						if (value === 0) {
							if (!checkRange(value, range)) {
								return false;
							}
						} else {
							return false;
						}
					} else {
						if (!checkRange(value, range)) {
							return false;
						}
					}
				}
			}
		}
		return true;
	}, [selectAlgorithm, algorithmParam]);

	return (
		<AlgorithmInfoArea>
			<InfoTitle>
				<div style={{ width: '154px', height: '20px', marginRight: '140px' }}>Algorithm</div>
				<EditButton isEdit={isEdit} editDisabled={!selectAlgorithm} onClickedEditBtn={onClickedEditBtn} saveDisabled={!checkValidation()} />
			</InfoTitle>
			<DataArea>
				<DataTitle>Name</DataTitle>
				<Spacer size={'sm'} />
				<DataName>{getAlgorithmName(selectAlgorithm)}</DataName>
				<Spacer size={'lg'} />
				<Divider />
				<Spacer size={'lg'} />
				<DataTitle>Parameters</DataTitle>
				<Spacer />
				<div style={{ width: '360px', height: '136px', overflowY: 'auto' }}>
					{selectAlgorithm &&
						selectAlgorithm.parameter.map((param, i) => {
							const tooltipId = uuid();
							// if (param.name != 'penalty') {   // test code
							//   return ''
							// }
							return (
								<span data-tip data-for={tooltipId}>
									<AlgorithmDynamicParam
										key={i}
										algorithm_id={selectAlgorithm.algorithm_id}
										id={param.name}
										paramData={param}
										setParamsValue={setAlgorithmParam}
										readOnly={!isEdit}
									/>
									{!isEdit && (
										<Tooltip id={tooltipId} text={'Edit을 눌러 변경 후, Save 버튼을 클릭하세요.'}/>
									)}
								</span>
							);
						})}
				</div>
			</DataArea>
		</AlgorithmInfoArea>
	);
}

const AlgorithmInfoArea = styled.div`
	width: 100%;
	height: 317px;
	padding: 0;
	border: solid 1px #eaebec;
`;
