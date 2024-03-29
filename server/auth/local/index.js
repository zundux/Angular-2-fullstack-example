import express from 'express';
import passport from 'passport';
import {signToken} from '../auth.service';

let router = express.Router();

router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    let error = err || info;

    if (error) {
      return res.status(401).json(error);
    }

    if (!user) {
      return res.status(404).json({message: 'Something went wrong, please try again.'});
    }

    let token = signToken(user._id, user.role);
    res.json({token});
  })(req, res, next);
});

export default router;
