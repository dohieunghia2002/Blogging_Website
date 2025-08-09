import mongoose from 'mongoose';
import mongooseDelete from 'mongoose-delete';


const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, minlength: 1, maxlength: 800 },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true,
    collection: 'comments'
});

commentSchema.plugin(mongooseDelete, {
    deletedBy: true,
    deletedAt: true,
    overrideMethods: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
