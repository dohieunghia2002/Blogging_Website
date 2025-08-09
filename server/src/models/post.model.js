import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';


const postSchema = new mongoose.Schema({
    title: { type: String, required: true, maxlength: 120 },
    slug: { type: String, required: true },
    content: { type: String, required: true, minlength: 50 },
    thumbnail: { type: String },
    commentCount: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    collection: 'posts'
});

postSchema.plugin(mongooseDelete, {
    deletedBy: true,
    deletedAt: true,
    overrideMethods: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;
