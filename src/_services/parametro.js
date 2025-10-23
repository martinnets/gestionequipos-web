

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/parametro";
class parametroService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getparametro(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createparametro(parametro){
        return axios.post(API_BASE_URL, parametro,{
            headers: {'Content-Type': 'application/json'}
        })}
    getparametroById(parametroId){
        return fetch(API_BASE_URL + '/' + parametroId);
    }
    getparametroByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateparametro( id,parametro){
        return axios.put(API_BASE_URL +'/'+id, parametro,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteparametro(parametroId){
        return axios.delete(API_BASE_URL + '/' + parametroId);
    }
}

export default new parametroService()