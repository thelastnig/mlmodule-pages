import styled, { keyframes } from 'styled-components';

const LoadingDot = ({
    size = 10,
    color = '#ffffff',
    style = {},
}) => {
    return (
        <DotBox style={style} color={color} size={size}></DotBox>
    );
};

const dotPulseBefore = (color) => keyframes`
    0% {
        box-shadow: 9984px 0 0 -5px ${color};
    }
    30% {
        box-shadow: 9984px 0 0 2px ${color};
    }
    60%,
    100% {
        box-shadow: 9984px 0 0 -5px ${color};
    }
`;

const dotPulse = (color) => keyframes`
    0% {
        box-shadow: 9999px 0 0 -5px ${color};
    }
    30% {
        box-shadow: 9999px 0 0 2px ${color};
    }
    60%,
    100% {
        box-shadow: 9999px 0 0 -5px ${color};
    }
`;

const dotPulseAfter = (color) => keyframes`
    0% {
        box-shadow: 10014px 0 0 -5px ${color};
    }
    30% {
        box-shadow: 10014px 0 0 2px ${color};
    }
    60%,
    100% {
        box-shadow: 10014px 0 0 -5px ${color};
    }
`;

const DotBox = styled.div`
    position: relative;
    left: -9999px;
    width: ${({ size }) => size}px;
    height: ${({ size }) => size}px;
    border-radius: 5px;
    background-color: ${({ color }) => color};
    color: ${({ color }) => color};
    box-shadow: 9999px 0 0 -5px ${({ color }) => color};
    animation: ${({ color }) => dotPulse(color)} 1.5s infinite linear;
    animation-delay: .25s;

    &:before {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        width: ${({ size }) => size}px;
        height: ${({ size }) => size}px;
        border-radius: 5px;
        background-color: ${({ color }) => color};
        color: ${({ color }) => color};
        box-shadow: 9984px 0 0 -5px ${({ color }) => color};
        animation: ${({ color }) => dotPulseBefore(color)} 1.5s infinite linear;
        animation-delay: 0s;
    }

    &:after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        width: ${({ size }) => size}px;
        height: ${({ size }) => size}px;
        border-radius: 5px;
        background-color: ${({ color }) => color};
        color: ${({ color }) => color};
        box-shadow: 10014px 0 0 -5px ${({ color }) => color};
        animation: ${({ color }) => dotPulseAfter(color)} 1.5s infinite linear;
        animation-delay: .5s;
    }
`;

export default LoadingDot;