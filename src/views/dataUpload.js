import React, { createContext, useCallback, useMemo, useState, useRef, useEffect, useImperativeHandle } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';

import { colors } from 'styles';
import './dataset.scss';
import { PROJECT_TYPE } from 'constants/common';
import agent from 'lib/apis';
import LocalStorageManager from 'utils/LocalStorageManager';
import Cloud from 'assets/icon/icon-cloud-n.png';

import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import {
	useStateActionHandler as useProjectStateActionHandler,
	useHandleState as useProjectHandleState,
} from 'store/project/hooks';
// import { useStateActionHandler, useHandleState } from 'store/dataset/hooks';
import { dialogList } from 'constants/dialog';

import Spacer from 'components/spacer';
import { PageWrapper, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import Button from 'component/Button';
import { CSV_MIME_TYPE, dropZoneStyle, ZIP_MIME_TYPE } from 'components/common/UploadComponent';
import SharedDatasetList from 'component/dialog/SharedDatasetList';
import DataUploadTable from 'components/dataSet/dataUploadTable';
import DataUploadSetInfo from 'components/dataSet/dataUploadSetInfo';
import { ROUTER_DATASET } from 'components/layout/MenuConst';
import DataUploadSharedTable from 'components/dataSet/dataUploadSharedTable';
import UploadService from 'services/FileUploadService';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUploadProgress from 'utils/FileUpload/FileUploadProgress';
import ListParamMaker from 'utils/ListParamMaker';
import { SET_START_SUCCESS } from 'store/experiments/reducer';
import { list_header } from 'styles/colors';
import Popup from 'utils/FileUpload/FileUploadStatus';
// import 'utils/popup.css';

export const DataUploadContext = createContext(null);
const DataUpload = () => {
	const history = useHistory();
	const { showAlert } = useAlertAction();
	const { loadProjectType } = useCommonState();
	const [uploadFiles, setUploadFiles] = useState([]);
	const [labelFile, setLabelFile] = useState(''); // xml, json 파일
	const [isPrivate, setIsPrivate] = useState(true); // private / shared
	const [dataset_name, change_dataset_name] = useState('');
	const [sharedItem, setSharedItem] = useState('');
	const isTabular = useMemo(() => loadProjectType !== PROJECT_TYPE.IMAGE);
	const { showDialog } = useDialogAction();
	const [progress, setProgress] = useState(0);
	const { onFetchProjectsListCallback, onInitDataCB, onCallGetProgressStatus } = useProjectStateActionHandler();
	const [key, setKey] = useState();
	const { status } = useProjectHandleState();
	const [showPopup, setShowPopup] = useState(false);

	function useInterval(callback, delay) {
		const savedCallback = useRef();
		useEffect(() => {
			savedCallback.current = callback;
		}, [callback]);

		useEffect(() => {
			function call_callback() {
				// console.log('call_callback');
				savedCallback.current();
			}
			if (delay != null) {
				const id = setInterval(call_callback, delay);
				return () => {
					clearInterval(id);
				};
			}
		}, [callback, delay]);
	}

	React.useEffect(() => {
		console.log('progress = ', progress);
		childRef.current.setProgress(progress);
	}, [progress]);

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		if (fileRejections.length < 1) {
			setSharedItem('');
			setUploadFiles(acceptedFiles);
		} else {
			let message = '';
			if (isTabular) {
				message = '확장자 zip 또는 csv 파일만 업로드 가능합니다.';
			} else {
				message = 'png, jpg/jpeg 파일만 업로드 가능합니다.';
			}
			showAlert({
				message: message,
			});
		}
	}, []);

	const { getRootProps, getInputProps, open, isDragActive, isDragAccept, isDragReject } = useDropzone({
		// accept: !isTabular ? ZIP_MIME_TYPE : CSV_MIME_TYPE,
		accept: isTabular ? `${CSV_MIME_TYPE}, ${ZIP_MIME_TYPE}` : ZIP_MIME_TYPE,
		onDrop,
		noClick: (sharedItem || isTabular) && uploadFiles.length > 0,
		noKeyboard: isTabular,
		// noDrag: isTabular,
		multiple: !isTabular,
	});
	const style = useMemo(
		() => ({
			...dropZoneStyle,
		}),
		[isDragActive, isDragReject, isDragAccept],
	);

	const uploadDataset = () => {
		let formData = new FormData();
		formData.append('project_id', LocalStorageManager.getLoadedProjectId()); // sample image:52, tabular: 55
		formData.append('dataset_nm', dataset_name);
		formData.append('dataset_auth', isPrivate ? 'Y' : 'N'); // private: Y, shared: N
		formData.append('dataset_type', isTabular ? 'tabular' : 'image'); // image / tabular
		uploadFiles.forEach((file) => {
			formData.append('files', file);
		});
		if (labelFile) {
			formData.append('label_status', 1); // 라벨이 존재하면 1, 아니면 0
			formData.append('label_nm', labelFile.name);
			formData.append('labels', labelFile);
		} else {
			formData.append('label_status', 0); // 라벨이 존재하면 1, 아니면 0
		}
		formData.append('show_status', 1); // show_status : 항상 1로 전달
		if (sharedItem) {
			// shared_status shared tab에서 선택 했을 경우 1, Local을 선택 했을 경우 0
			formData.append('shared_status', 1);
			formData.append('shared_dataset_id', sharedItem.dataset_id);
		} else {
			formData.append('shared_status', 0);
		}
		formData.append('noErrorPopup', true);
		// let files = formData.get('files')
		UploadService.upload(formData, null, (event) => {
			console.log(Math.round((100 * event.loaded) / event.total));
			setProgress(Math.round((100 * event.loaded) / event.total));
		})
			.then((response) => {
				console.log('then response = ', response);
				console.log(response.data['key']);
				setKey(response.data['key']);
			})
			.then((files) => {})
			.catch((error) => {
				setProgress(0);
				let status = error.status;
				const msg_desc = error.response.data.detail;
				switch (status) {
					case 400:
						showDialog(dialogList.DATA_DOWNLOAD_ERROR_REPORT);
						break;
					default:
						showAlert({
							message: msg_desc ? msg_desc : error.statusText,
						});
						break;
				}
			});
	};
	const confirmClicked = () => {
		if (!isTabular && !labelFile && !sharedItem.label_status) {
			showAlert({
				message: 'Label 미등록시 Experiment를 수행 할 수 없습니다. \nDataset을 등록하시겠습니까?',
				isConfirm: true,
				onOk: uploadDataset,
			});
		} else {
			uploadDataset();
		}
	};
	const cancelClicked = () => {
		history.push('/' + ROUTER_DATASET);
	};

	const Store = useMemo(() => {
		return {
			dataset_name,
			change_dataset_name,
			isPrivate,
			setIsPrivate,
			sharedItem,
			setSharedItem,
			uploadFiles,
			setUploadFiles,
		};
	}, [
		dataset_name,
		change_dataset_name,
		isPrivate,
		setIsPrivate,
		sharedItem,
		setSharedItem,
		uploadFiles,
		setUploadFiles,
	]);

	const callGetProgressStatus = useCallback(() => {
		let params = {
			key: key,
		};
		onCallGetProgressStatus(params);
	});

	const _interval_process = async () => {
		if (key != null) {
			console.log('key=' + key);
			callGetProgressStatus();
			setShowPopup(true);
		} else {
			// console.log('key is empty');
		}
	};

	function Interval() {
		useInterval(_interval_process, 1000);
		return <div />;
	}

	React.useEffect(() => {
		console.log('status = ', status);
		if (key != null && status != null && status.includes("doesn't exist") == true) {
			setKey(null);
			setShowPopup(false);
			history.push('/' + ROUTER_DATASET);
		} else if (key != null && status != null) {
			var res = JSON.parse(status);
			console.log('error');
			if (res['result'] === 'failed') {
				if (res['download'] === 'true') {
					callGetProgressStatus();
					setShowPopup(false);
					showDialog(dialogList.DATA_DOWNLOAD_ERROR_REPORT);
				} else {
					showAlert({
						message: 'error is occurred as next : ' + res['error_message'],
					});
				}
			}
		}
	}, [status]);

	const childRef = useRef();
	return (
		<>
			<DataUploadContext.Provider value={Store}>
				<SharedDatasetList />
				<PageWrapper>
					<TitleComponent text={'Data'} />
					<SubTitleBox>{'New Dataset'}</SubTitleBox>
					<Content>
						<ContentArea>
							<Left>
								<BoxTitle>Dataset List</BoxTitle>
								<FileUploadProgress ref={childRef} />
								<Spacer size={'lg'} />
								<LabelUploadContents>
									<Button
										colorType={'gray'}
										size={'lowMedium'}
										onClick={open}
										tooltipText={'Dataset을 직접 업로드합니다.'}
									>
										Upload
									</Button>
									<Button
										colorType={'gray'}
										size={'lowMedium'}
										onClick={(e) => showDialog(dialogList.DATA_SHARED_LIST)}
										tooltipText={'공유된 Dataset을 사용합니다.'}
									>
										Shared
									</Button>
									<Spacer />
									<UploadGuideText>
										{isTabular
											? 'Upload시 csv 파일 1개 혹은 csv 파일 1개가 포함된 zip 파일을 선택해 주세요.'
											: 'Upload시 jpg/jpeg 또는 png 파일로 구성된 zip파일을 선택해 주세요.'}
									</UploadGuideText>
								</LabelUploadContents>
								<div
									{...getRootProps({
										className: 'dropzone',
										style,
										onClick: (event) => (uploadFiles.length > 0 ? event.stopPropagation() : ''),
									})}
								>
									{<input {...getInputProps()} />}

									{uploadFiles.length > 0 ? (
										<>
											<Spacer size={'lg'} />
											<DataUploadTable isImgMode={!isTabular} uploadFiles={uploadFiles} />
										</>
									) : sharedItem ? (
										<>
											<Spacer size={'lg'} />
											<DataUploadSharedTable />
										</>
									) : (
										<ImgDragAndDropArea>
											<img src={Cloud} width="60px" height="60px" alt="" />
											<Spacer size={'sm'} />
											Drag and drop a file here or, if you prefer..
										</ImgDragAndDropArea>
									)}
								</div>
							</Left>
							<Spacer size={'lg'} />
							<DataUploadSetInfo
								labelFile={labelFile}
								setLabelFile={setLabelFile}
								isPrivate={isPrivate}
								setIsPrivate={setIsPrivate}
								sharedItem={sharedItem}
							/>
						</ContentArea>
					</Content>
					<Spacer />
					<Spacer />
					<ButtonContainer>
						<Button colorType={'cancel'} size={'xsmall'} onClick={cancelClicked}>
							Cancel
						</Button>
						<Button colorType={'blue'} size={'xsmall'} onClick={confirmClicked} disabled={!dataset_name}>
							OK
						</Button>
					</ButtonContainer>
				</PageWrapper>
			</DataUploadContext.Provider>
			<Interval />
			{showPopup ? <Popup title="Data Upload Progress Status" status={status} /> : null}
		</>
	);
};

export default DataUpload;

const ImgDragAndDropArea = styled.div`
	width: 692px;
	height: 536px;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 4px;
	border: solid 1px ${colors.gray_default};
	background-color: ${colors.text_white};
	border-style: dashed;
	font-size: 14px;
	color: ${colors.gray_dark};
	flex-direction: column;
`;

const LabelUploadContents = styled.div`
	display: flex;
	height: 50px;
	padding: 10px 0;
`;

const ButtonContainer = styled.div`
	width: 1524px;
	margin-left: 64px;
	display: flex;
	justify-content: flex-end;
`;

const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

const Left = styled.div`
	width: 756px;
	height: 100%;
	display: flex;
	flex-direction: column;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const Content = styled.div`
	width: 100%;
	padding: 0px 64px 0px 64px;
	display: flex;
	justify-content: space-between;
`;

const ContentArea = styled.div`
	width: 100%;
	height: 676px;
	display: flex;
`;

const UploadGuideText = styled.div`
	width: 100%;
	font-size: 12px;
	color: red;
	margin: 5px;
	letter-spacing: -0.4px;
`;
