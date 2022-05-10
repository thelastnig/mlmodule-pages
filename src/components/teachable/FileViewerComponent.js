import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';
import NormalIcon from 'assets/icon/correct.png';

const FileViewerComponent = (props) => {
    
    const { list } = useHandleState();
    const { deleteImage } = useStateActionHandler();
    const { id, data, isUploadOpen } = props;

    const clickDeleteButton = (index) => {
        const changedList = list.map((item) => {
            if (item.id === id) {
                let new_data = item.data.slice();
                new_data.splice(index, 1);
                return {
                    ...item,
                    data: new_data
                };
            } else {
                return item;
            }
        })
        deleteImage({
            list: changedList
        });
    };

    const clickPlayButton = (audioURL) => {
        const audio = new Audio(audioURL);
        audio.play();
    }

    const dataList = data.map((data, index) => {
        if (typeof data == "undefined" || data == null || !Object.keys(data).includes('data_type')) {
            return null;
        } else {
            if (data.data_type === 'webcam' || data.data_type === 'drive') {
                console.log(data);
                return (   
                    <ImageWrapper key={index} index={index}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.file_name}/>
                        </div>
                        <div className='fileName'>{data.file_name}</div>
                        <div className='fileStatus'><div className='statusIcon'></div></div>
                        <div className='fileSource'>{data.data_type}</div>
                        <DeleteOutlinedIcon className='deleteIcon' onClick={() => clickDeleteButton(index)}/>
                    </ImageWrapper>
                );
            } else if (data.data_type === 'local') {
                console.log(data);
                return (
                    <ImageWrapper key={index} index={index}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.name}/>
                        </div>
                        <div className='fileName'>{data.name}</div>
                        <div className='fileStatus'><div className='statusIcon'></div></div>
                        <div className='fileSource'>{data.data_type}</div>
                        <DeleteOutlinedIcon className='deleteIcon' onClick={() => clickDeleteButton(index)}/>
                    </ImageWrapper>
                );   
            } else if (data.data_type === 'recorder') {
                return (
                    <ImageWrapper key={index} index={index}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.file_name}/>
                            <DeleteOutlinedIcon className='deleteIcon' onClick={() => clickDeleteButton(index)}/>
                            <PlayArrowOutlinedIcon className='playIcon' onClick={() => clickPlayButton(data.audioURL)}/>
                        </div>
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
                <FileNull isUploadOpen={isUploadOpen}>No Data</FileNull>
                :
                <FileViewer isUploadOpen={isUploadOpen}>
                <div className='tableHeader'>
                    <div className='headerFile'>File</div>
                    <div className='headerName'>Name</div>
                    <div className='headerStatus'>Status</div>
                    <div className='headerSource'>Source</div>
                    <div className='headerDelete'></div>
                </div>
                {dataList}
                </FileViewer>
            }
        </>
	);
};

export default FileViewerComponent;

const FileNumViewer = styled.div`
    width: 100%;
    height: 24px;
    font-size: 12px;
    font-weight: 600;
    color: white;

`;

const FileNull = styled.div`
    width: 100%;
    ${props => props.isUploadOpen && `
        margin-top: 180px;
    `}

    ${props => !props.isUploadOpen && `
        margin-top: 80px;
    `}
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
            width: 43%;
            text-align: left;
        }
        .headerStatus{
            width: 12%;
            text-align: left;
        }
        .headerSource{
            width: 17%;
            color: ${TEACHABLE_COLOR_LIST.HEAVY_MAIN_COLOR};
        }
        .headerDelete{
            width: 10%;
        }


    }

    ${props => props.isUploadOpen && `
        height: 390px;
    `}

    ${props => !props.isUploadOpen && `
        height: 210px;
    `}

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
    background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_HARD};

    ${props => (props.index % 2 === 1) && `
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
    `}

    .playIcon {
        display: none;
        font-size: 29px;
        color: white;
        position: absolute;
        top: 26px;
        left: 0px;
    }

    .innerWrapper {
        width: 18%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .fileName {
        width: 43%;
        text-align: left;
    }

    .fileStatus {
        width: 12%;
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

    .deleteIcon {
        width: 10%;
        font-size: 22px;
        color: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};
    }

    img {
        width: 35px;
        height: 35px;
    }
`;





