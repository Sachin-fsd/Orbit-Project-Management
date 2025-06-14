import { recordActivity } from "../libs/index.js";
import { sendEmail } from "../libs/send-email.js";
import Project from "../models/project.modal.js";
import User from "../models/user.model.js";
import WorkspaceInvite from "../models/workspace-invite.js";
import WorkSpace from "../models/workspace.modal.js";
import jwt from "jsonwebtoken";


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
        const { workspaceId } = req.params;
        const workspace = await WorkSpace.findById(workspaceId).populate('members.user', 'name email profilePicture');
        if (!workspace) {
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
        const { workspaceId } = req.params;
        const workspace = await WorkSpace.findOne({
            _id: workspaceId, 'members.user': req.user.userId
        }).populate('members.user', 'name email profilePicture');
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const projects = await Project.find({
            workspace: workspaceId,
            isArchived: false,
            // members: { $in: [req.user._id] }

        })
            // .populate('tasks','status')
            .sort({ createdAt: -1 });
        res.status(200).json({ projects, workspace });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const getWorkspaceStats = async (req, res) => {
    try {
        const { workspaceId } = req.params;

        console.log(workspaceId)

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (!isMember) {
            return res.status(403).json({ message: 'You are not a member of this workspace' });
        }

        const [totalProjects, projects] = await Promise.all([
            Project.countDocuments({ workspace: workspaceId }),
            Project.find({ workspace: workspaceId })
                .populate("tasks", "status title dueDate project updatedAt isArchived priority")
                .sort({ createdAt: -1 })
        ])

        const totalTasks = projects.reduce((total, project) => total + project.tasks.length, 0);

        const totalProjectInProgress = projects.filter((project) => project.status === "IN PROGRESS").length;

        const totalProjectCompleted = projects.filter((project) => project.status === "COMPLETED").length;

        const totalTaskCompleted = projects.reduce((total, project) => total + project.tasks.filter(task => task.status === "Done").length, 0);
        const totalTaskToDo = projects.reduce((total, project) => total + project.tasks.filter(task => task.status === "To Do").length, 0);
        const totalTaskInProgress = projects.reduce((total, project) => total + project.tasks.filter(task => task.status === "In Progress").length, 0);

        const tasks = projects.flatMap((project) => project.tasks)

        // upcoming tasks in next 7 days

        const upcomingTasks = tasks.filter(task => {
            const dueDate = new Date(task.dueDate);
            const today = new Date();
            return dueDate >= today && dueDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
        });

        const taskTrendsData = [
            { name: "Sun", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Mon", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Tue", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Wed", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Thu", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Fri", completed: 0, inProgress: 0, toDo: 0 },
            { name: "Sat", completed: 0, inProgress: 0, toDo: 0 },
        ]

        // get last 7 days tasks Date

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date;
        }).reverse();

        // populate

        for (const project of projects) {
            for (const task in project.tasks) {
                const taskdate = new Date(project.updatedAt);

                const dayInDate = last7Days.findIndex(
                    (date) =>
                        date.getDate() === taskdate.getDate() &&
                        date.getMonth() === taskdate.getMonth() &&
                        date.getFullYear() === taskdate.getFullYear()
                )

                if (dayInDate !== -1) {
                    const daName = last7Days[dayInDate].toLocaleDateString('en-US', { weekday: "short" });

                    const dayData = taskTrendsData.find((day) => day.name === daName);

                    if (dayData) {
                        switch (task.status) {
                            case "Done":
                                dayData.completed += 1;
                                break;
                            case "In Progress":
                                dayData.inProgress += 1;
                                break;
                            case "To Do":
                                dayData.toDo += 1;
                                break;
                        }
                    }
                }
            }
        }

        // get Project status distribution
        const projectStatusData = [
            { name: "COMPLETED", value: 0, color: "#10b981" },
            { name: "IN PROGRESS", value: 0, color: "#f59e0b" },
            { name: "PLANNING", value: 0, color: "#ef4444" },
        ]

        for (const project of projects) {
            switch (project.status) {
                case "COMPLETED":
                    projectStatusData[0].value += 1;
                    break;
                case "IN PROGRESS":
                    projectStatusData[1].value += 1;
                    break;
                case "PLANNING":
                    projectStatusData[2].value += 1;
                    break;
            }
        }

        // Task Priority Distribution

        const taskPriorityData = [
            { name: "High", value: 0, color: "#ef4444" },
            { name: "Medium", value: 0, color: "#f59e0b" },
            { name: "Low", value: 0, color: "#10b981" },
        ]

        for (const task of tasks) {
            switch (task.priority) {
                case "High":
                    taskPriorityData[0].value += 1;
                    break;
                case "Medium":
                    taskPriorityData[1].value += 1;
                    break;
                case "Low":
                    taskPriorityData[2].value += 1;
                    break;
            }
        }

        const workspaceProductivityData = [];

        for (const project of projects) {
            const projectTask = tasks.filter(
                (task) => task.project.toString() === project._id.toString()
            )

            const completedTask = projectTask.filter(
                (task) => task.status === "Done" && task.isArchived === false
            )

            workspaceProductivityData.push({
                name: project.title,
                completed: completedTask.length,
                total: projectTask.length
            })
        }

        const stats = {
            totalProjects,
            totalTasks,
            totalProjectInProgress,
            totalProjectCompleted,
            totalTaskToDo,
            totalTaskInProgress,
            totalTaskCompleted
        }

        res.status(200).json({
            stats,
            taskTrendsData,
            projectStatusData,
            taskPriorityData,
            workspaceProductivityData,
            upcomingTasks,
            recentProjects: projects.slice(0, 5)

        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const inviteUserToWorkspace = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const usermemberInfo = workspace.members.find((member) => member.user.toString() === req.user.userId.toString());

        if (!usermemberInfo || !["admin", "owner"].includes(usermemberInfo.role)) {
            return res.status(403).json({ message: 'You are not authorized to invite users to this workspace' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === user._id.toString());

        if (isMember) {
            return res.status(400).json({ message: 'User is already a member of this workspace' });
        }

        const isInvited = await WorkspaceInvite.findOne({ workspaceId, user: user._id });
        if (isInvited && isInvited.expiresAt > new Date()) {
            return res.status(400).json({ message: 'Invite already sent. Please check your email for the invite link.' });
        }

        if (isInvited && isInvited.expiresAt < new Date()) {
            await WorkspaceInvite.findByIdAndDelete(isInvited._id);
        }

        const token = jwt.sign({ workspaceId, user: user._id, role: role || "member" }, process.env.JWT_SECRET, { expiresIn: '7d' });
        await WorkspaceInvite.create({ workspaceId, user: user._id, token, role: role || "member", expiresAt: new Date(Date.now() + 3600000) });

        const invitationLink = `${process.env.FRONTEND_URL}/workspace-invite/${workspace._id}?tk=${token}`;

        const emailContent = `
        <p>You have been invited to join ${workspace.name} workspace</p>
        <p>Click here to join: <a href="${invitationLink}">${invitationLink}</a></p>
        <p>This link will expire in 7 days.</p>
        `;

        await sendEmail(
            email,
            "You have been invited to join a workspace",
            emailContent
        );

        res.status(200).json({
            message: "Invitation sent successfully",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const acceptGenerateInvite = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email, role } = req.body;

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === req.user.userId.toString());

        if (isMember) {
            return res.status(400).json({ message: 'You are already a member of this workspace' });
        }

        workspace.members.push({ user: req.user.userId, role: role || "member", joinedAt: new Date() });
        await workspace.save();

        recordActivity(req.user.userId, "joined_workspace", "Workspace", workspaceId, { description: `joined workspace ${workspace.name}` });
        res.status(200).json({ workspace, message: "You have joined the workspace successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

export const acceptInviteByToken = async (req, res) => {
    try {
        const { token } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { workspaceId, user, role } = decoded;

        const workspace = await WorkSpace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: 'Workspace not found' });
        }

        const isMember = workspace.members.some((member) => member.user.toString() === user.toString());

        if (isMember) {
            return res.status(400).json({ message: 'User is already a member of this workspace' });
        }

        const invite = await WorkspaceInvite.findOne({ workspaceId, user });

        if (!invite) {
            return res.status(404).json({ message: 'Invite not found' });
        }

        if (invite.expiresAt < new Date()) {
            return res.status(400).json({ message: 'Invite link has expired' });
        }

        const ExistingUser = await User.findById(invite.user);
        if (!ExistingUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        workspace.members.push({ user, role: role || "member", joinedAt: new Date() });
        await workspace.save();

        await Promise.all([
            WorkspaceInvite.findByIdAndDelete(invite._id),
            recordActivity(user, "joined_workspace", "Workspace", workspaceId, { description: `joined workspace ${workspace.name}` }),
        ])

        res.status(200).json({ message: "You have joined the workspace successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

const isOwnerOrAdmin = (workspace, userId) => {
  const member = workspace.members.find(m => m.user.toString() === userId.toString());
  return workspace.owner.toString() === userId.toString() || (member && member.role === "admin");
};

export const updateWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { name, description, color } = req.body;
    const userId = req.user._id;

    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!isOwnerOrAdmin(workspace, userId)) {
      return res.status(403).json({ message: "Only owner or admin can update workspace" });
    }

    if (name !== undefined) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (color !== undefined) workspace.color = color;

    await workspace.save();
    res.json({ message: "Workspace updated", workspace });
  } catch (err) {
    console.log("Error in updateWorkspace",err)
    res.status(500).json({ message: "Failed to update workspace", error: err.message });
  }
};

// --- DELETE WORKSPACE ---
export const deleteWorkspace = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const userId = req.user._id;

    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only owner can delete workspace" });
    }

    // Optionally: delete all projects and tasks under this workspace
    await Project.deleteMany({ workspace: workspaceId });
    await WorkSpace.findByIdAndDelete(workspaceId);

    res.json({ message: "Workspace deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete workspace", error: err.message });
  }
};

// --- TRANSFER OWNERSHIP ---
export const transferWorkspaceOwnership = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { newOwnerId } = req.body;
    const userId = req.user._id;

    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only owner can transfer ownership" });
    }

    const member = workspace.members.find(m => m.user.toString() === newOwnerId);
    if (!member) {
      return res.status(400).json({ message: "New owner must be a member of the workspace" });
    }

    workspace.owner = newOwnerId;
    // Optionally, set previous owner as admin or member
    const prevOwnerMember = workspace.members.find(m => m.user.toString() === userId.toString());
    if (prevOwnerMember) prevOwnerMember.role = "admin";
    member.role = "owner";

    await workspace.save();
    res.json({ message: "Ownership transferred", workspace });
  } catch (err) {
    res.status(500).json({ message: "Failed to transfer ownership", error: err.message });
  }
};

// --- REMOVE MEMBER ---
export const removeWorkspaceMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { userId: removeUserId } = req.body;
    const userId = req.user._id;

    const workspace = await WorkSpace.findById(workspaceId);
    if (!workspace) return res.status(404).json({ message: "Workspace not found" });

    if (!isOwnerOrAdmin(workspace, userId)) {
      return res.status(403).json({ message: "Only owner or admin can remove members" });
    }

    if (workspace.owner.toString() === removeUserId) {
      return res.status(400).json({ message: "Cannot remove the owner from the workspace" });
    }

    const memberIndex = workspace.members.findIndex(m => m.user.toString() === removeUserId);
    if (memberIndex === -1) {
      return res.status(404).json({ message: "Member not found in workspace" });
    }

    workspace.members.splice(memberIndex, 1);
    await workspace.save();
    res.json({ message: "Member removed", workspace });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove member", error: err.message });
  }
};