import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import DialogTitleComponent from 'components/modal/DialogTitle';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

import UploadProgress from 'utils/FileUpload/UploadProgress';

const ProgressDialog = ({
    title,
    progress,
}) => {
    const { dialogName } = useDialogState();
    const { hideDialog } = useDialogAction();
    const isShow = dialogName === dialogList.PROGRESS_DLG;

    const childRef = useRef();

    useEffect(()=>{
        if(childRef && childRef.current && childRef.current.setProgress) {
            console.log('progress = ', progress)
		    childRef.current.setProgress(progress)
        }
        if(progress === 100) {
            hideDialog();
        }
	},[progress]);

    return (
        <div>
			<Dialog
				className={'data_merge_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
                <DialogTitleComponent title={title} toggle={hideDialog} />
                <DialogContent>
                    <UploadProgress ref={childRef} />
                </DialogContent>
            </Dialog>
        </div>
    );
};

const DialogContent = styled.div`
	padding: 24px 24px;	
`;

export default ProgressDialog;