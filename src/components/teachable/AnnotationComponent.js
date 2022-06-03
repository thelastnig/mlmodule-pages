import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import CreateIcon from '@material-ui/icons/Create';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const AnnotationComponent = (props) => {
    const history = useHistory();
    
    const { detection_list } = useHandleState();
    const { reorderClass, changeClassName } = useStateActionHandler();
    
    const [isSettingOpen, setIsSettingOpen] = useState(false);

    const isDetectionData = detection_list[0].data.length > 0 ? true : false;

    const handleButtonClick = (url) => {
        if (isDetectionData) {
            history.push(url);
        } else {
            return;
        }
	};

	return (
        <TrainItem>
            <ItemHeader>
                <HeaderText>
                    <CreateIcon className='headerIcon'></CreateIcon>
                    <div className='headerText'>Annotation</div>
                </HeaderText>
                <HeaderContent isDetectionData={isDetectionData}>
                    <div className='headerContentText' onClick={() => handleButtonClick('/annotation')}>Annotation</div>
                </HeaderContent>
                <UploadContent>
                    <div className='headerContentText'>Upload Annotation File</div>
                </UploadContent>
            </ItemHeader>
            {/* <ItemContent>
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
            </ItemContent> */}
        </TrainItem>
    );                                  
};

export default AnnotationComponent;

const TrainItem = styled.div`
    width: 300px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const ItemHeader = styled.div`
    width: 100%;
    padding: 15px;
    border-bottom: 1px solid ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    display: flex;
    flex-direction: column;
    justify-cotent: space-between;
`;

const HeaderText = styled.div`
    height: 42px;
    display: flex;
    justify-cotent: center;

    .headerIcon {
        margin-right: 5px;
        font-size: 20px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    }

    .headerText { 
        font-size: 14px;
        color: white;
        font-weight: 600;
    }
`;

const HeaderContent = styled.div`
    height: 42px;
    background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    color: white;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-cotent: center;
    align-items: center;


    ${props => !props.isDetectionData && ` 
        cursor: default;
    `};

    ${props => props.isDetectionData && ` 
        cursor: pointer;
        :hover {
            background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
        }
    `};

    .headerContentText {
        width: 100%;
        text-align: center;
    }
`;

const UploadContent = styled.div`
    height: 42px;
    color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    font-size: 14px;
    font-weight: 600;
    display: flex;
    justify-cotent: center;
    align-items: center;
    margin-top: 20px;
    border: 1px ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR} solid;
    cursor: pointer;
    :hover {
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
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


