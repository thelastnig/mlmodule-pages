import React, { useEffect, useState } from 'react';
import CommonMoreButton from 'components/common/MoreButton';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';

export default function MoreComponent(props) {

	const [ menuList, setMenuList ] = useState([]);
    const { id, listLength, clickDelete, clickDeleteAllImages, clickDownloadSamples } = props;
    const { list } = useHandleState();
	useEffect(() => {
		let list = [];
		let item = '';
        item = {
            text: '클래스 삭제',
            onClick: () => {
                clickDelete(id);
            },
        };
        list.push(item);
        item = {
            text: '모든 샘플 삭제',
            onClick: () => {
                clickDeleteAllImages(id);
            },
        };
        if (listLength > 0) {
            list.push(item);
        }
        item = {
            text: '샘플 다운로드',
            onClick: () => {
                clickDownloadSamples(id);
            },
        };
        if (listLength > 0) {
            list.push(item);
        }
			
		setMenuList(list);
	}, [list]);

	return <CommonMoreButton style={{ width: '170px' }} list={menuList} />;
}