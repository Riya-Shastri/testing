import { Injectable, OnInit } from '@angular/core';
import { AuthLoginService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class UtilityService{
    
    DECODED_TOKEN: any;
    
    constructor(private authService: AuthLoginService, private jwtHelper:JwtHelperService){
        const token = localStorage.getItem('token');
        if(token){
            this.DECODED_TOKEN = this.jwtHelper.decodeToken(token);
        }
    }

    getLocation(): void{
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position)=>{
              const longitude = position.coords.longitude;
              const latitude = position.coords.latitude;
              this.callApi(longitude, latitude);
            });
        } else {
        }
      }
    
      callApi(Longitude: number, Latitude: number){
        const url = `https://api-adresse.data.gouv.fr/reverse/?lon=${Longitude}&lat=${Latitude}`
        //Call API
      }
}