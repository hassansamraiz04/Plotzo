import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import prisma from "../prisma/prisma.js";

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;

const cookieOptions = () => ({
  httpOnly: true,
  maxAge: WEEK_MS,
  sameSite: "lax",
  secure:
    Boolean(process.env.COOKIE_SECURE === "true") ||
    process.env.NODE_ENV === "production",
});

const parseRole = (value) => {
  const normalized = String(value || "BUYER").toUpperCase();
  if (normalized === "SELLER" || normalized === "BUYER") return normalized;
  return null;
};

export const register = async (req, res) => {
  const { username: rawUsername, email: rawEmail, password, role: rawRole } =
    req.body || {};

  const username = validator.trim(rawUsername || "");
  const emailRaw = String(rawEmail || "").trim();
  const norm = validator.normalizeEmail(emailRaw);
  const email = typeof norm === "string" && norm ? norm : emailRaw;

  try {
    if (!username || username.length < 3 || username.length > 32) {
      return res.status(400).json({ message: "Username must be 3–32 characters" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Valid email required" });
    }
    if (!password || !validator.isLength(password, { min: 8, max: 128 })) {
      return res.status(400).json({ message: "Password must be 8–128 characters" });
    }

    const role = parseRole(rawRole);
    if (!role) {
      return res.status(400).json({ message: "role must be buyer or seller" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "P2002") {
      return res.status(409).json({ message: "Email or username already taken" });
    }
    res.status(500).json({ message: "Failed to create user" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body || {};

  try {
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password required" });
    }

    const user = await prisma.user.findUnique({
      where: { username: String(username).trim() },
    });

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: WEEK_MS }
    );

    const { password: _pw, ...userInfo } = user;

    res
      .cookie("token", token, cookieOptions())
      .status(200)
      .json({ ...userInfo, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to login" });
  }
};

export const logout = (req, res) => {
  res
    .clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure:
        Boolean(process.env.COOKIE_SECURE === "true") ||
        process.env.NODE_ENV === "production",
    })
    .status(200)
    .json({ message: "Logout successful" });
};
