import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors } from 'styles';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { PageWrapper, BodyFullContainer } from 'components/common/StyledComponent';
import imageClassificationImg from 'assets/img/image_classification.jpg';
import soundClassificationImg from 'assets/img/sound_classification.jpg';
import objectDetectionImg from 'assets/img/object_detection.jpg';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const TeachableMain = (props) => {

    const handleClick = (type, subType) => {
        props.history.push('easyml/' + type + '/' + subType)
    };


	return (
        <PageWrapper>
            <BodyFullContainer>
                <InnerWrapper>
                    <TaskItem onClick={() => handleClick('image', 'classification')}>
                        <div className='imageArea'>
                            <img src={imageClassificationImg} width="340px" alt='image classification'/>
                        </div>
                        <div className='textArea'>
                            <div className='taskWrapper'>
                                <div className='title'>이미지 분류</div>
                                <div className='item first'>VISION</div>
                                <div className='item'>CLASSIFICATION</div>
                            </div>
                            <div className='desc'>
                                파일 또는 웹캠에서 가져온 이미지 분류 학습
                            </div>
                        </div>
                    </TaskItem>

                    
                    <TaskItem onClick={() => handleClick('image', 'detection')}>
                        <div className='imageArea'>
                            <img src={objectDetectionImg} width="340px" alt='image detection'/>
                        </div>
                        <div className='textArea'>
                            <div className='taskWrapper'>
                                <div className='title'>객체 인식</div>
                                <div className='item first'>VISION</div>
                                <div className='item detection'>DETECTION</div>
                            </div>
                            <div className='desc'>
                                파일 또는 웹캠에서 가져온 객체 인식 학습
                            </div>
                        </div>
                    </TaskItem>

                    <TaskItem onClick={() => handleClick('sound', 'classification')}>
                        <div className='imageArea'>
                            <img src={soundClassificationImg} width="340px" alt='image classification'/>
                        </div>
                        <div className='textArea'>
                            <div className='taskWrapper'>
                                <div className='title'>사운드 분류</div>
                                <div className='item first sound'>SOUND</div>
                                <div className='item'>CLASSIFICATION</div>
                            </div>
                            <div className='desc'>
                                파일 또는 마이크에서 가져온 사운드 분류 학습
                            </div>
                        </div>
                    </TaskItem>
                </InnerWrapper>
            </BodyFullContainer>
        </PageWrapper>
	);
};

export default TeachableMain;


const InnerWrapper = styled.div`
    width: 1400px;
    margin: 150px auto 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const TaskItem = styled.div`    
    width: 400px;
    height: 400px;
    padding: 40px 30px;
    background: white;
    border-radius: 15px;
    cursor: pointer;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);

    &:hover {
        border: 1px solid ${TEACHABLE_COLOR_LIST.LIGHT_MAIN_COLOR};
    }

    .textArea {
        margin-top: 30px;

        .taskWrapper {
            display: flex;
            justify-content: flex-start;
            align-items: flex-start;

            .title {
                margin-right: 15px;
                font-size: 24px;
                font-weight: 800;
                font-family: 'Nanum Gothic' !important;
                span {
                    font-size: 14px;
                    color: gray;
                    font-weight: 500;
                }
            }
    
            .item {
                height: 25x;
                border-radius: 5px;
                padding: 0 10px;
                font-size: 10px;
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

        .desc {
            margin-top: 30px;
            font-size: 16px;
            font-weight: 600;
            color: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
            font-family: 'Nanum Gothic' !important;
        }
    }
`;

