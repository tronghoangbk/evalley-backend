var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");
var router = express.Router();
var User = require('../models/user');
require('dotenv').config();
const SECRET = process.env.EVALLEY_SECRET;

router.post('/register', function (req, res, next) {
    // var newUser = new User({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: req.body.password,
    // });
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('username', 'Username must be at least 6 characters long').isLength({ min: 6 });
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password', 'Password must be at least 6 characters long').isLength({ min: 6 });
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors);
        return;
    } else {
        User.getUserByUsername(req.body.username, function (err, user) {
            if (err) res.send(err);
            if (user.length > 0) {
                res.json([{ param: 'username', msg: 'Username already exists' }]);
            }
            else {
                User.getUserByEmail(req.body.email, function (err, user) {
                    if (err) res.send(err);
                    if (user.length > 0) {
                        res.json([{ param: 'email', msg: 'Email already exists' }]);
                    }
                    else {
                        User.addUser(req.body.username,req.body.email,req.body.password, function (err, user) {
                            if (err) console.log(err);
                            res.json({ success: true, msg: 'Successful created new user' });
                        });
                    }
                });
            }
        });


    }

});

// router.post('/login', function (req, res, next) {
//     User.getUserByUsername(req.body.username, function (err, user) {
//         if (err) {
//             res.status(500).json(err);
//         } else if (user == []) {
//             res.json({ success: false, message: 'User not found' });
//         } else {
//             user = user[0]
//             User.comparePassword(req.body.password, user.password, function (err, isMatch) {
//                 if (err) {
//                     res.status(500).json(err);
//                 } else if (isMatch) {
//                     if (user.status == 'inactive') {
//                         res.json({ success: false, message: 'The account has not been verified' });
//                     }
//                     else if (user.status == 'block') {
//                         res.json({ success: false, message: 'The account has been blocked' });
//                     }
//                     else {
//                         var token = jwt.sign({
//                             id: user._id,
//                             type: user.
//                         }, SECRET, {
//                             algorithm: 'HS256',
//                             expiresIn: 604800 // 1 week
//                         });
//                         res.json({
//                             success: true,
//                             role: user.role,
//                             access_token: token,
//                             message: 'User has been logged in'
//                         });
//                     }

//                 } else {
//                     res.json({ success: false, message: 'Wrong password' });
//                 }
//             });
//         }
//     });

// });

// router.get('/me', function (req, res, next) {
//     var user = req.user;
//     user.password = undefined;
//     res.json({ success: true, user: user });
// });

router.get('/getall', User.checkAdmin,  function (req, res, next) {
    
    User.getAllUser(function (err, users) {
        if (err) { res.status(500).json(err) }
        else {
            res.status(200).json(users)
        }
    });
});

router.get('/get-by-username/:username', function (req, res, next) {
    var username = req.params.username
    User.getUserByUsername(username, function (err, users) {
        if (err) { res.status(500).json(err) }
        else {
            res.status(200).json(users)
        }
    });
});

router.post('/delete', function (req, res, next) {
    var selected = req.body.selected
    User.deleteUser(selected, function (err, users) {
        if (err) { res.status(500).json(err) }
        else {
            res.status(200).json(users)
        }
    });
});

router.post('/update', function (req, res, next) {
    return;
});

router.post('/changepassword', function (req, res, next) {
});

router.post('/forgotpassword', function (req, res, next) {
});

router.post('/resetpassword', function (req, res, next) {
});
router.post('/block', function (req, res, next) {

});
router.post('/unblock', function (req, res, next) {

});

// router.post('/activate', function (req, res, next) {
//     User.getUserByUsername(req.body.username, function (err, user) {
//         if (err) {
//             res.send(err);
//             return;
//         }
//         if (!user) {
//             res.json({ message: 'User not found' });
//             return;
//         }
//         if (user.status == 'block') {
//             res.json({ message: 'The account has been blocked' });
//             return;
//         }
//         if (user.user_id == req.body.id) {
//             User.updateUserStatus(user.user_id, 'active', function (err, user) {
//                 if (err) {
//                     res.send(err);
//                     return;
//                 }
//                 res.json({ message: 'The account has been activated' });
//             });
//         } else {
//             res.json({ message: 'The activation link is invalid' });
//         }
//     });
// });
router.post('/login',function(req,res,next){
    var username_email = req.body.username;
    User.getUserByEmailOrUsername(username_email,function(err,user){
        if (err) {
            res.status(500).json(err);
        }
        else if (user == []) {
            res.json({ success: false, message: 'User not found' });
        }
        else {
            user = user[0]
            User.comparePassword(req.body.password, user.password, function(err, isMatch) {
                if (err) {
                    res.status(500).json(err);
                } else if (isMatch) {
                    // var token = jwt.sign({
                    //     id: user.user_id,
                    //     type: user.permission
                    // }, "SECRET", {
                    //     algorithm: 'HS256',
                    //     expiresIn: 604800 // 1 week
                    // });
                    res.json({
                        success: true,
                        // role: user.permission,
                        // access_token: token,
                        message: 'User has been logged in'
                    });
                    
                } else {
                    res.json({ success: false, message: 'Wrong password' });
                }
            })
        }
    })
});


module.exports = router;