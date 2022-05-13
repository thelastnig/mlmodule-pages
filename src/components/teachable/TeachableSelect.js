import React from 'react';
import styled from 'styled-components';
import { TEACHABLE_COLOR_LIST } from 'constants/common';


export default function TeachableSelect(props) {
    const optionList = props.options.map((option, index) => {
        return <option key={index} value={option} className='inputOption'>{option}</option>
    });

	return (
        <SelectWrapper width={props.width} className={props.shape}>
            <select name={props.name} 
                    className={'selectInput ' + props.shape} 
                    value={props.value}
                    onChange={(e) => props.handleChange(e)}
                    >
                {optionList}
            </select>
        </SelectWrapper>
	);
}

const SelectWrapper = styled.div`
    .selectInput {
        width: ${props => props.width}px;
        height: 30px;
        background: ${TEACHABLE_COLOR_LIST.COMPONENT_BACKGROUND_DEEP};
        border: none;
        outline: none;
        color: white;
        font-weight: 600;
        padding-left: 5px;

        &.round {
            height: 35px;
            border-radius: 15px;
            background: #f8f9fa;
            border: 2px solid #AECBFA;;
        }
    }
`;