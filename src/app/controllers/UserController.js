import User from '../models/User';

class UserController {
  //  METHOD TO CREATE A NEW USER
  async store(req, res) {
    const UserExists = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (UserExists) {
      return res.status(400).json({
        error: 'User Already exists',
      });
    }

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
