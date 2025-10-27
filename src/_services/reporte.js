

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/reporte";
class reporteService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getreporte(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    createreporte(reporte){
        return axios.post(API_BASE_URL, reporte,{
            headers: {'Content-Type': 'application/json'}
        })}
    getreporteById(reporteId){
        return fetch(API_BASE_URL + '/' + reporteId);
    }
    getreporteByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updatereporte( id,reporte){
        return axios.put(API_BASE_URL +'/'+id, reporte,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletereporte(reporteId){
        return axios.delete(API_BASE_URL + '/' + reporteId);
    }
}

export default new reporteService()