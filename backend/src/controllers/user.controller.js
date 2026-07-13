import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import FriendRequest from "../models/friendRequest.model.js";
import { generateToken } from "../utils/generateToken.js";
import { upsertStreamUser } from "../config/stream.js";

export async function getRecommendedUsers(req, res) {

     try {
    const currentUser = req.user;

    const recommendedUsers = await User.find({
      _id: {
        $nin: [...currentUser.friends, currentUser._id],
      },
    }).select(
      "_id fullName profilePic location bio nativeLanguage learningLanguage"
    );

    return res.status(200).json({
      success: true,
      users: recommendedUsers,
    });

  }catch(err){
        res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate(
        "friends",
        "_id fullName profilePic location bio nativeLanguage learningLanguage"
      );

    return res.status(200).json({
      success: true,
      friends: user.friends,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
}

export async function sendFriendRequest(req, res) {

    try {

        const myId = req.user._id;
        const recipientId = req.params.id;

        if (myId === recipientId) {
          return res.status(400).json({
            message: "You cannot send a friend request to yourself",
          });
        }

        const receipient = await User.findById(recipientId);

        if (!receipient) {
            return res.status(404).json({
                message: "Recipient user not found",
            });
        }

        // check if user is already friends
    if (receipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

      const friendRequest = new FriendRequest({
        sender: myId,
        recipient: recipientId,
      });

      await friendRequest.save();

      return res.status(200).json({
        success: true,
        message: "Friend request sent",
      });

    } catch (err) {
      console.error("Error in sendFriendRequest controller", err.message);
      return res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
      });
    }

}

export async function acceptFriendRequest(req, res) {
    try{

        const {id: requestId} = req.params;

        console.log("Request ID:", requestId);

        const friendRequest = await FriendRequest.findById(requestId);
        console.log(friendRequest);

        if(!friendRequest){
            return res.status(404).json({
                message: "Friend request not found",
            });
        }

        if(friendRequest.recipient.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message: "You are not authorized to accept this friend request",
            });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient },
        })

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender },
        })

        return res.status(200).json({
          message: "request accepted"
        })

    }catch(err){
        console.error("Error in acceptFriendRequest controller", err.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export async function getFriendRequests(req, res){

    try{
        const incomingReqs = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending",
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
    $or: [
        { sender: req.user._id },
        { recipient: req.user._id }
    ],
    status: "accepted",
})
.populate("sender", "fullName  profilePic location bio nativeLanguage learningLanguage")
.populate("recipient", "fullName profilePic location bio nativeLanguage learningLanguage");

        return res.status(200).json({
            incoming: incomingReqs,
            accepted: acceptedReqs
        });

    }catch(err){
        console.error("Error in getFriendRequests controller", err.message);
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
        });
    }
}

export async function getOutgoingFriendReqs(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user.id,
      status: "pending",
    }).populate("recipient", "fullName profilePic location bio nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);
  } catch (error) {
    console.log("Error in getOutgoingFriendReqs controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

