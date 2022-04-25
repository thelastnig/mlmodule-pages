import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';

import { ListSubheaderSt, WrapDivider } from 'components/layout/MenuComponent';
import {
	checkSelected,
	ROUTER_DATA_REPOSITORY,
	ROUTER_MODEL_REPOSITORY,
	ROUTER_PROJECT_REPOSITORY,
	ROUTER_RESOURCES,
	ROUTER_USER_GROUP,
} from 'components/layout/MenuConst';
import MenuItemComponent from 'components/layout/MenuItemComponent';

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		maxWidth: 360,
		backgroundColor: 'white',
		color: colors.brand,
	},
	nested: {
		paddingLeft: theme.spacing(4),
	},
}));
export default function AdminMenu() {
	const classes = useStyles();
	const history = useHistory();
	const location = useLocation();
	const pathname = location.pathname.split('/')[1];

	const menuClicked = useCallback((path, enable) => {
		console.log('menuClicked ', path, enable);
		if (enable) {
			history.push('/' + path);
		}
	});

	return (
		<>
			<List
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheaderSt component="div" id="nested-list-subheader">
						Admin
					</ListSubheaderSt>
				}
				className={classes.root}
			>
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_USER_GROUP, true)}
					isSelected={checkSelected(pathname, ROUTER_USER_GROUP)}
					itemIcon={THEME.getImageURL('icon-group')}
					text={'User/Group'}
				/>

				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_RESOURCES, true)}
					isSelected={checkSelected(pathname, ROUTER_RESOURCES)}
					itemIcon={THEME.getImageURL('icon-resource')}
					text={'Resources'}
				/>

				<EmptyArea />
				<WrapDivider />
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_DATA_REPOSITORY, true)}
					isSelected={checkSelected(pathname, ROUTER_DATA_REPOSITORY)}
					itemIcon={THEME.getImageURL('icon-data')}
					text={'Data Repository'}
				/>
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_PROJECT_REPOSITORY, true)}
					isSelected={checkSelected(pathname, ROUTER_PROJECT_REPOSITORY)}
					itemIcon={THEME.getImageURL('icon-experiment')}
					text={'Project Repository'}
				/>
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_MODEL_REPOSITORY, true)}
					isSelected={checkSelected(pathname, ROUTER_MODEL_REPOSITORY)}
					itemIcon={THEME.getImageURL('icon-model')}
					text={'Model Repository'}
				/>
			</List>
		</>
	);
}

const EmptyArea = styled.div`
	height: 88px;
`;
