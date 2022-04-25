import React from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import iconTotal from 'assets/icon/icon-home-project.png';
import iconSeeAll from 'assets/icon/btn-see-all-n.png';
import iconReady from 'assets/icon/icon-home-ready.png';
import iconWorking from 'assets/icon/icon-home-working.png';
import iconCompleted from 'assets/icon/icon-home-completed.png';
import { THEME } from 'styles/theme/theme';

export default function BoardComponent({ counts, boardClick, boardType }) {
	return (
		<FilterBox className={'FilterBox'}>
			<DashBoardContainer>
				<Board style={{ marginRight: '4%' }} onClick={(e) => boardClick('total')} selected={boardType === 'total'}>
					<BoardTitle>
						<HomeIcon src={iconTotal} />
						<div>Total Projects</div>
					</BoardTitle>
					<BoardCnt>{counts?.total}</BoardCnt>
					<Triangle>
						{'See all '}
						<TriangleIcon src={iconSeeAll} />
					</Triangle>
				</Board>

				<Board style={{ marginRight: '4%' }} onClick={(e) => boardClick('ready')} selected={boardType === 'ready'}>
					<BoardTitle>
						<HomeIcon src={iconReady} />
						<div>Ready</div>
					</BoardTitle>
					<BoardCnt>{counts?.ready}</BoardCnt>
					<Triangle>
						{'See all'}
						<TriangleIcon src={iconSeeAll} />
					</Triangle>
				</Board>

				<Board style={{ marginRight: '4%' }} onClick={(e) => boardClick('working')} selected={boardType === 'working'}>
					<BoardTitle>
						<HomeIcon src={iconWorking} />
						<div>Working</div>
					</BoardTitle>
					<BoardCnt>{counts?.working}</BoardCnt>
					<Triangle>
						{'See all'}
						<TriangleIcon src={iconSeeAll} />
					</Triangle>
				</Board>

				<Board onClick={(e) => boardClick('complete')} selected={boardType === 'complete'}>
					<BoardTitle>
						<HomeIcon src={iconCompleted} />
						<div>Complete</div>
					</BoardTitle>
					<BoardCnt>{counts?.completed}</BoardCnt>
					<Triangle>
						{'See all'}
						<TriangleIcon src={iconSeeAll} />
					</Triangle>
				</Board>
			</DashBoardContainer>
		</FilterBox>
	);
}

const FilterBox = styled.div`
	width: 100%;
	height: 144px;
`;
const DashBoardContainer = styled.div`
	width: 100%;
	height: 144px;
	display: flex;
	flex-direction: row;
	padding: 0px 63px 0 64px;
`;
const Board = styled.div`
	width: 22%;
	height: 144px;
	box-shadow: 8px 8px 10px 0 rgba(0, 0, 0, 0.03);
	border: solid 1px #d5dce4;
	background-color: ${THEME.background};
	z-index: 2;
	border-radius: 4px;
	color: ${colors.text_black};
	padding: 16px;
	cursor: pointer;
	${(props) => (props.selected && props.selected ? `background: ${colors.press_blue}` : ``)}
	:hover {
		background: ${colors.blue_hover};
	}
	:active {
		background: ${colors.light_blue_press};
	}
`;
const BoardTitle = styled.div`
	font-size: 15px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.bg_white};
	padding: 0;
	margin: 0;
	height: 36px;
	line-height: 36px;
	display: flex;
`;
const BoardCnt = styled.div`
	justify-content: center;
	display: flex;
	font-weight: bold;
	height: 60px;
	line-height: 60px;
	font-size: 32px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.8px;
	text-align: center;
	color: ${colors.bg_white};
`;
const HomeIcon = styled.img`
	margin-right: 10px;
`;
const TriangleIcon = styled.img`
	float: right;
`;
const Triangle = styled.div`
	height: 19px;
	width: 100%;
	font-size: 14px;
	letter-spacing: -0.35px;
	text-align: right;
	color: ${colors.bg_white};
	display: inline-block;
	width: 65px;
	float: right;
`;
