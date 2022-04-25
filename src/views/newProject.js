import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import history from 'lib/history';
import agent from 'lib/apis';
import IconInfo from 'assets/icon/icon-info.png';
import ImageClassificationLiner from 'assets/img/img-img-linear.png';
import ImageRegressionLinear from 'assets/img/img-img-classification.png';
import ImageSmallDetection from 'assets/img/img-img-detection.png';
import ImageInstance from 'assets/img/img-img-instance.png';
import ImageSemantic from 'assets/img/img-img-semantic.png';

import { useAuthState } from 'store/auth/hooks';
import { useStateActionHandler as groupActionHandler, useHandleState as groupState } from 'store/group/hooks';
import { useInput, useInputWithFiler } from 'store/root/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';

import { PageWrapper, WhiteBox, CommonInput, TitleComponent } from 'components/common/StyledComponent';
import RadioButton from 'component/RadioButton';
import SelectCustom from 'components/common/SelectCustom';
import TabularRegression from 'component/dialog/TabularRegression';
import TabularClassification from 'component/dialog/TabularClassification';
import ImageDetection from 'component/dialog/ImageDetection';
import InstanceSegmentation from 'component/dialog/InstanceSegmentation';
import SemanticSegmentation from 'component/dialog/SemanticSegmentation';
import ImageClassification from 'component/dialog/ImageClassification';
import Button from 'component/Button';
import Spacer from 'components/spacer';

import { dialogList } from 'constants/dialog';

const Frameworks = [
	{
		label: 'Tensorflow',
		key: 'FWT',
	},
	{
		label: 'Pytorch',
		key: 'FWP',
	},
	{
		label: 'Others',
		key: 'FWO',
	},
];

const OtherFramework = [
	{
		label: 'Others',
		key: 'FWO',
	},
];
// tabular : TYS,
//   Image : TYI
// (tabular) Classfication : MDCS,
// (tabular) Regression : MDRS,
// (Image) Classfication : MDCI,
// (Image) Detection : MDTI
// (Image) Instance Segmentation : MDIS,
// (Image) Semantic Segmentation : MDSS

