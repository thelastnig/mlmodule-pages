import styled from 'styled-components';

import { colors } from 'styles';

const Switch = ({
    isOn,
    width,
    height,
    handleOnClick,
}) => {

    return (
        <SwitchWrapper isOn={isOn} width={width} height={height} onClick={handleOnClick}>
            <SwitchBtn isOn={isOn}></SwitchBtn>
        </SwitchWrapper>
    );
};

const SwitchWrapper = styled.div`
    position: relative;
    border-radius: 15px;    
    cursor: pointer;
    transition: background-color 0.3s;
    ${({ width, height, isOn }) => (
        `width: ${width}px; 
         height: ${height}px;
         background: ${isOn ? colors.gray_light : colors.gray_light};         
        `
    )}    
`;

const SwitchBtn = styled.div`
    position: absolute;
    border-radius: 50%;    
    top: 0;    
    height: 100%;
    width: 45%;
    transition: left 0.3s, background-color 0.3s;
    ${({ isOn }) => (
        `left: ${isOn ? '50%' : '5%'}; background: ${isOn ? colors.switch_on_button : colors.gray_default};`        
    )}
`;

export default Switch;