import React, { useEffect, useState } from 'react';
import CommonMoreButton from 'components/common/MoreButton';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';

export default function MoreComponent(props) {

	const [ menuList, setMenuList ] = useState([]);
    const { id, listLength, clickDelete, clickDeleteAllImages, clickDownloadSamples } = props;
    const { list, detection_list, taskSubType } = useHandleState();

    const raw_list = taskSubType === 'classification' ? list : detection_list;

	useEffect(() => {
		let list = [];
		let item = '';
        item = {
            text: 'Delete Class',
            onClick: () => {
                clickDelete(id);
            },
        };
        if (taskSubType === 'classification') {
            list.push(item);
        }
        item = {
            text: 'Delete All Data',
            onClick: () => {
                clickDeleteAllImages(id);
            },
        };
        if (listLength > 0) {
            list.push(item);
        }
        item = {
            text: 'Data Download',
            onClick: () => {
                clickDownloadSamples(id);
            },
        };
        if (listLength > 0) {
            list.push(item);
        }
			
		setMenuList(list);
	}, [raw_list]);

	return <CommonMoreButton style={{ width: '170px' }} list={menuList} />;
}