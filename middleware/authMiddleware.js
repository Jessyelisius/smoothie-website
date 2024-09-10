

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

const requireAuth = (req, res, next)=>{
    const token = req.cookies.jwt;

    //checking for json web token and verifying it
    if(token){
        jwt.verify(token, 'jessy authorization video', (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.redirect('/login')
            }else{
                console.log(decodedToken);
                next();
            }
        });
    }else{
        res.redirect('/login')
    }
}

//checking the current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token) {
        jwt.verify(token, 'jessy authorization video', async (err, decodedToken) => {
            if(err){
                console.log(err.message);
                res.locals.user = null;
                // next();
            }else{
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user = user;
                next();
            }
        });
    }
    else{
        res.locals.user = null;
        next();
    }

}

module.exports = {
    requireAuth,
    checkUser
}