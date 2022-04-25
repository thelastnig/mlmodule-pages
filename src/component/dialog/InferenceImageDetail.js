import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';

import { useStateActionHandler } from 'store/inference/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { useDialogState } from 'store/dialog/hooks';

import Spacer from 'components/spacer';
import DialogFooter from 'components/modal/DialogFooter';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DlgInferenceImageTable from 'dialog/DlgInferenceImageTable';
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
		paper: { minWidth: '1656px', maxWidth: '1656px' },
		height: '935px',
	},
}));

export default function DlgInferenceImageDetail(props) {
	const { data } = props;
	const classes = useStyles();

	const { getImageList, getImagePreview } = useStateActionHandler();

	const [imageList, setImageList] = useState([]);
	const [selectData, setSelectData] = useState('');
	const [imageData, setImageData] = useState(null);
	const { hideDialog } = useDialogAction();
	const { dialogName } = useDialogState();
	const isShow = dialogName === dialogList.INFERENCE_IMAGE_DETAIL;

	useEffect(() => {
		if (isShow) {
			let params = {
				dataset_id: data.dataset_id,
			};
			getImageList(params)
				.then((response) => {
					console.log('then response = ', response);
					let { image_list } = response.data;
					setImageList(image_list);
				})
				.catch((error) => {
					console.log('error ', error);
					// clearTimeout(timeInterval.current);
				})
				.finally((v) => {});
		} else {
			setImageData('');
			setSelectData('');
			setImageList([]);
		}
	}, [isShow]);

	const imageClicked = useCallback((image) => {
		setSelectData(image);
		let params = {
			dataset_id: data.dataset_id,
			data_name: image,
		};
		getImagePreview(params)
			.then((response) => {
				let { image_data } = response.data;
				let imageString = image_data[0];
				// imageString = imageString.substring(2, imageString.length - 1)
				setImageData(imageString);
			})
			.catch((error) => {
				console.log('error ', error);
				// clearTimeout(timeInterval.current);
			})
			.finally((v) => {});
	});

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'inference_image_detail_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Dataset Details'} toggle={hideDialog} />
				<DialogContent>
					<FlexBox>
						<div>
							<Spacer />
							<Spacer />
							{isShow && <DlgInferenceImageTable list={imageList} imageClicked={imageClicked} selectData={selectData} />}
						</div>
						<Spacer size="xl" />
						<div>
							<Spacer />
							<Spacer />
							<SubTitle>Preview</SubTitle>
							<PreviewImgArea>
								{imageData ? (
									<PreviewImg
										// src={URL.createObjectURL(imageData)}
										src={`data:image/jpeg;base64,${imageData}`}
									/>
								) : (
									<>
										<Spacer size="xl" />
										<Spacer />
										<ImageArea>IMAGE</ImageArea>
									</>
								)}
							</PreviewImgArea>
						</div>
					</FlexBox>
				</DialogContent>
				<DialogFooter confirmClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const PreviewImgArea = styled.div`
	width: 608px;
	height: 402px;
	margin-top: 10px;
`;

const PreviewImg = styled.img`
	width: 100%;
	height: 100%;
`;

const ImageArea = styled.div`
	width: 608px;
	height: 342px;
	background-color: #b5bcc4;
	font-size: 20px;
	font-weight: bold;
	letter-spacing: -0.5px;
	color: ${colors.bg_white};
	display: flex;
	justify-content: center;
	align-items: center;
`;

const SubTitle = styled.div`
	font-size: 16px;
	font-weight: 500;
	color: ${colors.text_black};
`;

const FlexBox = styled.div`
	display: flex;
`;
