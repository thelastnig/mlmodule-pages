import { createContext, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { PROJECT_TYPE } from 'constants/common';

import { useHandleState, useStateActionHandler } from 'store/dataset/hooks';
import { useAuthState } from 'store/auth/hooks';
import { useCommonState } from 'store/common/hooks';

import TabularComponent from 'components/dataSet/Detail/TabularComponent';
import ImageComponent from 'components/dataSet/Detail/ImageComponent';
import { ROUTER_DATASET } from 'components/layout/MenuConst';

export const DataSetDetailContext = createContext(null);
export default function DataDetailComponent(props) {
	const dataset_id = props.match.params.dataset_id;
	const { loadProject, loadProjectType } = useCommonState();
	const history = useHistory();
	const { isLoggedIn } = useAuthState();
	const { detail } = useHandleState();
	const { onFetchDetailCB, onInitDetailCB } = useStateActionHandler();
	const isTabular = useMemo(() => loadProjectType !== PROJECT_TYPE.IMAGE);

	useEffect(() => {
		if (isLoggedIn) {
			let params = {
				dataset_id: dataset_id,
			};
			onFetchDetailCB(params);
		}
		return () => {
			// componentWillUnmount 역할
			onInitDetailCB();
		};
	}, [isLoggedIn]);

	const okClicked = () => {
		history.push('/' + ROUTER_DATASET);
	};

	const Store = useMemo(() => {
		return {
			isTabular,
			detail,
			dataset_id,
			okClicked,
		};
	}, [isTabular, detail, dataset_id, okClicked]);

	return (
		<>
			{loadProject && (
				<DataSetDetailContext.Provider value={Store}>
					{isTabular ? <TabularComponent data={detail} /> : <ImageComponent />}
				</DataSetDetailContext.Provider>
			)}
		</>
	);
}
