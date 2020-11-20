import axios from 'axios'

const baseUrl = 'https://blooming-waters-85360.herokuapp.com/api/persons'

const getAll = () => {
  return axios.get(baseUrl).then(res => res.data)
}

const create = (newPerson) => {
  return axios.post(baseUrl, newPerson).then(res => res.data)
}

const update = (updatedPerson) => {
  return axios.put(`${baseUrl}/${updatedPerson.id}`, updatedPerson).then(res => res.data)
}

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const personService = {
  getAll,
  create,
  update,
  remove,
}

export default personService
