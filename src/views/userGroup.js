import React, { useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';

import { useHandleState, useStateActionHandler } from 'store/usergroup/hooks';

import { BodyContainer, PageWrapper, TitleComponent } from 'components/common/StyledComponent';
import UserContentBody from 'components/userGroup/UserContentBody';
import UserGroupContentBody from 'components/userGroup/UserGroupContentBody';
import GroupContentBody from 'components/userGroup/GroupContentBody';

const UserGroup = () => {
	const checkTabType = () => {
		if (initTabType === 'G') {
			setInitTabType('U');
			return 'G';
		} else {
			return 'U';
		}

		return 'U';
	};
	const { setInitTabType } = useStateActionHandler();
	const { initTabType } = useHandleState();

	const [tabType, setTabType] = useState(checkTabType());
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState('');

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'User/Group'} />
				<BodyContainer>
					<TabComponent>
						<TabItem active={tabType === 'U'} onClick={(e) => setTabType('U')}>
							User
						</TabItem>
						{/*<TabItem active={tabType === 'UG'} onClick={e => setTabType('UG')}>User/Group</TabItem>*/}
						<TabItem active={tabType === 'G'} onClick={(e) => setTabType('G')}>
							Group
						</TabItem>
					</TabComponent>
					<div style={{ marginBottom: '21px' }}></div>
					{tabType === 'U' && (
						<UserContentBody
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							tabType={tabType}
						/>
					)}
					{tabType === 'UG' && (
						<UserGroupContentBody
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							tabType={tabType}
						/>
					)}
					{tabType === 'G' && (
						<GroupContentBody
							startDate={startDate}
							setStartDate={setStartDate}
							endDate={endDate}
							setEndDate={setEndDate}
							tabType={tabType}
						/>
					)}
				</BodyContainer>
			</PageWrapper>
		</>
	);
};

export default UserGroup;
const TabComponent = styled.div`
	height: 20px;
	display: flex;
	//padding: 24px 0;
	margin-top: 20px;
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
	${(props) =>
		props.active
			? `color: #004282;
    border-bottom: 2px solid #004282;`
			: ``}
`;
export const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 100%;
	height: 646px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
`;
export const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	margin: 0px 27px 0px 20px;
	justify-content: space-between;
`;
export const ContentWrapper = styled.div`
	display: flex;
`;

export const TableArea = styled.div`
	width: 100%;
`;
