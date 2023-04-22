'use strict';

const express = require('express');

// Construct a router instance.
const router = express.Router();
const User = require('./models').User;
const Course = require('./models').Course;
const { authenticateUser } = require('./middleware/auth-user');

// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        // Forward error to the global error handler
        next(error);
      }
    }
  }

// --------------------- Users ------------------------ //

// Route that returns a list of users.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  //Aythentication request: 
  const user = req.currentUser;
  
  let users = await User.findAll();
  res.status(200).json(users);
  }));

// Route that creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/"); // location Header to "/"
      res.status(201).json({ "message": "Account successfully created!" });
    } catch (error) {
      console.log('ERROR: ', error.name);
      
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }

    }
  }));

/* Delete individual user. */
router.delete('/users/:id',  authenticateUser, asyncHandler(async (req ,res) => {
  //Aythentication request: 
  const user = req.currentUser;

  const userDel  = await User.findByPk(req.params.id);
  if (userDel) {
    await userDel.destroy();
    res.status(204).end();
  } else {
    //res.sendStatus(404);
    res.render('error');
  }

}));

  
// --------------------- Courses ------------------------ //

// Route that returns a list of courses.
router.get('/courses', asyncHandler(async (req, res) => {
    let courses = await Course.findAll();
    res.status(200).json(courses);
  }));

// Route that creates a new course.
router.post('/courses', authenticateUser, asyncHandler(async (req, res) => {
    //Aythentication request: 
    const user = req.currentUser;

    try {
      const course = await Course.create(req.body);
      res.location(`/courses/${course.id}`); // location Header to "/courses/id"
      res.status(201).json({ "message": "Course successfully created!" });
    } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }

    }
  }));


/* GET individual course. */
router.get("/courses/:id", asyncHandler(async (req, res) => {
  let course = await Course.findByPk(req.params.id);
  if (course) {
    res.status(201).json(course);
  } else {
    //res.sendStatus(404);
    res.render('error');
  }
}));


/* Update individual course. */
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  //Aythentication request: 
  const user = req.currentUser;

  let course;
  try {
    course = await Course.findByPk(req.params.id);
    if (course) {
      await course.update(req.body);
      res.status(204).end();
    } else {
      //res.sendStatus(404);
      res.render('error');
    }
  } catch (error) {
      console.log('ERROR: ', error.name);

      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
  }
}));

/* Delete individual course. */
router.delete('/courses/:id',  authenticateUser, asyncHandler(async (req ,res) => {
  //Aythentication request: 
  const user = req.currentUser;

  const course  = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    //res.sendStatus(404);
    res.render('error');
  }

}));


module.exports = router;
