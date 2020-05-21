let bcrypt = require('bcryptjs')
let mongoose = require('mongoose')

// Create user schema
let tagsSchema = new mongoose.Schema({
    steamId: {
        type: String,
        unique: true
    },
    originId: {
        type: String,
        unique: true
    },
    battleNetId: {
        type: String,
        unique: true
    },
    epicGamesId: {
        type: String,
        unique: true
    },
    xboxGamerTag: {
        type: String,
        unique: true
    },
    psnId: {
        type: String,
        unique: true
    },
    nintendoFriendCode: {
        type: String,
        unique: true
    }
})

let creatorSchema = new mongoose.Schema({
    youTube: {
        type: String,
        unique: true
    },
    twitch: {
        type: String,
        unique: true
    },
    mixer: {
        type: String,
        unique: true
    },
    twitter: {
        type: String,
        unique: true
    },
    instagram: {
        type: String,
        unique: true
    }
})


let userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: String,
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: 6
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    pic: String,
    background: String,
    bio: String,
    admin: {
        type: Boolean,
        default: false
    },
    games: Array,
    tags: tagsSchema,
    creator: creatorSchema
})

// Hash the passwords with BCrypt 
userSchema.pre('save', function(done) {
    // Make sure it's new, as opposed to modified
    if (this.isNew) {   
        this.password = bcrypt.hashSync(this.password, 12)
    }
    // Tell it we're ok to move on (to inset into the DB)
    done()
})

// Make a JSON representation of the user (for send on the JWT payload)
userSchema.set('toJSON', {
    transform: (doc, user) => {
        delete user.password
        delete user.__v
        delete user.games
        return user
    }
})

// Make a function that compares passwords
userSchema.methods.validPassword = function (typedPassword) {
    // typedPassword: Plain text, just typed in by user
    // this.password: Existing, hashed password
    return bcrypt.compareSync(typedPassword, this.password)
}

// TODO: Export user model
module.exports = mongoose.model('User', userSchema)
