import React, { useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { useAuthState } from 'store/auth/hooks';

import { SubTitleBox2 } from 'components/common/StyledComponent';
import SelectCustom from 'components/common/SelectCustom';
import { InferenceContext } from 'views/Inference';

export default function SelectModel(props) {
	const { model_list, selectModel, setSelectModel } = props;

	const { isRunning } = useContext(InferenceContext);

	const { isLoggedIn } = useAuthState();
	// const { onGetInferenceModelList } = useStateActionHandler();
	// const [modelList, setModelList] = useState([]);
	const onSelectChange = useCallback((e) => {
		setSelectModel(e);
	});

	useEffect(() => {
		if (isLoggedIn) {
			// fetchList()
		}
	}, [isLoggedIn]);

	return (
		<>
			<SubTitleBox2>Select model</SubTitleBox2>
			<SelectBoxArea>
				<SelectCustom
					styleOptions={{
						width: '470px',
						height: '48px',
					}}
					isDisabled={isRunning}
					isLoading={false}
					isClearable={false}
					isRtl={false}
					isSearchable={false}
					options={model_list}
					getOptionLabel={(option) => option.model_nm}
					getOptionValue={(option) => option.experiment_id}
					onChange={onSelectChange}
					value={selectModel}
					label_key={'model_nm'}
					value_key={'experiment_id'}
				/>
			</SelectBoxArea>
		</>
	);
}

const SelectBoxArea = styled.div`
	display: flex;
	width: 470px;
`;
