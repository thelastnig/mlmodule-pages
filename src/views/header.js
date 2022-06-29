import React, { useCallback, useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const Header = (props) => {
    const history = useHistory();

    const { taskType, taskSubType, isWorking } = useHandleState();

	const handleButtonClick = (url) => {
		history.push(url);
	};
    

	return (
        <HeaderWrapper>
            <div className='headerUpper'>
                <div className='upperWrapper'>
                    <div className='upperLeft' onClick={() => handleButtonClick('/')}>
                        <div className='logo'>JW Park</div>
                    </div>
                    <div className='upperRight'>
                        <div className='upperRightItem' onClick={() => handleButtonClick('/')}>Easy ML Module</div>
                    </div>
                </div>
                <div className='upperEnd'>
                    {
                    isWorking
                    ?
                    <div className='upperEndItem running'>RUNNING</div>
                    :
                    <div className='upperEndItem ready'>READY</div>
                    }
                    <div className='upperEndItem type'>CPU</div>
                </div>
            </div>
            <div className='headerLower'>
                <div className='taskWrapper'>
                    <div className={taskType === 'image' ? 'item first' : 'item first sound'}>{taskType === 'image' ? 'VISION' : 'SOUND'}</div>
                    <div className={taskSubType === 'classification' ? 'item' : 'item detection'}>{taskSubType === 'classification' ? 'CLASSIFICATION' : 'DETECTION'}</div>
                </div>
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

    .logo {
        height: 22px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        font-size: 17px;
    }

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
        display: flex;
        justify-content: flex-start;
        align-items: center;
        color: white;
    }

    .taskWrapper {
        height: 25px;
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .item {
            border-radius: 5px;
            padding: 0 10px;
            font-size: 12px;
            border: 2px solid #E5A829;
            color: #E5A829;
            letter-spacing: 1px;
            font-weight: 600;
            &.first {
                margin-right: 10px;
                border: 2px solid ${TEACHABLE_COLOR_LIST.GREEN_COLOR};
                color: ${TEACHABLE_COLOR_LIST.GREEN_COLOR};
            }

            &.sound {
                border: 2px solid ${TEACHABLE_COLOR_LIST.PURPLE};
                color: ${TEACHABLE_COLOR_LIST.PURPLE};
            }

            &.detection {
                border: 2px solid ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
                color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
            }
        }
    }

    .soundWrapper {
        .item {
            cursor: pointer;
        }
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
        cursor: pointer;
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
            color: ${TEACHABLE_COLOR_LIST.GREEN_COLOR};
            font-weight: 600;

            &.type {
                color: #1967D2;
                background-color: rgba(25, 113, 194, .3);
            }

            &.ready {
                color: #E5A829;
                background-color: #51380D;
            }
        }
    }
`;
