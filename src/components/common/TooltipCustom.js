import { useEffect, useRef, useState } from 'react';

import { useCommonState } from 'store/common/hooks';

import CloseIcon from 'assets/icon/btn-delete-search.png';

const BACKGROUND_COLOR = '#222';

const TooltipCustom = ({ text, parent, isUpSide, margin, handleOnClickClose, isMustShow }) => {
	const { isToolTipHide } = useCommonState();

	const tipRef = useRef();
	const [pos, setPos] = useState({
		top: 0,
		left: 0,
	});
	const [tipSize, setTipSize] = useState({
		width: 0,
		height: 0,
	});

	const rendering = () => {
		if (parent && parent.current && tipRef && tipRef.current) {
			const parentRect = parent.current.getBoundingClientRect();
			const top = isUpSide
				? parentRect.top - tipSize.height - margin
				: parentRect.top + parentRect.height + margin;
			const left = parentRect.left + (parentRect.width / 2 - tipSize.width / 2);
			setPos({
				top,
				left,
			});
		}
	};

	useEffect(() => {
		rendering();

		window.addEventListener('resize', rendering);
		window.addEventListener('scroll', rendering);
		return () => {
			window.removeEventListener('resize', rendering);
			window.removeEventListener('resize', rendering);
		};
	}, [parent, tipSize, text, isUpSide]);

	useEffect(() => {
		if (tipRef && tipRef.current) {
			const rect = tipRef.current.getBoundingClientRect();
			setTipSize({
				width: rect.width,
				height: rect.height,
			});
		}
	}, [text]);

	useEffect(() => {
		if (tipRef && tipRef.current) {
			const tipRect = tipRef.current.getBoundingClientRect();
			console.log(tipRect);
			setTipSize({
				width: tipRect.width,
				height: tipRect.height,
			});
		}
	}, [tipRef]);

	const texts = text ? text.split('\n') : ['내용없음'];

	return (
		<>
			{(!isToolTipHide || isMustShow) && (
				<div
					ref={tipRef}
					className={isUpSide ? 'tooltip-custom-up' : 'tooltip-custom-down'}
					style={{
						position: 'fixed',
						padding: '5px 10px',
						background: `${BACKGROUND_COLOR}`,
						color: '#fff',
						borderRadius: '3px',
						fontSize: '13px',
						zIndex: '888',
						textAlign: 'center',
						top: pos.top,
						left: pos.left,
					}}
				>
					{texts &&
						texts.length > 0 &&
						texts.map((text) => (
							<>
								<span>{text}</span>
								<br />
							</>
						))}
					{handleOnClickClose && (
						<div
							style={{
								position: 'absolute',
								top: -18,
								right: 0,
								cursor: 'pointer',
								background: `${BACKGROUND_COLOR}`,
								borderRadius: '3px 3px 0 0',
							}}
							onClick={handleOnClickClose}
						>
							<img src={CloseIcon} style={{ width: 20 }} />
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default TooltipCustom;
