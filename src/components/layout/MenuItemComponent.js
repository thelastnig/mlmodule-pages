import React, { useEffect } from 'react';
import styled from 'styled-components';
import ReactTooltip from 'react-tooltip';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import { THEME } from 'styles/theme/theme';

import { ListItemIconSt, ListItemTextSt, ListItemTextStStatus, MenuIcon } from 'components/layout/MenuComponent';

const MenuItemComponent = (props) => {
	const { onClick, isSelected, isDisabed, tooltip_key, itemIcon, text, hasStatus, children } = props;

	return (
		<MenuItem onClick={onClick} isSelected={isSelected} isDisabed={isDisabed} data-tip data-for={tooltip_key}>
			<ListItemIconSt>{itemIcon && <MenuIcon url={itemIcon} />}</ListItemIconSt>
			{hasStatus ? <ListItemTextStStatus primary={text} /> : <ListItemTextSt primary={text} />}
			{children}
		</MenuItem>
	);
};
export default MenuItemComponent;

const MenuItem = styled.div`
	width: 100%;
	display: flex;
	position: relative;
	box-sizing: border-box;
	text-align: left;
	align-items: center;
	padding-top: 8px;
	padding-bottom: 8px;
	justify-content: flex-start;
	text-decoration: none;
	padding-left: 32px;
	padding-right: 24px;
	background: ${(props) => (props.isActive ? 'rgba(0, 66, 130, 0.1)' : '')};
	cursor: pointer;
	:hover {
		background: ${THEME.hover};
	}
	${(props) =>
		props.isSelected
			? `background:${THEME.selected}`
			: props.isDisabed
			? `
      background: #ffffff !important;
      cursor: not-allowed;
      `
			: `background: #ffffff`};
`;

export const EmptyProjectTooltip = (props) => {
	const { enable, tooltip_key, texts } = props;	
	return (
			<StyledToolTipMarginTopMinus5 id={tooltip_key} effect="solid" place={'bottom'}>
				{texts.map(text => (
					<div style={{ padding: '0px 10px' }}>{text}</div>
				))}				
				{enable && (
					<div style={{ padding: '0px 10px' }}>{'(프로젝트를 로드해주세요.)'}</div>
				)}
			</StyledToolTipMarginTopMinus5>
	);
};

const StyledToolTipMarginTopMinus5 = styled(ReactTooltip)`
	margin-top: -5px !important;
`;

export const GeneralTootip = ({ texts, tooltip_key }) => {

	return (
		<StyledToolTipMarginTopMinus5 id={tooltip_key} effect="solid" place={'bottom'}>
			{texts.map(text => (
				<div style={{ padding: '0px 10px' }}> {text}</div>
			))}			
		</StyledToolTipMarginTopMinus5>
	);
}

export const StatusTooltip = (props) => {
	const { startDate, tooltip_key, loadProject, texts } = props;
	return (
		<>
			{startDate && (
				<ReactTooltip className={'menu_tooltip custom'} id={tooltip_key} effect="solid" place={'bottom'}>
					<div> Status: 동작중</div>
					<div> start date: {startDate} </div>
				</ReactTooltip>
			)}
			<StyledToolTipMarginTopMinus5 id={tooltip_key} effect="solid" place={'bottom'}>
				{texts.map(text => (
					<div style={{ padding: '0px 10px' }}>{text}</div>
				))}				
				{!startDate && loadProject && (
					<div style={{ padding: '0px 10px' }}>(현재 진행중인 프로세스가 없습니다.)</div>
				)}				
			</StyledToolTipMarginTopMinus5>
		</>
	);
};

export const MenuArrowIcon = (props) => {
	const { onClick, isMenuOpen } = props;
	return <ArrowIcon onClick={onClick}>{isMenuOpen ? <ExpandLess /> : <ChevronRightIcon />}</ArrowIcon>;
};

const ArrowIcon = styled.span`
	cursor: pointer;
`;
