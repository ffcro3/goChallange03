import { isBefore, isAfter, parseISO } from 'date-fns';
import * as Yup from 'yup';
import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  /**
   *  THE METHOD BELOW IS FOR LIST ALL THE MEETUPS FOR THE USER LOGGED
   */

  async index(req, res) {
    const meetup = await Meetup.findAll({
      where: {
        user_id: req.userId,
      },
      order: ['date'],
      include: [
        {
          model: User,
          as: 'User',
          attributes: ['id', 'name', 'user_type'],
        },
      ],
    });

    return res.status(200).json(meetup);
  }

  /**
   *  THE METHOD BELOW IS FOR CREATE A NEW MEETUP
   */

  async store(req, res) {
    // Yup Schema definition
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number().required(),
    });

    // Yup schema validation
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: `You must fill all fields to include a new meetup`,
      });
    }
    // Data from body
    const { title, description, location, date, image_id } = req.body;
    // Parsing date for being able to manage dates
    const dateStart = parseISO(date);

    // Check if the new meetup are created for past dates
    if (isBefore(dateStart, new Date()))
      return res.status(400).json({
        error: `You can't schedule a Meetup for past dates`,
      });

    // ID from user Logged In
    const user_id = req.userId;

    // Create a Meetup
    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      user_id,
      image_id,
    });

    // Return all data for front-end usage
    return res.status(200).json(meetup);
  }

  /**
   *  THE METHOD BELOW IS FOR EDIT AN EXISTING MEETUP
   */

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      date: Yup.date().required(),
      image_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: `You can't left any blank fields when editing this Meetup`,
      });
    }

    const meetup = await Meetup.findByPk(req.params.meetID);

    // Check if the Meetup is related to the user Logged.
    if (meetup.user_id !== req.userId) {
      return res.status(400).json({
        error: `You can't update anothers Meetup`,
      });
    }

    // Check if Meetup Already occurred
    if (!isAfter(meetup.date, new Date())) {
      return res.status(400).json({
        error: `You can't edit a meetup that already occurred`,
      });
    }

    // Get the date provided by user
    const { date } = req.body;

    // Check if user is trying to edit a Meetup to past
    if (!isAfter(parseISO(date), new Date())) {
      return res.status(400).json({
        error: `You can't schedule a Meetup for past dates`,
      });
    }

    // Update Meetup
    const editMeetup = await meetup.update(req.body);

    // return data
    return res.json(editMeetup);
  }

  /**
   *  THE METHOD BELOW IS FOR DELETE AN EXISTING MEETUP
   */

  async delete(req, res) {
    // Find Meetup to delete
    const meetup = await Meetup.findByPk(req.params.meetID);

    if (meetup.user_id !== req.userId) {
      return res.status(400).json({
        error: `You can't delete a Meetup that aren't yours`,
      });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: `You can't delete Meetups that already occurred`,
      });
    }

    // Delete Meetup
    await Meetup.destroy({
      where: {
        id: meetup.id,
      },
    });

    // return success
    return res.status(200).json({
      ok: `Meetup deleted`,
    });
  }
}

export default new MeetupController();
