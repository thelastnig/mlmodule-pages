import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import { colors } from 'styles';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { useCommonState } from 'store/common/hooks';
import { dialogList } from 'constants/dialog';
import FormatUtil from 'utils/FormatUtil';
import { useAlertAction } from 'store/alert/hooks';

import { useHandleState, useStateActionHandler } from 'store/dataset/hooks';

import LocalStorageManager from 'utils/LocalStorageManager';
import UploadProgress from 'utils/FileUpload/UploadProgress';

import { BACKGROUND_JOB_TYPE } from 'constants/common';

const DataMerge = ({
    onMergeData,
    tabType,
}) => {
    const { dialogName } = useDialogState();
    const { hideDialog } = useDialogAction();
    const isShow = dialogName === dialogList.DATA_MERGE;    

    const { showAlert } = useAlertAction();

    const { backgroundJobList } = useCommonState();

    const { selectedMergeDataList } = useHandleState();
    const { mergeData } = useStateActionHandler();

    const [mergeDataNm, setMergeDataNm] = useState('');
    const [progress, setProgress] = useState(0);

    const childRef = useRef();	

    const onChangeDataNm = (e) => {
        const value = FormatUtil.excludeSpecialChar(e.target.value);
        setMergeDataNm(value);
    };

    const onConfirmClicked = () => {
        if(backgroundJobList && backgroundJobList.length > 0 && backgroundJobList.includes(BACKGROUND_JOB_TYPE.DATA_MERGE)) {
            showAlert({
				message: '이미 데이터 병합 작업 진행중입니다.',
			});
			return;
        }

        if(!selectedMergeDataList || selectedMergeDataList.length <= 1) {
            showAlert({
				message: '병합할 데이터가 없습니다.',
			});
			return;
        }

        if(selectedMergeDataList.length > 3) {
            showAlert({
				message: '병합 가능 최대 개수는 3개 입니다.',
			});
			return;
        }

        if(!mergeDataNm || mergeDataNm.trim() === '') {
            showAlert({
				message: '병합 데이터셋 이름을 입력하세요.',
			});
			return;
        }

        if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(mergeDataNm)) {
            showAlert({
				message: '병합 데이터셋 이름에 한글을 사용할 수 없습니다.',
			});
			return;
        }
        
        const datasetIds = [];
        
        selectedMergeDataList.forEach(data => {
            datasetIds.push(data.dataset_id);
        });

        const params = {
            project_id: LocalStorageManager.getLoadedProjectId(),
            merged_name: mergeDataNm,
            dataset_ids: datasetIds,
            dataset_auth: tabType === 'P' ? 'Y' : 'N',
            show_status: 1,
            shared_status: 0,
            noSpinner: true,
        };

        mergeData(params);

        setMergeDataNm('');
        hideDialog();
        onMergeData();

        // const formData = new FormData();
        // formData.append('project_id', LocalStorageManager.getLoadedProjectId());
        // formData.append('merged_name', mergeDataNm);
        // formData.append('dataset_ids', datasetIds);
        // formData.append('dataset_auth', tabType === 'P' ? 'Y' : 'N');
        // formData.append('show_status', 1);
        // formData.append('shared_status', 0);
        // formData.append('noSpinner', true);

        // agent.mergeData(formData, (event) => {
        //     // console.log(Math.round((100 * event.loaded) / event.total));
        //     // setProgress(Math.round((100 * event.loaded) / event.total));
        // })
        //     .then(response => {
        //         showAlert({
		// 			message: '데이터 병합이 완료되었습니다.',
        //             onOk: onClickClose,
		// 		});
        //     })
        //     .catch(error => {
        //         showAlert({
		// 			message: (error && error.data && error.data.detail) ? error.data.detail : '데이터 병합에 실패하였습니다.',
		// 		});
        //         setProgress(0);
        //     });
	};

    // const onClickClose = () => {
    //     setMergeDataNm('');
    //     setProgress(0);
    //     hideDialog();
    //     onMergeData();
    // };

    useEffect(()=>{
        if(childRef && childRef.current && childRef.current.setProgress) {
            console.log('progress = ', progress)
		    childRef.current.setProgress(progress)
        }		
	},[progress]);

    return (
        <div>
			<Dialog
				className={'data_merge_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Merge Data'} toggle={hideDialog} />
				<DialogContent>
					<SubTitle>병합 데이터</SubTitle>
                    <DataListTxt>
                        {
                            selectedMergeDataList.map((data, index) => {
                                const isLast = selectedMergeDataList.length-1 === index;
                                return (
                                    <>
                                        {data.dataset_nm}
                                        {!isLast && ' + '}
                                    </>
                                );
                            })
                        }
                    </DataListTxt>
                    <SubTitle>병합 데이터셋의 이름을 입력해 주세요.</SubTitle>
                    <CustomInput placeholder={'Merge Dataset name을 입력해주세요.'} value={mergeDataNm} onChange={onChangeDataNm} maxLength="40" />
                    <div style={{
                            marginBottom: "60px",
                        }}>
                        {progress > 0 && (                        
                            <UploadProgress ref={childRef} />                        
                        )}  
                    </div>                  
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} confirmTitle={'Merge'} />                
			</Dialog>
		</div>
    );
};

const DialogContent = styled.div`
	padding: 24px 24px;	
`;

const SubTitle = styled.div`
    font-size: 16px;
    font-weight: 500;
    color: ${colors.bg_black};
    letter-spacing: -0.4px;
    margin-bottom: 10px;    
`;

const DataListTxt = styled.div`
    font-size: 14px;
    font-weight: 500;    
    letter-spacing: -0.3px;
    color: ${colors.bg_black};
    padding: 15px;
    border-radius: 2px;
    background-color: ${colors.list_header};
    text-align: center;
    margin-bottom: 15px;
`;

const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_default};
	:focus {
		border: 1px solid #005cb5;
	}
	outline: none;
    margin-bottom: 20px;
`;

export default DataMerge;