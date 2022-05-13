import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Route } from 'react-router-dom';

import './App.scss';
import { sizes } from 'styles';
import LocalStorageManager from 'utils/LocalStorageManager';

import Routes from './Routes';

import { useAuthState, useAuthAction } from 'store/auth/hooks';
import { useCommonAction } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Spinner from 'component/Spinner';

export default function App() {
	return (
		<>
			<Route>
				<MainContainer className={'MainContainer'}>
					<MainWrapper>
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
