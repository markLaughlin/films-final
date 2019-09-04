
require('dotenv').config()
const express = require('express');
const FILMS = require('./films.json')
const morgan = require('morgan');
const helmet = require('helmet')
const cors = require('cors')

const app = express();
const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'

app.use(morgan(morganSetting))
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
  
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
})

app.get('/movie', function handleGetMovie(req, res) {
 
  let response = FILMS.data;
    //genre
    if (req.query.genre) {
      response = response.filter(
        item => {
          return item.genre.toLowerCase().includes(req.query.genre.toLowerCase());
        });
    }
    
    //country
    if(req.query.country) {
      response = response.filter(item => {
          return item.country.toLowerCase().includes(req.query.country.toLowerCase());
      });
    }

    //average
    if(req.query.avg_vote) {
      let a = req.query.avg_vote;
      let aN= Number(a)
      
      response = response.filter(
        item => {
          return item.avg_vote >= aN;
      });
    }

  res.json(response)
})

// 4 parameters in middleware, express knows to treat this as error handler
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {

})