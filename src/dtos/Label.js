class Label {
    constructor(text) {
        this.label = text
        this.value = text
    }
}

export function parseTextListToLabelList(source) {
    return source.map((text) => {
        return new Label(text)
    });
};

export default Label;