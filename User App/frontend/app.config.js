import 'dotenv/config'; // Import dotenv to use the .env variables

export default {
  expo: {
    name: "smart-waste-app",
    slug: "smart-waste-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: "AIzaSyD9K2p4QYXl8MausQHbqbrrWP697aTYI1I",
        },
      },
    },
    web: {
      favicon: "./assets/favicon.png",
    },
    updates: {
      fallbackToCacheTimeout: 0,
      enabled: false,
    },
    extra: {
      API_URL: process.env.APP_URL,  // Use the environment variable from .env
    },
  },
};
