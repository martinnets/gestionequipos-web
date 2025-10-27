

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/solicitud";
class solicitudService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getsolicitud(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createsolicitud(solicitud){
        return axios.post(API_BASE_URL, solicitud,{
            headers: {'Content-Type': 'application/json'}
        })}
    getsolicitudById(solicitudId){
        return fetch(API_BASE_URL + '/' + solicitudId);
    }
    getsolicitudByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatesolicitud( id,solicitud){
        return axios.put(API_BASE_URL +'/'+id, solicitud,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletesolicitud(solicitudId){
        return axios.delete(API_BASE_URL + '/' + solicitudId);
    }
}

export default new solicitudService()