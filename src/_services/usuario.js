

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API+"/usuario";
class usuarioService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getusuario(id){
        return fetch( API_BASE_URL +'/empresa/'+id ) 
    }
    createusuario(usuario){
        return axios.post(API_BASE_URL, usuario,{
            headers: {'Content-Type': 'application/json'}
        })}
    getusuarioById(usuarioId){
        return fetch(API_BASE_URL + '/' + usuarioId);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateusuario( id,usuario){
        return axios.put(API_BASE_URL +'/'+id, usuario,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteusuario(usuarioId){
        return axios.delete(API_BASE_URL + '/' + usuarioId);
    }
}

export default new usuarioService()