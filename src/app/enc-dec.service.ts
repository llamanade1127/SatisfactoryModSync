import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncDecService {

  constructor() { }

  encrypt(keys: string, value: string){
    let key = CryptoJS.enc.Utf8.parse(keys);
    let iv = CryptoJS.enc.Utf8.parse(keys);

    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value), key, {
      keySize: 128/8,
      iv:iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })

    return encrypted.toString();
  }


  decrypt(keys: string, value: string){
    let key = CryptoJS.enc.Utf8.parse(keys);
    let iv = CryptoJS.enc.Utf8.parse(keys);
    let decrypted = CryptoJS.AES.decrypt(value, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
