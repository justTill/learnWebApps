<template>
  <div class="test">
    <h1>Hier ist ein test</h1>
    <p>{{ userName }}</p>
    <p>{{ userId }}</p>
  </div>
</template>

<script>
export default {
  name: 'Test',
  props: {},
  computed: {
    userName() {
      return this.$store.state.userName
    },
    userId() {
      return this.$store.state.userId
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
