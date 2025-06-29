
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLenght: 3,
        maxLength: 30
    },

    password: {
        type: String,
        required: true,
        minLenght: 8
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50

    }
});


const accountSchema = new mongoose.Schema
    ({
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        },
        balance: {
            type: Number,
            required: true
        }




    })
  
export const Account = mongoose.model('Account', accountSchema);
export const User = mongoose.model("User", userSchema);
