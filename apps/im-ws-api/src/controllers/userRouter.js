const express = require('express');
const router = express.Router();
const yup = require("yup");
const { responseErrWithMsg } = require('../helpers/response');
const { createUser, getUserByUserId, updateUserByUserId } = require('../services/userServices');

/**
 * @typedef UpdateUserRequest
 * @property {string} name.required
 *   - name
 *   - eg: Tony
 * @property {string} email.required
 *   - email
 *   - eg: aaa@bbb.ccc
 */

/**
 * @typedef RegisteUserRequest
 * @property {string} phone.required
 *   - phone
 *   - eg: 0987654321
 * @property {string} email.required
 *   - email
 *   - eg: aaa@bbb.ccc
 * @property {string} password.required
 *   - 使用者密碼 6 ~ 20 個英數組合
 *   - eg: a12345678
 */

/**
 * get user information
 * @group users
 * @route GET /users/{userId}
 * @param {number} userId.paths.required - user identity number
 * @returns {{}} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @returns {Error} 500 - unexpected error
 * @security JWT
 * @property {{integer}} code - response code - eg: 200
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await getUserByUserId(userId);

    res.json({ success: true, data: result });
  } catch(error) {
    return responseErrWithMsg(res, error.message);
  }
});


const updateUserRequestSchema = yup.object({
  name: yup.string(),
  email: yup.string().email('Email 格式錯誤'),
});

/**
 * update user information
 * @group users
 * @route PUT /users/{userId}
 * @param {number} userId.paths.required - user identity number
 * @param {UpdateUserRequest.model} data.body.required - the new point
 * @returns {{}} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @returns {Error} 500 - unexpected error
 * @security JWT
 * @property {{integer}} code - response code - eg: 200
 */
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const validation = await updateUserRequestSchema.validate(req.body);
    const result = await updateUserByUserId(userId, validation);

    res.json({ success: true, data: result });
  } catch(error) {
    return responseErrWithMsg(res, error.message);
  }
});


const registeRequestSchema = yup.object({
  phone: yup.string().required('電話不可為空'),
  email: yup.string().email('email 格式錯誤').required('信箱不可為空'),
  password: yup.string().required('密碼不可為空'),
});

/**
 * registe user information
 * @group users
 * @route POST /users
 * @param {RegisteUserRequest.model} data.body.required - the new point
 * @returns {{}} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @returns {Error} 500 - unexpected error
 * @security none
 * @property {{integer}} code - response code - eg: 200
 */
router.post('/', async (req, res) => {
  try {
    await registeRequestSchema.validate(req.body);

    const result = await createUser(req.body);

    res.json({ success: true, data: result });
  } catch(error) {
    return responseErrWithMsg(res, error.message);
  }
});

module.exports = router;
