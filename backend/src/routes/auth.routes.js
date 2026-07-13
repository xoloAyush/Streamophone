import express from "express";
import { signup, signin, signout, onboard } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", protect, signout);

router.post("/onboarding", protect, onboard);

router.get('/me', protect, (req,res)=>{
    res.status(200).json(
        { 
        success: true, user:req.user
    }
    )
})

export default router;
