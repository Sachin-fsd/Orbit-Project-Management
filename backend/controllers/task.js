import Task from "../models/task.modal.js";
import Project from "../models/project.modal.js";
import WorkSpace from "../models/workspace.modal.js";



const createTask = async (req, res) => {
    try {
        const {projectId} = req.params;
        const {title, description, status, priority, assignees, dueDate} = req.body;

        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const workspace = await WorkSpace.findById(project.workspace);

        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this workspace' });
        }
        
        const newTask = await Task.create({
            title,
            description,
            status,
            priority,
            assignees,
            dueDate,
            project: projectId,
            createdBy: req.user.userId
        });

        project.tasks.push(newTask._id);
        await project.save();
        
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error in creating task' });
        
    }
}

export default createTask