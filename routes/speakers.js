const express = require('express');

const router = express.Router();

module.exports = (params) => {
  const { speakersService } = params;
  router.get('/', async (request, response, next) => {
    try {
      const speakers = await speakersService.getList();

      // render takes as first argument a path to a template
      // as a second variable it accepts a object with local variables
      return response.render('layout', { pageTitle: 'Speakers', template: 'speakers', speakers });
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:shortname', async (request, response, next) => {
    try {
      const speaker = await speakersService.getSpeaker(request.params.shortname);
      const artworkForSpeaker = await speakersService.getArtworkForSpeaker(
        request.params.shortname
      );
      return response.render('layout', {
        pageTitle: 'Speakers',
        template: 'speaker-detail',
        speaker,
        artworkForSpeaker,
      });
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
