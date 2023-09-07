import {  Schema, model } from 'mongoose';



const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 5,
        required: true,
    },
});

const User = model('users', userSchema, 'users');
export default User;
