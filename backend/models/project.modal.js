import mongoose, { Schema } from "mongoose";


const projectSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    workspace: {
        type: Schema.Types.ObjectId,
        ref: 'WorkSpace',
        required: true
    },
    members: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
            role: {
                type: String,
                enum: ['manager', 'contributor', 'viewer'],
                default: 'contributor'
            },
            joinedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    status: {
        type: String,
        enum: ['PLANNING', 'IN PROGRESS', 'COMPLETED', "ON HOLD", "CANCELLED"],
        default: 'PLANNING'
    },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium'
    },
    dueDate: {
        type: Date,
        default: Date.now
    },
    startDate : {
        type: Date,
        default: Date.now
    },
    endDate : {
        type: Date,
        default: Date.now
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    tasks: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Task'
        }
    ],
    tags: [
        {
            type: String
        }
    ],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isArchived: {
        type: Boolean,
        default: false
    }
}, { timestamps: true }); // Automatically manage createdAt and updatedAt fields

const Project = new mongoose.model('Project', projectSchema);
export default Project;