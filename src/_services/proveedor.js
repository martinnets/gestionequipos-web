

import axios from 'axios';
import React, {Component} from 'react';
const API_BASE_URL = import.meta.env.VITE_APP_API+"/proveedor";
class proveedorService extends Component{
    constructor(){
        super();
        this.state = {
            users: []
        };
    }
    getproveedor(id){
        return fetch( API_BASE_URL +'/empresa/'+id ) 
    }
    createproveedor(proveedor){
        return axios.post(API_BASE_URL, proveedor,{
            headers: {'Content-Type': 'application/json'}
        })}
    getproveedorById(proveedorId){
        return fetch(API_BASE_URL + '/' + proveedorId);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateproveedor( id,proveedor){
        return axios.put(API_BASE_URL +'/'+id, proveedor,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteproveedor(proveedorId){
        return axios.delete(API_BASE_URL + '/' + proveedorId);
    }
}

export default new proveedorService()