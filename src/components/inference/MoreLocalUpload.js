import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support

import { colors } from 'styles';
import Upload from 'assets/icon/icon-btn-upload.png';

const Fade = React.forwardRef(function Fade(props, ref) {
	const { in: open, children, onEnter, onExited, ...other } = props;
	const style = useSpring({
		from: { opacity: 0 },
		to: { opacity: open ? 1 : 0 },
		onStart: () => {
			if (open && onEnter) {
				onEnter();
			}
		},
		onRest: () => {
			if (!open && onExited) {
				onExited();
			}
		},
	});

	return (
		<animated.div ref={ref} style={style} {...other}>
			{children}
		</animated.div>
	);
});

Fade.propTypes = {
	children: PropTypes.element,
	in: PropTypes.bool,
	onEnter: PropTypes.func,
	onExited: PropTypes.func,
};

export default function MoreLocalUpload(props) {
	const { onUploadFile, onUploadFolder, data, isTabular } = props;

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClose = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorEl(null);
	};
	return (
		<>
			<GreyButton onClick={handleClick} style={{ cursor: 'pointer' }}>
				Upload
				<div style={{ marginRight: '8px' }} />
				<img src={Upload} width={'20px'} alt="" />
			</GreyButton>

			<StyledMenu
				id="customized-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
				style={{ marginLeft: '55px', marginTop: '4px' }}
			>
				<PopoverMenu>
					<>
						<PopoverMenuItem
							onClick={(e) => {
								onUploadFile(data);
								handleClick(e);
							}}
						>
							Upload file
						</PopoverMenuItem>
						{!isTabular && (
							<PopoverMenuItem
								onClick={(e) => {
									onUploadFolder(data);
									handleClick(e);
								}}
							>
								Upload folder
							</PopoverMenuItem>
						)}
					</>
				</PopoverMenu>
			</StyledMenu>
		</>
	);
}
const StyledMenu = withStyles({
	paper: {
		// border: '1px solid red',
	},
})((props) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'right',
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'right',
		}}
		{...props}
	/>
));

const GreyButton = styled.div`
	width: 100px;
	height: 32px;
	border-radius: 2px;
	background-color: #e1e4e7;
	display: flex;
	justify-content: center;
	align-items: center;
	display: flex;
	:hover {
		background-color: #b5bcc4;
	}
`;

const PopoverMenu = styled.div`
	background: red;
	width: 156px;
	// height: 124px;
	border-radius: 4px;
	border: solid 1px #d5d6d7;
	background-color: ${colors.bg_white};
	padding: 8px;
`;
const PopoverMenuItem = styled.div`
	height: 36px;
	padding: 0 8px;
	line-height: 36px;
	color: ${colors.gray_dark};
	font-size: 14px;
	letter-spacing: -0.35px;
	&:hover {
		color: ${colors.text_black};
		border-radius: 2px;
		background-color: rgba(0, 66, 130, 0.1);
		cursor: pointer;
	}
`;
