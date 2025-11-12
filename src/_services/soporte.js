

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/soporte";
class soporteService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getsoporte(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createsoporte(soporte){
        return axios.post(API_BASE_URL, soporte,{
            headers: {'Content-Type': 'application/json'}
        })}
    getsoporteById(soporteId){
        return fetch(API_BASE_URL + '/' + soporteId);
    }
    getsoporteByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatesoporte( id,soporte){
        return axios.put(API_BASE_URL +'/'+id, soporte,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletesoporte(soporteId){
        return axios.delete(API_BASE_URL + '/' + soporteId);
    }
}

export default new soporteService()