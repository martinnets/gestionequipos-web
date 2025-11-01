

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_APP_API+"/gama";
class gamaService {
    constructor(){
        this.state = {
            users: []
        };
    }
    getgama(id){
        return fetch( API_BASE_URL +'//'+id ) 
    }
    creategama(gama){
        return axios.post(API_BASE_URL, gama,{
            headers: {'Content-Type': 'application/json'}
        })}
    getgamaById(gamaId){
        return fetch(API_BASE_URL + '/' + gamaId);
    }
    getgamaByCod(id,cod){
        return fetch(API_BASE_URL + '/empresa/'+id+'/' + cod);
    }
    getcorrelativo(id){
        return fetch(API_BASE_URL + '/cod/'+id )
    }
    updategama( id,gama){
        return axios.put(API_BASE_URL +'/'+id, gama,{
            headers: {'Content-Type': 'application/json'}
        }) }

    deletegama(gamaId){
        return axios.delete(API_BASE_URL + '/' + gamaId);
    }
}

export default new gamaService()