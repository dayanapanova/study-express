const express = require('express');

const feedbackRoute = require('./feedback');
const speakersRoute = require('./speakers');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const topSpeakers = await speakersService.getList();
      const allArtwork = await speakersService.getAllArtwork();

      // render takes as first argument a path to a template
      // as a second variable it accepts a object with local variables
      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        allArtwork,
      });
    } catch (err) {
      return next(err);
    }
  });

  router.use('/feedback', feedbackRoute(params));

  router.use('/speakers', speakersRoute(params));

  return router;
};
