
const User = require("../models/User.model");
const jwt  = require("jsonwebtoken");


//error handling
const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = {email:'', password: ''};

    //incorrect email
    if(err.message === "incorrect email"){
        errors.email = "that email is not registered";
    }

    //incorrect password
    if(err.message === "incorrect password"){
        errors.password = "that password is incorrect";
    }

    //duplicate emails
    if(err.code === 11000){
        errors.email = 'that email has already been registered';
        return errors;
    }

    //validation Error
    if(err.message.includes('user validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        })
    }

    return errors;
}

//jwt init
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'jessy authorization video',{
        expiresIn: maxAge
    });
}


const signup_get = (req,res) => {
    res.render('signup');
}

const signup_post = async(req,res) => {

    const {email, password} = req.body;

    try {
        
        const user = await User.create({email, password});

        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(201).json({user: user._id});

        // console.log('Token created successfully:', token); // Debugging
        // return token;

    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        
    }
}

const login_get = (req,res) => {
    res.render('login');
}

const login_post = async (req, res) => {

    const {email, password} = req.body;

   try {

        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
        res.status(200).json({user: user._id})

   } catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
   }
}

const logout_get = (req, res) => {
    res.cookie('jwt', '', {maxAge: 1});
    res.redirect('/');
}

module.exports = {
    signup_get,
    signup_post,
    login_get,
    login_post,
    logout_get
}