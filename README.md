# Weather Application

## Overview

This Weather Application is a simple yet comprehensive tool that allows users to register, log in and access weather information for their location, search for specific cities or locations using latitude and longitude, view recent searches and mark favorite cities for quick access. The application relies on external APIs for country, state, city information and weather data.

## API Integration

-   **Country, State, City Information:** The application relies on the Universal Tutorial API for country, state, and city information. Access the API [here](https://www.universal-tutorial.com/rest-apis/free-rest-api-for-country-state-city).

-   **Weather Data:** Weather information is fetched from the WeatherAPI. Obtain the necessary data [here](https://www.weatherapi.com/).

## Features

### User Registration

-   Collects user information with mandatory fields including country, state, city, latitude, and longitude.

### User Login

-   Secure login functionality using valid credentials, with user sessions stored in Redis.

### User Location Weather

-   Displays the weather of the user's location on the dashboard.

### Search Weather

-   Enables users to search for weather based on city or latitude and longitude.

### Recent Searches

-   Displays the user's five most recent searches on the dashboard.

### Favorites

-   Allows users to mark search results as favorites for quick access to weather information on the dashboard.
