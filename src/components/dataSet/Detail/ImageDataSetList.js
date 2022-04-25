import React, { memo, useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from 'styles';
import agent from 'lib/apis';

import Spacer from 'components/spacer';
import { SortIcon, TableRow } from 'components/common/table/TableComponent';
import { BoxTitle, DatasetImageContext } from 'components/dataSet/Detail/ImageComponent';
import { DataSetDetailContext } from 'views/DataDetail';

const ImageDataSetList = memo((props) => {
	const { dataset_id } = useContext(DataSetDetailContext);
	const { selectImage, setSelectImage } = useContext(DatasetImageContext);

	const [sorting, setSorting] = useState('file_name');
	const [sorting_type, setSorting_type] = useState(true);
	const [image_list, set_image_list] = useState([]);

	const fetchImageDataList = useCallback(() => {
		let params = {
			dataset_id: dataset_id, //sample dataset_id : 198
			// sorting,
			// sorting_type : sorting_type ? "asc" : "desc",
		};
		agent
			.getImageDataList({ params })
			.then((response) => {
				console.log('then response = ', response);
				const { image_list } = response.data;
				set_image_list(image_list);
				if (image_list.length > 0) {
					setSelectImage(image_list[0]);
				}
			})
			.catch((error) => {
				console.log('error ', error);
			})
			.finally((v) => {});
	});
	useEffect(() => {
		fetchImageDataList();
	}, [dataset_id]);

	const updateSortingCB = ({ sorting, sorting_type }) => {
		setSorting(sorting);
		setSorting_type(sorting_type);
	};

	useEffect(() => {
		let list = [...image_list];
		list.sort((a, b) => {
			if (a[sorting] > b[sorting]) {
				return sorting_type ? 1 : -1;
			}
			if (a[sorting] < b[sorting]) {
				return sorting_type ? -1 : 1;
			}
		});
		set_image_list(list);
	}, [sorting, sorting_type]);

	return (
		<BottomLeft>
			<BoxTitle>Content</BoxTitle>
			<Spacer size={'lg'} />
			<div>
				<TableHeader>
					<Th1>
						<div>No.</div>
					</Th1>
					<Th2>
						<SortIcon
							columnName={'NAME'}
							sortColumn={'file_name'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</Th2>
					<Th3>
						<SortIcon
							columnName={'Type'}
							sortColumn={'file_type'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</Th3>
					<Th4>
						<SortIcon
							columnName={'Size'}
							sortColumn={'file_size'}
							sorting={sorting}
							sorting_type={sorting_type}
							updateSortingCB={updateSortingCB}
						/>
					</Th4>
				</TableHeader>
				<TableBody>
					{image_list.map((data, index) => {
						return (
							<TableRow key={index} isChecked={selectImage === data} onClick={(e) => setSelectImage(data)}>
								{
									<>
										<Th1>{index + 1}</Th1>
										<Th2>{data.file_name}</Th2>
										<Th3>{data.file_type}</Th3>
										<Th4>{data.file_size}</Th4>
									</>
								}
							</TableRow>
						);
					})}
				</TableBody>
			</div>
		</BottomLeft>
	);
});
export default ImageDataSetList;

const BottomLeft = styled.div`
	width: 692px;
	height: 100%;
`;

const Th4 = styled.div`
	display: flex;
`;

const Th3 = styled.div`
	width: 40px;
	margin-right: 53px;
	display: flex;
`;
const Th2 = styled.div`
	width: 360px;
	margin-right: 25px;
	display: flex;
`;
const Th1 = styled.div`
	margin-left: 16px;
	width: 80px;
	margin-right: 16px;
	display: flex;
`;

const TableBody = styled.div`
	height: 200px;
	overflow-y: auto;
`;
const TableHeader = styled.div`
	width: 692px;
	height: 40px;
	background: ${colors.list_header};
	color: ${colors.text_black};
	font-size: 14px;
	display: flex;
	font-weight: 700;
	align-items: center;
`;
