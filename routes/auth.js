var authController = require('../controllers/authcontroller.js');
var userRating = require("../models").userRating;
var User = require("../models").user;
var location = require("../models").location;
var monthlyStatus = require("../models").monthlyStatus;

module.exports = function(app, passport) {
  app.get('/signup', authController.signup);

  app.get('/signin', authController.signin);

  app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/dashboard',
        failureRedirect: '/signup'
    }
  ));

  app.get('/dashboard', isLoggedIn, function(req, res){
    location.findAll({
      include: [userRating]
    }).then(function(locations){
        var hbsObject = {
          loc: locations,
          user: req.user
        };
      res.render('dashboard', hbsObject);
    })
  });


  app.get('/logout', authController.logout);

  app.post('/signin', passport.authenticate('local-signin', {
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    }
  ));

  app.get("/rating", isLoggedIn, function(req,res){
    console.log(req.query.location_id);
    location.findOne({
      where: {
        id: req.query.location_id
      }
    }).then(function(data){
      var locationObj = {
        location: data
      }
      res.render("rating", locationObj);
    });

    // res.render("rating");
  });

  // sending ratings to db
  app.post("/api/rating", function(req, res){
    // console.log("params!!", req.params);
    // console.log("USER ID CURRENT!!!!! "+req.user.id);
    userRating.create({
      rating: req.body.star,
      review: req.body.review,
      notes: req.body.note,
      username: req.user.username,
      locationId: req.body.locationId,
      userId: req.user.id
    }).then(function(){
      monthlyStatus.update(
        {location1: 0},
        {where:
          {userId: req.user.id,
          location1: req.body.locationId}
        });

      monthlyStatus.update(
        {location2: 0},
        {where:
          {userId: req.user.id,
          location2: req.body.locationId}
        });

      monthlyStatus.update(
        {location3: 0},
        {where:
          {userId: req.user.id,
          location3: req.body.locationId}
        });

      monthlyStatus.update(
        {location4: 0},
        {where:
          {userId: req.user.id,
          location4: req.body.locationId}
        });

      monthlyStatus.update(
        {location5: 0},
        {where:
          {userId: req.user.id,
          location5: req.body.locationId}
        });

      monthlyStatus.update(
        {location6: 0},
        {where:
          {userId: req.user.id,
          location6: req.body.locationId}
        });

      monthlyStatus.update(
        {location7: 0},
        {where:
          {userId: req.user.id,
          location7: req.body.locationId}
        });

      monthlyStatus.update(
        {location8: 0},
        {where:
          {userId: req.user.id,
          location8: req.body.locationId}
        });

      monthlyStatus.update(
        {location9: 0},
        {where:
          {userId: req.user.id,
          location9: req.body.locationId}
        });

      monthlyStatus.update(
        {location10: 0},
        {where:
          {userId: req.user.id,
          location10: req.body.locationId}
        });

        // findone({userId:userid}{
        //   monthlyStatus.location1+ montl
        //   if(var = 0)
        //   set badge to true
        // })
        // set badge to challenge id if sum=0

        monthlyStatus.findOne({
          where: {
            userId: req.user.id
          }
        })
        .then(function(status){
          var sum = (status.location1 + status.location2 + status.location3 + status.location4 + status.location5 + status.location6 + status.location7 + status.location8 + status.location8 + status.location9 + status.location10);

          console.log("SUMMMMMMMM "+ sum);

          if(sum === 0){
            User.findOne({
              where: {
                id: req.user.id
              }
            })
            .then(function(user){
              var badges = user.badges;
              badges += status.MonthlyChallengeId + ", "
              User.update({
                badges: badges
              },{
                where:{
                  id: req.user.id
                }
              })
            })
          }
        })

      })
      .then(function(){
      res.redirect('/dashboard');
    })
  });

  app.get("/api/users", function(req,res){
    User.findAll({}).then(function(dbUser){
      res.json(dbUser);
    });
  });

  // if logged in route to dashboard, else redirect to signin page
  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
      return next();
    }

    res.redirect('/signin');
  };

};
