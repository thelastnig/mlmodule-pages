import React from 'react';
import styled from 'styled-components';

import Button from 'component/Button';

export default function DialogFooterComponent(props) {
	const { confirmClick, cancelClick, okDisabled, confirmTitle, tooltipText } = props;
	return (
		<>
			<DialogFooterWrapper>
				{cancelClick && <Button colorType={'cancel'} size={'xsmall'} onClick={(e) => cancelClick()} >Cancel</Button>}
				<Button colorType={'blue'} size={'xsmall'} disabled={okDisabled} onClick={(e) => confirmClick()} tooltipText={tooltipText} >{confirmTitle || 'OK'}</Button>
			</DialogFooterWrapper>
		</>
	);
}

const DialogFooterWrapper = styled.div`
	width: 100%;
	height: 80px;
	padding: 20px 24px 20px 0;
	background-color: #f0f1f3;
	text-align: right;
	justify-content: flex-end;
	display: flex;
`;
