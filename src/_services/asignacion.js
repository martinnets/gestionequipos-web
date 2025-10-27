

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/asignacion";
class asignacionService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getasignacion(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createasignacion(asignacion){
        return axios.post(API_BASE_URL, asignacion,{
            headers: {'Content-Type': 'application/json'}
        })}
    getasignacionById(asignacionId){
        return fetch(API_BASE_URL + '/' + asignacionId);
    }
    getasignacionByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateasignacion( id,asignacion){
        return axios.put(API_BASE_URL +'/'+id, asignacion,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteasignacion(asignacionId){
        return axios.delete(API_BASE_URL + '/' + asignacionId);
    }
}

export default new asignacionService()