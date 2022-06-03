import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as reducer from './reducer';

export function useHandleState() {
	return useSelector((state) => state.teachable);
}

export function useStateActionHandler() {
	const dispatch = useDispatch();

	const setTaskType = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setTaskType(params));
		},
		[dispatch],
	);

	const changeList = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.changeList(params));
		},
		[dispatch],
	);

	const changeDetectionList = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.changeDetectionList(params));
		},
		[dispatch],
	);

	const onInitData = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.initData(params));
		},
		[dispatch],
	);

	const addClass = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.addClass(params));
		},
		[dispatch],
	);

	const deleteClass = useCallback(
		(params) => {
			dispatch(reducer.actions.deleteClass(params));
		},
		[dispatch],
	);

	const reorderClass = useCallback(
		(params) => {
			dispatch(reducer.actions.reorderClass(params));
		},
		[dispatch],
	);

	const changeClassName = useCallback(
		(params) => {
			dispatch(reducer.actions.changeClassName(params));
		},
		[dispatch],
	);

	const uploadImage = useCallback(
		(params) => {
			dispatch(reducer.actions.uploadImage(params));
		},
		[dispatch],
	);

	const uploadAudio = useCallback(
		(params) => {
			dispatch(reducer.actions.uploadAudio(params));
		},
		[dispatch],
	);

	const changeParams = useCallback(
		(params) => {
			dispatch(reducer.actions.changeParams(params));
		},
		[dispatch],
	);

	const initParams = useCallback(
		(params) => {
			dispatch(reducer.actions.initParams(params));
		},
		[dispatch],
	);

	const changeUploadOpen = useCallback(
		(params) => {
			dispatch(reducer.actions.changeUploadOpen(params));
		},
		[dispatch],
	);

	const deleteImage = useCallback(
		(params) => {
			dispatch(reducer.actions.deleteImage(params));
		},
		[dispatch],
	);

	const deleteAllImages = useCallback(
		(params) => {
			dispatch(reducer.actions.deleteAllImages(params));
		},
		[dispatch],
	);

	const onAddDatasetCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.addDataset(params));
		},
		[dispatch],
	);

	const addModel = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.addModel(params));
		},
		[dispatch],
	);

	const addMetadata = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.addMetadata(params));
		},
		[dispatch],
	);

	const setTrainProgress = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.setTrainProgress(params));
		},
		[dispatch],
	);

	const stopTrain = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.stopTrain(params));
		},
		[dispatch],
	);

	const addHistory = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.addHistory(params));
		},
		[dispatch],
	);

	const changeWorking = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.changeWorking(params));
		},
		[dispatch],
	);

	const changeDataloading = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.changeDataloading(params));
		},
		[dispatch],
	);

	const changeTraining = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.changeTraining(params));
		},
		[dispatch],
	);

	const onConvertTeachableModelCB = useCallback(
		(params = {}) => {
			dispatch(reducer.actions.convertTeachableModel(params));
		},
		[dispatch],
	);

	const setGoogleAccessToken = useCallback(
		(params) => {
			dispatch(reducer.actions.setGoogleAccessToken(params));
		},
		[dispatch],
	);

	const toggleWebCamAvailable = useCallback(
		(params) => {
			dispatch(reducer.actions.toggleWebCamAvailable(params));
		},
		[dispatch],
	);

	const toggleAudioAvailable = useCallback(
		(params) => {
			dispatch(reducer.actions.toggleAudioAvailable(params));
		},
		[dispatch],
	);

	const showDataUploadAlert = useCallback(
		(params) => {
			dispatch(reducer.actions.showDataUploadAlert(params));
		},
		[dispatch],
	);

	const hideDataUploadAlert = useCallback(
		(params) => {
			dispatch(reducer.actions.hideDataUploadAlert(params));
		},
		[dispatch],
	);

	const addDetectionResultImage = useCallback(
		(params) => {
			dispatch(reducer.actions.addDetectionResultImage(params));
		},
		[dispatch],
	);

	const toggleDetectionResultImageClick = useCallback(
		(params) => {
			dispatch(reducer.actions.toggleDetectionResultImageClick(params));
		},
		[dispatch],
	);

	return {
		setTaskType,
		changeList,
		changeDetectionList,
		onInitData,
		addClass,
		deleteClass,
		reorderClass,
		changeClassName,
		uploadImage,
		uploadAudio,
		changeParams,
		initParams,
		changeUploadOpen,
		deleteImage,
		deleteAllImages,
		onAddDatasetCB,
		addModel,
		addMetadata,
		setTrainProgress,
		stopTrain,
		addHistory,
		changeWorking,
		changeDataloading,
		changeTraining,
		onConvertTeachableModelCB,
		setGoogleAccessToken,
		toggleWebCamAvailable,
		toggleAudioAvailable,
		showDataUploadAlert,
		hideDataUploadAlert,
		addDetectionResultImage,
		toggleDetectionResultImageClick,
	};
}
