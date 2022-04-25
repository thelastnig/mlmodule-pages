import React from 'react';
import styled from 'styled-components';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

import { colors, sizes } from 'styles';
import { ROLE } from 'constants/common';

import { useAuthState } from 'store/auth/hooks';

import AdminMenu from 'components/layout/AdminMenu';
import DeveloperMenu from 'components/layout/DeveloperMenu';
import AnnotatorMenu from 'components/layout/AnnotatorMenu';

export default function MenuComponent() {
	const { isAdmin, currentUser } = useAuthState();
	const isDeveloper = currentUser && currentUser.role === ROLE.DEVELOPER ? true : false;
	const isAnnotator = currentUser && currentUser.role === ROLE.ANNOTATOR ? true : false;
	return (
		<MenuContainer className={'menuContainer'}>
			{isAdmin ? <AdminMenu /> : isDeveloper ? <DeveloperMenu /> : isAnnotator ? <AnnotatorMenu /> : ''}
		</MenuContainer>
	);
}
const MenuContainer = styled.div`
	width: ${sizes.menu_width};
	// height: 1040px;
	border-radius: 1px;
	background-color: ${colors.bg_white};
`;
export const ListItemIconSt = styled(ListItemIcon)`
	&& {
		width: 20px;
		height: 20px;
		min-width: unset;
		margin-right: 10px;
	}
`;

export const MenuIcon = (props) => {
	const { width = 20, height = 20, url } = props;
	return <img src={url} width={width} height={height} alt=""></img>;
};

export const ListItemTextSt = styled(ListItemText)`
	&& {
		font-size: 15px;
		color: ${colors.text_black};
	}
`;
export const ListItemTextStStatus = styled(ListItemText)`
	&& {
		font-size: 15px;
		color: ${colors.text_black};
		flex: unset;
		margin-right: 5px;
	}
`;

export const ListSubheaderSt = styled(ListSubheader)`
	&& {
		padding-left: 32px;
		padding-right: 24px;
	}
`;

export const Divider = styled.div`
	height: 1px;
	background-color: #eaebec;
	width: calc(100% - 64px);
	margin: 0 32px;
`;
export const WrapDivider = styled.div`
	height: 1px;
	background: #eaebec;
	width: calc(100% - 64px);
	margin: 0 32px;
	:hover {
		background: ${colors.MENU_HOVER};
	}
	background: ${(props) => (props.isSelected ? 'rgba(0, 66, 130, 0)' : '')};
`;
