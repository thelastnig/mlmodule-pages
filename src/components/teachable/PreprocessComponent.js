import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined';
import RestoreOutlinedIcon from '@material-ui/icons/RestoreOutlined';
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlinedIcon from '@material-ui/icons/KeyboardArrowUpOutlined';
import TeachableSelect from './TeachableSelect';

const augType = ['이미지 뒤집기', '이미지 회전', '이미지 중앙 자르기', '이미지 밝기 변경', '이미지 포화']

const PreprocessComponent = (props) => {
    
    // const { list } = useHandleState();
    // const { reorderClass, changeClassName } = useStateActionHandler();
    
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    
    const handleChange = (e) => {
        // if (e.target.name === 'epoch') {
        //     if (isNaN(e.target.value)) {
        //         alert('숫자만 입력가능합니다');
        //         return;
        //     }
        // }
        // const changed_params = {
        //     ...params,
        //     [e.target.name]: e.target.value
        // };
        // changeParams({
        //     params: changed_params
        // });
    };

	return (
        <TrainItem>
            <ItemHeader>
                <HeaderText>
                    데이터 증강
                </HeaderText>
                <HeaderContent>
                    <div className='headerContentText'>데이터 증강하기</div>
                </HeaderContent>
            </ItemHeader>
            <ItemContent>
                <DetailButton onClick={() => setIsSettingOpen(!isSettingOpen)}>
                    <div className='detail toggle'>
                        <div className='detailLeft'>
                                <div className='detailText toggle'>고급</div>
                        </div>
                        <div className='detailRight'>
                            {
                                isSettingOpen
                                ?
                                <KeyboardArrowUpOutlinedIcon className='toggleIcon'/>
                                :
                                <KeyboardArrowDownOutlinedIcon className='toggleIcon'/>
                            }
                        </div>
                    </div>
                </DetailButton>
                <DetailSetting isSettingOpen={isSettingOpen}>
                    <div className='detail method'>
                        <div className='detailLeft'>
                            <div className='detailText'>증강 방법:</div>
                            <div className='detailSelect'>                    
                                <TeachableSelect 
                                    options={augType} 
                                    width={145}
                                    handleChange={handleChange}/>
                            </div>
                        </div>
                        <div className='detailRight'>
                            <HelpOutlineOutlinedIcon className='helpIcon' />
                        </div>
                    </div>
                    <div className='detail value'>
                        <div className='detailLeft'>
                            <div className='detailText'>설정값:</div>
                            <div className='detailSelect'>
                                <input
                                    className='detailInput' 
                                    value={1}
                                    onChange={(e) => handleChange(e)}
                                />
                            </div>
                        </div>
                        <div className='detailRight'>
                            <HelpOutlineOutlinedIcon className='helpIcon' />
                        </div>
                    </div>
                    <div className='detail learningRate'>
                        <div className='detailLeft'>
                            <div className='detailText reset'>기본값 초기화</div>
                        </div>
                        <div className='detailRight'>
                            <RestoreOutlinedIcon className='helpIcon reset' />
                        </div>
                    </div>
                </DetailSetting>
            </ItemContent>
        </TrainItem>
    );                                  
};

export default PreprocessComponent;

const TrainItem = styled.div`
    width: 300px;
    background: white;
    border-radius: 15px;
    box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2);
`;

const ItemHeader = styled.div`
    width: 100%;
    height: 115px;
    padding: 15px;
    border-bottom: 2px solid #e9ecef;
    display: flex;
    flex-direction: column;
    justify-cotent: space-between;
`;

const HeaderText = styled.div`
    height: 42px;
    font-size: 20px;
    font-weight: 600;
`;

const HeaderContent = styled.div`
    height: 42px;
    background: #F1F3F4;
    color: #495057;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    justify-cotent: center;
    align-items: center;

    :hover {
        background: #E8F0FE;
        color: #1967D2;
        font-weight: 600;
    }

    .headerContentText {
        width: 100%;
        text-align: center;
    }

    
`;

const ItemContent = styled.div`
    width: 100%;
    
    .detail {
        width: 100%;
        height: 60px;
        padding-left: 15px;
        padding-right: 15px;
        border-top: 1px solid #e9ecef;
        display: flex;
        justify-cotent: space-between;
        align-items: center;

        &.toggle {
            border-top: none;
        }
    }

    .detailLeft {
        width: 90%;
        display: flex;
        justify-cotent: flex-start;
        align-items: center; 
    }

    .detailText {
        font-weight: 600;

        &.toggle {
            color: #1967D2;
        }

        &.reset {
            color: #adb5bd;
        }
        margin-right: 15px;
    }

    .detailRight {
        width: 10%;
        text-align: right;
    }

    .toggleIcon {
        color: #1967D2;
        font-size: 32px;
    }

    .helpIcon {
        color: #adb5bd;
        font-size: 24px;
        cursor: pointer;

        &.reset {
            font-size: 26px;
        }

        :hover {
            color: #495057;
        }
    }
`;

const DetailButton = styled.div`
    cursor: pointer;

    :hover {
        background: #E8F0FE;
    }
    
`;

const DetailSetting = styled.div`
    display: none;
    ${props => props.isSettingOpen && `
        display: block;
    `}
    ${props => !props.isSettingOpen && `
        display: none;
    `}

    .detailInput {
        text-align: right;
        padding-right: 5px;
        width: 100px;
        border: 1px solid #AECBFA;
        font-size: 14px;
        :focus {
            outline: none !important;
            border: 2px solid #1967D2;
        }
    }
`;


