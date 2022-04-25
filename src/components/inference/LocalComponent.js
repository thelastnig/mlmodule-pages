import React, { useCallback, useState, useEffect, useMemo, useContext } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { colors } from 'styles';
import { PROJECT_TYPE } from 'constants/common';
import DeleteIcon from 'assets/icon/icon-delete.png';
import Cloud from 'assets/icon/icon-cloud-n.png';

import { useCommonState } from 'store/common/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Spacer from 'components/spacer';
import MoreLocalUpload from 'components/inference/MoreLocalUpload';
import { BottomArea } from 'components/common/StyledComponent';
import MiddleButtonsArea from 'components/inference/MiddleButtonsArea';
import { CSV_MIME_TYPE, dropZoneStyle, IMAGE_MIME_TYPE } from 'components/common/UploadComponent';
import LocalImageComponent from 'components/inference/LocalImageComponent';
import { CheckBoxHeader } from 'components/common/table/Checkbox';
import { InferenceContext } from 'views/Inference';
import LocalTabular from 'components/inference/LocalTabular';
import ResultTabluar from 'components/inference/ResultTabular';

const LocalComponent = (props) => {
	const { startInferenceClicked } = props;
	const { showAlert } = useAlertAction();
	const { loadProjectType } = useCommonState();

	const [checkItems, setCheckItems] = useState([]);
	const [isFolder, setIsFolder] = useState(0);
	const isTabular = useMemo(() => loadProjectType !== PROJECT_TYPE.IMAGE);
	const { isRunning, uploadFiles, setUploadFiles, before_local_dataset } = useContext(InferenceContext);

	const deleteClicked = () => {
		let items = uploadFiles.filter(function (v) {
			return !checkItems.includes(v);
		});
		setUploadFiles(items);
		setCheckItems([]);
	};

	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		setIsFolder(0);
		if (fileRejections.length < 1) {
			if (isTabular) {
				setUploadFiles(acceptedFiles);
			} else {
				setUploadFiles((prev) => {
					// return [...prev, acceptedFiles]
					return prev.concat(acceptedFiles);
				});
			}
		} else {
			let message = 'png, jpg 파일만 업로드 가능합니다.';
			if (isTabular) {
				message = '한개의 csv 파일만 업로드 가능합니다.';
			}
			showAlert({
				message: message,
			});
		}
	}, []);
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
		accept: !isTabular ? IMAGE_MIME_TYPE : CSV_MIME_TYPE,
		onDrop,
		// noClick: !isImgMode && uploadFiles.length > 0,
		// noKeyboard: !isImgMode,
		// noDrag: !isImgMode,
		// multiple : isImgMode,
	});
	const style = useMemo(
		() => ({
			...dropZoneStyle,
			textAlign: 'center',
		}),
		[isDragActive, isDragReject, isDragAccept],
	);

	useEffect(() => {
		if (isFolder > 0) {
			open();
			setIsFolder(0);
		}
	}, [isFolder]);

	return (
		<>
			<WhiteBox>
				{isRunning ? (
					<>
						{uploadFiles.length > 0 || before_local_dataset ? (
							<>
								<ContentWrapperComponent
									isTabular={isTabular}
									setIsFolder={setIsFolder}
									deleteClicked={deleteClicked}
									checkItems={checkItems}
									setCheckItems={setCheckItems}
								/>
								{isTabular ? (
									uploadFiles.length > 0 ? (
										<LocalTabular uploadFiles={uploadFiles} />
									) : (
										<ResultTabluar data={before_local_dataset} />
									)
								) : (
									<LocalImageComponent
										uploadFiles={uploadFiles.length > 0 ? uploadFiles : before_local_dataset}
										checkItems={checkItems}
										setCheckItems={setCheckItems}
									/>
								)}
							</>
						) : (
							''
						)}
					</>
				) : (
					<>
						<ContentWrapperComponent
							isTabular={isTabular}
							setIsFolder={setIsFolder}
							deleteClicked={deleteClicked}
							checkItems={checkItems}
							setCheckItems={setCheckItems}
						/>
						<div
							{...getRootProps({
								className: 'dropzone',
								style,
								onClick: (event) => (uploadFiles.length > 0 ? event.stopPropagation() : ''),
							})}
						>
							{isFolder === 2 ? <input {...getInputProps()} directory="" webkitdirectory="" /> : <input {...getInputProps()} />}
							{uploadFiles.length > 0 ? (
								isTabular ? (
									<LocalTabular uploadFiles={uploadFiles} />
								) : (
									<LocalImageComponent uploadFiles={uploadFiles} checkItems={checkItems} setCheckItems={setCheckItems} />
								)
							) : (
								<TableArea>
									<img src={Cloud} width="60px" height="60px" alt="" />
									<Spacer size={'sm'} />
									Drag and drop here, or click to upload
								</TableArea>
							)}
						</div>
					</>
				)}
			</WhiteBox>
			<BottomArea style={{ width: '1524px', paddingTop: '16px' }}>
				<BottomButtons>
					<MiddleButtonsArea startInferenceClicked={(e) => startInferenceClicked(uploadFiles)} startDisabled={uploadFiles.length < 1} />
				</BottomButtons>
			</BottomArea>
		</>
	);
};

