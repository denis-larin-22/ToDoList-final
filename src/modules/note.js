class Note {
    constructor(text, priority) {
        this.value = text;
        this.priority = +priority;
    }

    static editNote(text, priority) {
        return {
            value: text,
            priority
        };
    }
}

export default Note;
