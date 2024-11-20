const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Assuming you have a Mongoose model
const Question = require('../models/question');



router.post('/checkfa', async (req, res) => {
  const { question, correct_answer } = req.body;

  try {
    const questionData = await Question.findOne({ question });
    if (!questionData) {
      return res.status(404).json({ fasts: 1, msg: 'Question not found' });
    }
    if (questionData.correct_answer === correct_answer) {
      return res.json({ fasts: 0, msg: 'Correct answer' });
    } else {
      return res.status(400).json({ fasts: 1, msg: 'Incorrect answer' });
    }
  } catch (err) {
    console.error('Error fetching question:', err);
    return res.status(500).json({ msg: 'Server error while fetching question' });
  }
});

// POST route for storing QR data and creating QR code
router.post('/qrdata', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    work_email,
    organization,
    phone,
    street,
    city,
    state,
    zip,
    youtube_url,
    facebook_url,
    linkden_url,
    twitter_url,
    user_image,
  } = req.body;

  try {
    const newUser = new Data({
      first_name,
      last_name,
      email,
      work_email,
      organization,
      phone,
      street,
      city,
      state,
      zip,
      youtube_url,
      facebook_url,
      linkden_url,
      twitter_url,
      user_image,
    });

    await newUser.save();

    res.status(201).json({
      message: 'Submitted successfully',
      userId: newUser._id,
      qrdata: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while submitting', error: error.message });
  }
});

router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID and delete it
    const deletedUser = await Data.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

router.put('/qrdata/:id', async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    work_email,
    organization,
    phone,
    street,
    city,
    state,
    zip,
    youtube_url,
    facebook_url,
    linkden_url,
    twitter_url,
    user_image,
  } = req.body;

  console.log(user_image, first_name, email, work_email);
  try {
    // Find the existing QR data by ID
    const qrdata = await Data.findById(req.params.id);

    if (!qrdata) {
      return res.status(404).json({ message: 'QR Data not found' });
    }

    // Update the user data
    qrdata.first_name = first_name || qrdata.first_name;
    qrdata.last_name = last_name || qrdata.last_name;
    qrdata.email = email || qrdata.email;
    qrdata.work_email = work_email || qrdata.work_email;
    qrdata.organization = organization || qrdata.organization;
    qrdata.phone = phone || qrdata.phone;
    qrdata.street = street || qrdata.street;
    qrdata.city = city || qrdata.city;
    qrdata.state = state || qrdata.state;
    qrdata.zip = zip || qrdata.zip;
    qrdata.youtube_url = youtube_url || qrdata.youtube_url;
    qrdata.facebook_url = facebook_url || qrdata.facebook_url;
    qrdata.linkden_url = linkden_url || qrdata.linkden_url;
    qrdata.twitter_url = twitter_url || qrdata.twitter_url;
    
    if (user_image) {
      qrdata.user_image = user_image; // Update if new image is provided
    }

    // Save the updated data
    await qrdata.save();

    res.status(200).json({
      message: 'QR Data updated successfully',
      qrdata,
      userId: qrdata._id,
      user_image: qrdata.user_image // Return the updated image URL from Cloudinary
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while updating', error: error.message });
  }
});


router.get('/users', async (req, res) => {
  try {
    const users = await Data.find(); // Fetch all users from the database
    res.status(200).json(users); // Send the users as a JSON response
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update isAllowed field in user
router.put('/users/:id', async (req, res) => {
  try {
    const { isAllowed } = req.body;
    const user = await Data.findByIdAndUpdate(
      req.params.id,
      { isAllowed },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.get('/users/:userId', async (req, res) => {
  try {
    const user = await Data.findById(req.params.userId);  // Find user by ID
    if (!user) return res.status(404).send('User not found');

    // Check if the user is allowed
    if (!user.isAllowed) {
      return res.status(403).json({ message: 'User is blocked' });  // Send 'blocked' message
    }

    // If the user is allowed, send user details
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Server error');
  }
});


module.exports = router;
