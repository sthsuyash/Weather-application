import axios from 'axios'
import {
    City,
    FavoriteCity,
    RecentSearch,
    WeatherApiResponse
} from '../types/types'

import prisma from '../config/prisma'
import config from '../config'

const WEATHER_URL = `http://api.weatherapi.com/v1/current.json?key=${config.weather.apiKey}`

/**
 * Represents the Weather API service.
 */
class WeatherService {
    /**
     * Gets the weather data for the current user.
     * @param {number} userId - The user ID.
     * @returns {Promise<WeatherApiResponse>} - The weather data.
     * @throws {Error} - If an error occurs while fetching weather data.
     */
    static async getWeather(userId: number): Promise<WeatherApiResponse> {
        try {
            // get the user's city from the database
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            // get the user's city from the database
            if (!user) {
                throw new Error('User not found')
            }

            const userCity = user.city

            const response = await axios.get(WEATHER_URL, {
                params: {
                    q: userCity,
                    aqi: 'no'
                }
            })

            const weatherData: WeatherApiResponse = response.data
            return weatherData
        } catch (error: any) {
            throw new Error(`Error fetching weather data: ${error.message}`)
        }
    }

    /**
     * Searches for weather data based on query parameters.
     * @param {object} query - The search parameters.
     * @returns {Promise<WeatherApiResponse>} - The search result.
     * @throws {Error} - If an error occurs while searching for weather data.
     */
    static async searchWeather(
        query: {
            q?: string
            lat?: number
            lon?: number
        },
        userId: number,
        addToRecentSearch = true
    ): Promise<WeatherApiResponse> {
        try {
            if (
                !query.q &&
                (query.lat === undefined || query.lon === undefined)
            ) {
                throw new Error(
                    'Either "q" (city name) or "lat" and "lon" (latitude and longitude) must be provided'
                )
            }

            const queryParameters = query.q
                ? { q: query.q }
                : { q: `${query.lat},${query.lon}` }

            const response = await axios.get(WEATHER_URL, {
                params: {
                    q: queryParameters.q,
                    aqi: 'no'
                }
            })

            /*** adding city data to recent searches ***/

            // if lat and lon are provided, convert them to numbers
            if (query.lat && query.lon) {
                query.lat = +query.lat
                query.lon = +query.lon
            }

            if (addToRecentSearch) {
                let city
                const queryWhereClause = query.q
                    ? { name: query.q }
                    : { latitude: query.lat, longitude: query.lon }

                // Find the city
                city = await prisma.city.findFirst({
                    where: queryWhereClause
                })

                if (!city) {
                    city = await prisma.city.create({
                        data: {
                            name: response.data.location.name,
                            latitude: response.data.location.lat,
                            longitude: response.data.location.lon
                        }
                    })
                }

                // Check if the search record already exists for the user and city
                const existingSearchRecord =
                    await prisma.weatherSearch.findFirst({
                        where: {
                            userId: userId,
                            cityId: city.id
                        }
                    })

                if (existingSearchRecord) {
                    // Update the timestamp if the search record already exists
                    await prisma.weatherSearch.update({
                        where: { id: existingSearchRecord.id },
                        data: { timestamp: new Date() }
                    })
                } else {
                    // Create the search record if it doesn't exist
                    await prisma.weatherSearch.create({
                        data: {
                            userId: userId,
                            cityId: city.id
                        }
                    })
                }
            }

            const searchResult: WeatherApiResponse = response.data
            return searchResult
        } catch (error: any) {
            console.error(error.message)
            throw new Error(`Error searching weather data.`)
        }
    }

