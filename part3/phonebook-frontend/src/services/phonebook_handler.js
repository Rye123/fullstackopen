import axios from 'axios';

const dbUrl = "http://localhost:3001/api/persons";

const db_create = (newPerson) => {
    return axios.post(dbUrl, newPerson).then(response => response.data);
}

const db_readAll = () => {
    return axios.get(dbUrl).then(response => response.data);
}

const db_update = (id, updatedPerson) => {
    return axios.put(`${dbUrl}/${id}`, updatedPerson).then(response => response.data);
}

const db_delete = (id) => {
    return axios.delete(`${dbUrl}/${id}`).then(response => response.data);
}

const exports = { db_create, db_readAll, db_update, db_delete };

export default exports;