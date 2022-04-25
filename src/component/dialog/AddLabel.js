import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';

import { useDropzone } from 'react-dropzone';

import { colors } from 'styles';
import 'views/dataset.scss';
import agent from 'lib/apis';
import closeIcon from 'assets/icon/btn-close-n.png';

import Spacer from 'components/spacer';
import { dropZoneStyle, ZIP_MIME_TYPE } from 'components/common/UploadComponent';
import { DataSetContext } from 'views/dataSet';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import Tooltip from 'components/common/Tooltip';

export default function DlgAddLabel(props) {
	const { data, setShowAnnotation } = props;
	const { dialogName } = useDialogState();
	const { showDialog, hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.DATA_ADD_LABEL;

	const onAnnotationClicked = (e) => {
		setShowAnnotation(data);
		showDialog(dialogList.DATA_SELECT_ANNOTATOR);
	};

	return (
		<div>
			<Dialog
				className={'modal_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}>
				<CloseBtnArea>
					<CloseBtn onClick={hideDialog}>
						<img src={closeIcon} alt="" />
					</CloseBtn>
				</CloseBtnArea>
				<Title>Message</Title>
				<DialogContent>Label을 추가할 방법을 선택하세요.</DialogContent>
				<DialogFooterComponent annotationClick={onAnnotationClicked} uploadClick={hideDialog} data={data} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	height: 110px;
	width: 200px;
	margin: 16px 50px 50px 60px;
	font-size: 15px;
	font-weight: 500;
	line-height: 1.33;
	letter-spacing: -0.3px;
	text-align: center;
	color: ${colors.text_black};
`;
const Title = styled.div`
	margin-top: 10px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 27px;
	font-size: 20px;
	font-weight: bold;
	letter-spacing: -0.5px;
	color: ${colors.text_black};
`;

function DialogFooterComponent(props) {
	const { annotationClick, uploadClick, data } = props;
	const [selectFile, setSelectFile] = useState('');
	const [showAnnotatorBtn, setShowAnnotatorBtn] = useState(true);

	const { fetchList } = useContext(DataSetContext);

	/*
https://smr.snu.ac.kr:30002/issues/1746#change-11873
3) response 중 "state": 0 이고, **"model": "MDSS"**인 경우,
Add Label 클릭시 팝업은 정상적으로 띄우지만,
**Upload 버튼을 통한 직접 업로드만 가능하고 annotation 은 불가능하도록 버튼 비활성화**
*/
	useEffect(() => {
		if (data.model === 'MDSS') {
			setShowAnnotatorBtn(false);
		} else {
			setShowAnnotatorBtn(true);
		}
	}, [data]);

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		setSelectFile(acceptedFiles[0]);
	}, []);

	const uploadLabel = () => {
		let formData = new FormData();
		formData.append('dataset_id', data.dataset_id);
		formData.append('labels', selectFile);

		agent
			.addLabel(formData)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		if (selectFile) {
			uploadLabel();
			uploadClick();
		}
	}, [selectFile]);
	const {
		// acceptedFiles,
		// fileRejections,
		getRootProps,
		getInputProps,
		open,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		accept: ZIP_MIME_TYPE,
		onDrop,
		noClick: true,
		noKeyboard: true,
		noDrag: true,
		multiple: false,
	});
	const style = useMemo(
		() => ({
			...dropZoneStyle,
		}),
		[isDragActive, isDragReject, isDragAccept],
	);
	return (
		<>
			<DialogFooterWrapper>
				<ConfirmBtn
					// onClick={e => uploadClick()}
					onClick={open}
					data-tip
					data-for={'label_upload_tootip'}
				>
					Upload
					<Tooltip id={'label_upload_tootip'} text={'Annotation이 완료된 Label 파일을 업로드합니다.'}/>
				</ConfirmBtn>				
				<div
					{...getRootProps({
						className: 'dropzone',
						style,
					})}
				>
					<input {...getInputProps()} />
				</div>
				{showAnnotatorBtn && (
					<>
						<Spacer />
						<ConfirmBtn 
							onClick={(e) => annotationClick()}
							data-tip
							data-for={'label_annotator_tootip'}
						>
							Annotator
							<Tooltip id={'label_annotator_tootip'} text={'데이터에 Annotation을 할 작업자를 선택합니다.'}/>
						</ConfirmBtn>
					</>
				)}
			</DialogFooterWrapper>
		</>
	);
}

const DialogFooterWrapper = styled.div`
	width: 100%;
	height: 64px;
	padding: 12px 12px 12px 12px;
	background-color: #f0f1f3;
	text-align: right;
	display: flex;
	justify-content: center;
`;
const ConfirmBtn = styled.div`
	display: inline-block;
	width: 144px;
	height: 40px;
	border-radius: 2px;
	background: ${colors.light_blue};
	font-size: 16px;
	font-weight: 500;
	color: ${colors.text_white};
	text-align: center;
	line-height: 40px;
	cursor: pointer;
`;
const CloseBtnArea = styled.div`
	width: 100%;
	display: flex;
	justify-content: flex-end;
	padding: 16px;
`;
const CloseBtn = styled.div`
	width: 20px;
	height: 20px;
	cursor: pointer;
`;
