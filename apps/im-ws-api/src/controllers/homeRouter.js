const express = require('express');
const router = express.Router();

/**
 * @typedef HomeResponse
 * @property {[string]} title.required - example title name
 */

/**
 * Home Router.
 * @group home
 * @route GET /home
 * @returns {HomeResponse.model} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @security none
 * @typedef HomeResponse
 * @property {{integer}} code - response code - eg: 200
 */
router.get('/', function(req, res) {
  res.json({ title: 'home', user: req.user });
});

module.exports = router;
