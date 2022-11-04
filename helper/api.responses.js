const generalEnglish = require('../lang/english/general')
const wordsEnglish = require('../lang/english/words')

const status = {
  OK: 200,
  Create: 201,
  Deleted: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  NotAcceptable: 406,
  ExpectationFailed: 417,
  Locked: 423,
  InternalServerError: 500,
  UnprocessableEntity: 422,
  ResourceExist: 409,
  TooManyRequest: 429
}

const jsonStatus = {
  OK: 200,
  Create: 201,
  Deleted: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  Forbidden: 403,
  NotAcceptable: 406,
  ExpectationFailed: 417,
  Locked: 423,
  InternalServerError: 500,
  UnprocessableEntity: 422,
  ResourceExist: 409,
  TooManyRequest: 429
}

const messages = {
  English: {
    ...generalEnglish,
    ...wordsEnglish
  }
}

// const messages = {
//   add_success: '## added successfully.',
//   not_found: '## Not Found',
//   success: '## successfully',
//   intenalServerError: 'Something went wrong',
//   invalid: 'invalid ##',
//   unique: 'Enter unique ##',
//   unAuthorized: 'Unauthorized Access Denied',
//   sessionExpired: 'Session expired please login again',
//   exist: '## is already exists',
//   adminiStrator: 'Please Contact to Super Administrator',
//   required: '## is required',
//   succ_logout: 'You have successfully logged out!',
//   succ_login: 'Welcome Back! You have logged in successfully.',
//   update_success: '## updated successfully.',
//   admin_blocked: 'You are blocked by our system. Contact administrator for more details.'
// }

module.exports = { status, jsonStatus, messages }
