import React, { useContext } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import { DataSetDetailContext } from 'views/DataDetail';

const DataSetInfo = () => {
	const { isTabular, detail } = useContext(DataSetDetailContext);
	return (
		<>
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
						<RowValue isBold={detail ? (detail.missing_valued_features > 0 ? true : false) : false}>{detail.num_features}</RowValue>
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
			{
				detail.merge_from && detail.merge_from.length > 0 && (					
					<DataRow>
						<RowName>Merged Dataset</RowName>
						<RowValue>{detail.merge_from.split(',').map((mergeStr, idx) => (							
							mergeStr + `${idx < detail.merge_from.split(',').length-1 ? ', ' : ''}`
						))}</RowValue>
					</DataRow>
				)
			}
			<Divider />
		</>
	);
};
export default DataSetInfo;

const Divider = styled.div`
	width: 100%;
	height: 1px;
	background: ${colors.gray_light};
`;

const RowValue = styled.div`
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	${(props) =>
		props.isBold &&
		`
      font-weight: bold;
    `}
`;

const RowName = styled.div`
	width: 151px;
	color: #3e5376;
	font-size: 14px;
	font-weight: 500;
	letter-spacing: -0.35px;
`;

const DataRow = styled.div`
	width: 100%;
	height: 48px;
	padding: 12px 16px 12px 16px;
	display: flex;
	background: ${(props) => (props.colored ? colors.bg_light_gray : null)};
	:nth-child(even) {
		background: ${colors.bg_light_gray};
	}
`;
