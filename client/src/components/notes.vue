<template>
  <h1>Notes</h1>
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