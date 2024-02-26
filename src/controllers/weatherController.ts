import { Request, Response } from 'express'
import WeatherService from '../services/weatherService'
import ApiResponse from '../../utils/response'

import {
    City,
    FavoriteCity,
    RecentSearch,
    WeatherApiResponse
} from '../types/types'

/**
 * Gets the weather data for the current user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const getUserWeather = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const weather: WeatherApiResponse = await WeatherService.getWeather(
            req.session?.userId ?? 0
        )

        res.json(
            ApiResponse.success<WeatherApiResponse>(
                weather,
                'Weather data retrieved successfully.'
            )
        )
    } catch (error: any) {
        res.status(500).json(
            ApiResponse.error('Error fetching weather data.', error.message)
        )
    }
}

/**
 * Searches for weather data based on the provided query parameters.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const searchWeather = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { q, lat, lon } = req.query
        const userId = req.session.userId ?? 0

        if (!q && (lat === undefined || lon === undefined)) {
            throw new Error(
                'Either "q" (city name) or "lat" and "lon" (latitude and longitude) must be provided'
            )
        }

        const queryParameters = q
            ? { q: q as string }
            : { lat: lat as unknown as number, lon: lon as unknown as number }
        const searchResult: WeatherApiResponse =
            await WeatherService.searchWeather(queryParameters, userId)

        res.json(
            ApiResponse.success<WeatherApiResponse>(
                searchResult,
                'Weather data retrieved successfully.'
            )
        )
    } catch (error: any) {
        res.status(500).json(
            ApiResponse.error('Error searching weather data.', error.message)
        )
    }
}

/**
 * Adds a city to the user's favorites.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 * @throws {Error} - If the city information is not provided.
 */
export const addToFavorites = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        let { name, latitude, longitude } = req.body

        // change the latitude and longitude to numbers
        latitude = Number(latitude)
        longitude = Number(longitude)

        if (!name || !latitude || !longitude) {
            throw new Error('City information is required.')
        }

        const city: City = { name, latitude, longitude }

        const userId = req.session.userId ?? 0

        await WeatherService.addToFavorites(city, userId)

        res.json(
            ApiResponse.success<null>(
                null,
                'City added to favorites successfully.'
            )
        )
    } catch (error: any) {
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Gets the favorite cities for the current user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 * @throws {Error} - If an error occurs while fetching favorite cities.
 * @throws {Error} - If the user ID is not found in the session.
 */
export const getFavoriteCities = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0
        const favoriteCities: FavoriteCity[] =
            await WeatherService.getFavoriteCities(userId)
        res.json(
            ApiResponse.success<FavoriteCity[]>(
                favoriteCities,
                'Favorite cities retrieved successfully.'
            )
        )
    } catch (error: any) {
        res.status(500).json(
            ApiResponse.error('Error fetching favorite cities.', error.message)
        )
    }
}

/**
 * Gets the recent searches for the current user.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @returns {Promise<void>}
 */
export const getRecentSearches = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0
        const recentSearches: RecentSearch[] =
            await WeatherService.getRecentSearches(userId)
        res.json(
            ApiResponse.success<RecentSearch[]>(
                recentSearches,
                'Recent searches retrieved successfully.'
            )
        )
    } catch (error: any) {
        res.status(500).json(
            ApiResponse.error('Error fetching recent searches.', error.message)
        )
    }
}
