import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const CountdownTimer = ({ targetDate, textColor }) => {
  const [countdown, setCountdown] = useState(calculateTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  function calculateTimeRemaining (targetDate) {
    const specificDateTime = new Date(targetDate).getTime();
    const now = new Date().getTime();
    const timeRemaining = specificDateTime - now;

    if (timeRemaining <= 0) {
      return 'Airdrop expired';
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  return <div style={{ color: textColor }}>{countdown}</div>;
};

CountdownTimer.propTypes = {
  targetDate: PropTypes.string.isRequired,
  textColor: PropTypes.string.isRequired
};

export default CountdownTimer;
