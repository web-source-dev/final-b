const express = require('express');
const router = express.Router();
const Data = require('../models/data'); // Assuming you have a Mongoose model


// POST route for storing QR data and creating QR code
router.post('/qrdata', async (req, res) => {
  const {
    email,
    work_email,
    organization,
    phone,
    first_name,
    last_name,
    street,
    city,
    state,
    zip_code,
    youtube_url,
    facebook_url,
    linkden_url,
    twitter_url,
    user_image,
  } = req.body;

  try {
    // Combine address fields into a single object or store them as separate fields in MongoDB
    const address = {
      street,
      city,
      state,
      zip_code,
    };

    // Save the data to MongoDB (Mongoose model)
    const qrdata = new Data({
      first_name,
      last_name,
      email,
      work_email,
      organization,
      phone,
      address, // Storing address as an object
      youtube_url,
      facebook_url,
      linkden_url,
      twitter_url,
      user_image, // Cloudinary URL
    });

    await qrdata.save(); // Save the data to MongoDB

    res.status(201).json({
      message: 'Submitted successfully',
      qrdata,
      userId: qrdata._id,
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
    email,
    work_email,
    organization,
    phone,
     first_name,
    last_name,
    street,
    city,
    state,
    zip_code,
    youtube_url,
    facebook_url,
    linkden_url,
    twitter_url,
    user_image
  } = req.body;

  console.log('Incoming data:', {
    email,
    work_email,
    organization,
    phone,
    first_name,
    last_name,
    street,
    city,
    state,
    zip_code,
    youtube_url,
    facebook_url,
    linkden_url,
    twitter_url,
    user_image,
  });

  try {
    // Find the existing QR data by ID
    const qrdata = await Data.findById(req.params.id);

    if (!qrdata) {
      return res.status(404).json({ message: 'QR Data not found' });
    }

    // Update fields only if new values are provided
    if (first_name) qrdata.first_name = first_name;
    if (last_name) qrdata.last_name = last_name;
    if (email) qrdata.email = email;
    if (work_email) qrdata.work_email = work_email;
    if (organization) qrdata.organization = organization;
    if (phone) qrdata.phone = phone;

    // Address fields
    if (street || city || state || zipCode) {
      qrdata.address = qrdata.address || {};
      if (street) qrdata.address.street = street;
      if (city) qrdata.address.city = city;
      if (state) qrdata.address.state = state;
      if (zipCode) qrdata.address.zipCode = zipCode;
    }

    // Social Media URLs
    if (youtube_url) qrdata.youtube_url = youtube_url;
    if (facebook_url) qrdata.facebook_url = facebook_url;
    if (linkden_url) qrdata.linkden_url = linkden_url;
    if (twitter_url) qrdata.twitter_url = twitter_url;

    // User image
    if (user_image) qrdata.user_image = user_image;

    // Save the updated data
    await qrdata.save();

    res.status(200).json({
      message: 'QR Data updated successfully',
      updatedData: qrdata,
    });
  } catch (error) {
    console.error('Error updating QR data:', error);
    res.status(500).json({ message: 'An error occurred while updating QR data.', error: error.message });
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
