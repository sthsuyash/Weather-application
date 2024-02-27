# Weather Application

## Overview

This Weather Application is a simple yet comprehensive tool that allows users to register, log in and access weather information for their location, search for specific cities or locations using latitude and longitude, view recent searches and mark favorite cities for quick access. The application relies on external APIs for weather data.

## API Integration

- **Weather Data:** Weather information is fetched from the WeatherAPI. Obtain the necessary data [here](https://www.weatherapi.com/).

## Features

### User Registration

- Collects user information with mandatory fields including country, state, city, latitude, and longitude.

### User Login

- Secure login functionality using valid credentials, with user sessions stored in Redis.

### User Location Weather

- Displays the weather of the user's location on the dashboard.

### Search Weather

- Enables users to search for weather based on city or latitude and longitude.

### Recent Searches

- Displays the user's five most recent searches on the dashboard.

### Favorites

- Allows users to mark search results as favorites for quick access to weather information on the dashboard.

## How to Use

1. Clone the repository and navigate to the project directory.

   ```bash
   git clone https://github.com/sthsuyash/Weather-application.git && cd Weather-application
   ```

2. Install the dependencies.

   ```bash
   npm install
   ```

3. Create a new account on [WeatherAPI](https://www.weatherapi.com/) and obtain the API key.

4. Create a new database in MySQL.

   ```sql
   CREATE DATABASE weatherapp;
   ```

5. Copy the `.env.example` file to `.env` and update the environment variables as per your requirements.

   ```bash
   cp .env.example .env
   ```

6. Start redis server in docker container.

   ```bash
   docker run -p 6379:6379 --name redis -d redis
   ```

7. Migrate the database.

   ```bash
   npm run migrate
   ```

8. Start the application.

   ```bash
   npm start
   ```

9. Open the application in your browser. [http://localhost:3000](http://localhost:3000)
