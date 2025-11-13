

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API+"/perfil";
class perfilService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getperfil(id){
        return fetch( API_BASE_URL  +'/empresa/'+id) 
    }
    getperfilByPuesto(puesto){
        return axios.post( API_BASE_URL +'/rol',puesto,{
            headers: {'Content-Type': 'application/json'}
        })
    } 
    
    createperfil(perfil){
        return axios.post(API_BASE_URL, perfil,{
            headers: {'Content-Type': 'application/json'}
        })}
    getperfilById(perfilId){
        return fetch(API_BASE_URL + '/' + perfilId);
    }
    updateperfil( perfilId,perfil){
        return axios.put(API_BASE_URL +'/'+perfilId, perfil,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteperfil(perfilId){
        return axios.delete(API_BASE_URL + '/' + perfilId);
    }
}

export default new perfilService()