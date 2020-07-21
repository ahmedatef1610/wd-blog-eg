const bodyParser = require("body-parser");

export default {
  /*
   ** Nuxt rendering mode
   ** See https://nuxtjs.org/api/configuration-mode
   */
  mode: "universal",
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: "server",
  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    title: "WD Blog" || process.env.npm_package_name,
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Open+Sans"
      }
    ]
  },
  /*
   ** Global CSS
   */
  css: ["~/assets/styles/main.css"],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: ["@/plugins/data-filter.js"], // before app start
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [],
  /*
   ** Nuxt.js modules
   */
  modules: ["@nuxtjs/axios"],
  axios: {
    baseURL: process.env.BASE_URL || "https://nuxt-blog-8a27c.firebaseio.com",
    credentials: false
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {},
  loading: { color: "#f00", height: "5px" },
  loadingIndicator: { name: "circle", color: "#3B8070", background: "white" },
  env: {
    baseUrl: process.env.BASE_URL || "https://nuxt-blog-8a27c.firebaseio.com",
    fbAPIKey: "AIzaSyCPVaDv98apR4XTb6OnLmowolElJ58Mu2c"
    //baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  //generate: {},
  // rootDir: "/",
  // router: {
  //   linkActiveClass: "active"
  // },
  //srcDir: "client-app/",
  transition: { name: "fade", mode: "out-in" },
  // order important for serverMiddleware
  serverMiddleware: [bodyParser.json(), "~/api"]
};
