import { Router, Request, Response } from "express";
import {
  register,
  login,
  sendOtp,
  verifyOtpAndResetPassword,
  updateUser,
  deleteUser,
} from "../controllers/authController";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";

const router = Router();

router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.post("/register", register);
router.post("/login", login);
router.post("/send-code", sendOtp);
router.post("/verify-otp", verifyOtpAndResetPassword);

// Get all users
router.get("/users", async (req: Request, res: Response): Promise<void> => {
  try {
    const userRepo = AppDataSource.getRepository<User>(User); // Explicit typing
    const users = await userRepo.find();

    if (users.length === 0) {
      res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

export default router;
