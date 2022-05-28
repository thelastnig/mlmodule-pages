import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import LabelIcon from '@material-ui/icons/Label';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import NormalIcon from 'assets/icon/correct.png';


const AnnotationDataComponent = (props) => {
    
    const { list } = useHandleState();
    const { annotationIndex, annotationData, handleClickAnnotationDelete } = props;


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

	return (
        <FileWrapper>
            <FileViewer>
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
            </FileViewer>
        </FileWrapper>
	);
};

export default AnnotationDataComponent;

const FileWrapper = styled.div`
    margin-top: 30px;
    padding: 12.5px;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND};
`;

const FileNull = styled.div`
    width: 100%;
    height: 160px;
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
    overflow-y: auto;

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





