import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import LabelIcon from '@material-ui/icons/Label';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import NormalIcon from 'assets/icon/correct.png';
import ClassIcon from '@material-ui/icons/Class';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const colorList = [ 
    {'name': 'orange', 'valueColor': '#E67701', 'wrapperColor': '#FFECE2'},
    {'name': 'pink', 'valueColor': '#D84C6F', 'wrapperColor': '#FFE9EC'},
    {'name': 'purple', 'valueColor': '#794AEF', 'wrapperColor': '#F1F0FF'},
    {'name': 'blue', 'valueColor': '#1967D2', 'wrapperColor': '#D2E3FC'},
];


const AnnotationDataComponent = (props) => {
    
    const { detection_list } = useHandleState();
    const { annotationIndex, 
        annotationData, 
        handleClickAnnotationDelete,
        annotationTags,
        setAnnotationTags,
        setAnnotationTag
    } = props;


    const annotationDataList = annotationData.map((data, index) => {

        // const x = data.mark.x.toFixed(1);
        // const y = data.mark.y.toFixed(1);
        // const width = data.mark.width.toFixed(1);
        // const height = data.mark.height.toFixed(1);

        return (   
            <AnnotationDataWrapper key={index} index={index} onClick={() => handleClickAnnotationDelete(data.id)}>
                <div className='index'>#{index + 1}</div>
                <div className='label'>
                    <LabelIcon className='labelIcon'/>
                    <div className='labelText'>{data.comment}</div>
                </div>
                {/* <div className='Mark'>x: {x} y: {y} width: {width} height: {height}</div> */}
                <div className='delete'><DeleteOutlinedIcon className='deleteIcon'/></div>
            </AnnotationDataWrapper>
        );    
    });

    const tags = annotationTags.map((tag, index) => {
        const colorIndex = index % colorList.length;
        const colorClass =  colorList[colorIndex].name;

        return (
            <div className={'tag ' + colorClass} key={index} onClick={() => setAnnotationTag(tag)}>{tag}</div>
        )
    });

	return (
        <>
        <TagWrapper>
            <TagViewer>
            <div className='infoWrapper'>
                <LocalOfferIcon className='icon'></LocalOfferIcon>
                <div className='title'>Tags</div>
            </div>
            <div className='tagWrapper'>    
                {tags}
            </div>
            </TagViewer>
        </TagWrapper>
        <FileWrapper>
            <FileViewer>
            <div className='infoWrapper'>
                <ClassIcon className='icon'></ClassIcon>
                <div className='title'>Labels</div>
            </div>
            <div className='tableWrapper'>    
                <div className='tableHeader'>
                    <div className='index'>Index</div>
                    <div className='label'>Label</div>
                    {/* <div className='Mark'>Status</div> */}
                    <div className='delete'>Delete</div>
                </div>
                {
                annotationData.length === 0
                ?
                <FileNull><div className='nullText'>No Label</div></FileNull>
                :
                annotationDataList
                }
            </div>
            </FileViewer>
        </FileWrapper>
        </>
	);
};

export default AnnotationDataComponent;


const TagWrapper = styled.div`
    margin-top: 30px;
    padding: 12.5px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;


const TagViewer = styled.div`
    width: 100%;
    height: 100px;

    .infoWrapper {
        width: 100%;
        height: 30px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .icon {
            font-size: 22px;
        }
    
        .title {
            margin-left: 10px;
            font-size: 14px;
            font-weight: 600;
        }
    }

    .tagWrapper {
        margin-top: 5px;
        height: 65px;
        overflow-y: auto;
        display: flex;
        justify-content: flex-start;
        align-content: flex-start;
        flex-wrap: wrap;

        .tag {
            padding: 2px 10px;
            color: white;
            font-size: 12px;
            font-weight: 600;
            margin-right: 15px;
            margin-bottom: 10px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 999;

            &.orange {
                background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
            }
            &.pink {
                background: ${colorList[1].valueColor};
            }
            &.purple {
                background: ${TEACHABLE_COLOR_LIST.PURPLE};
            }
            &.blue {
                background: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
            }
        }
    }

    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #899095;
        border-radius: 7px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: ${TEACHABLE_COLOR_LIST.GRAY};
        border-radius: 7px;
    }
`;


const FileWrapper = styled.div`
    margin-top: 30px;
    padding: 12.5px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const FileNull = styled.div`
    width: 100%;
    height: 130px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};
    color: ${TEACHABLE_COLOR_LIST.GRAY};
    display: flex;
    justify-content: center;
    align-items: center;

`;

const FileViewer = styled.div`
    width: 100%;
    height: 210px;

    .infoWrapper {
        width: 100%;
        height: 30px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .icon {
            font-size: 22px;
        }
    
        .title {
            margin-left: 10px;
            font-size: 14px;
            font-weight: 600;
        }
    }

    .tableWrapper {
        height: 172px;
        overflow-y: auto;
    }

    .tableHeader {
        width: 100%;
        height: 42px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 11px;
        font-weight: 600;
        color: ${TEACHABLE_COLOR_LIST.GRAY};
        text-align: center;

        .index {
            width: 20%;
        }
        .label {
            width: 60%;
            text-align: left;
        }
        .delete {
            width: 20%;
        }
    }

    ::-webkit-scrollbar {
        width: 7px;
    }
    ::-webkit-scrollbar-thumb {
        background-color: #899095;
        border-radius: 7px;
        background-clip: padding-box;
    }
    ::-webkit-scrollbar-track {
        background-color: ${TEACHABLE_COLOR_LIST.GRAY};
        border-radius: 7px;
    }
`;

const AnnotationDataWrapper = styled.div`
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: white;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};

    ${props => (props.index % 2 === 1) && `
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    `}

    .index {
        width: 20%;
        text-align: center;
        font-size: 11px;
        word-break:break-all; 
        line-height: 1.1;
    }

    .label {
        width: 60%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .labelIcon {
            width: 15px;
            height: 15px;
            margin-right: 10px;
            color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
        }
        .labelText {
            text-align: left;
        }
    }

    .delete {
        width: 20%;
        text-align: center;

        .deleteIcon {
            cursor: pointer;

            &:hover {
                color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
            }
        }
    }

`;





