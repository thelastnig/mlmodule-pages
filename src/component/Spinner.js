import styled, { keyframes } from 'styled-components';

import { useCommonState } from 'store/common/hooks';

import IconSpinner from 'assets/icon/img-loading.png';

export default function Spinner() {
	const { spinnerCount } = useCommonState();

	return (
		<>
			{spinnerCount > 0 && (
				<SpinnerWrapper>
					<SpinnerIcon src={IconSpinner} />
				</SpinnerWrapper>
			)}
		</>
	);
}

const boxFade = keyframes`
    from {
      transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
`;

const SpinnerWrapper = styled.div`
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.12);
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999;
	color: black;
	opacity: 1;
	&.loading {
		z-index: 3000;
	}
`;

const SpinnerIcon = styled.img`
	width: 60px;
	height: 60px;
	animation: ${boxFade} 2s linear infinite;
`;
