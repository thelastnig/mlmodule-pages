import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { useHandleState, useStateActionHandler } from 'store/dataset/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useDialogAction } from 'store/dialog/hooks';
import { useCommonState } from 'store/common/hooks';
import { dialogList } from 'constants/dialog';

import { ROUTER_ANALYZE, ROUTER_PREPROCESS } from 'components/layout/MenuConst';
import { checkPreProcess } from 'views/PreProcess';
import TablePrivate from 'components/dataSet/TablePrivate';
import TableShared from 'components/dataSet/TableShared';
import AddLabel from 'component/dialog/AddLabel';
import SelectAnnotator from 'component/dialog/SelectAnnotator';
import { checkAnalyze } from 'views/Analyze';
import ProgressDialog from 'component/dialog/ProgressDialog';

import { BACKGROUND_JOB_TYPE } from 'constants/common';

export const DataSetTableContext = createContext(null);
export default function ListTable(props) {
	const { list, checkItems, setCheckItems, maxRowCnt, tabType, total_row_count, refresh } = props;
	const history = useHistory();
	const { showAlert } = useAlertAction();
	const { backgroundJobList } = useCommonState();

	const [addLabelData, setAddLabelData] = useState(false);
	const [showAnnotation, setShowAnnotation] = useState(false);
	const { showDialog } = useDialogAction();

	const { updateSortingCB, reqReplaceLabel } = useStateActionHandler();
	const { sorting, sorting_type } = useHandleState();
	let emptyRowCnt = maxRowCnt - list.length;

	const [progress, setProgress] = useState(0);	// 라벨 교체 작업 진행도
	const [isLabelWorkOn, setIsLabelWorkOn] = useState(false);

	const gotoPreProcess = (_id) => {
		history.push('/' + ROUTER_PREPROCESS + '/' + _id);
	};
	const failPreProcess = () => {
		showAlert({
			message: '현재 다른 Preprocess가 진행되고 있습니다.',
		});
	};

	const preProcessClicked = (dataset_id) => {
		checkPreProcess(dataset_id, gotoPreProcess, failPreProcess);
	};

	const gotoAnalyze = (_id) => {
		history.push('/' + ROUTER_ANALYZE + '/' + _id);
	};
	const failAnalyze = () => {
		showAlert({
			message: '현재 다른 Analyze가 진행되고 있습니다.',
		});
	};
	const analyzeClicked = (dataset_id) => {
		checkAnalyze(dataset_id, gotoAnalyze, failAnalyze);
	};

	/*
  https://smr.snu.ac.kr:30002/issues/1746#change-11873
1) "label_status": 1 인 경우는 변경 사항 없음 (Add label 버튼이 없기 때문)
2) response 중 "state":0 이고 **"allocate_annotation_status":true** 인 경우,
    **Add Label 클릭시 "이미 annotation 작업이 진행 중 입니다." 의 오류 팝업 띄움**
3) response 중 "state": 0 이고, **"model": "MDSS"**인 경우,
    Add Label 클릭시 팝업은 정상적으로 띄우지만,
    **Upload 버튼을 통한 직접 업로드만 가능하고 annotation 은 불가능하도록 버튼 비활성화**
   */
	const addLabelClicked = (dataset) => {
		console.log('dsds addLabelClicked dataset = ', dataset);
		if (dataset.label_status === 0 && dataset.allocate_annotation_status) {
			showAlert({
				message: '이미 annotation 작업이 진행 중 입니다.',
			});
		} else {
			setAddLabelData(dataset);
			showDialog(dialogList.DATA_ADD_LABEL);
		}
	};

	const onClickLabelEditBtn = (e, dataset) => {
		e.stopPropagation();

		if(backgroundJobList && backgroundJobList.length > 0 && backgroundJobList.includes(BACKGROUND_JOB_TYPE.LABEL_REPLACE)) {
			showAlert({
				message: '라벨 교체 작업이 진행중입니다.\n작업 종료 후 실행하세요.',
			});
			return;		
		}

		showAlert({
			message: '해당 라벨을 교체하시겠습니까?',
			isConfirm: true,
			onOk: () => {
				// const token = {
				// 	access_token_value: access_token,
				// 	refresh_token_value: refresh_token,
				// 	user_id: currentUser.user_id,
				// 	role: currentUser.role,
				// };
				// reqModifyLabel(Number(dataset.dataset_id), token);
				reqReplaceLabel({
					dataset_id: Number(dataset.dataset_id),
					noSpinner: true,
				});
				setIsLabelWorkOn(true);
			},
		});		
	};

	useEffect(() => {
		if(isLabelWorkOn) {
			showAlert({
				message: '라벨교체 작업이 시작되었습니다.\n(작업이 완료되면 다시 알림 예정)',
			});
			setIsLabelWorkOn(false);
		}
	}, [isLabelWorkOn]);

	// const reqModifyLabel = (datasetId, token) => {
	// 	showDialog(dialogList.PROGRESS_DLG);		
	// 	agent.modifyLabel({
	// 		dataset_id: datasetId,
	// 	}, (event) => {
    //         console.log(Math.round((100 * event.loaded) / event.total));
    //         setProgress(Math.round((100 * event.loaded) / event.total));
    //     })
	// 		.then(response => {
	// 			refresh();
	// 			showAlert({
	// 				message: '라벨 교체를 완료하였습니다.',
	// 				onOk: () => {
	// 					goAnnotationPage(response.data.annotation_id, token);
	// 				}
	// 			});
	// 		})
	// 		.catch(error => {
	// 			console.log(error);
	// 			showAlert({
	// 				message: '라벨 교체에 실패하였습니다.',
	// 			});
	// 		});
	// }

	const Store = useMemo(() => {
		return {
			preProcessClicked,
			analyzeClicked,
			addLabelClicked,
		};
	}, [preProcessClicked, analyzeClicked, addLabelClicked]);

	return (
		<DataSetTableContext.Provider value={Store}>
			<AddLabel data={addLabelData} setShowAnnotation={setShowAnnotation}/>
			<SelectAnnotator data={showAnnotation} />
			{tabType === 'P' ? (
				<TablePrivate
					list={list}
					checkItems={checkItems}
					setCheckItems={setCheckItems}
					emptyRowCnt={emptyRowCnt}
					sorting={sorting}
					sorting_type={sorting_type}
					updateSortingCB={updateSortingCB}
					total_row_count={total_row_count}
					onClickAddLabel={addLabelClicked}
					onClickLabelEditBtn={onClickLabelEditBtn}
				/>
			) : (
				<TableShared
					list={list}
					checkItems={checkItems}
					setCheckItems={setCheckItems}
					emptyRowCnt={emptyRowCnt}
					sorting={sorting}
					sorting_type={sorting_type}
					updateSortingCB={updateSortingCB}
					total_row_count={total_row_count}
				/>
			)}
			<ProgressDialog title={'라벨 교체 작업'} progress={progress} />
		</DataSetTableContext.Provider>
	);
}
