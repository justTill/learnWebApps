<template>
  <div class="lessonSuccessfullySolvedContainer">
    <b-modal ref="solved-modal" id="modal-center-solved" centered title="Aufgabe erfolgreich gelöst"
             ok-variant="success"
             ok-title="weiter"
             ok-only
             hide-header-close>
      <div class="resetText">{{ preparedFeedback }}</div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'lessonSolved',
  props: {
    feedback: String,
    next: Function,
    prev: Function
  },
  mounted() {
    this.$refs['solved-modal'].show()
  },
  methods: {},
  computed: {
    preparedFeedback() {
      return this.feedback === null || this.feedback === '' ? "Sie haben die Aufgabe erfolgreich gelöst" : this.feedback
    }
  },
}
</script>

<style>
.modal-footer {
  justify-content: center !important;
}
</style>