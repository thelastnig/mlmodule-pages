import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import { makeStyles } from '@material-ui/core/styles';

import { colors } from 'styles';
import ListParamMaker from 'utils/ListParamMaker';

import { useStateActionHandler as userGroupActionHandler } from 'store/usergroup/hooks';
import { useAlertAction } from 'store/alert/hooks';

import Spacer from 'components/spacer';
import SelectCustom from 'components/common/SelectCustom';
import Checkbox, { CheckBoxHeader, checkClickCB } from 'components/common/table/Checkbox';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';
import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';

const useStyles = makeStyles((theme) => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120,
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	paper: {
		paper: { minWidth: '1656px', maxWidth: '1656px' },
		height: '935px',
	},
}));

export default function DlgGroupChange(props) {
	const { data, fetchList } = props;

	const classes = useStyles();
	const { getUsingGroupList, getJoinedGroupList, changeUserGroup } = userGroupActionHandler();

	const [inGroupList, setIngroupList] = useState([]);
	const [outGroupList, setOutgroupList] = useState([]);
	const { dialogName } = useDialogState();
	const { hideDialog } = useDialogAction();
	const isShow = dialogName === dialogList.GROUP_CHANGE;

	useEffect(() => {
		if (isShow) {
			fetchUsingGroupList();
			fetchJoinedGroupList();
		}
	}, [isShow]);

	const fetchUsingGroupList = useCallback(() => {
		let params = {
			user_id: data.user_id,
		};
		getUsingGroupList(params)
			.then((response) => {
				console.log('the response = ', response);
				let { list } = response.data;
				setOutgroupList(list);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally(() => {});
	});

	const fetchJoinedGroupList = useCallback(() => {
		let params = ListParamMaker.make({
			user_id: data.user_id,
		});
		getJoinedGroupList(params)
			.then((response) => {
				console.log('the response = ', response);
				let { list } = response.data;
				setIngroupList(list);
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally(() => {});
	});
	const addGroupClicked = (data) => {
		let list = [...inGroupList, data];
		setIngroupList(list);
		let tempOutGroups = [...outGroupList];
		const idx = tempOutGroups.findIndex((v) => {
			return v.group_id === data.group_id;
		});
		if (idx > -1) tempOutGroups.splice(idx, 1);
		setOutgroupList(tempOutGroups);
	};
	const removeGroupClicked = (dataArray) => {
		let removeGroup_ids = [];
		dataArray.forEach((v) => {
			removeGroup_ids.push(v.group_id);
		});
		let inGroups = [];
		let outGroups = [];
		inGroupList.forEach((v) => {
			let group_id = v.group_id;
			if (removeGroup_ids.includes(group_id)) {
				outGroups.push(v);
			} else {
				inGroups.push(v);
			}
		});
		setIngroupList(inGroups);
		setOutgroupList([...outGroupList, ...outGroups]);
	};

	const onConfirmClicked = (e) => {
		let group_ids = [];
		inGroupList.forEach((v) => {
			group_ids.push(v.group_id);
		});
		let params = {
			user_id: data.user_id,
			group_id: group_ids,
		};
		changeUserGroup(params)
			.then((response) => {
				console.log('then response = ', response);
				fetchList();
			})
			.catch((error) => {
				console.log('error ', error);
				// clearTimeout(timeInterval.current);
			})
			.finally((v) => {
				hideDialog();
			});
	};

	return (
		<div>
			<Dialog
				open={isShow}
				onClose={hideDialog}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				className={'group_change_dlg dialog_layout'}
				classes={{ paper: classes.paper }}
			>
				<DialogTitleComponent title={'Change Group'} toggle={hideDialog} />
				<DialogContent>
					<LeftArea data={data} group_list={outGroupList} clickHandler={addGroupClicked} />
					<Divider />
					<RightArea data={data} group_list={inGroupList} clickHandler={removeGroupClicked} />
				</DialogContent>
				<DialogFooter confirmClick={onConfirmClicked} cancelClick={hideDialog} />
			</Dialog>
		</div>
	);
}

const LeftArea = (props) => {
	const { data, group_list, clickHandler } = props;
	const [selectGroup, setSelectGroup] = useState('');

	const onGroupChange = useCallback((e) => {
		setSelectGroup(e);
	});

	const buttonClicked = useCallback(() => {
		if (!selectGroup) {
			return;
		}
		clickHandler(selectGroup);
		setSelectGroup('');
	});
	return (
		<Left>
			<FlexArea>
				<InputArea>
					<Label>User ID</Label>
					<Spacer />
					<DisabledInput>{data && data.user_id}</DisabledInput>
				</InputArea>
				<Spacer />
				<InputArea>
					<Label>User Name</Label>
					<Spacer />
					<DisabledInput>{data && data.user_nm}</DisabledInput>
				</InputArea>
			</FlexArea>

			<Spacer />
			<Spacer />
			<Spacer />
			<Spacer />
			<Spacer />

			<Label>그룹 추가</Label>
			<Spacer />
			<SelectCustom
				styleOptions={{
					width: '408px',
					height: '36px',
					maxHeight: '150px',
				}}
				isDisabled={false}
				isLoading={false}
				isClearable={false}
				isRtl={false}
				isSearchable={false}
				disabledColor={true}
				options={group_list}
				getOptionLabel={(option) => option.group_nm}
				getOptionValue={(option) => option.group_id}
				onChange={onGroupChange}
				value={selectGroup}
				label_key={'group_nm'}
				value_key={'group_id'}
				placeholder={'추가할 그룹을 선택해 주세요.'}
				isRemovePrefixCurrent={true}
			/>
			<Spacer size={'lg'} />
			<FlexEnd>
				<GreyButton onClick={buttonClicked} disabled={!selectGroup}>
					Add
				</GreyButton>
			</FlexEnd>
		</Left>
	);
};
const RightArea = (props) => {
	const { data, group_list, clickHandler } = props;

	const { showAlert } = useAlertAction();

	const [checkItems, setCheckItems] = useState([]);
	const buttonClicked = useCallback(() => {
		if (checkItems.length < 1) {
			return;
		}
		checkCreator();
	});
	const checkCreator = () => {
		let leaderItems = checkItems.filter((v) => {
			return v.create_user_id === data.user_id;
		});
		let message = '';
		if (leaderItems.length > 0) {
			message = '이 유저는 해당 그룹의 그룹장입니다. 그룹을 탈퇴하면 그룹이 종료 됩니다. 탈퇴시키겠습니까?';
		} else {
			message = '해당 그룹에서 이 유저를 탈퇴시키겠습니까?';
		}
		showAlert({
			message: message,
			isConfirm: true,
			onOk: () => {
				clickHandler(checkItems);
				setCheckItems([]);
			},
		});
	};
	return (
		<Right>
			<Label>현재 그룹</Label>
			<Spacer />
			<RightBox>
				<TDivider />
				<Th>
					<Th1>
						<CheckBoxHeader checkItems={checkItems} list={group_list} setCheckItems={setCheckItems} />
					</Th1>
					<Th2>Group</Th2>
					<Th3>User ID</Th3>
				</Th>
				<TDivider />
				<Tbody>
					{group_list.map((data, index) => (
						<>
							<StyledTableRow
								key={index}
								isChecked={checkItems.includes(data)}
								onClick={(e) => checkClickCB(data, checkItems, setCheckItems, true)}
							>
								{
									<>
										<Tr1 style={{ marginTop: '7px' }}>
											<Checkbox
												data={data}
												checked={checkItems.includes(data)}
												checkItems={checkItems}
												setCheckItems={setCheckItems}
												// NoClickable={true}
											/>
										</Tr1>
										<Tr2>{data.group_nm}</Tr2>
										<Tr3>{data.create_user_id}</Tr3>
									</>
								}
							</StyledTableRow>
						</>
					))}
				</Tbody>
				<BtnArea>
					<Spacer />
					<Spacer />
					<GreyButton onClick={buttonClicked} disabled={checkItems.length < 1}>
						그룹 삭제
					</GreyButton>
				</BtnArea>
			</RightBox>
		</Right>
	);
};

const TDivider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #eaebec;
`;

const BtnArea = styled.div`
	width: 100%;
	height: 52px;
	display: flex;
	flex-direction: column;
	align-items: flex-end;
`;

const Tbody = styled.div`
	width: 100%;
	height: 198px;
	overflow-y: auto;
`;

const Tr3 = styled.div`
	display: flex;
	align-items: center;
`;

const Tr2 = styled.div`
	width: 160px;
	display: flex;
	align-items: center;
	margin-right: 33px;
`;

const Tr1 = styled.div`
	width: 64px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Th3 = styled.div`
	display: flex;
	align-items: center;
`;

const Th2 = styled.div`
	width: 160px;
	display: flex;
	align-items: center;
	margin-right: 33px;
`;

const Th1 = styled.div`
	width: 64px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Th = styled.div`
	width: 100%;
	height: 40px;
	background-color: #f3f5f7;
	display: flex;
	font-size: 14px;
	font-weight: bold;
	letter-spacing: -0.3px;
	color: #1e1f22;
`;

export const StyledTableRow = styled.tr`
	width: 100%;
	height: 37px;
	padding: 1px 0 0 0;
	align-items: center;
	display: flex;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
	border-bottom: 1px solid #eaebec;
	${(props) => (props.isChecked ? `background: ${colors.hover_sel};` : `background: #fff`)}
	:hover {
		cursor: pointer;
		background: ${(props) => (props.onClick ? `${colors.hover_sel}` : null)};
	}
`;

const RightBox = styled.div`
	width: 425px;
	height: 312px;
	padding: 8px;
	border-radius: 2px;
	border: solid 1px #d5d6d7;
`;

const GreyButton = styled.button`
	width: 80px;
	height: 32px;
	outline: none;
	border: none;
	border-radius: 2px;
	background-color: ${colors.light_blue};
	color: ${colors.text_white};
	display: flex;
	justify-content: center;
	align-items: center;
	display: flex;
	&:hover:not(:disabled) {
		background-color: ${colors.light_blue};
		cursor: pointer;
	}
	:disabled {
		cursor: not-allowed;
		background: ${colors.button_gray_bg};
		color: ${colors.gray_dark};
	}
`;

const FlexEnd = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const FlexArea = styled.div`
	display: flex;
`;

const InputArea = styled.div`
	width: 200px;
	display: flex;
	flex-direction: column;
`;

const Divider = styled.div`
	width: 100%;
	height: 1px;
	background-color: #eaebec;
`;

const Right = styled.div`
	width: 473px;
	height: 396px;
	display: flex;
	flex-direction: column;
	padding: 16px 24px;
`;

const Left = styled.div`
	width: 456px;
	height: 396px;
	display: flex;
	flex-direction: column;
	padding: 16px 24px;
`;

const DialogContent = styled.div`
	display: flex;
	height: 396px;
	width: 100%;
`;

const DisabledInput = styled.div`
	width: 200px;
	height: 36px;
	border-radius: 4px;
	background-color: #f0f1f3;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: #9ea1a4;
	padding: 8px 16px;
`;

const Label = styled.div`
	height: 19px;
	font-size: 14px;
	letter-spacing: -0.3px;
	color: ${colors.text_black};
`;
