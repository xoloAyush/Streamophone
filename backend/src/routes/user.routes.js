import express from "express";
import { getRecommendedUsers, 
    getMyFriends, 
     acceptFriendRequest,
    getOutgoingFriendReqs,
  sendFriendRequest,
  getFriendRequests,
  getExploreUsers,
  getUserById
 } from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(protect); // Apply the protect middleware to all routes in this router

router.get("/recommended", getRecommendedUsers);
router.get("/friends", getMyFriends);

router.get("/explore", getExploreUsers);

router.post("/friend-request/:id", sendFriendRequest);
router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequests);
router.get("/outgoing-friend-requests", getOutgoingFriendReqs);

// dynamic catch-all route LAST
router.get("/:id", getUserById);

export default router;
