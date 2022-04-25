import React from 'react';

import { colors } from 'styles';

export default function ProgressBar(props) {
	const { completed, width, height } = props;

	const containerStyles = {
		height: height ? `${height}px` : '8px',
		width: width ? `100%` : ' 750px',
		backgroundColor: colors.gray_light_30,
		borderRadius: '10px',
	};

	const fillerStyles = {
		height: '100%',
		width: `${completed}%`,
		backgroundColor: colors.point_blue,
		borderRadius: 'inherit',
		textAlign: 'right',
	};

	return (
		<div style={containerStyles}>
			<div style={fillerStyles}></div>
		</div>
	);
}
