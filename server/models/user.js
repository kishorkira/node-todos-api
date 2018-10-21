const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt =require('bcryptjs');

let userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true,'Email is required.'],
        minlength: 1,
        trim: true,
        unique: true,
        validate:{
            validator: validator.isEmail,
            message:'{VALUE} is not a valid email.'
        }
    },
    password: {
        type: String,
        required :[true,'password is required.'],
        trim: true,
        minlength: 6,
    },
    tokens:[{
        access: {
            type: String,
            required :true
        },
        token: {
            type: String,
            required :true
        }
    }] 
 });
userSchema.methods.toJSON = function (){
    let user =this;
    let userObject = user.toObject();
    return _.pick(userObject,['email','_id']);

};

userSchema.methods.generateAuthToken = function(){
    let user =this;
    let access ='auth';
    let token = jwt.sign({_id:user._id.toHexString(),access},'kkdev').toString();
    user.tokens.push({access,token});
    return user.save().then(()=>token);
};
userSchema.methods.removeToken = function (token) {
    var user = this;  
    return user.update({
      $pull: {
        tokens: {token}
      }
    });
};

userSchema.statics.findByToken = function(token){
    let user = this;
    let decoded;
    try {
        decoded = jwt.verify(token,'kkdev');
    } catch (error) {
        // return new Promise((resolve,reject)=>{
        //     reject();
        // });
        return Promise.reject();
    }
    return user.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access': 'auth'
    });
};
userSchema.statics.findByCredentials = function (email, password) {
    var User = this;  
    return User.findOne({email}).then((user) => {
      if (!user) {
        return Promise.reject();
      }  
      return new Promise((resolve, reject) => {
        // Use bcrypt.compare to compare password and user.password
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            resolve(user);
          } else {
            reject();
          }
        });
      });
    });
};
userSchema.pre('save',function(next){
    let user =this;
    
    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password =hash;
                next();
            });
        });
    }else{
        next();
    }

});

let User = mongoose.model('User',userSchema);

 
 module.exports ={
    User
};