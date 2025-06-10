import express, { Router } from "express"
import { validateRequest } from 'zod-express-middleware'
import { projectSchema } from "../libs/validate-schema.js"
import { z } from "zod"
import createProject, { getProjectDetails, getProjectTasks } from "../controllers/project.js"
import { authMiddleware } from "../middleware/auth-middleware.js"

const router = express.Router()

router.post("/:workspaceId/create-project", authMiddleware, validateRequest({
    params: z.object({ workspaceId: z.string() }),
    body: projectSchema
}), createProject)

router.get("/:projectId", authMiddleware, validateRequest({
    params: z.object({ projectId: z.string() })
}),
    getProjectDetails
)


router.get("/:projectId/tasks", authMiddleware, validateRequest({
    params: z.object({ projectId: z.string() }),
},
), getProjectTasks)

export default router
