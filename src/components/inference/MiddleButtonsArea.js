import React, { useContext } from 'react';

import { InferenceContext } from 'views/Inference';
import Button from 'component/Button';

export default function MiddleButtonsArea(props) {
	const { startInferenceClicked, startDisabled } = props;
	const { isRunning, logShowAble, showProcessDlg, stopClicked } = useContext(InferenceContext);
	return (
		<>
			{isRunning ? (
				<>
					<Button
						size={'medium'}
						colorType={'blue'}
						onClick={showProcessDlg}
					>
						Show Log
					</Button>
					<Button
						size={'medium'}
						colorType={'red'}
						onClick={stopClicked}
					>
						Stop Inference
					</Button>
				</>
			) : (
				<>
					<Button
						size={'medium'}
						colorType={'blue'}
						disabled={!logShowAble}
						onClick={showProcessDlg}
					>
						Show Log
					</Button>
					<Button
						size={'medium'}
						colorType={'blue'}
						disabled={startDisabled}
						onClick={(e) => startInferenceClicked()}
					>
						Start
					</Button>
				</>
			)}
		</>
	);
}
