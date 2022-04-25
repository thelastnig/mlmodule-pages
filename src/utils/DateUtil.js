import moment from 'moment';

class DateUtil {
	static parseDateToMMDDYYYY(date) {
		return moment(date).format('MM/DD/YYYY');
	};

	static parseDateToMMDDYYYYRange(start, end) {
		return `${moment(start).format('MM/DD/YYYY')} - ${moment(end).format('MM/DD/YYYY')}`;
	};

	static parseDateToYYYYMMDD(date) {
		return (date) ? moment(date).format('YYYY-MM-DD') : '-';
	};

	static parseTimeToDHM(time) {
		const days = Math.floor((time) / (60 * 24));
		const hours = Math.floor((time) / (60) % 24);
		const minutes = Math.floor((time) % 60);

		return `${(days > 0) ? days + 'd' : ''} ${(hours > 0) ? hours + 'h' : ''} ${minutes}m`.trim();
	}

	static isSameDate(source1, source2) {
		return moment(source1).isSame(moment(source2), 'day');
	};

	static isBefore(target, standard) {
		return moment(target).diff(moment(standard)) < 0;
	};

	static isInTime(date, time) {
		const diff = moment(date).diff(moment());
		return 0 < diff && diff < time;
	};

	static isNewBadgeInTime(date, time) {
		const diff = moment(moment()).diff(date);
		return 0 < diff && diff < time;
	};

	static isValidDateRange = (start, end) => {
		return moment(start).diff(moment(end)) < 0;
	};
}

export default DateUtil;
