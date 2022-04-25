import { useState, useCallback } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import DateSelector from 'component/date/DateSelector';

export default function DateSelectorWithTerm(props) {
	const TERM_BUTTON_LIST = [
		{value: 0, text: 'Days'},
		{value: 7, text: 'Weeks'},
		{value: 30, text: 'Months'},
	]

	//TODO setStartDate, setEndDate -> Table header 생성 후 제거 (onApply)
	const { isShort, startDate, endDate, setStartDate, setEndDate } = props;

	const [selectedTerm, setSelectedTerm] = useState(0);

	const clearDate = useCallback(() => {
		setSelectedTerm(null);
		setStartDate(new Date());
		setEndDate('');
	}, [selectedTerm]);

	const setDateByTerm = (term) => {
		let beforeDate = new Date().setDate(new Date().getDate() - term);

		setSelectedTerm(term)
		setStartDate(beforeDate);
		setEndDate(new Date());
	}

	const apply = (selectedStartDate, selectedEndDate) => {
		if (!(startDate === selectedStartDate && endDate === selectedEndDate)) {
			setSelectedTerm(null);
			setStartDate(selectedStartDate);
			setEndDate(selectedEndDate);
		}
	}

	return (
		<>
			{/* TODO 버튼 리팩토링 */}
			<ButtonGroup isShort={isShort}>
				{ TERM_BUTTON_LIST.map((button) => {
					return <TabButton
						isShort={isShort}
						isSelected={selectedTerm === button.value}
						onClick={() => {(selectedTerm === button.value) ? clearDate() : setDateByTerm(button.value)}}
					>
						{button.text}
					</TabButton>
				})}
			</ButtonGroup>

			<DateSelector
				startDate={startDate}
				endDate={endDate}
				onApply={apply}
				isShort={isShort}
			/>
		</>
	);
}

const ButtonGroup = styled.div`
	width: 210px;
	height: 30px;
	border-radius: 2px;
	background-color: #eaebee;
	display: flex;
	align-items: center;
	margin-right: 8px;
	${(props) => props.isShort ? `width: 150px;` : ``}
`;

const TabButton = styled.div`
	width: 70px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	letter-spacing: -0.35px;
	cursor: pointer;
	border-top-right-radius: 2px;
	border-bottom-right-radius: 2px;
	
	${(props) => props.isShort ? `width: 50px; font-size:12px;` : ``}
	${(props) =>
		props.isSelected ?
			`
				background-color: ${colors.light_blue};
				color: ${colors.bg_white};
				
			`
			:
			`
				background-color: #d5dce4;
				color: ${colors.gray_dark};
				:hover {
					background: rgba(0, 0, 0, 0.12);
				}
			`
	}
`;
