const express = require('express');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieSession = require('cookie-session');
// eslint-disable-next-line import/no-extraneous-dependencies
const createError = require('http-errors');
const routes = require('./routes');
const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const SpeakersService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');

const speakersService = new SpeakersService('./data/speakers.json');

const app = express();

const port = 3000;

// if you deploy this application ever to a web server and usually this runs
// behind a reverse proxy line NGINX, then the whole cookie system might not work,
// this makes Express trust cookies that are passed trought a reverse proxy.

app.set('trust proxy', 1);

// fetch cookies that are sent with the headers that come from the client
// and parse them and sent them to the request object
app.use(
  cookieSession({
    name: 'session',
    keys: ['gfkl4DD4lmdf', 'tyevFRe5mg'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// this will instruct express to look into the static folder for each request it receives
// and if it finds a matching file to serve it to the browser

app.use(express.static(path.join(__dirname, './static')));

app.use(async (request, response, next) => {
  try {
    const names = await speakersService.getNames();
    response.locals.speakerNames = names;
    return next();
  } catch (err) {
    return next(err);
  }
});

// setting a global template variable
app.locals.siteName = 'ROUX Meetups';

app.use(
  '/',
  routes({
    feedbackService,
    speakersService,
  })
);

app.use((request, response, next) => next(createError(404, 'File not found')));

app.use((err, request, response) => {
  response.locals.message = err.message;
  console.error(err);
  const status = err.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Express listens on port ${port}`);
});
