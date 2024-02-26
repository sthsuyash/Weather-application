import express, { Router } from 'express'
const router: Router = express.Router()

import {
    getUserWeather,
    searchWeather,
    addToFavorites,
    getFavoriteCities,
    getRecentSearches
} from '../controllers/weatherController'

router.get('/', getUserWeather)
router.get('/search', searchWeather)
router.get('/recent', getRecentSearches)
router.post('/favorites', addToFavorites)
router.get('/favorites', getFavoriteCities)

export default router
