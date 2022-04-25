import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import Spacer from 'components/spacer';
import { BoxTitle, Divider, LeftContainerTop } from 'views/Analyze';
import { AnalyzeContext } from 'views/Analyze';

const DatasetInfo = () => {
	const { isTabular, detail } = useContext(AnalyzeContext);
	return (
		<LeftContainerTop>
			<BoxTitle>Dataset Info</BoxTitle>
			<Spacer size={'lg'} />
			<Divider />
			<DataRow>
				<RowName>Dataset</RowName>
				<RowValue>{detail.dataset_nm}</RowValue>
			</DataRow>
			<DataRow>
				<RowName>Type</RowName>
				<RowValue>{detail.dataset_type}</RowValue>
			</DataRow>
			{isTabular ? (
				<>
					<DataRow>
						<RowName>No. of features</RowName>
						<RowValue>{detail.num_features}</RowValue>
					</DataRow>
					<DataRow>
						<RowName>No. of rows</RowName>
						<RowValue>{detail.num_rows}</RowValue>
					</DataRow>
				</>
			) : (
				<DataRow>
					<RowName>No. of instances</RowName>
					<RowValue>{detail.num_instances}</RowValue>
				</DataRow>
			)}
			<DataRow>
				<RowName>Size</RowName>
				<RowValue>{detail.size}</RowValue>
			</DataRow>
			<DataRow>
				<RowName>Version</RowName>
				<RowValue>{detail.version}</RowValue>
			</DataRow>
			<Divider />
		</LeftContainerTop>
	);
};
export default DatasetInfo;

const DataRow = styled.div`
	width: 100%;
	height: 44px;
	padding: 12px 16px 12px 16px;
	display: flex;
	background: ${(props) => (props.colored ? colors.bg_light_gray : null)};
	:nth-child(even) {
		background: ${colors.bg_light_gray};
	}
`;

const RowValue = styled.div`
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
`;

const RowName = styled.div`
	width: 151px;
	color: #3e5376;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
`;
