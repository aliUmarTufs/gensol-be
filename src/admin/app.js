import Logo from "./extensions/logo.svg";
import favicon from "./extensions/favicon.png";
// import MenuLogo from "./extensions/menuLogo.png";

const config = {
  auth: {
    logo: Logo,
  },
  // // Replace the favicon
  head: {
    favicon: favicon,
  },
  // // Replace the Strapi logo in the main navigation
  menu: {
    logo: Logo,
  },
  tutorials: false,
  translations: {
    en: {
      "app.components.LeftMenu.navbrand.title": "Genius Academy Admin",
      "Auth.form.welcome.subtitle": "Log in to your Genius Academy account",
      "Auth.form.welcome.title": "Welcome to Genius Academy!",
      "app.components.HomePage.welcome": "Welcome on board 💡",
      "app.components.HomePage.welcome.again": "Welcome 💡",
      "app.components.HomePage.welcomeBlock.content":
        "Congrats! You are logged as the first administrator. To discover the powerful features provided by Genius Academy, we recommend you to create your first Content type!",
    },
  },
  theme: {
    colors: {
      alternative100: "#694d16",
      alternative200: "#D9A94A",
      alternative500: "#FF0000",
      alternative600: "#f2e1c0",
      alternative700: "#D9A94A",
      primary100: "#D9A94A",
      primary200: "#694d16",
      primary500: "#e9cd96",
      primary600: "#694d16",
      primary700: "#694d16",
      buttonPrimary600: "#D9A94A",
      buttonPrimary500: "#D9A94A",
      buttonNeutral0: "#ffffff",
    },
  },
};

const bootstrap = () => {};

export default {
  config,
  bootstrap,
};
