<template>
  <div class="box">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'BoxItem'
}
</script>

<style scoped>
.box {
  border: 1px solid black;
  width: 400px;
  height: 200px;
  padding: 20px;
}
</style>
