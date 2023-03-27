import Model from './model.js';
import View from './view.js';

class Controller {
    model = new Model();
    view = new View();

    constructor() {
        this.handleModelChange();
        this.view.addNoteHandler(() => this.handleAddNote());
        this.view.deleteNoteHandler((id) => this.handleDeleteNote(id));
        this.view.editForm();
        this.view.saveEditHandler((id, newNote) => this.handlerEditNote(id, newNote));
        this.view.toggleNoteHandler(id => this.handlerToggleNote(id));
    }

    async handleLogin(name, email) {
        await this.model.login(name, email);
        await location.reload();
    }

    async handleAddNote() {
        const {text, priority} = this.view.getNoteInput();

        await this.model.addNote(text, priority);
        this.view.clearNoteInput();
        await this.handleModelChange();
    }

    async handleModelChange() {
        this.view.displayNotes(await this.model.list);
    }

    handleDeleteNote(id) {
        this.model.removeNote(id, this.model.token);
        this.handleModelChange();
    }

    async handlerEditNote(id, editedNote) {
        await this.model.editNote(id, editedNote);

        this.view.displayNotes(await this.model.getList());
    }

    async handlerToggleNote(id) {
        this.model.toggleNoteStatus(id);
    }
}

export default Controller;