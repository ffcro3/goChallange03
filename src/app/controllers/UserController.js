import User from '../models/User';

class UserController {
  //  METHOD TO CREATE A NEW USER
  async store(req, res) {
    const { name, email, password, userType } = await User.create(req.body);

    return res.json({
      name,
      email,
      password,
      userType,
    });
  }
}

export default new UserController();
