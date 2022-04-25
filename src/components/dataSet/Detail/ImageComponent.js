import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'styles';
import agent from 'lib/apis';
import Arrow from 'assets/icon/icon-arrow.png';

import { PageWrapper, SubTitleBox, TitleComponent } from 'components/common/StyledComponent';
import Spacer from 'components/spacer';
import Button from 'component/Button';
import DataDetailStatusTable from 'components/dataSet/dataDetailImageStatus';
import { DataSetDetailContext } from 'views/DataDetail';
import ImageDataSetList from 'components/dataSet/Detail/ImageDataSetList';
import DataSetInfo from 'components/dataSet/Detail/DataSetInfo';
import StaticComponent from 'components/dataSet/Detail/StaticComponent';
import ImageSelectComponent from 'components/dataSet/Detail/ImageSelectComponent';
import { DATA_DETAIL_IMAGE_TYPE } from 'constants/common';
import Tooltip from 'components/common/Tooltip';

export const DatasetImageContext = createContext(null);
const ImageComponent = (props) => {
	const { detail, okClicked, dataset_id } = useContext(DataSetDetailContext);

	const [selectImage, setSelectImage] = useState('');
	const [attributes, setAttributes] = useState({});
	const [imageData, setImageData] = useState('');
	const [labeledImageData, setLabeledImageData] = useState('');
	const [imageType, setImageType] = useState(DATA_DETAIL_IMAGE_TYPE.IMAGE);
	const [noLabelReason, setNoLabelReason] = useState('');

	const fetchImageData = useCallback(() => {
		setLabeledImageData('');
		setImageType(DATA_DETAIL_IMAGE_TYPE.IMAGE);

		let params = {
			image_nm: selectImage.file_name,
			dataset_id: dataset_id, //sample dataset_id : 198
		};
		agent
			.getImageDetail({ params })
			.then((response) => {
				const { image_attributes, image_binaray } = response.data;
				setAttributes(image_attributes);
				setImageData(image_binaray.image);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});

		agent
			.getLabeledImage({ params })
			.then((response) => {
				const { labeled_image_binary } = response.data;
				setLabeledImageData(labeled_image_binary);
			})
			.catch((error) => {
				console.log('error ', error);
				if (error.status === 405) {
					setNoLabelReason(error.data.detail);
				} else {
					setNoLabelReason('라벨 정보가 없습니다.');
				}
			})
			.finally((v) => {});
	});
	useEffect(() => {
		if (selectImage) {
			fetchImageData();
		}
	}, [selectImage]);
	const ImageStore = useMemo(() => {
		return {
			selectImage,
			setSelectImage,
			attributes,
			imageData,
		};
	}, [selectImage, setSelectImage, attributes, imageData]);

	return (
		<DatasetImageContext.Provider value={ImageStore}>
			<PageWrapper>
				<TitleComponent text={'Data'} />
				<BodyContainer>
					<SubTitleBox>{'Data Details'}</SubTitleBox>
					<Content>
						<ContentArea>
							<TopLayout>
								<Left>
									<BoxTitle>Dataset Info</BoxTitle>
									<Spacer />
									<DataSetInfo data={detail} />
								</Left>
								<Spacer size={'lg'} />
								<Right>
									<RightContainer>
										<BoxTitle>Dataset Status</BoxTitle>
										<Spacer />
										<DataDetailStatusTable data={detail} />
									</RightContainer>
								</Right>
							</TopLayout>
							<Spacer size={'lg'} />
							<BottomLayout>
								<ImageDataSetList />
								<BottomCenter>
									<img src={Arrow} width={'28px'} height={'28px'} alt="" />
								</BottomCenter>
								<FlexBox>
									<BottomRight>
										<BoxTitle>Selected Image</BoxTitle>
										<Spacer size={'lg'} />
										<FlexBox>
											<StaticComponent />
										</FlexBox>
									</BottomRight>
									<BottomImageBox>
										<ButtonBox>
											<ImageTypeButton
												disabled={false}
												selected={imageType === DATA_DETAIL_IMAGE_TYPE.IMAGE}
												onClick={() => {
													setImageType(DATA_DETAIL_IMAGE_TYPE.IMAGE);
												}}
											>
												image
											</ImageTypeButton>
											<ImageTypeButton
												data-tip
												data-for={'label_button_tooltip'}
												disabled={!labeledImageData}
												selected={imageType === DATA_DETAIL_IMAGE_TYPE.IMAGE_WITH_LABEL}
												onClick={() => {
													if (!!labeledImageData) {
														setImageType(DATA_DETAIL_IMAGE_TYPE.IMAGE_WITH_LABEL);
													}
												}}
											>
												label
												{!labeledImageData && (
													<Tooltip id={'label_button_tooltip'} text={noLabelReason} />
												)}
											</ImageTypeButton>
										</ButtonBox>
										<ImageSelectComponent
											imageData={
												imageType === DATA_DETAIL_IMAGE_TYPE.IMAGE
													? imageData
													: labeledImageData
											}
										/>
									</BottomImageBox>
								</FlexBox>
							</BottomLayout>
						</ContentArea>
					</Content>

					<Spacer />
					<Spacer />
					<ButtonContainer>
						<Button colorType={'blue'} size={'xsmall'} onClick={(e) => okClicked()}>
							OK
						</Button>
					</ButtonContainer>
				</BodyContainer>
			</PageWrapper>
		</DatasetImageContext.Provider>
	);
};

