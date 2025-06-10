import mongoose, { Schema } from "mongoose";

const WorkSpaceSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        default: '#FF5733',
    },
    description: {
        type: String,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    members: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['admin', 'member', 'owner', 'viewer'],
                default: 'member'
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    projects: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        }
    ]
}, { timestamps: true });

const WorkSpace = new mongoose.model('WorkSpace', WorkSpaceSchema);
export default WorkSpace;