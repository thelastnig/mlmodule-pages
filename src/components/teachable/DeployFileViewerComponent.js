import React, { useCallback, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';


const DeployFileViewerComponent = (props) => {
    
    const { inferenceFile, type } = props;

    let data = null;

    if (type === 'inferenceFile') {
        if (inferenceFile !== null && Object.keys(inferenceFile).includes('data_type')) {
            if (inferenceFile.data_type === 'local') {
                data = <ImageWrapper ><img src={inferenceFile.inference_url} alt={inferenceFile.name}/></ImageWrapper>
            } else {
                data = <ImageWrapper ><img src={inferenceFile.inference_url} alt={inferenceFile.file_name}/></ImageWrapper>
            }
        }
    } else {
        if (inferenceFile !== null) {
            data = <ImageWrapper ><img src={inferenceFile} alt="detection result image"/></ImageWrapper>
        }

    }

	return (
        <FileViewer>
            {data}
        </FileViewer>
	);
};

export default DeployFileViewerComponent;


const FileViewer = styled.div`
    width: 100%;
    height: 250px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ImageWrapper = styled.div`
    width: 225px;
    height: 225px;

    img {
        width: 225px;
        height: 225px;
    }
`;





