import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import RadioButton from 'component/RadioButton';

const FeaturesTable = (props) => {
	const { list, selectFeature, setSelectFeature, setSelectedGraph, graphValues } = props;
	const setSelectedFeatureAndGraph = (data) => {
		setSelectFeature(data);
		const feature_nm = data['feature_nm'];
		setSelectedGraph(graphValues[feature_nm]);
	};
	return (
		<div>
			<CommonTh>
				<FeaturesTh1></FeaturesTh1>
				<FeaturesTh2>No.</FeaturesTh2>
				<FeaturesTh3>FEATURE</FeaturesTh3>
				<FeaturesTh4>Type</FeaturesTh4>
			</CommonTh>
			<Tbody style={{ height: '160px' }}>
				{list &&
					list.map((data, index) => {
						return (
							<CommonTr onClick={(e) => setSelectedFeatureAndGraph(data)}>
								<FeaturesTr1>
									<RadioButton selected={selectFeature === data} />
								</FeaturesTr1>
								<FeaturesTr2>{index + 1}</FeaturesTr2>
								<FeaturesTr3>{data.feature_nm}</FeaturesTr3>
								<FeaturesTr4>{data.type}</FeaturesTr4>
							</CommonTr>
						);
					})}
			</Tbody>
		</div>
	);
};
export default FeaturesTable;

const CommonTh = styled.div`
	width: 100%;
	height: 40px;
	padding: 11px 0px 10px 16px;
	background: ${colors.list_header};
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	display: flex;
`;

const FeaturesTh1 = styled.div`
	width: 66px;
`;

const FeaturesTh2 = styled.div`
	width: 50px;
	margin-right: 86px;
`;

const FeaturesTh3 = styled.div`
	width: 150px;
	margin-right: 136px;
`;

const FeaturesTh4 = styled.div``;

const FeaturesTr1 = styled.div`
	width: 66px;
	display: flex;
	align-items: center;
`;

const FeaturesTr2 = styled.div`
	width: 50px;
	margin-right: 86px;
`;

const FeaturesTr3 = styled.div`
	width: 150px;
	margin-right: 136px;
`;

const FeaturesTr4 = styled.div``;

const Tbody = styled.div`
	height: 204px;
	overflow: auto;
`;

const CommonTr = styled.div`
	width: 100%;
	height: 40px;
	padding: 10px 0px 10px 16px;
	border-bottom: 1px solid ${colors.line_color};
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	display: flex;
	border-bottom: 1px solid #eaebec;
	:hover {
		cursor: pointer;
		background: ${colors.hover_sel};
	}
`;
