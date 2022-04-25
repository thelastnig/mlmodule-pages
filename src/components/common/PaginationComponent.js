import React, { useState, useEffect, useCallback } from 'react';
import styled, { css } from 'styled-components';

import { colors } from 'styles';
import FirstIcon from 'assets/icon/pagination-first.png';
import PrevIcon from 'assets/icon/pagination-prev.png';
import NextIcon from 'assets/icon/pagination-next.png';
import LastIcon from 'assets/icon/pagination-last.png';

//표시할 최대 pagination 개수
const MAX_PAGINATION_LENGTH = 10;
const PAGINATION_FIRST = 'first';
const PAGINATION_PREV = 'prev';
const PAGINATION_NEXT = 'next';
const PAGINATION_LAST = 'last';

export default function PaginationComponent(props) {
	const { totalCnt, startIndex, maxRowCnt, setStartIndex } = props;
	const [paginationList, setPaginationList] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [lastPage, setLastPage] = useState(1);
	useEffect(() => {
		let paginationMax = Math.ceil(totalCnt / maxRowCnt) || 1;
		setLastPage(paginationMax);
		let currentPage = Math.ceil(startIndex / maxRowCnt);
		setCurrentPage(currentPage);

		// pagination의 최대 개수가 10개 이므로 화면에 10개만 보여주는 코드
		let temp = [];
		let start = 1;
		let half = MAX_PAGINATION_LENGTH / 2;
		let max = paginationMax;
		if (currentPage < half) {
			if (paginationMax > MAX_PAGINATION_LENGTH) {
				max = MAX_PAGINATION_LENGTH;
			} else {
				max = paginationMax;
			}
		} else if (currentPage > max - half) {
			start = max - MAX_PAGINATION_LENGTH;
		} else {
			start = currentPage - half;
			max = currentPage + half;
		}
		if (max > MAX_PAGINATION_LENGTH) {
			start = max - MAX_PAGINATION_LENGTH + 1;
		}
		if (start < 1) {
			start = 1;
		}
		for (start; start <= max; start++) {
			temp.push(start);
		}

		setPaginationList(temp);
	}, [totalCnt, startIndex]);

	const buttonClicked = useCallback((v) => {
		let tempPage = currentPage;
		if (v === PAGINATION_FIRST) {
			tempPage = 1;
		} else if (v === PAGINATION_PREV) {
			if (tempPage > 1) {
				tempPage = tempPage - 1;
			} else {
				tempPage = 1;
			}
		} else if (v === PAGINATION_NEXT) {
			if (tempPage < paginationList[paginationList.length - 1]) {
				tempPage = tempPage + 1;
			} else {
				tempPage = paginationList[paginationList.length - 1];
			}
		} else if (v === PAGINATION_LAST) {
			tempPage = lastPage;
		} else {
			tempPage = v;
		}
		let targetIndex = (tempPage - 1) * maxRowCnt + 1;
		setStartIndex(targetIndex - 1);
	});
	return (
		<PaginationArea>
			<FirstButton disabled={currentPage === 1} onClick={(e) => buttonClicked(PAGINATION_FIRST)} />
			<PrevButton disabled={currentPage === 1} onClick={(e) => buttonClicked(PAGINATION_PREV)} />
			{paginationList.map((data, index) => (
				<IndexBtn key={index} isSelect={currentPage === data} onClick={(e) => buttonClicked(data)}>
					{data}
				</IndexBtn>
			))}
			<NextButton disabled={currentPage === lastPage} onClick={(e) => buttonClicked(PAGINATION_NEXT)} />
			<LastButton disabled={currentPage === lastPage} onClick={(e) => buttonClicked(PAGINATION_LAST)} />
		</PaginationArea>
	);
}

const PaginationArea = styled.div`
	// background: red;
	height: 36px;
	display: flex;
`;
const PaginationBtn = css`
	width: 36px;
	height: 36px;
	border-radius: 20px;
	outline: none;
	border: none;
	background-color: #f4f7fc;
	&:hover:not(:disabled) {
		background-color: rgba(0, 66, 130, 0.1);
		cursor: pointer;
	}
	&:disabled {
		cursor: not-allowed;
	}
`;
const PaginationBtnRectangle = css`
	width: 36px;
	height: 36px;
	outline: none;
	border: none;
	background-color: #f4f7fc;
	border-radius: 2px;
	&:hover:not(:disabled) {
		background-color: rgba(0, 66, 130, 0.1);
		cursor: pointer;
	}
	&:disabled {
		cursor: not-allowed;
	}
`;
const IndexBtn = styled.div`
	${PaginationBtn}
	text-align: center;
	line-height: 36px;
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	${(props) =>
		props.isSelect &&
		`
      background-color: ${colors.press_blue};
      color: ${colors.bg_white};
    `}
`;
const FirstButton = styled.button`
	background-image: url(${FirstIcon});
	${PaginationBtnRectangle}
`;
const PrevButton = styled.button`
	background-image: url(${PrevIcon});
	${PaginationBtnRectangle}
`;
const NextButton = styled.button`
	background-image: url(${NextIcon});
	${PaginationBtnRectangle}
`;
const LastButton = styled.button`
	background-image: url(${LastIcon});
	${PaginationBtnRectangle}
`;
