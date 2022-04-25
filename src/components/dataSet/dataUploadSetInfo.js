import React, { useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';

import { colors } from 'styles';
import { PROJECT_TYPE } from 'constants/common';
import FormatUtil from 'utils/FormatUtil';
import IconDelete from 'assets/icon/icon-delete.png';

import { useCommonState } from 'store/common/hooks';

import Spacer from 'components/spacer';
import RadioButton from 'component/RadioButton';
import Button from 'component/Button';
import { dropZoneStyle, ZIP_MIME_TYPE } from 'components/common/UploadComponent';
import { DataUploadContext } from 'views/dataUpload';

import IconInfo from 'assets/icon/btn-info-p.png';
import { useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import DataLabelUploadInfo from 'component/dialog/DataLabelUploadInfo';

export default function DataUploadSetInfo(props) {
	const { labelFile, setLabelFile } = props;
	const { loadProject, loadProjectType } = useCommonState();
	const onDrop = useCallback((acceptedFiles, fileRejections) => {
		setLabelFile(acceptedFiles[0]);
	}, []);

	const { showDialog } = useDialogAction();

	const { dataset_name, change_dataset_name, isPrivate, setIsPrivate, sharedItem } = useContext(DataUploadContext);

	const {
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

	const onChangeDatasetName = (e) => {
		let value = FormatUtil.excludeSpecialChar(e.target.value);
		change_dataset_name(value);
	};

	const onDeleteClicked = useCallback(() => {
		setLabelFile('');
	});

	const handleOnClickInfoIcon = () => {		
		window.open(process.env.REACT_APP_MANUAL_URL);
	};

	return (
		<>
		<Right>
			<RightContainer>
				<BoxTitle>Set Info</BoxTitle>
				<Spacer size={'lg'} />
				<Label>* Dataset</Label>
				<Spacer />
				<CustomInput placeholder={'영문과 숫자, “_”, “-”만 입력할 수 있습니다.'} value={dataset_name} onChange={onChangeDatasetName} maxLength="40" />
				<Spacer size={'xl'} />
				<Label>* Type</Label>
				<Spacer />
				<CustomText>{loadProject && loadProject.type_nm}</CustomText>
				<Spacer size={'xl'} />
				<Label style={{ display: 'flex', textAlign: 'center' }}>
					<div>Label Upload</div>
					<Button colorType={'brandDark'} size={'iconSmall'} onClick={handleOnClickInfoIcon} iconSrc={IconInfo} />
					
					{/* {<div style={{ marginLeft: '8px', fontSize: '12px', color: '#e22706' }}>
						{loadProjectType === PROJECT_TYPE.IMAGE
							? 'Format에 맞는 Label 추가시 Experiment 수행 가능'
							: '마지막 column을 Label로 지정합니다'}
					</div>} */}
				</Label>
				<Spacer />
				<LabelUploadContents>
					{}
					<Button
						style={{ marginTop: '2px' }}
						
						size={'lowMedium'}
						colorType={'gray'}
						disabled={(loadProjectType !== PROJECT_TYPE.IMAGE) || sharedItem.label_nm}
						onClick={(e) => {
							if (loadProjectType === PROJECT_TYPE.IMAGE) {
								open();
							}
						}}
					>
						Upload
					</Button>
					<Spacer />
					<div
						{...getRootProps({
							className: 'dropzone',
							style,
						})}
					>
						<CustomText size={'sm'}>
							{sharedItem.label_status ? sharedItem.label_nm :
								labelFile ? labelFile.name : 'Format에 맞는 Label 추가 시 Experiment 수행이 가능합니다.'
							}
						</CustomText>
						<input {...getInputProps()} />
					</div>
					<Spacer />
					<Button colorType={'gray'} size={'iconLarge'} iconSrc={IconDelete} onClick={onDeleteClicked} disabled={sharedItem.label_status} tooltipText={'Delete Label'}/>
				</LabelUploadContents>
				<Spacer size={'xl'} />
				<Label>Datastorage Select</Label>
				<Spacer size={'lg'} />
				<GreyText>Private 유무를 확인합니다.</GreyText>
				<Spacer size={'lg'} />
				<RadioRow>
					<RadioButton onClick={(e) => setIsPrivate(true)} selected={isPrivate} >
						Private
					</RadioButton>
				</RadioRow>
				<Spacer />
				<RadioRow>
					<RadioButton onClick={(e) => setIsPrivate(false)} selected={!isPrivate} >
						Shared
					</RadioButton>
				</RadioRow>

				<Spacer />
			</RightContainer>
		</Right>
		<DataLabelUploadInfo />
		</>
	);
}

const Right = styled.div`
	width: 756px;
	height: 100%;
`;

const RightContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const CustomInput = styled.input`
	width: ${(props) => (props.size === 'sm' ? '404px' : '512px')};
	height: 36px;
	padding: 8px 40px 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_default};
	:focus {
		border: 1px solid #005cb5;
	}
	outline: none;
`;

const CustomText = styled.div`
	width: ${(props) => (props.size === 'sm' ? '404px' : '512px')};
	height: 36px;
	padding: 8px 10px 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_light};
	background: #f9f9f9;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: #b8babd;
`;

const LabelUploadContents = styled.div`
	display: flex;
	height: 50px;
`;

const GreyText = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.35px;
	color: #9ea1a4;
`;

const RadioRow = styled.div`
	display: flex;
	align-items: center;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;

const LabelUploadInfoImage = styled.img`
	width: 16px;
	margin-left: 5px;
	vertical-align: middle;
	cursor: pointer;
`;