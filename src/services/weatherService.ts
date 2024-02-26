import axios from 'axios'
import {
    City,
    FavoriteCity,
    WeatherApiResponse,
    RecentSearch
} from '../types/types'
import prisma from '../config/prisma'
import config from '../config'

const WEATHER_URL = `http://api.weatherapi.com/v1/current.json?key=${config.weather.apiKey}`

/**
 * Represents the Weather API service.
 */
class WeatherService {
    /**
     * Gets the weather data for a user.
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
        userId: number
    ): Promise<WeatherApiResponse> {
        try {
            if (
                !(
                    query.q ||
                    (query.lat !== undefined && query.lon !== undefined)
                )
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

            // create the city if it doesn't exist
            const existingCity = await prisma.city.findFirst({
                where: {
                    name: query.q
                }
            })

            let newCreatedCity

            if (!existingCity) {
                await prisma.city.create({
                    data: {
                        name: query.q ?? '',
                        latitude: query.lat ?? 0,
                        longitude: query.lon ?? 0
                    }
                })
                // get the city from the database
                newCreatedCity = await prisma.city.findFirst({
                    where: {
                        name: query.q
                    }
                })
            }

            // create the search record
            await prisma.weatherSearch.create({
                data: {
                    userId: userId,
                    cityId: existingCity?.id ?? newCreatedCity?.id ?? 0
                }
            })

            const searchResult: WeatherApiResponse = response.data
            return searchResult
        } catch (error: any) {
            throw new Error(`Error searching weather data: ${error.message}`)
        }
    }

    /**
     * Adds a city to the user's favorites.
     * @param {City} city - The city data to be added.
     * @param {number} userId - The user ID.
     * @returns {Promise<FavoriteCity>} - The added city.
     * @throws {Error} - If an error occurs while adding the city to favorites.
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

            // first create the city if it doesn't exist
            const existingCity = await prisma.city.findFirst({
                where: {
                    name: city.name
                }
            })

            // if the city doesn't exist,
            // create it and add it to the user's favorites
            if (!existingCity) {
                const newCity = await prisma.city.create({
                    data: {
                        name: city.name,
                        latitude: city.latitude,
                        longitude: city.longitude
                    }
                })

                await prisma.favoriteCity.create({
                    data: {
                        userId: userId,
                        cityId: newCity.id
                    }
                })
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
}

export default WeatherService
