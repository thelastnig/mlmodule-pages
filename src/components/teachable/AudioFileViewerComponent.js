import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import PlayArrowOutlinedIcon from '@material-ui/icons/PlayArrowOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


const AudioFileViewerComponent = (props) => {
    
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
                return (
                    <ImageWrapper key={index}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.file_name}/>
                            <DeleteOutlinedIcon className='deleteIcon' onClick={() => clickDeleteButton(index)}/>
                        </div>
                    </ImageWrapper>
                );
            } else if (data.data_type === 'local') {
                return (
                    <ImageWrapper key={index}>
                        <div className='innerWrapper'>
                            <img src={data.base64} alt={data.name}/>
                            <DeleteOutlinedIcon className='deleteIcon' onClick={() => clickDeleteButton(index)}/>
                        </div>
                    </ImageWrapper>
                );   
            } else if (data.data_type === 'recorder') {
                return (
                    <ImageWrapper key={index}>
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
                    {dataList}
                </FileViewer>
            }
        </>
	);
};

export default AudioFileViewerComponent;


const FileNumViewer = styled.div`
    width: 90%;
    margin: 0 auto;
    height: 24px;
    font-size: 12px;
    font-weight: 600;
    color: white;
`;

const FileViewer = styled.div`
    width: 90%;
    margin: 0 auto;
    height: 210px;
    overflow-y: auto;
    display: flex;
    justify-content: flex-start;
    align-content: flex-start;
    flex-wrap: wrap;

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

const FileNull = styled.div`
    width: 100%;
    ${props => props.isUploadOpen && `
        margin-top: 180px;
    `}
    ${props => !props.isUploadOpen && `
        margin-top: 80px;
    `}
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: ${TEACHABLE_COLOR_LIST.GRAY};
`;

const ImageWrapper = styled.div`
    margin-bottom: 5px;
    margin-right: 5px;
    position: relative;

    .innerWrapper {
        width: 100%;
        height: 100%;

        .deleteIcon {
            display: none;
            font-size: 26px;
            color: white;
            position: absolute;
            top: 2px;
            left: 1px;
        }

        .playIcon {
            display: none;
            font-size: 29px;
            color: white;
            position: absolute;
            top: 26px;
            left: 0px;
        }
    }

    .innerWrapper:hover {
        width: 100%;
        height: 100%;

        .deleteIcon {
            display: block;
            font-size: 26px;
            color: white;
            position: absolute;
            top: 2px;
            left: 1px;
        }

        .playIcon {
            display: block;
            font-size: 29px;
            color: white;
            position: absolute;
            top: 26px;
            left: 0px;
        }
    }

    img {
        width: 55px;
        height: 55px;
        border-radius: 5px;
    }
`;