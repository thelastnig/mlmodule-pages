import React from 'react';
import styled from 'styled-components';
import { sizes } from 'styles';

import './menu.scss';

import MenuComponent from 'components/layout/MenuComponent';
import Profile from 'components/layout/Profile';

const LeftSideBar = () => {
	return (
		<>
			<SideBarWrappers>
				<Profile />
				<MenuComponent />
			</SideBarWrappers>
		</>
	);
};

export default LeftSideBar;

const SideBarWrappers = styled.div`
	display: block;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: ${sizes.menu_width};
	height: 100%;
	background: white;
`;
