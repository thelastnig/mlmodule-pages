import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import './App.scss';
import Routes from './Routes';
import Header from 'views/header';


import Spinner from 'component/Spinner';

export default function App() {
	return (
		<>
			<Route>
				<MainContainer className={'MainContainer'}>
					<MainWrapper>
						<Header />
						<Routes />
					</MainWrapper>
				</MainContainer>
			</Route>
			<Spinner />
		</>
	);
}

const MainContainer = styled.div`
	width: 100%;
	height: 100%;
`;

const MainWrapper = styled.div`
	width: 100%;
	height: 100%;
`;
