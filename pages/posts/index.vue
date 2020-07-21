<template>
  <div class="posts-page">
    <PostList :posts="$store.getters.loadedPosts" />
  </div>
</template>

<script>
export default {
  middleware: "log"
};
</script>

<style scoped>
.posts-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>