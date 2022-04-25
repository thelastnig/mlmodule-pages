import React from 'react';
import styled from 'styled-components';

import { checkIsAbort, checkIsRunning, checkIsSucceed } from 'views/expRun';

const StatusComponent = (props) => {
	const { status, type } = props;
	const StatusText = () => {
		let text = '';
		if (checkIsRunning(status)) {
			if (type === 'preprocess') {
				text = 'Preprocessing...';
			} else {
				text = 'Analyzing...';
			}
		} else if (checkIsAbort(status)) {
			text = 'deleting...';
		} else if (checkIsSucceed(status)) {
			text = 'Complete';
		}
		return <>{text}</>;
	};
	return (
		<StatusWrepper>
			<StatusText />
		</StatusWrepper>
	);
};
export default StatusComponent;

const StatusWrepper = styled.div`
	line-height: 40px;
	color: #005cb5;
	font-size: 15px;
`;
