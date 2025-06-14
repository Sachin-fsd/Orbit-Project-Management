import express from 'express';
import { validateRequest } from "zod-express-middleware";

import { authMiddleware } from '../middleware/auth-middleware.js';
import { acceptGenerateInvite, acceptInviteByToken, createWorkspace, deleteWorkspace, getWorkspaceDetails, getWorkspaceProjects, getWorkspaces, getWorkspaceStats, inviteUserToWorkspace, removeWorkspaceMember, transferWorkspaceOwnership, updateWorkspace } from '../controllers/workspace.js';
import { inviteMemberSchema, workspaceSchema } from '../libs/validate-schema.js';
import { z } from 'zod';


const router = express.Router();

router.post('/',authMiddleware,validateRequest({body:workspaceSchema}),createWorkspace);

router.get('/',authMiddleware, getWorkspaces);

router.post("/accept-invite-token", authMiddleware,validateRequest({
    body:z.object({token:z.string().min(1, 'Token is required')})}), acceptInviteByToken);

router.post("/:workspaceId/invite-member", authMiddleware, validateRequest({
    params:z.object({workspaceId:z.string()}),
    body:inviteMemberSchema}), inviteUserToWorkspace)

router.post("/:workspaceId/accept-generate-invite", authMiddleware, validateRequest({
    params:z.object({workspaceId:z.string()}),
}), acceptGenerateInvite)

router.get('/:workspaceId',authMiddleware, getWorkspaceDetails);

router.get('/:workspaceId/projects',authMiddleware, getWorkspaceProjects);

router.get('/:workspaceId/stats',authMiddleware, getWorkspaceStats);

router.put("/:workspaceId", authMiddleware, validateRequest({
  params: z.object({ workspaceId: z.string() }),
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional()
  })
}), updateWorkspace);

// Delete workspace
router.delete("/:workspaceId", authMiddleware, validateRequest({
  params: z.object({ workspaceId: z.string() })
}), deleteWorkspace);

// Transfer ownership
router.post("/:workspaceId/transfer-ownership", authMiddleware, validateRequest({
  params: z.object({ workspaceId: z.string() }),
  body: z.object({ newOwnerId: z.string() })
}), transferWorkspaceOwnership);

// Remove member
router.post("/:workspaceId/remove-member", authMiddleware, validateRequest({
  params: z.object({ workspaceId: z.string() }),
  body: z.object({ userId: z.string() })
}), removeWorkspaceMember);


export default router;