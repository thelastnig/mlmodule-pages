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
		<AddButtonWrapper>
			<AddButton onClick={addClick}>
				<AddBoxOutlinedIcon className='addButtonIcon'/>
				<AddButtonText>Add Class</AddButtonText>
			</AddButton>
		</AddButtonWrapper>
	);
}

const AddButtonWrapper =styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const AddButton = styled.div`
	width: 250px;
	height: 40px;
	text-align: center;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR};

	:hover {
		background: ${TEACHABLE_COLOR_LIST.MAIN_THEME_COLOR_LIGHT};
	}

	.addButtonIcon {
		color: white;
		font-size: 20px;
		margin-right: 10px;
	}
`;

const AddButtonText = styled.div`
	color: white;
	font-size: 14px;
	font-weight: 600;
`;