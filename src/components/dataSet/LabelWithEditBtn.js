import styled from 'styled-components';
import EditImg from 'assets/icon/btn-edit.png';
import EditImgHover from 'assets/icon/btn-edit-hover.png';
import EditImgPress from 'assets/icon/btn-edit-press.png';
import Tooltip from 'components/common/Tooltip';
import { uuid } from 'uuidv4';

const LabelWithEditBtn = ({
    txt,    
    onClickEditBtn,
}) => {
    const tooltipId = uuid();

    return (
        <Wrapper>
            <EditBtn data-tip data-for={tooltipId} onClick={onClickEditBtn}>
                <Tooltip id={tooltipId} text={'라벨을 수정 할 수 있습니다.'}/>
            </EditBtn>
            <LabelTxt>{txt}</LabelTxt>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    align-items: center;
    display: flex;
`;

const EditBtn = styled.div`
    width: 17px;
    height: 17px;    
    background: url(${EditImg}) no-repeat;
    :hover {
		background: url(${EditImgHover}) no-repeat;
	}
	:active {
		background: url(${EditImgPress}) no-repeat;
	}
`;

const LabelTxt = styled.div`
    margin-left:5px;
`;

export default LabelWithEditBtn;