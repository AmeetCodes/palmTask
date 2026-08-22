import { Router } from "express";
import {
  getUsers,
  getUser,
  createNewUser,
  updateExistingUser,
  removeUser,
  getUsersCount,
} from "../controller/user.controller";
import { protect, AuthRequest } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/role.middleware";

const router = Router();

router.get("/profile", protect, (req: AuthRequest, res) => {
  res.json({
    message: "You accessed a protected route",
    user: req.user,
  });
});

router.get("/", protect, getUsers);
router.get("/count", protect, getUsersCount);
router.get("/:id", protect, getUser);

router.post("/", protect, adminOnly, createNewUser);
router.put("/:id", protect, adminOnly, updateExistingUser);
router.delete("/:id", protect, adminOnly, removeUser);

export default router;