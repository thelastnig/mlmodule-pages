import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import FeaturesTable from 'components/dataSet/Detail/TabularFeaturesTable';
import Button from 'component/Button';

const TabularFeatures = (props) => {
	const { handleToggleVisualize, selectFeature, setSelectFeature, data, setSelectedGraph, graphValues } = props;
	return (
		<>
			<FeaturesHead>
				<BoxTitle>Features</BoxTitle>
				<Button
					colorType={'gray'}
					size={'lowLarge'}
					onClick={(e) => handleToggleVisualize()}
				>
					Visualize All
				</Button>
			</FeaturesHead>
			<Spacer />
			<FeaturesTable
				selectFeature={selectFeature}
				setSelectFeature={setSelectFeature}
				list={data.list}
				setSelectedGraph={setSelectedGraph}
				graphValues={graphValues}
			/>
		</>
	);
};
export default TabularFeatures;

const FeaturesHead = styled.div`
	height: 32px;
	width: 100%;
	display: flex;
	justify-content: space-between;
`;

const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;
