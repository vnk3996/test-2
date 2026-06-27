const redisClient = require('../config/redis');

const getHome = async (req, res) => {
  const currentVisits = Number(await redisClient.get('visits') || 0) + 1;
  await redisClient.set('visits', currentVisits);
  res.json({ message: 'Hello World!', visits: currentVisits });
};

module.exports = { getHome };
