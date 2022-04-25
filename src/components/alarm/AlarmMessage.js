import React from 'react';
import PropTypes from 'prop-types';
import { useSpring, animated } from 'react-spring/web.cjs'; // web.cjs is required for IE 11 support
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';

import { colors } from 'styles';
import IconSearchNormal from 'assets/icon/icon-search-n.png';
import IconSearchHover from 'assets/icon/icon-search-hover.png';
import IconSearchPress from 'assets/icon/icon-search-p.png';

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

export default function AlarmMessage(props) {
	const { data, readAlarm } = props;

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
		if (data && data.read_yn === 0) {
			readAlarm(data.error_no);
		}
	};

	return (
		<>
			<div>
				<IconArea onClick={handleClick} />
				<StyledMenu
					id="customized-menu"
					anchorEl={anchorEl}
					keepMounted
					open={Boolean(anchorEl)}
					onClose={handleClose}
				>
					<MsgArea>
						<MsgContent>{data.message}</MsgContent>
						<ConfirmBtn onClick={(e) => handleClose(e)}>OK</ConfirmBtn>
					</MsgArea>
				</StyledMenu>
			</div>
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

const ConfirmBtn = styled.div`
	width: 60px;
	height: 30px;
	float: right;
	margin-top: 10px;
	margin-bottom: 10px;
	border-radius: 2px;
	background: ${colors.light_blue};
	font-size: 14px;
	font-weight: 400;
	color: ${colors.text_white};
	text-align: center;
	line-height: 30px;
	cursor: pointer;
	:hover {
		background: ${colors.light_blue_hover};
	}
	:active {
		background: ${colors.light_blue_hover};
	}
`;

const MsgArea = styled.div`
	width: 200px;
	height: 160px;
	padding: 8px;
	border-radius: 4px;
	border: solid 1px #d5d6d7;
	background-color: ${colors.bg_white};
	padding: 8px;
`;

const MsgContent = styled.div`
	width: 180px;
	height: 100px;
	word-break: break-all;
	overflow-y: auto;
`;

const IconArea = styled.div`
	width: 20px;
	height: 20px;
	background: url(${IconSearchNormal});
	cursor: pointer;
	:hover {
		background: url(${IconSearchHover});
	}
	:active {
		background: url(${IconSearchPress});
	}
`;
