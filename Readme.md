# AquaGas Monitor

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)

## Overview

The back-end of a service that manages individual readings for water and gas consumption will leverage AI to obtain measurements from photos of meters. This approach will facilitate the accurate collection of data by utilizing advanced image recognition technology to interpret the meter readings.

## Installation

1. Clone the repository:

   ```bash
    git clone git@github.com:voibhiv/aquagas-monitor.git
   ```

2. Navigate to the project directory:

   ```bash
    cd aquagas-monitor
   ```

3. Create an .env file and add your secret key:

   ```bash
    GEMINI_API_KEY='your-secret-key'
   ```

   <b>voce pode conseguir uma secret-key aqui:</b> https://ai.google.dev/gemini-api/docs/api-key

4. Run the containers using Docker:
   ```bash
    docker compose up --build
   ```
