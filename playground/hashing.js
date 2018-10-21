const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt =require('bcryptjs');

let password = 'kkdev';

// bcrypt.genSalt(10,(err,salt)=>{
//     bcrypt.hash(password,salt,(err,hash)=>{
//         console.log(hash);
//     });
// });
// let hashed1 ='$2a$10$BZ8Ks/cK1FC6ygBnc43jpOgSL4oSL/oba8qdCl3AyXXdj4xvJTF5W';
// let hashed2 ='$2a$10$s9fl1TUXTJT.9x7LnkCFc.16Uc3NBbQY1CktHDNY5PRIib9nyNu6C';
// bcrypt.compare(password,hashed1,(err,res)=>{
//     console.log(res);
// });
// let data ={
//     id:13
// };
// let token = jwt.sign(data,'123abc');
// console.log('token',token);
// let decoded = jwt.verify(token,'123abc');
// console.log('decoded',decoded);

// let message = 'I am KK.';
// let hash256 = SHA256(message).toString();

// console.log(`Message : ${message} ---> ${hash256}`);

// let data ={
//     id:1
// };
// let token ={
//     data,
//     hash: SHA256(JSON.stringify(data) + 'secreteCode').toString()
// };
// // token.data.id =3;
// // token.hash =SHA256(JSON.stringify(token.data)).toString();

// let resultHash = SHA256(JSON.stringify(token.data) + 'secreteCode').toString();
// if(resultHash === token.hash){
//     console.log('Data not manipulated');
// }else{
//     console.log('Data manipulated , deny request');
// }