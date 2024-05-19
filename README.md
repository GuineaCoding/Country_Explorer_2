# Country Explorer README

Welcome to Country Explorer, a sophisticated web application crafted using Svelte that incorporates interactive charts, real-time Leaflet maps, and Firebase integration for a comprehensive user experience. Country Explorer allows users to sign up, sign in, add locations with descriptions, upload multiple photos with authentication, and check weather conditions for each location.

## Key Features

- **User Authentication**: Secure authentication system powered by Firebase, enabling users to sign up and sign in efficiently.
- **Interactive Maps**: Utilize Leaflet to display dynamic maps where users can add and view locations.
- **Data Visualization**: Integration of Chart.js enhanced with date-fns for rendering time-sensitive data associated with various locations.
- **Real-Time Database Interaction**: Firebase Realtime Database is used to handle and store user data such as locations and photo uploads.
- **Photo Gallery**: Users can upload multiple images to each location, displayed elegantly in a responsive gallery.
- **Weather Information**: Fetch and display real-time weather conditions for each location using reliable weather APIs.

## Technology Stack

- **Svelte**: A modern tool for building fast and reactive web interfaces.
- **Leaflet**: A leading open-source JavaScript library for mobile-friendly interactive maps.
- **Firebase**: Comprehensive suite for application development including authentication, database, and storage solutions, developed by Google.
- **Chart.js**: Simple yet flexible JavaScript charting for developers and designers.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have Node.js installed on your machine, which can be downloaded from [nodejs.org](https://nodejs.org/).

### Installation

1. Clone the repository from GitHub:
   ```bash
   git clone https://github.com/GuineaCoding/Country_Explorer_2.git
   ```
2. Change to the project directory:
   ```bash
   cd Country_Explorer_2
   ```
3. Install the required packages:
   ```bash
   npm install
   ```

### Running the Application

- **Development Mode**:
  ```bash
  npm run dev
  ```
  This command starts the server with live reloading enabled.

- **Build the Application**:
  ```bash
  npm run build
  ```
  Compile the application into static files for production.

- **Start the Server**:
  ```bash
  npm run start
  ```
  Serve the built application on a local server.

## Usage

Once the setup is complete, you can:

- **Sign Up/Sign In**: Register a new account or log in to access personalized features.
- **Add Locations**: Mark locations on the map and provide detailed descriptions.
- **Upload Photos**: Attach photos to enhance the location descriptions within the user-friendly gallery.
- **Check Weather**: View up-to-date weather conditions at each location to better plan your activities.