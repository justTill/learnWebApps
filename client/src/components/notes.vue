<template>
  <div>
    <h1>Notes</h1>
    {{ notes }}
  </div>
</template>

<script>

import {mapGetters} from 'vuex'

export default {
  name: 'notes',
  components: {},
  computed: {
    ...mapGetters([
      'notes'
    ])
  },
  methods: {}
}
</script>