import express, { Router } from 'express'
const router: Router = express.Router()

import {
    getUserWeather,
    searchWeather,
    addToFavorites,
    getFavoriteCities,
    getFavoriteCitiesWeather,
    getRecentSearches,
    getRecentSearchesWeather
} from '../controllers/weatherController'

router.get('/', getUserWeather)
router.get('/search', searchWeather)
router.get('/recent', getRecentSearches)
router.get('/recent-weather', getRecentSearchesWeather)
router.post('/favorites', addToFavorites)
router.get('/favorites', getFavoriteCities)
router.get('/favorites-weather', getFavoriteCitiesWeather)

export default router
