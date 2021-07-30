<template>
  <div class="errorPopUpContainer">
    <b-modal ref="showErrorMessage-modal" id="modal-center-showErrorMessage" centered
             title="Es ist ein Fehler aufgetreten"
             ok-only
             ok-variant="danger"
             @hide="onModalHide"
             ok-title="okay"
             hide-header-close>
      {{ errorMessage }}
    </b-modal>
  </div>
</template>
<script>

export default {
  name: 'errorPopUp',
  props: {
    errorMessage: String
  },
  methods: {
    onModalHide() {
      this.$store.commit('setErrorMessage', "")
    },
  },
  computed: {},
  data: function () {
    return {}
  },
  mounted() {
    if (this.errorMessage) {
      setTimeout(() => this.$refs['showErrorMessage-modal'].show(), 150)
    }
  }
}
</script>
<style>

</style>
