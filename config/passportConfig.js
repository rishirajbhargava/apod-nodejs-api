
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/User');
const bcrypt = require('bcryptjs');


exports.initializingPassport =  (passport) =>{
    passport.use(
        new LocalStrategy( async ( username, password, done) => {

            const user = await User.findOne({ email: username })



            if (!user) return done(null, false);
            bcrypt.compare(password, user.password, (err, result) => {

                if (err) throw err;
                if (result === true) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        })

    )






passport.serializeUser((user, done) => { done(null, user.id) });

passport.deserializeUser( async(id, done) => {

   const user = await User.findOne({ _id: id }) 

    if(!user) return done(null, false);
    return done(null, user);
});

};



exports.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/login');
    }
    
}