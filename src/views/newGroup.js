import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import { colors } from 'styles';
import DateUtil from 'utils/DateUtil';

import { useInput, useInputWithFiler } from 'store/root/hooks';
import { useAlertAction } from 'store/alert/hooks';
import { useStateActionHandler as useUserGroupStateActionHandler } from 'store/usergroup/hooks';
import { useStateActionHandler } from 'store/group/hooks';

import { PageWrapper, WhiteBox, MarginLeft, TitleComponent } from 'components/common/StyledComponent';
import { ROUTER_USER_GROUP } from 'components/layout/MenuConst';
import Button from 'component/Button';
import DateSelector from 'component/date/DateSelector';

const DATE_FORMAT = 'YYYY-MM-DD';

export default function NewGroup() {
	const history = useHistory();
	const { showAlert } = useAlertAction();
	const { addGroup } = useStateActionHandler();
	const { setInitTabType } = useUserGroupStateActionHandler();

	const [group_nm, change_group_nm] = useInputWithFiler(false);
	const [description, change_description] = useInput('');
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [validDate, setValidDate] = useState(false);

	const okClicked = useCallback(() => {
		if (!validDate) {
			showAlert({
				message: 'End date는 Start date보다 크게 설정하시기 바랍니다.',
			});
			return;
		}
		
		let params = {
			group_nm: group_nm,
			start_date: moment(startDate).format(DATE_FORMAT),
			end_date: moment(endDate).format(DATE_FORMAT),
			description: description,
		};
		addGroup(params)
			.then((response) => {
				gotoList();
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	const gotoList = useCallback(() => {
		setInitTabType('G');
		history.push('/' + ROUTER_USER_GROUP);
	});

	useEffect(() => {
		setValidDate(DateUtil.isValidDateRange(startDate, endDate));
	}, [startDate, endDate]);

	return (
		<>
			<PageWrapper>
				<TitleComponent text={'New Group'} />
				<WhiteBox style={{ marginTop: '42px', height: '518px', display: 'flex' }}>
					<LeftBox>
						<FormLabel text={'* Group'} style={{ marginBottom: '8px' }} />
						<CustomInput placeholder="내용을 입력해주세요." value={group_nm} onChange={change_group_nm} maxLength="100" />
						<SelectBox>
							<div>
								<FormLabel text={'* Start date'} style={{ marginTop: '20px', marginBottom: '8px' }} />
								<DateSelector date={startDate} onApply={setStartDate} />
							</div>
							<MarginLeft size={'8px'} />
							<div>
								<FormLabel text={'* End date'} style={{ marginTop: '20px', marginBottom: '8px' }} />
								<DateSelector date={endDate} onApply={setEndDate} />
							</div>
						</SelectBox>

						<FormLabel text={'Description'} style={{ marginTop: '20px', marginBottom: '8px' }} />
						<CustomDescription placeholder="내용을 입력해주세요." value={description} onChange={change_description} maxLength="5000" />
					</LeftBox>
				</WhiteBox>
				<BottomBox>
					<Button colorType={'blue'} size={'xsmall'} onClick={okClicked} >Create</Button>
				</BottomBox>
			</PageWrapper>
		</>
	);
}
const FormLabel = ({ text, style }) => <StyledLabelTitle style={style}>{text}</StyledLabelTitle>;
const SelectBox = styled.div`
	width: 512px;
	display: flex;
	flex-direction: row;
`;
const CustomInput = styled.input`
	width: 100%;
	height: 36px;
	padding: 5px 10px;
	border-radius: 4px;
	border: solid 1.2px #ced4da;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5;
	}
`;

const CustomDescription = styled.textarea`
	width: 512px;
	height: 244px;
	padding: 8px 16px;
	border-radius: 4px;
	border: solid 1.2px ${colors.gray_default};
	resize: none;
	outline: none;
	:focus {
		border: solid 1.2px #005cb5 !important;
	}
`;

const LeftBox = styled.div`
	width: 512px;
	margin: 32px 32px;
	flex-direction: column;
	justify-content: center;
`;

const StyledLabelTitle = styled.div`
	height: 20px;
	font-family: NotoSans;
	font-size: 14px;
	font-weight: bold;
	font-stretch: normal;
	font-style: normal;
	line-height: normal;
	letter-spacing: -0.3px;
	color: ${colors.bg_black};
`;

const BottomBox = styled.div`
	width: 1524px;
	margin: 16px 64px 0 64px;
	display: flex;
	justify-content: flex-end;
`;
