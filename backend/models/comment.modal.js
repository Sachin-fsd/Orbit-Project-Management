import { model, Schema } from "mongoose";


const commentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mentions: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            offset: {
                type: Number,
                required: true
            },
            length: {
                type: Number,
                required: true
            }
        }
    ],
    reactions: [
        {
            emoji: {
                type: String,
                required: true
            },
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ],
    attachments: [
        {
            fileName: {
                type: String,
            },
            fileUrl: {
                type: String,
            },
            fileType: {
                type: String,
            },
            fileSize: {
                type: Number,
            }
        }
    ],
    isEdited: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const Comment = model('Comment', commentSchema);
export default Comment;