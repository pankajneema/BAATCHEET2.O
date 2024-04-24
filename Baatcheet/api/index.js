// Hi , this is node server for baatcheet backend 

//  init require modules 

const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;


const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongoose.connect(
    "mongodb+srv://neemapankaj123:TrYSTs85o6NE4imY@cluster0.xbfr9yj.mongodb.net/Baatcheet",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.log("Mongo Db connected successfully");
}).catch((err) => {
    console.log("Error in connecting MongoDB :", err);
});


app.listen(port, () => {
    console.log("Node server running on port: " + port);
}).on('error', (err) => {
    console.log("Error in starting server: " + err);
});

const User = require("./modoles/user");
const Message = require("./modoles/message");

// function to create token 
const createToken = (userId) => {
    const payload = {
        userId: userId,
    };
    const token = jwt.sign(payload, "oi#$%PIuFGVTY%^$%*$#$", { expiresIn: "24h" });

    return token;
}

// New User Register Endpoint
app.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;
    //  register new user object
    const newUser = new User({ name, email, password, image });
    newUser.save().then(() => {

        res.status(200).json({ Message: "User Registered Succesfully" })
        console.log("New User Registered Succesfully => ", newUser);
    }).catch((err) => {
        res.status(500).json({ Message: "Server Error" })
        console.log("Erorn in New User Registration : " + err);

    })
})

//  User Login Endpoint
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(404).json({ Message: "Email is required" });
    }


    if (!password) {
        return res.status(404).json({ Message: "Password is required" })
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            console.log("User not Found" + user);
            return res.status(404).json({ Message: "User not Found" });
        }
        if (user.password !== password) {
            console.log("Password Mismatch");
            return res.status(404).json({ Message: "Incorrect Password" });
        }

        const token = createToken(user._id);
        return res.status(200).json({ token });

    }).catch((error) => {
        console.log("LogedIn Error == ", error);
        res.status(500).json({ message: "Internal Server Error" });
    })


});

//retrive all users except who login in app 
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } })
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.log("Error retrieving users", err);
            res.status(500).json({ message: "Error retrieving users" });
        });
});


// End point to send freind request 
app.post("/friend-request", async (req, res) => {

    const { currentUserId, selectedUserId } = req.body;
    try {
        //jiske pass request send hogi uski frindRequest array update krni hai
        await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currentUserId },
        });

        //jisne send kari hai friend requset send uska sendFriendRequest Array update krna hai 
        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId },
        });

        res.sendStatus(200);
    } catch (err) {
        console.log("Error in sending Frind request", err);
        res.sendStatus(500);
    }
});


//api to get friends requests 
app.get("/friend-request/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
     
      //fetch the user document based on the User id
      const user = await User.findById(userId)
        .populate("friendRequests", "name email image")
        .lean();
      
      const friendRequests = user.friendRequests;
      console.log("total friends of "+userId+" is ",friendRequests);
      res.json(friendRequests);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });  

  //endpoint to delete friend request
app.post("/friend-request/delete", async (req, res) => {
    try {
      const { senderId, recepientId } = req.body;
      console.log("Friend Request Deletion Strat");
      //retrieve the documents of sender and the recipient
      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);
    
      recepient.friendRequests = recepient.friendRequests.filter(
        (request) => request.toString() !== senderId.toString()
      );
  
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (request) => request.toString() !== recepientId.toString()
      );

      await sender.save();
      await recepient.save();
  
      res.status(200).json({ message: "Friend Request Deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

//endpoint to Accpet friend request
app.post("/friend-request/accept", async (req, res) => {
    try {
        console.log("debug :: ACCEPT FREND REQUEST START --------");
      const { senderId, recepientId } = req.body;
      console.log("debug :: SenderId - "+senderId+"  recepientId - "+recepientId);
      //retrieve the documents of sender and the recipient
      const sender = await User.findById(senderId);
      const recepient = await User.findById(recepientId);
    
      sender.friends.push(recepientId);
      recepient.friends.push(senderId);
      
      recepient.friendRequests = recepient.friendRequests.filter(
        (request) => request.toString() !== senderId.toString()
      );
  
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (request) => request.toString() !== recepientId.toString()
      );

      await sender.save();
      await recepient.save();
    console.log("DEBUG :: Appect freind request completed ");
      res.status(200).json({ message: "Friend Request Accepted successfully" });

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

//Api to get Friends
app.get("/accepted-friends/:userId", async (req, res) => { 
  try {
  console.log("debug :: Fetching FRENDS START --------");
  const { userId } = req.params;
  console.log("debug :: userId - "+userId);
  //retrieve the documents of sender and the recipient
  const user = await User.findById(userId).populate(
    "friends",
    "name email image "
  );
  
  const acceptFriends  =  user.friends;


  console.log("DEBUG :: Fetching friends  completed ");
  res.status(200).json(acceptFriends);

} catch (error) {

  console.log("DEBUG :: Error in fetch friends ",error);
  res.status(500).json({ message: "Internal Server Error" });
}
}) 

const multer = require("multer");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post Messages and store it in the backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body;
    
    console.log(req.body);
    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      message: messageText,
      timestamp: new Date(),
      imageUrl: messageType === "image" ? req.file.path : null,
    });

    await newMessage.save();
    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

///endpoint to get the userDetails to design the chat Room header
app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId);

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to fetch the messages between two users in the chatRoom
app.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");
    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//endpoint to delete the messages!
app.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});


app.get("/friend-requests/sent/:userId",async(req,res) => {
  try{
    const {userId} = req.params;
    const user = await User.findById(userId).populate("sentFriendRequests","name email image").lean();

    const sentFriendRequests = user.sentFriendRequests;

    res.json(sentFriendRequests);
  } catch(error){
    console.log("error",error);
    res.status(500).json({ error: "Internal Server" });
  }
})

app.get("/friends/:userId",(req,res) => {
  try{
    const {userId} = req.params;

    User.findById(userId).populate("friends").then((user) => {
      if(!user){
        return res.status(404).json({message: "User not found"})
      }

      const friendIds = user.friends.map((friend) => friend._id);

      res.status(200).json(friendIds);
    })
  } catch(error){
    console.log("error",error);
    res.status(500).json({message:"internal server error"})
  }
})


app.get("/profile-image/:userId" ,(req,res) => {
   try{
    console.log("User Profile --");
    const {userId} = req.params;
    
    User.findById(userId).populate("friends").then((user) => {
      if(!user){
        return res.status(404).json({message: "User not found"})
      }
      const profileImage = user.image;
      console.log("User Profile --",profileImage);
      res.status(200).json(profileImage);
    })

   }catch(err){

    console.log("Error in Fetcing profile",err);
   }

})

app.get("/profile-details/:userId" ,(req,res) => {
  try{
   console.log("User Details fetcing");
   const {userId} = req.params;
   
   User.findById(userId).then((user) => {
     if(!user){
       return res.status(404).json({message: "User not found"})
     }
     const user_data = user
     console.log("Logged IN User Data",user_data);
     res.status(200).json(user_data);
   })

  }catch(err){

   console.log("Error in Fetcing profile",err);
  }

})