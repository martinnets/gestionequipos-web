

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/cotizacion";
class cotizacionService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getcotizacion(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createcotizacion(cotizacion){
        return axios.post(API_BASE_URL, cotizacion,{
            headers: {'Content-Type': 'application/json'}
        })}
    getcotizacionById(cotizacionId){
        return fetch(API_BASE_URL + '/' + cotizacionId);
    }
    getcotizacionByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatecotizacion( id,cotizacion){
        return axios.put(API_BASE_URL +'/'+id, cotizacion,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletecotizacion(cotizacionId){
        return axios.delete(API_BASE_URL + '/' + cotizacionId);
    }
}

export default new cotizacionService()