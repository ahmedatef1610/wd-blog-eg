<template>
  <div class="admin-post-page">
    <section class="update-form">
      <AdminPostForm :post="loadedPost" @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "admin",
  middleware: ["check-auth", "auth"], //order important for excution and this middleware on server
  data() {
    return {};
  },
  asyncData(context) {
    return axios
      .get(`${process.env.baseUrl}/posts/${context.params.postId}.json`)
      .then(res => {
        // console.log(res.data);
        return {
          loadedPost: { ...res.data, id: context.params.postId }
        };
      })
      .catch(e => {
        context.error(e);
      });
  },
  methods: {
    onSubmitted(editedPost) {
      this.$store
        .dispatch("editPost", editedPost)
        .then(result => {
          this.$router.push("/admin");
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style scoped>
.update-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .update-form {
    width: 500px;
  }
}
</style>
