

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/equipo";
class equipoService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getequipo(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createequipo(equipo){
        return axios.post(API_BASE_URL, equipo,{
            headers: {'Content-Type': 'application/json'}
        })}
    getequipoById(equipoId){
        return fetch(API_BASE_URL + '/' + equipoId);
    }
    getequipoByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateequipo( id,equipo){
        return axios.put(API_BASE_URL +'/'+id, equipo,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteequipo(equipoId){
        return axios.delete(API_BASE_URL + '/' + equipoId);
    }
}

export default new equipoService()