export default ImageComponent;

const BodyContainer = styled.div`
	background: #f4f7fc;
	width: 100%;
	height: calc(100% - 80px);
	padding-bottom: 20px;
	overflow-y: overlay;
`;

const FlexBox = styled.div`
	width: 100%;
	display: flex;
`;

const BottomCenter = styled.div`
	width: 76px;
	height: 100%;
	display: flex;
	justify-content: center;
	padding-top: 143px;
	margin: 0 24px;
`;

const BottomRight = styled.div`
	width: 270px;
	height: 100%;
`;

const BottomImageBox = styled.div``;

const ButtonContainer = styled.div`
	width: 1524px;
	margin-left: 64px;
	display: flex;
	justify-content: flex-end;
`;

const Content = styled.div`
	width: 100%;
	padding: 0px 64px 0px 64px;
	display: flex;
	justify-content: space-between;
`;

const ContentArea = styled.div`
	display: flex;
	flex-direction: column;
`;

const TopLayout = styled.div`
	width: 1524px;
	height: 329px;
	display: flex;
`;

const BottomLayout = styled.div`
	width: 1524px;
	height: 329px;
	background: ${colors.bg_white};
	padding: 24px 28px 25px 32px;
	display: flex;
`;

export const BoxTitle = styled.div`
	height: 22px;
	font-size: 16px;
	font-weight: bold;
	letter-spacing: -0.4px;
	color: ${colors.text_black};
`;

const RightContainer = styled.div`
	width: 100%;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const Right = styled.div`
	width: 756px;
	height: 100%;
`;

const Left = styled.div`
	width: 756px;
	height: 100%;
	background: ${colors.bg_white};
	padding: 24px 32px 24px 32px;
`;

const ButtonBox = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	margin-bottom: 1px;
`;

const activeButton = css`
	background-color: ${colors.gray_dark};
	color: ${colors.bg_white};
`;

const deactiveButton = css`
	background-color: ${colors.gray_light};
	color: ${colors.gray_default};
`;

const ImageTypeButton = styled.div`
	${({ selected }) => (selected ? activeButton : deactiveButton)}
	${({ disabled }) => (disabled ? 'cursor: not-allowed;' : 'cursor: pointer;')}	
	padding: 6px;
	width: 100%;
	text-align: center;
	font-size: 14px;
	&:first-child {
		border-radius: 3px 0 0 0;
	}
	&:last-child {
		border-radius: 0 3px 0 0;
	}
`;
