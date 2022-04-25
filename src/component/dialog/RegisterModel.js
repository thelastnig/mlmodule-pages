import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';

import { colors } from 'styles';
import FormatUtil from 'utils/FormatUtil';

import { useStateActionHandler, useHandleState } from 'store/models/hooks';
import { useAlertAction } from 'store/alert/hooks';

import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { InputDisabled } from 'components/common/StyledComponent';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

export default function RegisterModel({ data, fetchList }) {
	const source = data.source;
	const register_run_id = data.register_run_id;
	const experiment_id = data.experiment_id;
	const [selectModel, setSelectModel] = useState('');
	const [showModelName, setShowModelName] = useState(false);
	const [LmodelList, setLmodelList] = useState([]);
	const [modelName, setModelName] = useState('');
	const { registered_model_list } = useHandleState();
	const { showAlert } = useAlertAction();
	const { onFetchModelsListCallback, setRegisteredModelVersionCB, setRegisteredModelCB } = useStateActionHandler();
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_REGISTER_MODEL;

	useEffect(() => {
		if (isShow) {
			onFetchModelsListCallback();
		} else {
			setSelectModel('');
			setShowModelName(false);
			setLmodelList([]);
		}
	}, [isShow]);
	useEffect(() => {
		let temp = [];
		temp.push({
			model_name: '+ New Model',
			isButton: true,
		});
		registered_model_list.forEach((item) => {
			temp.push(item);
		});
		setLmodelList(temp);
	}, [registered_model_list]);

	useEffect(() => {
		if (selectModel && selectModel.isButton) {
			setShowModelName(true);
		} else {
			setShowModelName(false);
		}
	}, [selectModel]);
	const handleSelectChange = (e) => {
		let value = e;
		setSelectModel(value);
		return value;
	};

	const registerComplte = useCallback(() => {
		console.log('dsds registerComplte');
		hideDialog();
		fetchList();
	});

	const onConfirmClicked = (e) => {
		console.log('confirm clicked');
		let name = '';
		let params = {
			source,
			register_run_id,
			experiment_id,
		};
		if (selectModel && selectModel.isButton) {
			name = modelName;
			params.name = name;
			setRegisteredModelCB(params)
				.then((response) => {
					showAlert({
						message: '등록 완료 되었습니다.',
						onOk: registerComplte,
					});
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {
					setModelName('');
				});
		} else {
			name = selectModel.model_name;
			params.name = name;
			setRegisteredModelVersionCB(params)
				.then((response) => {
					showAlert({
						message: '등록 완료 되었습니다.',
						onOk: registerComplte,
					});
				})
				.catch((error) => {
					console.log('error ', error);
				})
				.finally((v) => {});
		}
	};
	const onCancelClicked = (e) => {
		hideDialog();
	};

	const onChangeModelName = (e) => {
		const value = FormatUtil.excludeSpecialChar(e.target.value);
		setModelName(value);
	};

	const selectStyles = {
		control: (styles, state) => ({
			...styles,
			border: '1px solid #ced4da',
			boxShadow: 'none',
			'&:hover': {
				border: state.isFocused ? '1px solid #d5dce4' : '1px solid #d5dce4',
			},
		}),
		indicatorsContainer: (styles) => ({ ...styles }),
		indicatorSeparator: (styles) => ({ ...styles, display: 'none' }),
		menuList: (styles) => ({
			...styles,
			maxHeight: '145px',
			boxShadow: '7px 8px 20px 0 rgba(0, 0, 0, 0.12)',
			border: '1px solid #d5d6d7',
			padding: 0,
			backgroundColor: '#ffffff',
		}),
		option: (styles, { data, isDisabled, isFocused, isSelected }) => {
			let isButton = data.isButton;
			return {
				...styles,
				height: '36px',
				backgroundColor: isSelected ? 'rgba(0, 66, 130, 0.1)' : '#ffffff',
				color: isButton ? '#005cb5' : '#1e1f22',
				letterSpacing: '-0.3px',
				fontSize: '14px',
				':hover': {
					...styles[':hover'],
					backgroundColor: 'rgba(0, 66, 130, 0.1)',
				},
			};
		},
	};
	return (
		<div>
			<Dialog 
				className={'register_model_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
			>
				<DialogTitleComponent title={'Register model'} toggle={hideDialog} />
				<DialogContent>
					<Sesstion>
						<SessionTitle>Selected model</SessionTitle>
						<InputDisabled>{data.model_nm}</InputDisabled>
					</Sesstion>
					<Sesstion>
						<SessionTitle>Select model to register to.</SessionTitle>
						<ModelSelect>
							<Select
								className="basic-single"
								classNamePrefix="select"
								isDisabled={false}
								isLoading={false}
								isClearable={false}
								isRtl={false}
								isSearchable={false}
								options={LmodelList}
								styles={selectStyles}
								getOptionLabel={(option) => option.model_name}
								getOptionValue={(option) => option.model_name}
								onChange={handleSelectChange}
								value={selectModel}
							/>
						</ModelSelect>
					</Sesstion>
					{showModelName && (
						<Sesstion>
							<SessionTitle>Model Name</SessionTitle>
							<CustomInput placeholder="이름을 입력하세요." value={modelName} onChange={onChangeModelName} maxLength="100" />
						</Sesstion>
					)}
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} />
			</Dialog>
		</div>
	);
}

const DialogContent = styled.div`
	padding: 0 24px;
	height: 287px;
`;

const Sesstion = styled.div``;

const SessionTitle = styled.div`
	font-size: 14px;
	font-weight: 500;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	color: ${colors.text_black};
	height: 40px;
	padding-top: 12px;
`;

const ModelSelect = styled.div``;

const CustomInput = styled.input`
	font-size: 12px;
	font-size: 16px;
	outline: none !important;
	color: ${colors.text_black};
	background-color: ${colors.bg_white};
	width: 100%;
	height: 36px;
	border: solid 1.2px #ced4da;
	border-radius: 4px;
	font-size: 14px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.35px;
	padding: 10px;
	:focus {
		border: solid 1.2px #005cb5;
	}
`;
