import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';


const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 2, maxlength: 40},
    penName: {type: String, required: true, minlength: 2, maxlength: 40, unique: true},
    slug: {type: String, required: true, minlength: 2, maxlength: 40, unique: true},
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: {type: String, default: 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png'},
    refreshToken: { type: String }
}, {
    timestamps: true,
    collection: 'users'
});

userSchema.plugin(mongooseDelete, {
    deletedBy: true,
    deletedAt: true,
    overrideMethods: true
});

const User = mongoose.model('User', userSchema);
export default User;