export default LocalComponent;

const ContentWrapperComponent = (props) => {
	const { isTabular, deleteClicked, setIsFolder, checkItems, setCheckItems } = props;
	const { isRunning, uploadFiles } = useContext(InferenceContext);
	return (
		<FilterBox>
			<ContentWrapper>
				외부 데이터를 불러옵니다.
				{!isRunning && (
					<>
						<Spacer />
						<MoreLocalUpload
							data={''}
							isTabular={isTabular}
							onUploadFile={() => {
								setIsFolder(1);
								// open()
							}}
							onUploadFolder={() => {
								setIsFolder(2);
								// open()
							}}
						/>
						{!isTabular && (
							<>
								<GreyButton
									onClick={(e) => {
										deleteClicked();
									}}
									disabled={checkItems.length < 1}
								>
									Delete
									<div style={{ marginRight: '8px' }} />
									<img src={DeleteIcon} width={'20px'} alt="" />
								</GreyButton>
								<CheckBoxGreyButton>
									<CheckBoxHeader
										checkItems={checkItems}
										list={uploadFiles}
										setCheckItems={setCheckItems}
										colorType={'white_head'}
									/>
								</CheckBoxGreyButton>
							</>
						)}
					</>
				)}
			</ContentWrapper>
		</FilterBox>
	);
};

const BottomButtons = styled.div`
	width: 1524px;
	display: flex;
	justify-content: flex-end;
`;

const GreyButton = styled.button`
	width: 100px;
	height: 32px;
	border-radius: 2px;
	background-color: #e1e4e7;
	display: flex;
	justify-content: center;
	align-items: center;
	display: flex;
	outline: none;
	border: none;
	cursor: pointer;
	margin: 0 8px;
	:hover {
		background-color: #b5bcc4;
	}
	:disabled {
		cursor: not-allowed;
		background-color: #e1e4e7;
		color: unset;
		// background: ${colors.gray_default};
	}
`;
const CheckBoxGreyButton = styled.div`
	width: 32px;
	height: 32px;
	border-radius: 2px;
	background-color: #e1e4e7;
	display: flex;
	justify-content: center;
	align-items: center;
	display: flex;
	:hover {
		background-color: #b5bcc4;
	}
	cursor: pointer;
`;

const TableArea = styled.div`
	width: 1460px;
	height: 227px;
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
const WhiteBox = styled.div`
	background: ${colors.bg_white};
	width: 1524px;
	height: 319px;
	border: 1px solid #dfe2e5;
	border-radius: 4px;
	box-shadow: 3px 8px 12px 0 rgba(0, 0, 0, 0.03);
	overflow: hidden;
	padding: 0 30px;
`;

const FilterBox = styled.div`
	display: flex;
	height: 72px;
	align-items: center;
	justify-content: space-between;
`;
const ContentWrapper = styled.div`
	display: flex;
	align-items: center;
`;
