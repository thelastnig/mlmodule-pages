import React from 'react';

import DateUtil from 'utils/DateUtil';
import badgeIcon from 'assets/icon/bedge-new.png';

import { BadgeIcon } from 'components/common/StyledComponent';

const NEW_BEFORE_TIME = 1000 * 60 * 60 * 24;

// Table 리팩토링시 삭제 될 것
export default function NewBadge(props) {
	const { date } = props;
	console.log('date', date);
	return (
		<>
			{DateUtil.isNewBadgeInTime(date, NEW_BEFORE_TIME) ? <BadgeIcon src={badgeIcon} /> : ''}
		</>
	);
};