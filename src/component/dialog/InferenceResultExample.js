import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import ImageDetection from 'assets/img/img-detection.png';

const InferenceResultExample = ({
    
}) => {
    const { dialogName } = useDialogState();
    const { hideDialog } = useDialogAction();
    const isShow = dialogName === dialogList.INFERENCE_RESULT_EXAMPLE;

    return (
        <div>
			<Dialog
				className={'inference_res_example_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'추론 결과 예시'} toggle={hideDialog} />
				<DialogContent>
                    <ImgResultExample src={ImageDetection} />
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} confirmTitle={'확인'} />
			</Dialog>
		</div>
    );
};

const DialogContent = styled.div`
	padding: 20px 20px;	
`;

const ImgResultExample = styled.img`
    width: 760px;
`;

export default InferenceResultExample;