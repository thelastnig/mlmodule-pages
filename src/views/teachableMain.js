import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { colors } from 'styles';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import { PageWrapper, BodyFullContainer, TitleComponent } from 'components/common/StyledComponent';
import imageClassificationImg from 'assets/img/image_classification.jpg';
import soundClassificationImg from 'assets/img/sound_classification.jpg';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const TeachableMain = (props) => {

    const handleClick = (type) => {
        props.history.push('teachable/' + type)
    };


	return (
        <PageWrapper>
            <TitleComponent text={'EASY ML'} />
            <BodyFullContainer>
                <InnerWrapper>
                    <TaskItem onClick={() => handleClick('image')}>
                        <div className='imageArea'>
                            <img src={imageClassificationImg} width="340px" alt='image classification'/>
                        </div>
                        <div className='textArea'>
                            <div className='title'>이미지 분류&nbsp;&nbsp;<span>Image Classification</span></div>
                            <div className='desc'>
                                파일 또는 웹캠에서 가져온 이미지를 학습
                            </div>
                        </div>
                    </TaskItem>
                    <TaskItem onClick={() => handleClick('sound')}>
                        <div className='imageArea'>
                            <img src={soundClassificationImg} width="340px" alt='image classification'/>
                        </div>
                        <div className='textArea'>
                            <div className='title'>사운드 분류&nbsp;&nbsp;<span>Sound Classification</span></div>
                            <div className='desc'>
                                파일 또는 마이크에서 가져온 사운드를 학습
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
    width: 1000px;
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
        .title {
            font-size: 26px;
            font-weight: 700;
            span {
                font-size: 14px;
                color: gray;
                font-weight: 500;
            }
        }
        .desc {
            margin-top: 30px;
            font-size: 16px;
        }
    }
`;

