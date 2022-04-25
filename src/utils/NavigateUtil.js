export const goAnnotationPage = (annotation_id, token) => {
    const url = `${process.env.REACT_APP_START_ANNOTATION_URL}?annotation_id=${annotation_id}&token=${JSON.stringify(token)}`;
	window.open(url);
};