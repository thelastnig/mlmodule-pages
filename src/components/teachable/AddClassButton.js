import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useHandleState, useStateActionHandler } from 'store/teachable/hooks';
import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


export default function AddClassButton(props) {
	const { addClass } = useStateActionHandler();
	const { class_count, list_init, list } = useHandleState();
	const addClick = useCallback(() => {	
		const changed_class_count = class_count + 1;
		const added_item = {
				id: `id-${String(list_init)}`,
				class_name: `class ${String(list_init)}`,
				audioFullData: '',
				data: [],
				isUploadOpen: false,
				uploaderType: 'local',
				isWebcamAvailable: false,
		};
		addClass({added_item: added_item, class_count: changed_class_count});
	}, [list]);

	return (
		<AddButton onClick={addClick}>
			<AddBoxOutlinedIcon className='addButtonIcon'/>
			<AddButtonText>클래스 추가</AddButtonText>
		</AddButton>
	);
}

const AddButton = styled.div`
	width: 600px;
	height: 85px;
	border-radius: 20px;
	border: 2px dashed ${TEACHABLE_COLOR_LIST.PURPLE};
	text-align: center;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;

	.addButtonIcon {
		color: #6741d9;
		font-size: 20px;
		margin-right: 10px;
	}
`;

const AddButtonText = styled.div`
	color: ${TEACHABLE_COLOR_LIST.PURPLE};
	font-size: 16px;
	font-weight: 600;
`;