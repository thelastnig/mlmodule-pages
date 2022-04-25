import React from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';

export const PageWrapper = styled.div`
	display: flex;
	flex-direction: column;
	background: #f4f7fc;
	height: 100%;
`;

export const WhiteBox = styled.div`
	background: ${colors.bg_white};
	margin: 0px 64px 0 64px;
	width: 1524px;
	height: 662px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
`;

export const TitleBox = styled.div`
	width: 100%;
	height: 40px;
	color: ${colors.text_white};
	font-size: 28px;
	font-weight: bold;
	letter-spacing: -0.7px;
	padding: 24px 0px 24px 64px;
	font-family: ${THEME.titleFont};
`;

export const SubTitleBox = styled.div`
	padding: 12px 64px 8px 64px;
	height: 42px;
	font-size: 16px;
	color: ${colors.text_black};
`;

export const SubTitleBox2 = styled.div`
	padding: 12px 0 8px 0;
	height: 42px;
	font-size: 16px;
	color: ${colors.text_black};
`;

export const TitleContainer = styled.div`
	width: 100%;
	height: 80px;
	background-color: ${THEME.background};
`;

export const PaginationContainer = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
`;

export const BodyContainer = styled.div`
	background: #f4f7fc;
	padding: 0 64px;
	width: 1652px;
	height: calc(100% - 80px);
	padding-bottom: 20px;
	overflow-y: overlay;
`;

export const BodyFullContainer = styled.div`
	background: #f4f7fc;
	min-width: 1652px;
	height: calc(100% - 80px);
`;

export const TableRow = styled.tr`
	width: 100%;
	height: 48px;
	margin: 1px 0 0 0;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
`;

export const SortImg = styled.img`
	width: 20px;
	height: 20px;
`;

export const SatusDot = styled.div`
	width: 9px;
	height: 9px;
	border-radius: 5px;
	background: transparent;
	margin-top: 5px;
	margin-right: 10px;
	${(props) =>
		props.type && props.type === 'draft'
			? `background: #97a1ac;`
			: props.type === 'pending' || props.type === 'ready'
			? `background: #fd7e14;`
			: props.type === 'succeeded' || props.type === 'published' || props.type === 'completed'
			? `background: #008281;`
			: props.type === 'working' || props.type === 'running'
			? `background: #0069cf;`
			: props.type === 'aborted' || props.type === 'failed' || props.type === 'terminated'
			? `background: #e22706;`
			: `background: transparent;`}
`;
/* Experiment의 Status
  Pending : 실행 전 상태
  Runnig : 실행 중
  Succeeded : 실험 완료
  Failed : 실패
  Aborted : 중단됨
  Published : 배포됨
*/

export const MarginLeft = styled.div`
	margin-left: ${(props) => props.size || '8px'};
`;

export const StyledTable = styled.table`
	border: none;
	border-collapse: collapse;
	width: 100%;
`;

export const TableHeader = styled.thead`
	width: 100%;
	height: 46px;
	margin: 1px 0 0 0;
	padding: 13px 0px 0px 0px;
	background-color: #f8f9fa;
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-top: 1px solid #dfe2e5;
`;

export const BottomRightArea = styled.div`
	position: absolute;
	right: 0;
`;

export const BottomArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	height: 66px;
	padding-top: 20px;
	position: relative;
`;

export const BottomButtonArea = styled.div`
	display: flex;
	width: 522px;
	justify-content: flex-end;
	position: absolute;
	right: 0;
`;

export const InputDisabled = styled.div`
	width: 100%;
	height: 36px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	text-align: center;
	line-height: 34px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	background-color: #f9f9f9;
`;

export const CommonInput = css`
	outline: none;
	border-radius: 4px;
	&:focus {
		border: 1.2px solid #005cb5;
		border-radius: 4px;
	}
`;

export const BadgeIcon = styled.img`
	width: 10px;
	height: 10px;
	margin-left: 3px;
	vertical-align: top;
`;

export const TitleComponent = (props) => {
	const { text } = props;
	return (
		<TitleContainer>
			<TitleBox>{text}</TitleBox>
		</TitleContainer>
	);
};
