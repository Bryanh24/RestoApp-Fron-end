import React, {Component} from 'react'
import request from 'superagent'
import {getJwt} from "./helpers/jwt/jwtHelper"

class AuteniticatedComponent extends Component {
    constructor(props){
        super(props);

        this.state ={
            empleado: undefined 
        }
    }
}