import React, { useCallback, useContext, useEffect, useState } from 'react';
import $ from 'jquery';
import { useHistory } from 'react-router-dom';

import { useAuthState } from 'store/auth/hooks';
import { useAlertAction } from 'store/alert/hooks';

import { ROUTER_DATASET } from 'components/layout/MenuConst';
import { DataSetContext } from 'views/dataSet';
import { DataSetTableContext } from 'components/dataSet/dataSetList';
import CommonMoreButton from 'components/common/MoreButton';
import { useCommonAction } from 'store/common/hooks';

/*
private : preprocess, analyze, details, add label(라벨이 없을 경우)
Shared: detail
* */
/*
다른 유저의 프로젝트를 로드할 경우 정책 설명
  - More 팝업에서 Proprocess, Analyze 없어짐,
 */

export default function DataMore({ data, isPrivate }) {
	const { currentUser, access_token, refresh_token } = useAuthState();
	const { showAlert } = useAlertAction();

	const history = useHistory();

	const { controlable } = useContext(DataSetContext);
	const { preProcessClicked, analyzeClicked, addLabelClicked } = useContext(DataSetTableContext);

	const [menuList, setMenuList] = useState([]);
	const { onHideSpinnerCB, onShowSpinnerCB } = useCommonAction();

	useEffect(() => {
		let list = [];
		let item = '';
		if (data) {
			if (controlable && isPrivate) {
				item = {
					text: 'Preprocess',
					onClick: () => {
						gotoPreProcess();
					},
				};
				if (data.label_status === 0 && data.allocate_annotation_status) {
					item.disabled = true;
					item.tooltip = '라벨링 작업이 진행중인 데이터셋은 전처리 할 수 없습니다. 라벨링이 끝난 후 다시 시도해주세요.';
				} else {					
					item.tooltip = '데이터를 학습시키기 전 단계로, 데이터 가공 후 학습을 완료하게 되면 새로운 dataset 버전으로 저장됩니다.';
				}
				list.push(item);
			}
			if (data.dataset_type === 'tabular') {
				item = {
					text: 'Analyze',
					onClick: () => {
						gotoAnalyze();
					},
				};
				if (data.missing_value_status) {
					item.disabled = true;
					item.tooltip = '결측치가 있는 데이터셋은 분석 할 수 없습니다. 결측치를 제거 해주세요.';
				}
				list.push(item);
			}
			item = {
				text: 'Details',
				onClick: () => {
					gotoDetail();
				},
			};
			list.push(item);
			// if (data.dataset_type !== 'tabular' && controlable && isPrivate && data.label_status !== 1) {
			// 	item = {
			// 		text: 'Add Label',
			// 		onClick: () => {
			// 			addLabelClicked(data);
			// 		},
			// 	};
			// 	list.push(item);
			// }
			item = {
				text: 'Download Dataset',
				onClick: (e) => {
					downloadDataSet(e);
				},
			};
			list.push(item);
		}
		setMenuList(list);
	}, [data]);

	const gotoDetail = useCallback(() => {
		let id = data.dataset_id;
		history.push('/' + ROUTER_DATASET + '/' + id);
	});

	const gotoPreProcess = () => {
		let id = data.dataset_id;
		preProcessClicked(id);
	};
	const gotoAnalyze = () => {
		let id = data.dataset_id;
		analyzeClicked(id);
	};

	const downloadDataSet = (e) => {
		e.preventDefault();
		e.stopPropagation();
		const token = {
			access_token_value: access_token,
			refresh_token_value: refresh_token,
			user_id: currentUser.user_id,
			role: currentUser.role,
		};
		const base_url = `${process.env.REACT_APP_API_ENDPOINT}/${process.env.REACT_APP_API_PREFIX}`;
		const download_url = base_url + '/datapre/downloadDataset?dataset_id=' + data.dataset_id + '&token=' + JSON.stringify(token);
		const link = document.createElement('a');

		$.ajax({
			method: 'GET',
			contentType: 'application/octet-stream',
			url: download_url,
			beforeSend: function () {
				onShowSpinnerCB();
				link.href = download_url;
				link.click();
				link.remove();
			},
			success: function() {
				onHideSpinnerCB();
			},
			fail: function(xhr, status, error) {
				showAlert({
					message: xhr.responseJSON.msg_desc,
				});
			},
			complete: function() {
				onHideSpinnerCB();
			}
		})
	};
	return <CommonMoreButton list={menuList} />;
}
