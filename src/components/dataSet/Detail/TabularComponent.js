import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import { PageWrapper, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import DataTabularVisualize from 'component/dialog/DataTabularVisualize';
import { DataSetDetailContext } from 'views/DataDetail';
import TabularFeatures from 'components/dataSet/Detail/TabularFeatures';
import TabularSelectedFeature from 'components/dataSet/Detail/TabularSelectedFeature';
import DataSetInfo from 'components/dataSet/Detail/DataSetInfo';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

// Graph 구현
import HistogramGraphComponent from 'components/common/graph/HistogramGraphComponent';

const TabularComponent = (props) => {
	const { data } = props;
	const { okClicked } = useContext(DataSetDetailContext);
	const { showDialog } = useDialogAction();

	const [showVisualize, setShowVisualize] = useState(false);
	const [selectFeature, setSelectFeature] = useState('');
	// Graph 정보
	const [graphValues, setGraphValues] = useState(null);
	const [selectedGraph, setSelectedGraph] = useState(null);
	const graphWidth = 818;
	const graphHeight = 318;
	const layoutLeft = 50;
	const layoutRight = 40;
	const layoutTop = 5;
	const layoutBottom = 50;
	const layoutPadding = 4;
	const showticklabels = true;

	const handleToggleVisualize = () => {
		// setShowVisualize(!showVisualize);
		showDialog(dialogList.DATA_TABULAR_VISUALIZE);
	};

	useEffect(() => {
		if (data && data.list.length > 0 && !selectFeature) {
			setSelectFeature(data.list[0]);
			setGraphValues(data.graph_values);
			const defaultData = data.list[0];
			const feature_nm = defaultData['feature_nm'];
			setSelectedGraph(data.graph_values[feature_nm]);
		}
	}, [data]);

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'Data Details'} />
				<SubTitleBox>{'Data Details'}</SubTitleBox>
				<Content>
					<ContentArea>
						{/* <DataTabularVisualize show={showVisualize} toggle={handleToggleVisualize} graphValues={graphValues} /> */}
						<DataTabularVisualize graphValues={graphValues} />
						<Left>
							<BoxTitle>Dataset Info</BoxTitle>
							<Spacer size={'lg'} />
							<DataSetInfo data={data} />
							<Spacer size={'xl'} />
							<Spacer size={'lg'} />

							<TabularSelectedFeature selectFeature={selectFeature} />
						</Left>
						<Spacer size={'lg'} />
						<Right>
							<RightContainer>
								<TabularFeatures
									handleToggleVisualize={handleToggleVisualize}
									selectFeature={selectFeature}
									setSelectFeature={setSelectFeature}
									setSelectedGraph={setSelectedGraph}
									graphValues={graphValues}
									data={data}
								/>

								<Spacer size={'lg'} />
								<Spacer size={'xl'} />
								<BoxTitle>Visualization</BoxTitle>
								<Spacer />
								<HistogramGraphComponent
									graphData={selectedGraph}
									graphWidth={graphWidth}
									graphHeight={graphHeight}
									layoutLeft={layoutLeft}
									layoutRight={layoutRight}
									layoutTop={layoutTop}
									layoutBottom={layoutBottom}
									layoutPadding={layoutPadding}
									showticklabels={showticklabels}
								/>
							</RightContainer>
						</Right>
					</ContentArea>
				</Content>

				<Spacer />
				<Spacer />
				<ButtonContainer>
					<Button colorType={'blue'} size={'xsmall'} onClick={(e) => okClicked()} >OK</Button>
				</ButtonContainer>
			</PageWrapper>
		</>
	);
};

export default TabularComponent;
const ButtonContainer = styled.div`
	width: 1524px;
	margin-left: 64px;
	display: flex;
	justify-content: flex-end;
`;

export const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

const RightContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const Right = styled.div`
	width: 882px;
	height: 100%;
`;

const Left = styled.div`
	width: 630px;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const Content = styled.div`
	width: 100%;
	padding: 0px 64px 0px 64px;
	display: flex;
	justify-content: space-between;
`;

const ContentArea = styled.div`
	width: 100%;
	height: 676px;
	display: flex;
`;
