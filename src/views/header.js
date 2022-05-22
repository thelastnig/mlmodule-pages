import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import logo from 'assets/icon/surromind.png';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const Header = (props) => {
    const history = useHistory();

    const { taskType } = useHandleState();

	const handleButtonClick = (url) => {
		history.push(url);
	};

	return (
        <HeaderWrapper>
            <div className='headerUpper'>
                <div className='upperWrapper'>
                    <div className='upperLeft'>
                        <img src={logo} height='22px'/>
                    </div>
                    <div className='upperRight'>
                        <div className='upperRightItem' onClick={() => handleButtonClick('/')}>Easy ML Module</div>
                        <div className='upperRightItem' onClick={() => handleButtonClick('/annotation')}>Annotation</div>
                    </div>
                </div>
                <div className='upperEnd'>
                    <div className='upperEndItem status'>RUNNING</div>
                    <div className='upperEndItem type'>CPU</div>
                </div>
            </div>
            <div className='headerLower'>
                
            </div>
        </HeaderWrapper>
	);
};

export default Header;


const HeaderWrapper = styled.div`
    width: 100%;
    height: 70px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
    padding-left: 20px;
    padding-right: 20px;

    .headerUpper {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .headerLower {
        width: 100%;
        height: 30px;
    }

    .upperWrapper {
        width: 80%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .upperLeft {
        margin-right: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .upperRight {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .upperRightItem {
            color: ${TEACHABLE_COLOR_LIST.GRAY};
            margin-right: 20px;
            cursor: pointer;

            &:hover {
                color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
            }
            
        }
    }

    .upperEnd {
        width: 20%;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .upperEndItem {
            margin-left: 15px;
            font-size: 12px;
            border-radius: 3px;
            padding-top: 2px;
            padding-bottom: 2px;
            padding-left: 8px;
            padding-right: 8px;
            letter-spacing: 1px;
            background-color: rgba(55, 178, 77, .3);
            color: #37b24d;
            font-weight: 600;

            &.type {
                color: #1967D2;
                background-color: rgba(25, 113, 194, .3);
            }
        }
    }
`;
