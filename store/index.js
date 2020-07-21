import Vuex from "vuex";
import axios from "axios";
import Cookie from "js-cookie";

const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedPosts: [],
      token: null
    }, /////////////////////////////////////////////////////////////////////////
    getters: {
      loadedPosts(state) {
        return state.loadedPosts;
      },
      isAuthenticated(state) {
        return state.token != null;
      }
    }, /////////////////////////////////////////////////////////////////////////
    mutations: {
      setPosts(state, payload) {
        state.loadedPosts = payload;
      },
      addPost(state, payload) {
        state.loadedPosts.push(payload);
      },
      editPost(state, payload) {
        const postIndex = state.loadedPosts.findIndex(
          post => post.id == payload.id
        );
        state.loadedPosts[postIndex] = payload;
      },
      setToken(state, payload) {
        state.token = payload;
      },
      clearToken(state, payload) {
        state.token = null;
      }
    }, /////////////////////////////////////////////////////////////////////////
    actions: {
      //1
      nuxtServerInit(vuexContext, context) {
        //here everything on server
        return context.app.$axios
          .$get(`/posts.json`)
          .then(data => {
            const postArray = [];
            for (const key in data) {
              postArray.push({ ...data[key], id: key });
            }
            vuexContext.commit("setPosts", postArray);
          })
          .catch(e => console.log(e));
      },
      //2
      setPosts({ commit }, payload) {
        commit("setPosts", payload);
      },
      //3
      addPost({ commit }, payload) {
        const createdPost = {
          ...payload,
          updatedDate: new Date().toLocaleString()
        };
        return this.$axios
          .$post(`/posts.json?auth=${state.token}`, createdPost)
          .then(data => {
            commit("addPost", { ...createdPost, id: data.name });
          })
          .catch(e => {
            console.log(e);
          });
      },
      //4
      editPost({ state, commit }, payload) {
        const editPost = {
          ...payload,
          updatedDate: new Date().toLocaleString()
        };
        return this.$axios
          .$put(`/posts/${editPost.id}.json?auth=${state.token}`, editPost)
          .then(result => {
            commit("editPost", editPost);
          })
          .catch(e => {
            console.log(e);
          });
      },
      //5
      authenticationUser({ state, commit, dispatch }, payload) {
        let authUrl = "";
        if (!payload.isLogin) {
          authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.fbAPIKey}`;
        } else {
          authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.fbAPIKey}`;
        }
        return this.$axios
          .$post(authUrl, {
            email: payload.email,
            password: payload.password,
            returnSecureToken: true
          })
          .then(res => {
            console.log(res);
            commit("setToken", res.idToken);
            
            localStorage.setItem("token", res.idToken);
            localStorage.setItem("tokenExpiration",new Date().getTime() + Number.parseInt(res.expiresIn) * 1000);
            
            Cookie.set("jwt", res.idToken,{expires: new Date(Date.now() +  Number.parseInt(res.expiresIn) * 1000)});
            Cookie.set("expirationDate",new Date().getTime() + Number.parseInt(res.expiresIn) * 1000,{expires: new Date(Date.now() +  Number.parseInt(res.expiresIn) * 1000)});
            // dispatch("setLogoutTimer", res.expiresIn * 1000);

            return this.$axios.$post("http://localhost:3000/api/track-data",{data:"Authenticated"})
          })
          .then(res => {
            console.log(res);
          })
          .catch(err => {
            console.log(err);
          });
      },
      //6
      // setLogoutTimer({ state, commit }, payload) {
      //   // payload == duration
      //   setTimeout(() => {
      //     commit("clearToken");
      //   }, payload);
      // },
      //7
      initAuth({ state, commit, dispatch }, req) {
        //payload == req

        let token;
        let expirationDate;

        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie.split(";").find(c => c.trim().startsWith("jwt="));
          if (!jwtCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expirationDate = req.headers.cookie.split(";").find(c => c.trim().startsWith("expirationDate=")).split("=")[1];

        } 
        else {
          token = localStorage.getItem("token");
          expirationDate = localStorage.getItem("tokenExpiration");
        }

        if (new Date().getTime() > +expirationDate || !token) {
          console.log("No token or invalid token");
          dispatch("logout");
          return;
        }

        // dispatch("setLogoutTimer", +expirationDate - new Date().getTime());
        commit("setToken", token);
      },
      //8
      logout({commit}) {
        commit("clearToken");
        Cookie.remove("jwt");
        Cookie.remove("expirationDate");
        if (process.client) {
          localStorage.removeItem("token");
          localStorage.removeItem("tokenExpiration");
        }
      }
    } /////////////////////////////////////////////////////////////////////////
  });
};

export default createStore;
