import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import { INPUT_TYPE } from 'constants/common';

import { useStateActionHandler as useSettingActionHandler, useHandleState as useSettingHandleState } from 'store/setting/hooks';
import { useInputPercent } from 'store/root/hooks';

import RadioButton from 'component/RadioButton';
import Checkbox from 'components/common/table/Checkbox';
import DialogFooter from 'components/modal/DialogFooter';
import DialogTitleComponent from 'components/modal/DialogTitle';
import InputType from 'components/common/InputType';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '476px', maxWidth: '476px' },
	},
}));

const PercentInput = ({ label, value, setValue, tooltipText }) => {
	return (
		<>
			<InputContainer>
				<Label>{label}</Label>
				<InputBoxArea>
					<InputType type={INPUT_TYPE.NUMBER} min={0} max={100} step={1} value={value} maxValue={100} setValue={setValue} tooltipText={tooltipText} />
					<div style={{ marginLeft: '5px' }}>%</div>
				</InputBoxArea>
			</InputContainer>
		</>
	);
};

export default function DlgDataSplit({ setDataSplitCB, isShowCrossValidation }) {
	const { paramT, paramC } = useSettingHandleState();
	const { onFetchSplitParamTCB, onFetchSplitParamCCB } = useSettingActionHandler();
	const classes = useStyles();
	const [stratify, setStratify] = useState(true);
	const [split_type, setSplitType] = useState('T'); //types = [T,C]
	let [split_training, change_split_training, set_split_training] = useInputPercent(null);
	let [split_validation, change_split_validation, set_split_validation] = useInputPercent(null);
	let [split_test, change_split_test, set_split_test] = useInputPercent(null);
	let [t_split_stratify, set_t_split_stratify] = useState(true);
	const [split_cross, set_split_cross] = useState(null);
	const [t_random_seed, set_t_random_seed] = useState(null);
	const [c_random_seed, set_c_random_seed] = useState(null);
	let [c_split_stratify, set_c_split_stratify] = useState(true);
	const [percentOk, setPercentOk] = useState(true);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.EXPERIMENT_DATA_SPLIT;

	const handleSplitType = (type) => setSplitType(type);

	useEffect(() => {
		let Training = isNaN(parseInt(split_training)) ? 0 : parseInt(split_training);
		let Validation = isNaN(parseInt(split_validation)) ? 0 : parseInt(split_validation);
		let TestSplit = isNaN(parseInt(split_test)) ? 0 : parseInt(split_test);

		if (Training + Validation + TestSplit === 100) {
			setPercentOk(true);
		} else {
			setPercentOk(false);
		}
	}, [split_training, split_validation, split_test]);

	const setTInitValue = () => {
		if (paramT && paramT.split_training) {
			set_split_training(paramT.split_training);
		}
		if (paramT && paramT.split_validation) {
			set_split_validation(paramT.split_validation);
		}
		if (paramT && paramT.split_test) {
			set_split_test(paramT.split_test);
		}
		if (paramT && paramT.split_seed) {
			set_t_random_seed(paramT.split_seed);
		}
		if (paramT && paramT.split_stratify) {
			set_t_split_stratify(paramT.split_stratify);
		}
	};
	const setCInitValue = () => {
		if (paramC && paramC.split_cross) {
			set_split_cross(paramC.split_cross);
		}
		if (paramC && paramC.split_seed) {
			set_c_random_seed(paramC.split_seed);
		}
		if (paramC && paramC.split_stratify) {
			set_c_split_stratify(paramC.split_stratify ?? false);
		}
	};

	useEffect(() => {
		if (isShow) {
			onFetchSplitParamTCB();
			onFetchSplitParamCCB();
		}
	}, [isShow]);

	useEffect(() => {
		if (paramT.isFetch) {
			setTInitValue();
		}
	}, [paramT, paramT && paramT.isFetch]);

	useEffect(() => {
		if (paramC.isFetch) {
			setCInitValue();
		}
	}, [paramC, paramC && paramC.isFetch]);

	const checkOkAbled = () => {
		if (split_type === 'T') {
			if (percentOk && !isNaN(parseInt(t_random_seed))) {
				return true;
			} else {
				return false;
			}
		} else {
			if (split_cross && !isNaN(parseInt(split_cross)) && parseInt(split_cross) > 2 && !isNaN(parseInt(c_random_seed))) {
				return true;
			} else {
				return false;
			}
		}
	};

	const onConfirmClicked = (e) => {
		let dada = {
			split_type: split_type,
			split_training: split_training,
			split_validation: split_validation,
			split_test: split_test,
			split_seed: split_type === 'T' ? t_random_seed : c_random_seed,
			t_split_stratify: t_split_stratify,
			split_cross: split_cross,
			split_stratify: split_type === 'T' ? t_split_stratify : c_split_stratify,
		};
		setDataSplitCB(dada);
		hideDialog();
	};

	const onCancelClicked = (e) => {
		setTInitValue();
		setCInitValue();
		setSplitType('T');
		hideDialog();
	};

	const onChangeStratify = () => {
		setStratify(!stratify);
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Data Split'} toggle={hideDialog} />
				<DialogContent>
					<DialogContentText>
						<RadioBox>
							<RadioButton selected={split_type === 'T'} onClick={() => {handleSplitType('T')}} tooltipText={'선택한 데이터를 학습/검증/테스트 데이터로 분할합니다.'}>
								Training / Validation / Test split
							</RadioButton>
							{isShowCrossValidation && (
								<RadioButton selected={split_type === 'C'} onClick={() => {handleSplitType('C')}} tooltipText={'데이터를 교차 검증합니다(정확도가 향상되나 시간이 비교적 오래 소요)'}>
									Cross - Validation
								</RadioButton>
							)}
						</RadioBox>

						{split_type === 'T' ? (
							<>
								<div style={{ display: 'flex', justifyContent: 'space-between' }}>
									<PercentInput
										label="Training"
										value={split_training}
										onChange={change_split_training}
										setValue={set_split_training}
										tooltipText={'훈련할 데이터의 비율입니다.'}
									/>
									<PercentInput
										label="Validation"
										value={split_validation}
										onChange={change_split_validation}
										setValue={set_split_validation}
										tooltipText={'훈련 과정 검증에 사용할 데이터의 비율입니다.'}
									/>
									<PercentInput 
										label="Test Split" 
										value={split_test} 
										onChange={change_split_test} 
										setValue={set_split_test} 
										tooltipText={'평가용 데이터의 비율입니다.'}
									/>
								</div>
								<ErrorLineArea>
									{!percentOk && <ErrorLine>Training, Validation, Test의 합은 100이어야만 합니다.</ErrorLine>}
								</ErrorLineArea>

								<InputContainer>
									<Label>Random Seed</Label>
									<InputType
										type={INPUT_TYPE.NUMBER}
										min={0}
										max={100}
										step={1}
										value={t_random_seed}
										setValue={set_t_random_seed}
										maxValue={99}
										tooltipText={'데이터를 분할할 때의 기준이 되는 초기값으로, 값이 동일하면 항상 동일하게 나뉩니다.'}
									/>
								</InputContainer>

								<InputContainer style={{ marginTop: '12px' }}>
									<Label>Stratify</Label>
									<CheckBoxContainer>
										<Checkbox checked={stratify} onChange={(e) => onChangeStratify()} tooltipText={'데이터 분할시 레이블의 분포가 원본대로 유지되도록 합니다.'} />
									</CheckBoxContainer>
								</InputContainer>
							</>
						) : (
							<div>
								<InputContainer style={{ marginTop: '12px' }}>
									<Label>K-Value</Label>
									<InputType
										type={INPUT_TYPE.NUMBER}
										min={0}
										max={10}
										step={1}
										value={split_cross}
										setValue={set_split_cross}
										maxValue={10}
										tooltipText={'교차 검증 횟수(3 또는 5를 권장)'}
									/>
								</InputContainer>

								<InputContainer style={{ marginTop: '12px' }}>
									{/*GUIDE 정수 이외의 값이 입력되고, 정수 값이 99를 초과하여 입력된다.*/}
									<Label>Random Seed</Label>
									<InputType
										type={INPUT_TYPE.NUMBER}
										min={0}
										max={100}
										step={1}
										value={c_random_seed}
										setValue={set_c_random_seed}
										maxValue={99}
										tooltipText={'데이터를 분할할 때의 기준이 되는 초기값으로, 값이 동일하면 항상 동일하게 나뉩니다.'}
									/>
								</InputContainer>

								<InputContainer style={{ marginTop: '12px' }}>
									<Label>Stratify</Label>
									<CheckBoxContainer>
										<Checkbox checked={stratify} onChange={(e) => onChangeStratify()} tooltipText={'데이터 분할시 레이블의 분포가 원본대로 유지되도록 합니다.'} />
									</CheckBoxContainer>
								</InputContainer>
							</div>
						)}
					</DialogContentText>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} okDisabled={!checkOkAbled()} />
			</Dialog>
		</div>
	);
}

const InputBoxArea = styled.div`
	width: 100px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
`;
const InputContainer = styled.div``;
const Label = styled.div`
	width: 120px;
	height: 17px;
	margin-bottom: 2px;
	font-size: 12px;
	font-weight: 500;
	color: ${colors.text_black};
`;
const RadioBox = styled.div`
	width: 428px;
	height: 54px;
	margin: 12px 0px;
	padding: 0px 10px;
	background-color: #f0f1f3;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;
const CheckBoxContainer = styled.div`
	margin-top: 8px;
`;

const ErrorLine = styled.div`
	font-size: 10px;
	text-align: right;
	color: red;
`;
const ErrorLineArea = styled.div`
	height: 12px;
`;
