import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import FormatUtil from 'utils/FormatUtil';
import LocalStorageManager from 'utils/LocalStorageManager';
import SearchIconN from 'assets/icon/btn-search-n.png';
import SearchIconH from 'assets/icon/btn-search-hover.png';
import SearchIconP from 'assets/icon/btn-search-p.png';
import InputBoxReset from 'assets/icon/btn-delete-search.png';

export default function SearchInputComponent(props) {
	const { placeHolder, doSearch, filter_text, setFilterText, type, start_index, setStartIndex } = props;

	const [searchHistory, setSearchHistory] = useState([]);
	const [isInputFocused, setIsInputFocused] = useState(false);
	const [isHistoryClick, setIsHistoryClick] = useState(false);
	const [historyOpen, setHistoryOpen] = useState(false);

	useEffect(() => {
		if (type) {
			fetchSearchHistory();
		}
	}, [type]);

	const fetchSearchHistory = () => {
		let list = LocalStorageManager.getSearchHistory(type);
		setSearchHistory(list);
	};
	const change_searchText = useCallback((e) => {
		let value = FormatUtil.excludeSpecialChar(e.target.value);
		setFilterText(value);
	}, []);
	const startSearch = () => {
		if (start_index === undefined || setStartIndex === undefined) {
			doSearch();
		} else {
			if (start_index === 0) {
				doSearch();
			} else {
				setStartIndex(0);
			}
		}
		LocalStorageManager.addSearchHistory(type, filter_text);
		fetchSearchHistory();
	};

	useEffect(() => {
		if (isHistoryClick) {
			startSearch();
			setIsHistoryClick(false);
		}
	}, [filter_text]);

	const historyClicked = (searchWord) => {
		setFilterText(searchWord);
		setIsInputFocused(false);
		setIsHistoryClick(true);
	};

	useEffect(() => {
		if (isInputFocused && searchHistory && searchHistory.length > 0) {
			setHistoryOpen(true);
		} else {
			setHistoryOpen(false);
		}
	}, [isInputFocused, searchHistory]);

	const handleKeyPress = useCallback((e) => {
		if (e.key === 'Enter') {
			startSearch();
		}
	});

	return (
		<InputBoxWrapper>
			<InputBox>
				<SearchBox isFocused={isInputFocused}>
					<SearchInput
						placeholder={placeHolder}
						value={filter_text}
						onChange={change_searchText}
						onKeyPress={handleKeyPress}
						onFocus={(e) => {
							setIsInputFocused(true);
						}}
						onBlur={(e) => {
							setTimeout(() => {
								setIsInputFocused(false);
							}, 200);
						}}
						maxLength="100"
					/>
					<SearchBoxResetBtn onClick={(e) => setFilterText('')}>
						<img src={InputBoxReset} alt="" />
					</SearchBoxResetBtn>
				</SearchBox>
				<SearchIcon onClick={(e) => startSearch()} />
			</InputBox>
			{historyOpen && (
				<HistoryWrapper>
					{searchHistory.map((data, index) => (
						<HistoryItem onClick={(e) => historyClicked(data)}>{data}</HistoryItem>
					))}
				</HistoryWrapper>
			)}
		</InputBoxWrapper>
	);
}

const HistoryItem = styled.div`
	width: 100%;
	height: 40px;
	background-color: #ffffff;
	padding: 0 10px;
	display: flex;
	justify-content: center;
	flex-direction: column;
	:last-child {
		border: none;
	}
	:hover {
		background-color: rgba(0, 66, 130, 0.1);
		cursor: pointer;
	}
	${(props) =>
		props.isActive &&
		`
        background: #e1e4e7;
    `}
`;

const HistoryWrapper = styled.div`
	position: absolute;
	width: 100%;
	width: inherit;
	border: solid 1.2px #ced4da;
	top: 48px;
	box-shadow: '7px 8px 20px 0 rgba(0, 0, 0, 0.12)';
	overflow-y: auto;
	padding-bottom: 4px;
	-webkit-overflow-scrolling: touch;
	box-sizing: border-box;
	box-shadow: 7px 8px 20px 0 rgb(0 0 0 / 12%);
	border: 1px solid #d5d6d7;
	padding: 0;
	background-color: #ffffff;
	overflow-x: hidden;
	border-radius: 5px;
`;

const InputBoxWrapper = styled.div`
	width: 360px;
	position: relative;
`;

const InputBox = styled.div`
	width: 360px;
	height: 40px;
	display: flex;
`;

const SearchBox = styled.div`
	width: 320px;
	background: ${colors.bg_white};
	height: 40px;
	display: flex;
	border: solid 1.2px #ced4da;
	padding: 10px 10px 10px 16px;
	${(props) => (props.isFocused ? `border: solid 1.2px #005CB5;` : ``)};
`;

const SearchInput = styled.input`
	width: 300px;
	height: 20px;
	border: none;
	font-size: 15px;
	letter-spacing: -0.38px;
	color: #1e1f22;
	outline: none;
`;

const SearchBoxResetBtn = styled.div`
	width: 20px;
	height: 20px;
	margin-left: 10px;
	cursor: pointer;
`;

const SearchIcon = styled.div`
	width: 40px;
	height: 40px;
	cursor: pointer;
	background: url(${SearchIconN});
	:hover {
		background: url(${SearchIconH});
	}
	:active {
		background: url(${SearchIconP});
	}
`;
