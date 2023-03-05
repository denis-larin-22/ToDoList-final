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


class Request {
    baseUrl = 'https://todo.hillel.it';

    async login(name, email) {
        const response = await fetch(`${this.baseUrl}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                value: name + email
            })
        });
        const tokenValue = await response.json();
        return tokenValue.access_token;
    }

    async postNote(objNote, token) {
        const response = await fetch(`${this.baseUrl}/todo`, Request.requestParamWithObj('POST', token, objNote));

        return await response.json();
    }

    async putNote(idNote, editedNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}`, Request.requestParamWithObj('PUT', token, editedNote));
    }

    async getNote(idNote, token) {
        return fetch(`${this.baseUrl}/todo/${idNote}`, Request.requestParam('GET', token)).then(res => res.json());
    }

    async getList(token) {
        const response = await fetch(`${this.baseUrl}/todo`, Request.requestParam('GET', token));

        return await response.json();
    }

    async deleteNote(idNumb, token) {
        fetch(`${this.baseUrl}/todo/${idNumb}`, Request.requestParam('DELETE', token));
    }

    async putChecked(idNote, token) {
        return await fetch(`${this.baseUrl}/todo/${idNote}/toggle`, Request.requestParam('PUT', token));
    }

    static requestParamWithObj(method, token, obj) {
        return {
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(obj)
        };
    }

    static requestParam(method, token) {
        return {
            method,
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${token}`
            },
        };
    }
}


class Model {
    note = new Note();
    request = new Request();

    token = null ?? localStorage.getItem('token');
    list = this.getList();

    async login(name, email) {
        const token = await this.request.login(name, email);
        this.token = token;
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
        //При === появляется баг с задержкой рендеринга, не могу разобраться из-за чего так происходит, при == всё ok
        // eslint-disable-next-line eqeqeq
        this.list = this.list.filter(({_id}) => _id != idNote);
    }
}

class View {
    inputText = document.querySelector('.note-input-text');
    inputPriority = document.querySelector('.note-input-priority');

    noteList = document.querySelector('.note-list');

    addBtn = document.querySelector('.add-btn');
    editBtn = document.querySelector('.edit-btn');
    toggleBtn = document.querySelector('.toggle-btn');

    getNoteInput() {
        const text = this.inputText.value.trim();
        if (!text) {
            this.inputText.placeholder = 'Please, enter note text!!';
        } else {
            const noteInput = {
                text,
                priority: this.inputPriority.value,
            };
            return noteInput;
        }
    }

    clearNoteInput() {
        this.inputText.value = '';
        this.inputPriority.value = '1';
    }

    static createItemNote(id, text, priority, isDone) {
        const itemNote = document.createElement('li');
        itemNote.dataset.id = id;

        itemNote.innerHTML = `
            <h3>${text}</h3>
            <p>Priority: <span>${priority}</span></p>
            <button class="delete-btn" idde606e1cbf5b3"">Delete</button>
            <button class="edit-btn" idde606e1cbf5b3"">Edit</button>
            <input class="toggle-btn" type="checkbox" ${isDone ? 'checked' : ''}>
        `;

        return itemNote;
    }

    displayNotes(notes) {
        this.noteList.innerHTML = '';

        for (const {_id, value, priority, checked} of notes) {
            const noteItem = View.createItemNote(_id, value, priority, checked);
            this.noteList.prepend(noteItem);
        }
    }

    addNoteHandler(handler) {
        this.addBtn.addEventListener('click', event => {
            event.preventDefault();
            handler();
        });
    }

    deleteNoteHandler(handler) {
        this.noteList.addEventListener('click', ({target}) => {
            if(target.classList.contains('delete-btn')) {
                const { id } = target.closest('li').dataset;
                handler(id);
            }
        });
    }

    editForm() {
        this.noteList.addEventListener('click', ({target}) => {
            if (target.classList.contains('edit-btn')) {
                const li = target.closest('li');
                li.innerHTML = `
                    <form class="form" action="">
                    <input class="note-input-text" type="text" placeholder="New note-text">
                    <select class="note-input-priority" name="priority">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    </select>
                    <button class="save-btn">Save</button>
                    </form>
                `;
            }
        });
    }

    saveEditHandler(handler) {
        this.noteList.addEventListener('click', event => {
            if (event.target.classList.contains('save-btn')) {
                event.preventDefault();

                const [text, priority] = event.target.closest('form').children;
                const editedNoteInput = {
                    value: text.value,
                    priority: +priority.value,
                };

                const {id} = event.target.closest('li').dataset;
                handler(id, editedNoteInput);
            }
        });
    }

    toggleNoteHandler(handler) {
        this.noteList.addEventListener('click', ({target}) => {
            if (target.classList.contains('toggle-btn')) {
                const {id} = target.closest('li').dataset;
                handler(id);
            }
        });
    }
}


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

    handleLogin(name, email) {
        this.model.login(name, email);
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

const todo = new Controller;
todo.handleLogin('denis', 'dev');

