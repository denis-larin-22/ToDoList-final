
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

export default Request;