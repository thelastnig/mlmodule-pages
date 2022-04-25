import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import Spacer from 'components/spacer';
import { BoxTitle } from 'components/dataSet/Detail/TabularComponent';
import TabularSelectedNumericTable from 'components/dataSet/Detail/TabularSelectedNumericTable';
import TabularSelectedCategoryTable from 'components/dataSet/Detail/TabularSelectedCategoryTable';
import TabularSelectedNFTable from 'components/dataSet/Detail/TabularSelectedNFTable';

const TabularSelectedFeature = (props) => {
	const { selectFeature } = props;
	return (
		<>
			<BoxTitle>Selected features</BoxTitle>
			<Spacer />
			<SubTitleContents>
				<SubTitleContentItem>
					<SubTitleText isBold={selectFeature ? (selectFeature.missing > 0 ? true : false) : false}>
						Missing: {selectFeature ? selectFeature.missing : ''}
					</SubTitleText>
				</SubTitleContentItem>
				<SubTitleContentItem>
					<SubTitleText>Distinct: {selectFeature ? selectFeature.distinct : ''}</SubTitleText>
				</SubTitleContentItem>
				<SubTitleContentItem>
					<SubTitleText>Unique: {selectFeature ? selectFeature.unique : ''}</SubTitleText>
				</SubTitleContentItem>
			</SubTitleContents>
			<Spacer size={'lg'} />
			<TableArea>
				{!selectFeature ? (
					''
				) : selectFeature.type === 'numeric' ? (
					<TabularSelectedNumericTable selectFeature={selectFeature} />
				) : selectFeature.type === 'categorical' ? (
					<TabularSelectedCategoryTable selectFeature={selectFeature} />
				) : (
					<TabularSelectedNFTable selectFeature={selectFeature} />
				)}
			</TableArea>
		</>
	);
};
export default TabularSelectedFeature;

const SubTitleContentItem = styled.div`
	display: flex;
	height: 20px;
	align-items: center;
	width: 140px;
`;

const SubTitleContents = styled.div`
	display: flex;
	height: 20px;
	align-items: center;
`;

const SubTitleText = styled.div`
	font-size: 14px;
	letter-spacing: -0.35px;
	color: ${colors.gray_dark};
	${(props) =>
		props.isBold &&
		`
      font-weight: bold;
    `}
`;

const TableArea = styled.div`
	width: 566px;
	height: 245px;
`;

export const StyledTableHeader = styled.thead`
	width: 100%;
	height: 40px;
	margin: 1px 0 0 0;
	padding: 10px 0px 0px 0px;
	background-color: ${colors.list_header};
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

export const StyledTableRow = styled.tr`
	width: 100%;
	height: 40px;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
`;
