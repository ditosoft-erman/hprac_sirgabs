// import { Request, Response } from "express";
// import { AppDataSource } from "../config/database";
// import { User } from "../entities/User";
// import bcrypt from "bcrypt";
// import nodemailer from "nodemailer";
// import crypto from "crypto"; // To generate the OTP
// import * as dotenv from "dotenv";

// 
// dotenv.config(); // Loads environment variables from .env file
// 
// let otpStore: { [key: string]: { otp: string; expiry: number } } = {};
// 
// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: "gmail", // Use Gmail or your chosen email service
//   auth: {
//     user: process.env.EMAIL_USER, // Set your email here (use env variables)
//     pass: process.env.EMAIL_PASS, // Set your app-specific password here (use env variables)
//   },
// });
// 
// //Update 
// export const updateUser = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
//   const { username, email } = req.body;
// 
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const user = await userRepo.findOneBy({ id: parseInt(id) });
// 
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
// 
//     user.username = username;
//     user.email = email;
// 
//     await userRepo.save(user);
// 
//     res.status(200).json({ message: "User updated successfully", user });
//   } catch (error) {
//     console.error("Update Error:", error);
//     res.status(500).json({ message: "Update failed", error });
//   }
// };
// 
// //Delete
// export const deleteUser = async (req: Request, res: Response): Promise<void> => {
//   const { id } = req.params;
// 
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const user = await userRepo.findOneBy({ id: parseInt(id) });
// 
//     if (!user) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }
// 
//     await userRepo.remove(user);
// 
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Deletion Error:", error);
//     res.status(500).json({ message: "Deletion failed", error });
//   }
// };
// 
// 
// 
// 
// // Register handler
// export const register = async (req: Request, res: Response): Promise<void> => {
//   const { username, email, password } = req.body;
// 
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const existingUser = await userRepo.findOneBy({ email });
// 
//     if (existingUser) {
//       res.status(400).json({ message: "Email already in use" });
//       return;
//     }
// 
//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
//     const user = userRepo.create({ username, email, password: hashedPassword });
//     await userRepo.save(user);
// 
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Registration failed", error });
//   }
// };
// 
// // Login handler
// export const login = async (req: Request, res: Response): Promise<void> => {
//   const { email, password } = req.body;
// 
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const user = await userRepo.findOneBy({ email });
// 
//     if (!user) {
//       res.status(401).json({ message: "Invalid email or password" });
//       return;
//     }
// 
//     // Compare the plain password with the hashed password from the database
//     const isPasswordValid = await bcrypt.compare(password, user.password);
// 
//     if (!isPasswordValid) {
//       res.status(401).json({ message: "Invalid email" });
//       return;
//     }
// 
//     // If login is successful
//     res.json({ message: "Login successful" });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Login failed", error });
//   }
// };
// 
// // Send OTP for Password Reset
// // Send OTP for Password Reset
// export const sendOtp = async (req: Request, res: Response): Promise<any> => {
//   const { email } = req.body;
// 
//   try {
//     const userRepo = AppDataSource.getRepository(User);
//     const user = await userRepo.findOneBy({ email });
// 
//     if (!user) {
//       return res.status(404).json({ message: "Email not found" });
//     }
// 
//     // Generate OTP
//     const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
//     const expiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
// 
//     // Store OTP temporarily (in-memory or use Redis in production)
//     otpStore[email] = { otp, expiry };
// 
//     // Send OTP email
//     const mailOptions = {
//       from: process.env.EMAIL_USER, // Sender's email
//       to: email, // Recipient's email
//       subject: "Password Reset OTP",
//       text: `Your OTP for resetting the password is: ${otp}`,
//     };
// 
//     await transporter.sendMail(mailOptions);
// 
//     res.status(200).json({ message: "OTP sent to email" });
//   } catch (error) {
//     console.error("Error sending OTP:", error);
//     res.status(500).json({ message: "Failed to send OTP", error });
//   }
// };
// 
// // Verify OTP
// // Verify OTP and check password
// export const verifyOtpAndResetPassword = async (
//   req: Request,
//   res: Response
// ): Promise<any> => {
//   const { email, otp, newPassword } = req.body;
// 
//   // Check if OTP is valid
//   const storedOtp = otpStore[email];
// 
//   if (!storedOtp) {
//     return res.status(404).json({ success: false, message: "OTP not found" });
//   }
// 
//   if (Date.now() > storedOtp.expiry) {
//     return res.status(400).json({ success: false, message: "OTP expired" });
//   }
// 
//   if (storedOtp.otp !== otp) {
//     return res.status(400).json({ success: false, message: "Invalid OTP" });
//   }
// 
//   // Proceed with password reset
//   const userRepo = AppDataSource.getRepository(User);
//   const user = await userRepo.findOneBy({ email });
// 
//   if (!user) {
//     return res.status(404).json({ success: false, message: "User not found" });
//   }
// 
//   // Hash the new password and update it
//   const hashedPassword = await bcrypt.hash(newPassword, 10);
//   user.password = hashedPassword;
//   await userRepo.save(user);
// 
//   // OTP expires after use
//   delete otpStore[email];
// 
//   res
//     .status(200)
//     .json({ success: true, message: "Password reset successfully" });
// };



import { Request, Response } from "express";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import crypto from "crypto"; 
import * as dotenv from "dotenv";
import validator from 'validator';



dotenv.config(); 

let otpStore: { [key: string]: { otp: string; expiry: number } } = {};

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { username, email } = req.body;

  if (!username || !email) {
    res.status(400).json({ message: "Username and email are required" });
    return;
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: parseInt(id) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.username = username;
    user.email = email;

    await userRepo.save(user);

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Update failed", error });
  }
};

// Delete user
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ id: parseInt(id) });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    await userRepo.remove(user);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Deletion Error:", error);
    res.status(500).json({ message: "Deletion failed", error });
  }
};

// Register handler
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({ message: "Username, email, and password are required" });
    return;
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const existingUser = await userRepo.findOneBy({ email });

    if (existingUser) {
      res.status(400).json({ message: "Email already in use" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds
    const user = userRepo.create({ username, email, password: hashedPassword });
    await userRepo.save(user);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Registration failed", error });
  }
};

// Login handler
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and password are required" });
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // Compare the plain password with the hashed password from the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    // If login is successful
    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Login failed", error });
  }
};

// Send OTP for Password Reset
export const sendOtp = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  // Validate email format
  if (!validator.isEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOneBy({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
    const expiry = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes

    // Store OTP temporarily (in-memory or use Redis in production)
    otpStore[email] = { otp, expiry };

    // Send OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender's email
      to: email, // Recipient's email
      subject: "Password Reset OTP",
      text: `Your OTP for resetting the password is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Failed to send OTP", error });
  }
};

// Verify OTP and reset password
export const verifyOtpAndResetPassword = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400).json({ message: "Email, OTP, and new password are required" });
    return;
  }

  // Check if OTP is valid
  const storedOtp = otpStore[email];

  if (!storedOtp) {
    return res.status(404).json({ success: false, message: "OTP not found" });
  }

  if (Date.now() > storedOtp.expiry) {
    return res.status(400).json({ success: false, message: "OTP expired" });
  }

  if (storedOtp.otp !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  // Proceed with password reset
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ email });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Hash the new password and update it
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await userRepo.save(user);

  // OTP expires after use
  delete otpStore[email];

  res.status(200).json({ success: true, message: "Password reset successfully" });
};
