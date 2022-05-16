import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';

import { colors } from 'styles';
import ListMore from 'assets/icon/btn-list-more-n.png';
import ListMoreHover from 'assets/icon/btn-list-more-p.png';

import PopoverMenuItem from 'components/common/PopoverMenuItem';

import TooltipCustom from 'components/common/TooltipCustom';

export default function CommonMoreButton(props) {
	const { list, style, guideText } = props;

	const [isClickedBtn, setIsClickedBtn] = useState(false);

	const buttonRef = useRef();

	const [anchorEl, setAnchorEl] = React.useState(null);

	const handleClick = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setIsClickedBtn(true);
		setAnchorEl(anchorEl ? null : event.currentTarget);
	};

	const handleClose = (event) => {
		event.preventDefault();
		event.stopPropagation();
		setAnchorEl(null);
	};

	return (
		<>
			<div onClick={handleClick} style={{ cursor: 'pointer' }}  ref={buttonRef}>
				<MoreIcon />
				{(guideText && !isClickedBtn) && (				
					<TooltipCustom text={guideText} parent={buttonRef} isUpSide={true} margin={10} />				
				)}
			</div>
			<StyledMenu id="customized-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleClose}>
				<PopoverMenu style={style}>
					{list.map((data, index) => (
						<PopoverMenuItem
							index={index}
							key={index}
							text={data.text}
							onClick={(e) => {
								data.onClick(e);
								handleClick(e);
							}}
							disabled={data.disabled}
							tooltip={data.tooltip}
						/>
					))}
				</PopoverMenu>
			</StyledMenu>
		</>
	);
}

const StyledMenu = withStyles({
	paper: {
		borderRadius: '4px',
		border: 'solid 1px #d5d6d7',
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

const PopoverMenu = styled.div`
	width: 156px;
	background-color: ${colors.bg_white};
	padding: 0 8px;
`;

const MoreIcon = styled.div`
	height: 20px;
	width: 20px;
	background: url(${ListMore});
	:hover {
		background: url(${ListMoreHover});
	}
`;
