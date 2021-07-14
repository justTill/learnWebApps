<template>
  <div class="title">
    <h1> {{ title }}
      <span class="doneIcon" v-if="lesson && lesson.type !== 'information'">&#10003;</span>
    </h1>
    <div v-if="lesson && !user.isDefault" class="helperButtons">
      <div title="Hilfe" class="helpButton" v-on:click="openHelpModal" v-b-modal.modal-center
           variant="info">
        <img title="Hilfe" alt="Hilfe" class="helpIcon" src="../../assets/question.png">
        <b-modal ref="help-modal" id="modal-center-help" centered title="Hilfe" ok-only ok-variant="success"
                 hide-header-close>
          <p class="my-4">{{ helpText }}</p>
        </b-modal>
      </div>
      <div title="Meldung" class="reportButton" v-on:click="openReportModal">
        <img title="Problem Melden" alt="Hilfe" class="helpIcon" src="../../assets/error.png">
        <b-modal ref="report-modal" id="modal-center-report" centered title="Problem Melden" hide-header-close
                 ok-variant="success"
                 ok-title="Problem melden"
                 @ok="sendProblem"
                 cancel-title="Abbruch" cancel-variant="danger">
            <textarea class="problemArea" v-model="problem"
                      placeholder="Bitte beschreiben Sie das Problem für der Aktuellen Aufgabe">
            </textarea>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script>
import {backEndHost, backEndPort} from '@/envVariables'
import {mapGetters} from "vuex";

export default {
  name: 'titleHeader',
  props: {
    title: String,
    lesson: Object,
    helpText: String
  },
  data: function () {
    return {
      problem: "",
    }
  }, computed: {
    ...mapGetters([
      'user'
    ]),
  },
  methods: {
    openHelpModal() {
      this.$refs['help-modal'].show()
    },
    openReportModal() {
      this.$refs['report-modal'].show()
    },
    sendProblem() {
      if (this.problem !== "") {
        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/problems/", {
          moodleId: this.user.userId,
          moodleName: this.user.userName,
          problem: this.problem
        }).then(response => {
          this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/problems/" + userId + "/" + userName)
              .then(result => {
                this.$store.commit("setProblems", result.data.problems)
              })
              .catch(err => console.log(err))
        }).catch(err => {
          console.log(err)
        })
      }
    }
  }
}
</script>
<style>
.doneIcon {
  color: green;
}

.title > h1 {
  display: inline-block;
}

.title {
  height: 80px;
  position: relative;
  text-align: center;
  background-color: white;
  margin-bottom: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.helperButtons {
  position: absolute;
  right: 30px;
  height: 80px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.helpButton, .reportButton {
  width: 40px;
  height: 80px;
  align-items: center;
  display: inline-flex;
  margin: 20px;
}

.helpIcon {
  width: 30px;
  height: 30px;
  margin-left: 3px;
}

.helperButtons:hover {
  cursor: pointer;
}

.problemArea {
  width: 300px;
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>