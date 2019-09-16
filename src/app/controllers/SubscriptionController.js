import { isBefore, isAfter } from 'date-fns';
import Subscription from '../models/Subscription';
import User from '../models/User';
import Meetup from '../models/Meetup';

class SubscriptionController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetup = await Meetup.findByPk(req.params.meetID, {
      include: [User],
    });

    if (meetup.user_id === user.id) {
      return res.status(400).json({
        error: `You can't subscribe to Meetups that are yours`,
      });
    }

    if (meetup.past) {
      return res.json({
        error: `You can't subscribe to Meetups that already occurred`,
      });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: `You can't subscribe to Meetup that already occurred`,
      });
    }

    const meetupSameTime = await Subscription.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetup,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (meetupSameTime)
      return res.status(400).json({
        error: `You can't subscribe to two Meetups at same time`,
      });

    const subscriptionSuccedded = await Subscription.create({
      meetup_id: req.params.meetID,
      user_id: user.id,
    });

    return res.status(400).json(subscriptionSuccedded);
  }
}

export default new SubscriptionController();
