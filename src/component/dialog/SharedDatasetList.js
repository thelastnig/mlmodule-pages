import React, { useState, useEffect, useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';

import agent from 'lib/apis';
import ListParamMaker from 'utils/ListParamMaker';
import LocalStorageManager from 'utils/LocalStorageManager';
import { SEARCH_BAR_TYPE } from 'constants/common';

import Spacer from 'components/spacer';
import DialogFooter from 'components/modal/DialogFooter';
import TableSelectComponent from 'components/common/TableSelectComponent';
import PaginationComponent from 'components/common/SharedPaginationComponent';
import SearchInputComponent from 'components/common/SearchInputComponent';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DlgDataUploadSharedTable from 'dialog/DlgDataUploadSharedTable';
import { DataUploadContext } from 'views/dataUpload';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const SELECT_FILTER_LIST = [
	{
		column: 'dataset_nm',
		label: 'Dataset',
	},
	{
		column: 'user_id',
		label: 'User ID',
	},
	{
		column: 'dataset_type',
		label: 'Type',
	},
];

export default function SharedDatasetList() {
	const [list, setList] = useState([]);
	const row_count = 12;
	const [total_row_count, set_total_row_count] = useState(-1);
	const [sorting, setSorting] = useState('create_date');
	const [sorting_type, setSorting_type] = useState(false);
	const [filter_type, setFilterType] = useState('');
	const [filter_text, setFilterText] = useState('');
	const [start_index, setStartIndex] = useState(0);
	const [selectItem, setSelectItem] = useState('');
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.DATA_SHARED_LIST;

	const { setSharedItem, setUploadFiles } = useContext(DataUploadContext);

	useEffect(() => {
		if (!filter_type) {
			setFilterType(SELECT_FILTER_LIST[0]);
		}
	});

	const onConfirmClicked = (e) => {
		hideDialog();
		setUploadFiles([]);
		setSharedItem(selectItem);
	};
	const onCancelClicked = (e) => {
		hideDialog();
	};
	useEffect(() => {
		fetchList();
	}, [isShow]);

	const fetchList = () => {
		if (!isShow) {
			return;
		}
		// http://{{HOST}}/api/datapre/getDatasetList?sorting=create_date&start_index=0&row_count=5&sorting_type=asc&filters={"project_id":1,"dataset_auth":"N"}
		let params = ListParamMaker.make({
			start_index,
			row_count,
			sorting,
			sorting_type,
			[filter_type.column]: filter_text,
			project_id: LocalStorageManager.getLoadedProjectId(),
			dataset_auth: 'N', // private:Y, shared:N
		});
		set_total_row_count(-1);
		agent
			.getDatasetList(params)
			.then((response) => {
				let { list, total_row_count } = response.data;
				setList(list);
				set_total_row_count(total_row_count);
			})
			.catch((error) => {
				console.log('error ', error);
				set_total_row_count(-1);
			})
			.finally((v) => {});
	};

	useEffect(() => {
		fetchList();
	}, [start_index, sorting, sorting_type]);

	const handleSelectChange = (e) => {
		setFilterType(e);
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				className={'data_shared_storage_dialog dialog_layout'}
			>
				<DialogTitleComponent title={'Shared'} toggle={hideDialog} />
				<DialogContent>
					<Spacer size={'lg'} />
					<div style={{ display: 'flex' }}>
						<TableSelectComponent options={SELECT_FILTER_LIST} onChange={handleSelectChange} value={filter_type} />
						<Spacer />
						<SearchInputComponent
							placeHolder={'검색어를 입력해주세요.'}
							doSearch={(e) => fetchList()}
							filter_text={filter_text}
							setFilterText={setFilterText}
							type={SEARCH_BAR_TYPE.DATA_UPLOAD_SHARED}
							start_index={start_index}
							setStartIndex={setStartIndex}
						/>
					</div>
					<Spacer />
					<Spacer />
					<DlgDataUploadSharedTable
						list={list}
						maxRowCnt={row_count}
						selectItem={selectItem}
						setSelectItem={setSelectItem}
						sorting={sorting}
						setSorting={setSorting}
						sorting_type={sorting_type}
						setSorting_type={setSorting_type}
						total_row_count={total_row_count}
					/>

					<Spacer size={'lg'} />
					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<PaginationComponent
							totalCnt={total_row_count}
							startIndex={start_index + 1}
							setStartIndex={setStartIndex}
							maxRowCnt={row_count}
						/>
					</div>
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={onCancelClicked} />
			</Dialog>
		</div>
	);
}
