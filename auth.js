// const person = require('./model/person');
// const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await person.findOne({ username: username });
        if (!user) {
            return done(null, null, { message: 'Incorrect username.' });
        }
        if (!user.comparePassword(password)) {
            return done(null, null, { message: 'Incorrect password.' });
        }
        return done(null, user);
    } catch (err) {
        console.log(err);
        return done(err, false, { message: 'An error occurred.' });
    }
}))

module.exports = passport;