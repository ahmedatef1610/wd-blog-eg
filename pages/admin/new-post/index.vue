<template>
  <div class="admin-new-post-page">
    <section class="new-post-form">
      <AdminPostForm @submit="onSubmitted" />
    </section>
  </div>
</template>

<script>
import axios from "axios";
export default {
  layout: "admin",
  middleware: ["check-auth", "auth"], //order important for excution and this middleware on server
  methods: {
    onSubmitted(postData) {
      this.$store
        .dispatch("addPost", postData)
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
.new-post-form {
  width: 90%;
  margin: 20px auto;
}

@media (min-width: 768px) {
  .new-post-form {
    width: 500px;
  }
}
</style>

