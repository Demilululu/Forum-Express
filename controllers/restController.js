const restService = require('../services/restService')

const restController = {
  getRestaurants: (req, res) => {
    restService.getRestaurants(req, res, data => {
      return res.render('restaurants', data)
    })
  },

  getRestaurant: (req, res) => {
    restService.getRestaurant(req, res, data => {
      return res.render('restaurant', data)
    })
  },

  getFeeds: (req, res) => {
    restService.getFeeds(req, res, data => {
      return res.render('feeds', data)
    })
  },

  getDashBoard: (req, res) => {
    restService.getDashBoard(req, res, data => {
      return res.render('dashboard', data)
    })
  },
  // Top
  getTopRestaurant: (req, res) => {
    restService.getTopRestaurant(req, res, data => {
      return res.render('topRestaurant', data)
    })
  }
}
module.exports = restController