    /**
     * Adds a city to the user's favorites.
     * @param {City} city - The city data to be added.
     * @param {number} userId - The user ID.
     * @returns {Promise<FavoriteCity>} - The added city.
     * @throws {Error} - If the user is not found.
     * @throws {Error} - If the city information is missing.
     * @throws {Error} - If the city already exists in the user's favorites.
     */
    static async addToFavorites(city: City, userId: number): Promise<void> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!user) {
                throw new Error('User not found')
            }

            if (!city) {
                throw new Error('City information is required.')
            }

            // find the city in the database
            const existingCity = await prisma.city.findFirst({
                where: {
                    name: city.name
                }
            })

            // if the city already exists in the user's favorites, return
            const existingFavorite = await prisma.favoriteCity.findFirst({
                where: {
                    userId: userId,
                    cityId: existingCity?.id
                }
            })

            if (existingFavorite) {
                throw new Error('City already exists in favorites.')
            }

            // if the city doesn't exist,
            // create it and add it to the user's favorites
            if (!existingCity) {
                throw new Error('City not found')
            } else {
                // if the city exists, add it to the user's favorites
                await prisma.favoriteCity.create({
                    data: {
                        userId: userId,
                        cityId: existingCity.id
                    }
                })
            }
        } catch (error: any) {
            throw new Error(`Error adding city to favorites: ${error.message}`)
        }
    }

    /**
     * Gets the favorite cities for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<FavoriteCityResponse[]>} - The favorite cities.
     * @throws {Error} - If an error occurs while fetching favorite cities.
     */
    static async getFavoriteCities(userId: number): Promise<FavoriteCity[]> {
        try {
            const favoriteCities = await prisma.favoriteCity.findMany({
                where: {
                    userId: userId
                },
                select: {
                    id: true,
                    cityId: true,
                    city: {
                        select: {
                            name: true,
                            latitude: true,
                            longitude: true
                        }
                    }
                }
            })

            const formattedFavoriteCities: FavoriteCity[] = favoriteCities.map(
                (favoriteCity) => {
                    if (!favoriteCity.city) {
                        throw new Error('City information is missing.')
                    }

                    return {
                        id: favoriteCity.id,
                        cityId: favoriteCity.cityId,
                        city: {
                            name: favoriteCity.city.name,
                            latitude: favoriteCity.city.latitude,
                            longitude: favoriteCity.city.longitude
                        }
                    }
                }
            )

            return formattedFavoriteCities
        } catch (error: any) {
            throw new Error(`Error fetching favorite cities: ${error.message}`)
        }
    }

    /**
     * Gets the favorite cities weather for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<WeatherApiResponse[]>} - The favorite cities weather.
     * @throws {Error} - If an error occurs while fetching favorite cities weather.
     */
    static async getFavoriteCitiesWeather(
        userId: number
    ): Promise<WeatherApiResponse[]> {
        try {
            const favoriteCities =
                await WeatherService.getFavoriteCities(userId)

            const favoriteCitiesWeather: WeatherApiResponse[] = []

            for (const cities of favoriteCities) {
                const weatherData = await WeatherService.searchWeather(
                    {
                        q: cities.city.name
                    },
                    userId,
                    false
                )
                favoriteCitiesWeather.push(weatherData)
            }

            return favoriteCitiesWeather
        } catch (error: any) {
            throw new Error(
                `Error fetching favorite cities weather data: ${error.message}`
            )
        }
    }

    /**
     * Gets the recent searches for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<RecentSearch[]>} - The recent searches.
     * @throws {Error} - If an error occurs while fetching recent searches.
     */
    static async getRecentSearches(userId: number): Promise<RecentSearch[]> {
        try {
            const response = await prisma.weatherSearch.findMany({
                where: {
                    userId: userId
                },
                orderBy: {
                    timestamp: 'desc'
                },
                take: 5,
                select: {
                    id: true,
                    cityId: true,
                    city: {
                        select: {
                            name: true,
                            latitude: true,
                            longitude: true
                        }
                    }
                }
            })

            const formattedRecentSearches: RecentSearch[] = response.map(
                (search) => {
                    if (!search.city) {
                        throw new Error('City information is missing.')
                    }

                    return {
                        id: search.id,
                        cityId: search.cityId,
                        city: {
                            name: search.city.name,
                            latitude: search.city.latitude,
                            longitude: search.city.longitude
                        }
                    }
                }
            )

            return formattedRecentSearches
        } catch (error: any) {
            throw new Error(`Error fetching recent searches: ${error.message}`)
        }
    }

    /**
     * Gets the recent search weather for a user.
     * @param {number} userId - The user ID.
     * @returns {Promise<RecentSearch[]>} - The recent searches.
     * @throws {Error} - If an error occurs while fetching recent searches.
     */
    static async getRecentSearchesWeather(
        userId: number
    ): Promise<WeatherApiResponse[]> {
        try {
            const recentSearches =
                await WeatherService.getRecentSearches(userId)

            const recentSearchesWeather: WeatherApiResponse[] = []

            for (const search of recentSearches) {
                const weatherData = await WeatherService.searchWeather(
                    {
                        q: search.city.name
                    },
                    userId,
                    false
                )
                recentSearchesWeather.push(weatherData)
            }

            return recentSearchesWeather
        } catch (error: any) {
            throw new Error(
                `Error fetching recent searches weather data: ${error.message}`
            )
        }
    }
}

export default WeatherService
