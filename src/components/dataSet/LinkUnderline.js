import styled from 'styled-components';
import { colors } from 'styles';

const LinkUnderline = ({
    txt,
    onClick,
}) => {

    return (
        <LinkDiv
            onClick={onClick}
        >
            {txt}
        </LinkDiv>
    );
};

const LinkDiv = styled.div`
    text-decoration: underline;
    padding: 3px 4px 2px;
    border-radius: 4px;
    :hover {
		background: ${colors.button_white_bg_hover_2};
	}
	:active {
		background: ${colors.button_white_bg_press};
	}
`;

export default LinkUnderline;