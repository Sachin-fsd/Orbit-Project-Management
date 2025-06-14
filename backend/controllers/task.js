import Task from "../models/task.modal.js";
import Project from "../models/project.modal.js";
import WorkSpace from "../models/workspace.modal.js";
import { recordActivity } from "../libs/index.js";
import ActivityLog from "../models/activity.modal.js";
import Comment from "../models/comment.modal.js";
import { pusher } from "../libs/pusher.js";



const createTask = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { title, description, status, priority, assignees, dueDate } = req.body;

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

const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;


        const task = await Task.findById(taskId)
            .populate("watchers", "name profilePicture")
            .populate("assignees", "name profilePicture")

        if (!task) {
            return res.status(404).json({ message: "Task not Found" })
        }

        const project = await Project.findById(task.project)
            .populate("members.user", "name email profilePicture");

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json({ task, project })

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error in getting task' });

    }
}

const updateTaskTitle = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const oldTitle = task.title;

        task.title = title;
        await task.save();

        await recordActivity(req.user.userId, 'updated_task', "Task", taskId, {
            description: `updated task title from ${oldTitle} to ${title}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating title' });
    }
}

const updateTaskDescription = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { description } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const oldDescription = task.description.substring(0, 50) + (task.description.length > 50 ? '...' : '');
        const newDescription = description.substring(0, 50) + (description.length > 50 ? '...' : '');

        task.description = description;
        await task.save();

        await recordActivity(req.user.userId, 'updated_task', "Task", taskId, {
            description: `updated task description from ${oldDescription} to ${newDescription}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating title' });
    }
}

const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const oldStatus = task.status;

        task.status = status;
        await task.save();

        await recordActivity(req.user.userId, 'updated_task', "Task", taskId, {
            description: `updated task status from ${oldStatus} to ${status}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating title' });
    }
}

const updateTaskAssignees = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { assignees } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const oldAssignees = task.assignees;

        task.assignees = assignees;
        await task.save();

        await recordActivity(req.user.userId, 'updated_task', "Task", taskId, {
            description: `updated task assignees from ${oldAssignees.length} to ${assignees.length}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating title' });
    }
}

const updateTaskPriority = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { priority } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const oldPriority = task.priority;

        task.priority = priority;
        await task.save();

        await recordActivity(req.user.userId, 'updated_task', "Task", taskId, {
            description: `updated task priority from ${oldPriority} to ${priority}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating priority' });
    }
}

const addSubTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { title } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const newSubTask = {
            title,
            completed: false
        };

        task.subTasks.push(newSubTask);
        await task.save();

        await recordActivity(req.user.userId, 'created_subtask', "Task", taskId, {
            description: `created subtask ${title}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in adding subtask' });
    }
}

const updateSubTask = async (req, res) => {
    try {
        const { taskId, subTaskId } = req.params;
        const { completed } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const subTask = task.subTasks.find((subtask) => subtask._id.toString() === subTaskId);

        if (!subTask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        subTask.completed = completed;
        await task.save();

        await recordActivity(req.user.userId, 'updated_subtask', "Task", taskId, {
            description: `updated subtask ${subTask.title}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in updating subtask' });
    }
}

const getActivityByResourceId = async (req, res) => {
    try {
        const { resourceId } = req.params;
        const activities = await ActivityLog.find({ resourceId: resourceId })
            .populate("user", "name profilePicture")
            .sort({ createdAt: -1 });
        res.status(200).json(activities);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const addComment = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { text } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const newComment = await Comment.create({ text, author: req.user.userId, task: taskId });

        task.comments.push(newComment._id);
        await task.save();

        await recordActivity(req.user.userId, 'added_comment', "Task", taskId, {
            description: `added comment ${text.substring(0, 50) + (text.length > 50 ? '...' : '')}`
        });

        const populatedComment = await Comment.findById(newComment._id).populate("author", "name profilePicture");

        // --- PUSHER EVENT ---
        pusher.trigger(`task-${taskId}`, "new-comment", populatedComment);

        res.status(200).json(populatedComment);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in adding comment' });
    }
}

const watchTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const isWatching = task.watchers.includes(req.user._id);

        if (isWatching) {
            task.watchers = task.watchers.filter((watcher) => watcher.toString() !== req.user.userId.toString());
        } else {
            task.watchers.push(req.user.userId);
        }

        await task.save();

        await recordActivity(req.user.userId, 'watched_task', "Task", taskId, {
            description: `${isWatching ? 'stopped watching' : 'started watching'} task ${task.title}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in watching task' });
    }
}

const archiveTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const project = await Project.findById(task.project);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const isMember = project.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this project' });
        }

        const isArchived = task.isArchived;

        task.isArchived = !isArchived;
        await task.save();

        await recordActivity(req.user.userId, 'archived_task', "Task", taskId, {
            description: `${isArchived ? 'unarchived' : 'archived'} task ${task.title}`
        });


        res.status(200).json(task);

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error in watching task' });
    }
}

const getCommentsByTaskId = async (req, res) => {
    try {
        const { taskId } = req.params;
        const comments = await Comment.find({ task: taskId })
            .populate("author", "name profilePicture")
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignees: { $in: [req.user.userId] } })
            .populate("project", "title workspace")
            .sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const userId = req.user._id;

        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: "Task not found" });

        // Only allow assignee, project admin, or workspace owner to delete
        const project = await Project.findById(task.project);
        if (!project) return res.status(404).json({ message: "Project not found" });

        // You may want to check workspace permissions as well
        // For now, allow if user is in assignees or project owner
        const isAssignee = task.assignees.some(a => a.toString() === userId.toString());
        const isProjectOwner = project.owner?.toString() === userId.toString();

        if (!isAssignee && !isProjectOwner) {
            return res.status(403).json({ message: "Not authorized to delete this task" });
        }

        // Remove task from project.tasks array if you store it there
        if (project.tasks) {
            project.tasks = project.tasks.filter(tid => tid.toString() !== taskId);
            await project.save();
        }

        await Task.findByIdAndDelete(taskId);

        res.json({ message: "Task deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete task", error: err.message });
    }
};

export {
    createTask,
    getTaskById,
    updateTaskTitle,
    updateTaskDescription,
    updateTaskStatus,
    updateTaskAssignees,
    updateTaskPriority,
    addSubTask,
    updateSubTask,
    getActivityByResourceId,
    addComment,
    getCommentsByTaskId,
    watchTask,
    archiveTask,
    getMyTasks
}