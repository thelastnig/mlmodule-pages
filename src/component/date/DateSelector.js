import React, { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';

import './DateSelector.css';
import { colors } from 'styles';
import DateUtil from "utils/DateUtil";
import imgButton from 'assets/icon/btn-calendar-icon-n.png';
import imgButtonH from 'assets/icon/btn-calendar-icon-hover.png';
import imgButtonP from 'assets/icon/btn-calendar-icon-p.png';

//TODO isSingleMode 상속 or mixin 알아보기
export default function DateSelector(props) {
	const { date, startDate, endDate, isShort, onApply } = props;

	const [selectedDate, setSelectedDate] = useState(new Date());
	const [selectedStartDate, setSelectedStartDate] = useState(new Date());
	const [selectedEndDate, setSelectedEndDate] = useState(new Date());
	const [isOpen, setIsOpen] = useState(false);
	const [isSingleMode, setIsSingleMode] = useState(false);

	const calendar = useRef(null);

	useEffect(() => {
		setIsSingleMode(Boolean(date));
		initializeDate();
	}, [date]);

	useEffect(() => {
		initializeDate();
	}, [startDate, endDate]);

	const initializeDate = () => {
		if (isSingleMode) {
			setSelectedDate(date);
		} else {
			setSelectedStartDate(startDate);
			(endDate) ? setSelectedEndDate(endDate) : setSelectedEndDate(startDate);
		}
	}

	const selectDate = (date) => {
		if (isSingleMode) {
			setSelectedDate(date);
		} else {
			if (DateUtil.isSameDate(selectedStartDate, selectedEndDate)) {
				if (DateUtil.isBefore(date, selectedStartDate)) {
					setSelectedStartDate(date);
					setSelectedEndDate(selectedStartDate);
				} else {
					setSelectedEndDate(date);
				}
			} else {
				setSelectedStartDate(date);
				setSelectedEndDate(date);
			}
		}
	};

	const openCalendar = () => {
		calendar.current.setOpen(true);
		setIsOpen(true);
	};

	const closeCalendar = () => {
		calendar.current.setOpen(false);
		setIsOpen(false);
	};

	const confirmDate = () => {
		if (isSingleMode) {
			onApply && onApply(selectedDate);
		} else {
			onApply && onApply(selectedStartDate, selectedEndDate);
		}

		closeCalendar();
	};

	const cancelDate = () => {
		initializeDate();
		closeCalendar();
	};

	const getText = () => {
		if (isSingleMode) {
			return DateUtil.parseDateToMMDDYYYY(selectedDate);
		} else {
			return (startDate && endDate) ? `${DateUtil.parseDateToMMDDYYYYRange(selectedStartDate, selectedEndDate)}` : '';
		}
	}

	const handleDateChangeRaw = (e) => {
		e.preventDefault();
	}

	return (
		<>
			<DatePicker
				className={isShort ? 'isShort' : ''}
				selected={isSingleMode ? selectedDate : selectedStartDate}
				value={getText()}
				startDate={selectedStartDate}
				endDate={selectedEndDate}
				shouldCloseOnSelect={false}
				onSelect={selectDate}
				onCalendarClose={cancelDate}
				onCalendarOpen={openCalendar}
				onChangeRaw={handleDateChangeRaw}
				ref={calendar}
			>
				<div className="button-container">
					<CancelBtn onClick={cancelDate}>Cancel</CancelBtn>
					<ConfirmBtn onClick={confirmDate}>Apply</ConfirmBtn>
				</div>
			</DatePicker>
			{!isSingleMode && <CalendarIcon disabled={isOpen} onClick={openCalendar} />}
		</>
	);
}

const CancelBtn = styled.div`
	display: inline-block;
	width: 80px;
	height: 32px;
	line-height: 32px;
	text-align: center;
	color: #b5bcc4;
	cursor: pointer;
	font-size: 12px;
	font-weight: 500;
`;

const ConfirmBtn = styled.div`
	display: inline-block;
	width: 80px;
	height: 32px;
	line-height: 32px;
	border-radius: 1px;
	background-color: ${colors.light_blue};
	text-align: center;
	color: ${colors.bg_white};
	cursor: pointer;
	font-size: 12px;
	font-weight: 500;
`;

const CalendarIcon = styled.div`
	width: 30px;
	height: 30px;
	z-index: 1;
	cursor: pointer;
	background: url(${imgButton});
	:hover {
		background: url(${imgButtonH});
	}
	:active {
		background: url(${imgButtonP});
	}
	${(props) => (props.disabled ? `pointer-events: none;` : ``)}
`;
