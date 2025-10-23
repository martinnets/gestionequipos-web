

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API+"/empresa";
class empresaService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getempresa(){
        return fetch( API_BASE_URL  ) 
    }
    createempresa(empresa){
        return axios.post(API_BASE_URL, empresa,{
            headers: {'Content-Type': 'application/json'}
        })}
    getempresaById(empresaId){
        return fetch(API_BASE_URL + '/' + empresaId);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateempresa( id,empresa){
        return axios.put(API_BASE_URL +'/'+id, empresa,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteempresa(empresaId){
        return axios.delete(API_BASE_URL + '/' + empresaId);
    }
}

export default new empresaService()