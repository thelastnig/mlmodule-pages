import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';

import { colors } from 'styles';
import { THEME } from "styles/theme/theme";

import { ListSubheaderSt } from 'components/layout/MenuComponent';
import { checkSelected, ROUTER_ANNOTATION } from 'components/layout/MenuConst';
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

export default function AnnotatorMenu() {
	const classes = useStyles();
	const location = useLocation();
	const history = useHistory();
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
						Main
					</ListSubheaderSt>
				}
				className={classes.root}
			>
				<MenuItemComponent
					onClick={(e) => menuClicked(ROUTER_ANNOTATION, true)}
					isSelected={checkSelected(pathname, ROUTER_ANNOTATION)}
					itemIcon={THEME.getImageURL('icon-annotation')}
					text={'annotation'}
				/>
			</List>
		</>
	);
}
