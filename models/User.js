import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true,
        maxlength: [100, 'Full Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email Address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    }
}, {
    timestamps: true //Change this if not required
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(8); // you can increase the salt rounds but that will slow the the hashing process
        this.password = await bcrypt.hash(this.password, salt); 
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('User', userSchema);
