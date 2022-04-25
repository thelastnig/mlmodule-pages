import styled from 'styled-components';
import Dialog from '@material-ui/core/Dialog';
import DialogTitleComponent from 'components/modal/DialogTitle';
import DialogFooter from 'components/modal/DialogFooter';

import { colors } from 'styles';
import { THEME } from 'styles/theme/theme';

import { useDialogState, useDialogAction } from 'store/dialog/hooks';
import { dialogList } from 'constants/dialog';
import { useState } from 'react';

const SECTION_LIST = {
    IMAGE_CLASSIFICATION: 0,
    OBJECT_DETECTION: 1,
    INSTANCE_SEG: 2,
    SEMANTIC_SEG: 3,
};

const DataLabelUploadInfo = ({

}) => {
    const { dialogName } = useDialogState();
    const { hideDialog } = useDialogAction();
    const isShow = dialogName === dialogList.DATA_LABEL_UPLOAD_INFO;

    const [curSection, setCurSection] = useState(SECTION_LIST.IMAGE_CLASSIFICATION);

    const handleClickSection = (sectionId) => {
        setCurSection(sectionId);
    };

    return (
        <div>
            <Dialog 
                className={'data_label_info_dialog dialog_layout'}
				open={isShow}
				onClose={hideDialog}
            >
                <DialogTitleComponent title={'Label 파일 형식'} toggle={hideDialog} />
                <DialogContent>
                    <SubTitle>1. 별도의 어노테이션 폴더를 생성하여 각 Type에 맞는 데이터 파일을 준비합니다.</SubTitle>
                    <TypesBox>
                        <JobType style={{ paddingTop: "7px" }} selected={curSection === SECTION_LIST.IMAGE_CLASSIFICATION} onClick={() => handleClickSection(SECTION_LIST.IMAGE_CLASSIFICATION)}>
                            Image<br />Classification<br />예시
                        </JobType>
                        <JobType style={{ paddingTop: "20px" }} selected={curSection === SECTION_LIST.OBJECT_DETECTION} onClick={() => handleClickSection(SECTION_LIST.OBJECT_DETECTION)}>
                            Object Detection<br />예시
                        </JobType>
                        <JobType style={{ paddingTop: "7px" }} selected={curSection === SECTION_LIST.INSTANCE_SEG} onClick={() => handleClickSection(SECTION_LIST.INSTANCE_SEG)}>
                            Instance<br />Segmentation<br />예시
                        </JobType>
                        <JobType style={{ paddingTop: "7px" }} selected={curSection === SECTION_LIST.SEMANTIC_SEG} onClick={() => handleClickSection(SECTION_LIST.SEMANTIC_SEG)}>
                            Semantic<br />Segmentation<br />예시
                        </JobType>
                    </TypesBox>
                    <TypeDescBox>
                    {curSection === SECTION_LIST.IMAGE_CLASSIFICATION && (
                        <>
                            <ExampleSectionDesc>
                                이미지 데이터와 매치되는 json 파일을 다음과 같이 생성합니다.<br />
                                메모장 프로그램으로도 json 파일을 만들 수 있습니다.<br />
                                이 때, 데이터와 json파일의 수는 같아야 합니다.
                            </ExampleSectionDesc>
                            <ExampleSectionTitle>
                                [Image Classification label format example]<br />
                                * category가 필수입니다.
                            </ExampleSectionTitle>
                            <ExampleSection>
                                {`{`}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;"image": {`{`}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 1, "width": 908, "height": 626, "file_name": "156d98a8896b9f.jpg"<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;{`}`},<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;"instances": [{`{`}<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id": 1<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;{`}`}]<br />
                                {`}`}<br />
                            </ExampleSection>
                        </>
                    )}
                    {curSection === SECTION_LIST.OBJECT_DETECTION && (
                        <>
                            <ExampleSectionDesc>
                                이미지 데이터와 매치되는 json 파일을 다음과 같이 생성합니다.<br />
                                메모장 프로그램으로도 json 파일을 만들 수 있습니다.<br />
                                이 때, 데이터와 json파일의 수는 같아야 합니다.
                            </ExampleSectionDesc>
                            <ExampleSectionTitle>
                                [Object Detection label format example]<br />
                                * category와 bbox가 필수입니다.
                            </ExampleSectionTitle>
                            <ExampleSection>
                                {`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"image": {`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 139, "width": 640, "height": 426, "file_name": "000000000139.jpg"<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{`}`},<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"instances": [{`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id": 64,<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"segmentation": [[240.86, 211.31, 240.16, 197.19,236.98, 192.26, 237.34, 187.67, 245.8, 188.02, 243.33, 176.02, 250.39, 186.96, 251.8, 166.85, 255.33, 142.51, 253.21, 190.49, 261.68, 183.08, 258.86, 191.2, 260.98, 206.37, 254.63, 199.66, 252.51, 201.78, 251.8, 212.01]],<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"bbox": [236.98, 142.51, 261.68, 212.01]<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{`}`}]<br />
                                {`}`}
                            </ExampleSection>
                        </>
                    )}
                    {curSection === SECTION_LIST.INSTANCE_SEG && (
                        <>
                            <ExampleSectionDesc>
                                이미지 데이터와 매치되는 json 파일을 다음과 같이 생성합니다.<br />
                                메모장 프로그램으로도 json 파일을 만들 수 있습니다.<br />
                                이 때, 데이터와 json파일의 수는 같아야 합니다.
                            </ExampleSectionDesc>
                            <ExampleSectionTitle>
                                [Instance Segmentation label format example]<br />
                                * category와 bbox, segmentation 좌표가 필수입니다.
                            </ExampleSectionTitle>
                            <ExampleSection>
                                {`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"image": {`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"id": 139, "width": 640, "height": 426, "file_name": "000000000139.jpg"<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{`}`},<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;"instances": [{`{`}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"category_id": 64,<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"segmentation": [[240.86, 211.31, 240.16, 197.19,236.98, 192.26, 237.34, 187.67, 245.8, 188.02, 243.33, 176.02, 250.39, 186.96, 251.8, 166.85, 255.33, 142.51, 253.21, 190.49, 261.68, 183.08, 258.86, 191.2, 260.98, 206.37, 254.63, 199.66, 252.51, 201.78, 251.8, 212.01]],<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"bbox": [236.98, 142.51, 261.68, 212.01]<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{`}`}]<br />
                                {`}`}
                            </ExampleSection>
                        </>
                    )}
                    {curSection === SECTION_LIST.SEMANTIC_SEG && (
                        <>
                            <ExampleSectionTitle>
                                [Semantic Segmentation label format example]                                
                            </ExampleSectionTitle>
                            <ExampleSection>
                                - Semantic Segmentation은 JSON확장자의 Label을 사용하지 않습니다.<br /><br />
                                - 학습에 사용할 이미지 파일과 같은 이름의 Mask 파일을 준비합니다.<br />
                                &nbsp;&nbsp;&nbsp;(Mask는 png, jpg 확장자를 갖는 이미지 형식만 가능합니다.
                            </ExampleSection>
                        </>
                    )}
                    </TypeDescBox>

                    <SubTitle>2. 폴더와 같은 경로에 JSON 파일을 "meta.json" 이름으로 하나 생성합니다.<br />&nbsp;&nbsp;&nbsp;&nbsp;분류할 종류와 이름을 적은 후, 총 데이터의 개수를 기입합니다.</SubTitle>
                    <ExampleMetaFile>
                        <ExampleSectionTitle>[meta.json 파일 예시]</ExampleSectionTitle>
                        <ExampleSection>{`{"class_names": ["car", "person", "truck", "laptop"], "num_images": 304}`}</ExampleSection>
                    </ExampleMetaFile>

                    <SubTitle>3. 과정 1에서 생성한 어노테이션 파일과 meta.json 파일을 하나의 zip 파일로 압축합니다.</SubTitle>
                </DialogContent>
                <DialogFooter confirmClick={hideDialog} confirmTitle={'확인'} />                
            </Dialog>
        </div>
    );
};

const DialogContent = styled.div`
	padding: 24px 24px;	
`;

const SubTitle = styled.div`
    font-size: 15px;
    font-weight: 550;
    color: ${colors.text_black};
    letter-spacing: -0.4px;
    margin-bottom: 10px;    
`;

const TypesBox = styled.div`
    display: flex;
    margin-bottom: 10px;
    padding-left: 15px;
`;

const TypeDescBox = styled.div`
    margin-bottom: 20px;
    padding-left: 15px;
    padding-right: 15px;
`;

const JobType = styled.div`
    width: 131px;
    height: 80px;
    margin-right: 15px;
    box-shadow: 8px 8px 10px 0 rgba(0, 0, 0, 0.03);
	border: solid 1px #d5dce4;
    background-color: ${THEME.background};
    :hover {
		background: ${colors.blue_hover};
	}
	:active {
		background: ${colors.light_blue_press};
	}
    ${({selected}) => (selected ? `background: #0355a6` : ``)}
    color: ${colors.bg_white};    
    text-align: center;
    cursor: pointer;
    font-size: 14px;
`;

const ExampleMetaFile = styled.div`
    margin-bottom: 20px;
    font-size: 13px;
    padding-left: 15px;
    padding-right: 15px;
`;

const ExampleSectionDesc = styled.div`
    background: #edf6ff;
    border-radius: 3px;
    padding: 10px;
    font-size: 13px;
    margin-bottom: 10px;
    color: ${colors.text_black};
`;

const ExampleSectionTitle = styled.div`
    font-size: 13px;
    font-weight: bold;
    color: ${colors.text_black};
`;

const ExampleSection = styled.div`
    background: #f0f1f2;
    border-radius: 3px;
    padding: 10px;
    font-size: 13px;
    color: ${colors.text_black};
`;

export default DataLabelUploadInfo;