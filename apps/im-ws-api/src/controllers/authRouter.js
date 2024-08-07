const express = require("express");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const pick = require("lodash/pick");
const yup = require("yup");

const { responseOk, responseErrWithMsg } = require("../helpers/response");
const { parseUserResponse } = require("../services/userServices");
const { jwtAuthorizationMiddleware } = require("../helpers/passportManager");

const router = express.Router();

const { AUTH_SECRET } = process.env;

/**
 * @typedef LogoutRequest
 * @property {boolean} success.required
 *   - logout response status
 *   - eg: true
 */


/**
 * Logout API.
 * @group authorization
 * @route POST /auth/logout
 * @returns {LogoutResponse.model} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @returns {Error} 500 - unexpected error
 * @security JWT
 * @typedef LogoutResponse
 * @property {{integer}} code - response code - eg: 200
 */

router.post("/logout", jwtAuthorizationMiddleware, async (req, res) => {
try{
  return responseOk(res, { success: true });
} catch (error) {
  responseErrWithMsg(res, error.message);
}
});

const loginRequestSchema = yup.object({
  phone: yup.string().required('電話或密碼不可為空'),
  password: yup.string().required('電話或密碼不可為空'),
});

/**
 * @typedef LoginRequest
 * @property {string} phone.required
 *   - auth0 Response.sub
 *   - eg: 0987654321
 * @property {string} password.required
 *   - password: 6 ~ 20 個英數組合
 *   - eg: a12345678
 */

/**
 * @typedef MemberInformation
 * @property {number} id.required
 *  - member Id
 *  - eg: 1
 * @property {string} phone.required
 *  - member.phone
 */

/**
 * @typedef LoginResponse
 * @property {[string]} token.required - JWT token string
 * @property {{integer}} expiredIn.required - JWT expired timestamp
 * @property {MemberInformation.model} info.required - member information
 */

/**
 * LogIn API.
 * @group authorization
 * @route POST /auth
 * @param {LoginRequest.model} data.body.required - the new point
 * @returns {LoginResponse.model} 200 - success, return requested data
 * @returns {String} 400 - invalid request params/query/body
 * @returns {String} 404 - required data not found
 * @returns {Error} 500 - unexpected error
 * @security none
 * @typedef LoginResponse
 * @property {{integer}} code - response code - eg: 200
 */
router.post("/", (req, res) => {
  passport.authenticate("local", { session: false }, async (error, user) => {
    try {
      if (error) throw error;
      // const expireIn = add(new Date(), { days: 1 }).getTime();

      const signInfo = pick(user, ["id", "phone"]);
      const token = jwt.sign(
        {
          data: signInfo,
          // exp: expireIn,
        },
        AUTH_SECRET
      );

      return responseOk(res,  {
          token,
          expireIn: null,
          user: parseUserResponse(user),
        });
    } catch (error) {
      responseErrWithMsg(res, error.message);
    }
  })(req, res);
});

module.exports = router;
