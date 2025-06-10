import Project from "../models/project.modal.js";
import WorkSpace from "../models/workspace.modal.js";



export const createWorkspace = async (req, res) => {
    try {
        const { name, description, color } = req.body;

        const workspace = await WorkSpace.create({ 
            name, 
            description, 
            color,
            owner: req.user.userId,
            members: [{ user: req.user.userId, role: 'owner', joinedAt: new Date() }]
        });

        res.status(201).json(workspace);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspaces = async (req, res) => {
    try {
        const workspaces = await WorkSpace.find({ "members.user": req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json(workspaces);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspaceDetails = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const workspace = await WorkSpace.findById(workspaceId).populate('members.user','name email profilePicture');
        if(!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }
        res.status(200).json(workspace);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspaceProjects = async (req, res) => {
    try {
        const {workspaceId} = req.params;
        const workspace = await WorkSpace.findOne({ _id: workspaceId, 'members.user': req.user.userId 
        }).populate('members.user','name email profilePicture');
        if(!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const projects = await Project.find({ 
            workspace: workspaceId, 
            isArchived: false,
            // members: { $in: [req.user._id] }
        
        })
        // .populate('tasks','status')
        .sort({ createdAt: -1 });
        res.status(200).json({projects,workspace});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}