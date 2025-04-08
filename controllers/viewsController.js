const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
// const AppError = require('../utils/appError');

exports.alerts = (req, res, next) => {
  const { alert } = req.query;

  if (alert === 'booking') {
    res.locals.alert =
      "Your booking was successful! Please check youe email for a confirmation. If your booking doesn't show up here immediately, please come back later.";
  }

  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get all the tours from the collection
  const tours = await Tour.find();

  // 2) Building the template

  // 3) Rendering the template
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com; worker-src 'self' blob:;",
  );
  res.status(200).render('overview', {
    title: 'Natours | All tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1) Get the data for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
  });

  // if (!tour) {
  //   return next(new AppError('There is no tour with that name.', 404));
  // }

  // 2) Build the template

  // 3) Render the template using data from 1
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://api.mapbox.com https://js.stripe.com; worker-src 'self' blob:;",
  );
  res.status(200).render('tour', {
    tour,
    title: `Natours | ${tour.name} Tour`,
  });
});

exports.getLoginForm = (req, res) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://api.mapbox.com https://cdn.jsdelivr.net https://js.stripe.com; worker-src 'self' blob:;",
  );

  res.status(200).render('login', {
    title: 'Natours | Log into your account',
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Natours | Your Account',
  });
};

exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1)Get all the bookings of the user
  const bookings = await Booking.find({ user: req.user.id });

  // 2) Get the tours from the bookings
  const tourIds = bookings.map((el) => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com; worker-src 'self' blob:;",
  );

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Natours | Your Account',
    user: updatedUser,
  });
});
