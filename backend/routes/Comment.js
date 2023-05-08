const express = require('express');
const router = express.Router();
const commentContollers = require('../controller/Comment.js');
const passport = require('passport');

const authentication = passport.authenticate("jwt", {session: false})

router.get('/:id',authentication , commentContollers.getComment);
router.post('/:id',authentication, commentContollers.addComment);
router.delete('/:id/:Cid',authentication, commentContollers.deleteComment);

module.exports = router;