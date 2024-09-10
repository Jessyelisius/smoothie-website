const mongoose = require('mongoose');
const {isEmail} = require('validator');
const bcrypt = require('bcryptjs');


const Schema = mongoose.Schema;

const userSchema = new Schema({
    email:{
        type: String,
        required: [true,'email field is required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'please enter a valid email']
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        minlength: [6,'Password is too short'],
        maxlength: [30, 'Password is too long']
    }
}, {timeStamps: true});


//fire a function after doc is saved to db
userSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

// userSchema.post('save', function (doc, next) {
//     console.log('new user was created and save', doc);
//     // next();
// })

//static method to login
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({email});

    if(user){
       const auth = await bcrypt.compare(password, user.password);

       if(auth){
        return user;
       }
       throw Error("incorrect password");
    }
    
    throw Error("incorrect email");
    
}

const User = mongoose.model('user', userSchema);

module.exports = User;