export default function NewProject() {
	const { showAlert } = useAlertAction();
	const { showDialog } = useDialogAction();
	const [dataType, setDataType] = useState('TYS');
	const { isLoggedIn } = useAuthState();
	const [project_nm, change_project_nm] = useInputWithFiler(false);
	const [description, change_description] = useInput('');
	const [framework, setFramework] = useState(OtherFramework[0]);
	const [selectGroup, setSelectGroup] = useState('');
	const [problemDefi, setProblemDefi] = useState('MDRS');

	const { group_list } = groupState();
	const { onFetchGroupListCB } = groupActionHandler();

	useEffect(() => {
		if (isLoggedIn) {
			onFetchGroupListCB();
		}
	}, [isLoggedIn]);
	useEffect(() => {
		if (group_list.length > 0) {
			setSelectGroup(group_list[0]);
		}
	}, [group_list]);

	const handleRadioTabular = () => {
		setDataType('TYS');
		setProblemDefi('MDCS');
		setFramework(OtherFramework[0]);
	};
	const handleRadioImage = () => {
		setDataType('TYI');
		setProblemDefi('MDCI');
		setFramework(Frameworks[0]);
	};

	const okClicked = useCallback(() => {
		let params = {
			project_nm: project_nm,
			group_id: selectGroup.group_id,
			framework: framework.key,
			description: description,
			type: dataType,
			model: problemDefi,
		};

		agent
			.saveNewProject(params)
			.then((response) => {
				console.log('then response = ', response);
				showAlert({
					message: '생성이 완료 되었습니다.',
					onOk: cancelClicked,
				});
			})
			.catch((error) => {
				console.log('error ', error);
				showAlert({
					message: error.data.detail,
				});
			})
			.finally((v) => {});
	});
	const cancelClicked = useCallback(() => {
		history.push({
			pathname: '/home',
			firstCreatedProject: {projectName: project_nm},
		});
	});
	const isTabular = dataType === 'TYS';

	return (
		<>
			<TabularRegression />
			<TabularClassification />
			<ImageClassification />
			<ImageDetection />
			<InstanceSegmentation />
			<SemanticSegmentation />
			<PageWrapper>
				<TitleComponent text={'New Project'} />
				<WhiteBox style={{ marginTop: '24px', height: '518px', display: 'flex' }}>
					<LeftBox>
						<FormLabel text={'* Define your project'} style={{ marginBottom: '16px' }} />
						<FormLabel text={'Type'} style={{ marginBottom: '8px', fontSize: '16px', fontWeight: 'normal' }} />
						<RadioBox>
							<RadioButton selected={dataType === 'TYS'} onClick={handleRadioTabular}>
								Tabular
							</RadioButton>
							<Spacer />
							<RadioButton selected={dataType === 'TYI'} onClick={handleRadioImage}>
								Image
							</RadioButton>
						</RadioBox>
						<FormLabel text={'Model'} style={{ marginTop: '37px', fontSize: '16px', fontWeight: 'normal' }} />

						{isTabular ? (
							<SelectModelArea>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDRS'} onClick={(e) => setProblemDefi('MDRS')}>
											Regression
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_TABULAR_REGRESSION)}
											src={IconInfo}
											alt="Tabular Regression"
										/>
									</RadioWrapper>
									<ModelImage src={ImageRegressionLinear} alt="" />
								</ModelWrapper>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDCS'} onClick={(e) => setProblemDefi('MDCS')}>
											Classification
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_TABULAR_CLASSIFICATION)}
											src={IconInfo}
											alt="Tabular Classification"
										/>
									</RadioWrapper>
									<ModelImage src={ImageClassificationLiner} alt="" />
								</ModelWrapper>
							</SelectModelArea>
						) : (
							<SelectModelArea>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDCI'} onClick={(e) => setProblemDefi('MDCI')}>
											Classification
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_IMAGE_CLASSIFICATION)}
											src={IconInfo}
											alt="Image Classification"
										/>
									</RadioWrapper>
									<ModelImage src={ImageClassificationLiner} alt="" />
								</ModelWrapper>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDTI'} onClick={(e) => setProblemDefi('MDTI')}>
											Detection
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_IMAGE_DETECTION)}
											src={IconInfo}
											alt="Image Detection"
										/>
									</RadioWrapper>
									<ModelImage src={ImageSmallDetection} alt="ImageSmallDetection" />
								</ModelWrapper>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDIS'} onClick={(e) => setProblemDefi('MDIS')}>
											Instance Segmentation
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_INSTANCE_SEGMENTATION)}
											src={IconInfo}
											alt="ImageInstance"
										/>
									</RadioWrapper>
									<ModelImage src={ImageInstance} alt="ImageInstance" />
								</ModelWrapper>
								<ModelWrapper>
									<RadioWrapper>
										<RadioButton selected={problemDefi === 'MDSS'} onClick={(e) => setProblemDefi('MDSS')}>
											Semantic Segmentation
										</RadioButton>
										<ModelInformationImage
											onClick={(e) => showDialog(dialogList.INFO_SEMANTIC_SEGMENTATION)}
											src={IconInfo}
											alt="ImageSemantic"
										/>
									</RadioWrapper>
									<ModelImage src={ImageSemantic} alt="ImageSemantic" />
								</ModelWrapper>
							</SelectModelArea>
						)}
					</LeftBox>
					<RightBox>
						<FormLabel text={'* Name'} style={{ marginBottom: '8px' }} />
						<CustomInput placeholder="내용을 입력해주세요." value={project_nm} onChange={change_project_nm} maxLength="100" />
						<FormLabel text={'* Group'} style={{ marginTop: '20px', marginBottom: '8px' }} />
						<SelectCustom
							styleOptions={{
								width: '512px',
								height: '36px',
								maxHeight: '300px',
							}}
							isDisabled={false}
							isLoading={false}
							isClearable={false}
							isRtl={false}
							isSearchable={false}
							options={group_list}
							getOptionLabel={(option) => option.group_nm}
							getOptionValue={(option) => option.group_id}
							onChange={(e) => setSelectGroup(e)}
							value={selectGroup}
							isRemovePrefixCurrent={true}
							label_key={'group_nm'}
							value_key={'group_id'}
						/>
						<FormLabel text={'Framework'} style={{ marginTop: '20px', marginBottom: '8px' }} />
						<SelectCustom
							styleOptions={{
								width: '512px',
								height: '36px',
							}}
							isDisabled={isTabular}
							isLoading={false}
							isClearable={false}
							isRtl={false}
							isSearchable={false}
							options={Frameworks}
							getOptionLabel={(option) => option.label}
							getOptionValue={(option) => option.key}
							onChange={(e) => setFramework(e)}
							value={framework}
							isRemovePrefixCurrent={true}
						/>
						<FormLabel text={'Description'} style={{ marginTop: '20px', marginBottom: '8px' }} />
						<CustomDescription placeholder="내용을 입력해주세요." value={description} onChange={change_description} maxLength="5000" />
					</RightBox>
				</WhiteBox>
				<BottomBox>
					<Button colorType={'cancel'} size={'xsmall'} onClick={cancelClicked} >Cancel</Button>
					<Button colorType={'blue'} size={'xsmall'} onClick={okClicked} >OK</Button>
				</BottomBox>
			</PageWrapper>
		</>
	);
}
const FormLabel = ({ text, style }) => <StyledLabelTitle style={style}>{text}</StyledLabelTitle>;
const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	${CommonInput};
`;

const CustomDescription = styled.textarea`
	width: 512px;
	height: 160px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_default};
	resize: none;
	${CommonInput};
`;

const RightBox = styled.div`
	width: 512px;
	margin: 32px 0px;
	flex-direction: column;
	justify-content: center;
`;

const LeftBox = styled.div`
	width: 916px;
	margin: 32px 32px;
	flex-direction: column;
	justify-content: center;
`;

const StyledLabelTitle = styled.div`
	height: 20px;
	font-family: NotoSans;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.bg_black};
`;

const RadioBox = styled.div`
	width: 916px;
	height: 48px;
	margin: 12px 0px;
	padding: 0px 26px;
	background-color: #f0f1f3;
	display: flex;
	align-items: center;
`;

const BottomBox = styled.div`
	width: 1524px;
	margin: 16px 64px 0 64px;
	display: flex;
	justify-content: flex-end;
`;

const SelectModelArea = styled.div`
	display: flex;
	margin-top: 8px;
`;

const ModelWrapper = styled.div`
	margin-top: 12px;
	margin-right: 10px;
	display: flex;
	flex-direction: column;
`;

const RadioWrapper = styled.div`
	display: flex;
	align-items: center;
`;

const ModelInformationImage = styled.img`
	width: 16px;
	margin-left: 5px;
	vertical-align: middle;
	cursor: pointer;
`;

const ModelImage = styled.img`
	width: 210px;
	height: 210px;
	margin-top: 12px;
`;
