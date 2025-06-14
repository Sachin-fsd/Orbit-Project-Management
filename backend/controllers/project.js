import Task from "../models/task.modal.js";
import WorkSpace from "../models/workspace.modal.js";
import Project from "../models/project.modal.js";


const createProject = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { title, description, status, members, tags, startDate, dueDate } = req.body;

        const workspace = await WorkSpace.findById(workspaceId);

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user.userId);

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this workspace' });
        }

        const tagArray = tags ? tags.split(',').map((tag) => tag.trim()) : [];

        const values = {
            workspace: workspaceId,
            title,
            description,
            status,
            members,
            tags: tagArray, startDate, dueDate, createdBy: req.user.userId
        }

        const newProject = await Project.create(values);

        workspace.projects.push(newProject._id);
        await workspace.save();

        res.status(201).json(newProject);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId);

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


const getProjectTasks = async (req, res) => {
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId)
            .populate("members.user");

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user._id.toString() === req.user.userId.toString());
        console.log("isMember", isMember)
        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const tasks = await Task.find({
            project: projectId,
            isArchived: false
        }).populate("assignees", "name email profilePicture").sort({ createdAt: -1 });

        res.status(200).json({ tasks, project });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const userId = req.user.userId;

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        // Only allow owner or admin of the workspace to delete
        const workspace = await WorkSpace.findById(project.workspace);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }
        const member = workspace.members.find(m => m.user.toString() === userId);
        const isOwnerOrAdmin = workspace.owner.toString() === userId || (member && member.role === "admin");
        if (!isOwnerOrAdmin) {
            return res.status(403).json({ message: "Only owner or admin can delete project" });
        }

        // Remove project reference from workspace
        workspace.projects = workspace.projects.filter(pid => pid.toString() !== projectId);
        await workspace.save();

        // Delete all tasks under this project
        await Task.deleteMany({ project: projectId });

        // Delete the project
        await Project.findByIdAndDelete(projectId);

        res.json({ message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete project", error: error.message });
    }
};

export default createProject

export { getProjectDetails, getProjectTasks }