

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/licencia";
class licenciaService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getlicencia(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createlicencia(licencia){
        return axios.post(API_BASE_URL, licencia,{
            headers: {'Content-Type': 'application/json'}
        })}
    getlicenciaById(licenciaId){
        return fetch(API_BASE_URL + '/' + licenciaId);
    }
    getlicenciaByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatelicencia( id,licencia){
        return axios.put(API_BASE_URL +'/'+id, licencia,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletelicencia(licenciaId){
        return axios.delete(API_BASE_URL + '/' + licenciaId);
    }
}

export default new licenciaService()