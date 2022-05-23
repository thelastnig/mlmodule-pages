import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import NormalIcon from 'assets/icon/correct.png';

const AnnotationFileViewerComponent = (props) => {
    
    const { list } = useHandleState();
    const { id, data, handleClickNext } = props;

    const dataList = data.map((data, index) => {
        if (typeof data == "undefined" || data == null || !Object.keys(data).includes('data_type')) {
            return null;
        } else {
            if (data.data_type === 'webcam' || data.data_type === 'drive') {
                return (   
                    <ImageWrapper key={index} index={index} onClick={() => handleClickNext(index)}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.file_name}/>
                        </div>
                        <div className='fileName'>{data.file_name}</div>
                        <div className='fileStatus'><div className='statusIcon'></div></div>
                        <div className='fileSource'>{data.data_type}</div>
                    </ImageWrapper>
                );
            } else if (data.data_type === 'local') {
                return (
                    <ImageWrapper key={index} index={index} onClick={() => handleClickNext(index)}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.name}/>
                        </div>
                        <div className='fileName'>{data.name}</div>
                        <div className='fileStatus'><div className='statusIcon'></div></div>
                        <div className='fileSource'>{data.data_type}</div>
                    </ImageWrapper>
                );   
            } else {
                return null;
            }
        }
    });

	return (
        <>
            <FileNumViewer>
            {
                dataList.length === 0
                ?
                null
                :
                    dataList.length === 1
                    ?
                    <p>{dataList.length} file</p> 
                    :
                    <p>{dataList.length} files</p> 
            }
            </FileNumViewer>
            {
                dataList.length === 0
                ?
                <FileNull>No Data</FileNull>
                :
                <FileViewer>
                <div className='tableHeader'>
                    <div className='headerFile'>File</div>
                    <div className='headerName'>Name</div>
                    <div className='headerStatus'>Status</div>
                    <div className='headerSource'>Source</div>
                </div>
                {dataList}
                </FileViewer>
            }
        </>
	);
};

export default AnnotationFileViewerComponent;

const FileNumViewer = styled.div`
    width: 100%;
    height: 24px;
    font-size: 12px;
    font-weight: 600;
    color: white;

`;

const FileNull = styled.div`
    width: 100%;
    margin-top: 180px;
    text-align: center;
    font-size: 11px;
    font-weight: 600;
    color: ${TEACHABLE_COLOR_LIST.GRAY};
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

        .headerFile{
            width: 18%;
        }
        .headerName{
            width: 50%;
            text-align: left;
        }
        .headerStatus{
            width: 15%;
            text-align: left;
        }
        .headerSource{
            width: 17%;
            color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
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

const ImageWrapper = styled.div`
    width: 100%;
    height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    color: white;
    cursor: pointer;
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};

    ${props => (props.index % 2 === 1) && `
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    `}

    &:hover {
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_LIGHT};
    }

    .innerWrapper {
        width: 18%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fileName {
        width: 50%;
        text-align: left;
        font-size: 11px;
        word-break:break-all; 
        line-height: 1.1;
    }

    .fileStatus {
        width: 15%;
        display: flex;
        justify-content: center;
        align-items: center;
        .statusIcon {
            width: 15px;
            height: 15px;
            background: url(${NormalIcon});
            background-repeat : no-repeat;
            background-size : cover;
        }
    }

    .fileSource {
        width: 17%;
        text-align: center;
        color: ${TEACHABLE_COLOR_LIST.GRAY};
    }

    img {
        width: 35px;
        height: 35px;
    }
`;





