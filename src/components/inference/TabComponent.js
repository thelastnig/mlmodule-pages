import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { useStateActionHandler } from 'store/dataset/hooks';

import DataSetComponent from 'components/inference/DatasetComponent';
import LocalComponent from 'components/inference/LocalComponent';
import { InferenceContext } from 'views/Inference';

export default function TabComponent(props) {
	const { checkItems, setCheckItems, selectModel } = props;

	const { tabType, setTabType, isRunning, startInferenceClicked, before_storage_dataset_nm } = useContext(InferenceContext);

	const { setStartIndex, setFilterText } = useStateActionHandler();

	const changeTabType = (type) => {
		if (isRunning) {
			return;
		}
		setFilterText('');
		setStartIndex(0);
		setTabType(type);
	};

	return (
		<>
			<TabWrapper>
				<TabItem active={tabType === 'L'} onClick={(e) => changeTabType('L')} disabled={isRunning}>
					Local
				</TabItem>
				<TabItem active={tabType === 'P'} onClick={(e) => changeTabType('P')} disabled={isRunning}>
					Private
				</TabItem>
				<TabItem active={tabType === 'S'} onClick={(e) => changeTabType('S')} disabled={isRunning}>
					Shared
				</TabItem>
			</TabWrapper>
			<ContentInfoComponent>
				{isRunning
					? before_storage_dataset_nm
						? before_storage_dataset_nm + ' 데이터셋이 선택되었습니다.'
						: 'Local Inference가 동작중입니다.'
					: '데이터셋을 선택해주세요.'}
			</ContentInfoComponent>
			{tabType === 'P' || tabType === 'S' ? (
				<DataSetComponent
					checkItems={checkItems}
					setCheckItems={setCheckItems}
					tabType={tabType}
					startInferenceClicked={startInferenceClicked}
					selectModel={selectModel}
				/>
			) : (
				<LocalComponent startInferenceClicked={startInferenceClicked} />
			)}
		</>
	);
}

const ContentInfoComponent = styled.div`
	height: 50px;
	line-height: 50px;
`;

const TabWrapper = styled.div`
	height: 53px;
	display: flex;
	padding: 24px 0;
	padding-bottom: 0;
	border-bottom: 2px solid ${colors.gray_light};
`;

const TabItem = styled.div`
	font-size: 16px;
	font-weight: 600;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.4px;
	color: ${colors.gray_default};
	margin-right: 32px;
	cursor: pointer;
	margin-bottom: -2px;
	${(props) =>
		props.active
			? `color: #004282;
      border-bottom: 2px solid #004282;`
			: ``}
	${(props) => (props.disabled ? `cursor: not-allowed` : ``)}
`;
