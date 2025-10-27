

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/venta";
class ventaService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getventa(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createventa(venta){
        return axios.post(API_BASE_URL, venta,{
            headers: {'Content-Type': 'application/json'}
        })}
    getventaById(ventaId){
        return fetch(API_BASE_URL + '/' + ventaId);
    }
    getventaByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updateventa( id,venta){
        return axios.put(API_BASE_URL +'/'+id, venta,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deleteventa(ventaId){
        return axios.delete(API_BASE_URL + '/' + ventaId);
    }
}

export default new ventaService()