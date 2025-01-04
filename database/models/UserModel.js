import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        select: false
    }
})

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = async function () {
    return jwt.sign({ email: this.email }, process.env.JWT_SCRECT, { expiresIn: '24h' })
}


const User = mongoose.model('user', userSchema)

export default User;