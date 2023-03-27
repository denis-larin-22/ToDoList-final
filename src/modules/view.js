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
                const editedText = li.firstElementChild.innerText;
                li.innerHTML = `
                    <form class="form" action="">
                    <input class="note-input-text" type="text" placeholder="New note-text" value="${editedText}">
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

export default View;