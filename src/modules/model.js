import Note from './note.js';
import Request from './request.js';

class Model {
    note = new Note();
    request = new Request();

    token = null ?? localStorage.getItem('token');
    list = this.getList();

    async login(name, email) {
        const token = await this.request.login(name, email);
        localStorage.setItem('token', token);
    }

    async addNote(text, priority) {
        const note = new Note(text, priority);
        const newNote = await this.request.postNote(note, this.token);
        this.list.push(newNote);
    }

    async getNote(idNote) {
        await this.request.getNote(idNote, this.token);
    }

    async getList() {
        const list = await this.request.getList(this.token);
        this.list = list;
        return list;
    }

    async editNote(idNote, editedNote) {
        await this.request.putNote(idNote, editedNote, this.token);
    }

    async toggleNoteStatus(idNote) {
        this.request.putChecked(idNote, this.token);
    }

    removeNote(idNote) {
        this.request.deleteNote(idNote, this.token);
        // eslint-disable-next-line eqeqeq
        this.list = this.list.filter(({_id}) => _id != idNote);
    }
}

export default Model;