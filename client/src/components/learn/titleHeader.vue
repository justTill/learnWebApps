<template>
  <div class="title">
    <h1> {{ title }}
      <span class="doneIcon" v-if="lesson && lesson.type !== 'information' && lesson.done">&#10003;</span>
    </h1>
    <div title="Kapitel zurücksetzen" v-if="resetChapter" class="resetButton">
      <div title="Kapitel zurücksetzen" class="reset" v-on:click="openResetModal" v-b-modal.modal-center
           variant="info">
        <img title="Kapitel zurücksetzen" alt="Kapitel zurücksetzen" class="resetIcon" src="../../assets/reset.png"
             v-b-tooltip.hover.lefttop>
        <b-modal ref="reset-modal" id="modal-center-reset" centered title="Kapitel zurücksetzen" ok-only
                 ok-variant="danger"
                 ok-title="Zurücksetzen"
                 @ok="resetChapter"
                 hide-header-close>
          <div class="resetText">{{ resetText }}</div>
        </b-modal>
      </div>
    </div>
    <div v-if="lesson" class="helperButtons">
      <div title="Hilfe" class="helpButton" v-on:click="openHelpModal" v-b-modal.modal-center
           variant="info" v-if="lesson.type !=='information'">
        <img title="Hilfe" alt="Hilfe" class="helpIcon" src="../../assets/help.png" v-b-tooltip.hover.lefttop>
        <b-modal ref="help-modal" id="modal-center-help" centered title="Hilfe" ok-only ok-variant="success"
                 hide-header-close>
          <help-content class="my-4" :lesson="lesson"></help-content>
        </b-modal>
      </div>
      <div v-if="!user.isDefault" title="Meldung" class="reportButton" v-on:click="openReportModal">
        <img title="Problem Melden" alt="Hilfe" class="reportIcon" src="../../assets/report.png"
             v-b-tooltip.hover.lefttop>
        <b-modal ref="report-modal" id="modal-center-report" centered title="Problem Melden" hide-header-close
                 ok-variant="success"
                 ok-title="Problem melden"
                 @ok="sendProblem"
                 cancel-title="Abbruch" cancel-variant="danger">
            <textarea class="problemArea" v-model="problem"
                      placeholder="Bitte beschreiben Sie das Problem für die aktuelle Aufgabe">
            </textarea>
        </b-modal>
      </div>
    </div>
  </div>
</template>
<script>
import {backEndUrl} from '@/envVariables'
import {mapGetters} from "vuex";
import HelpContent from "@/components/learn/helpContent";

export default {
  name: 'titleHeader',
  components: {HelpContent},
  props: {
    title: String,
    lesson: Object,
    helpText: String,
    resetText: String,
    resetChapter: Function
  },
  data: function () {
    return {
      problem: "",
    }
  }, computed: {
    ...mapGetters([
      'user',
      'ltiKey'
    ]),
  },
  methods: {
    openHelpModal() {
      this.$refs['help-modal'].show()
    },
    openResetModal() {
      this.$refs['reset-modal'].show()
    },
    openReportModal() {
      this.$refs['report-modal'].show()
    },
    sendProblem() {
      if (this.problem !== "" && !this.user.isDefault) {
        this.$http.post(backEndUrl + "/api/v1/users/problems/problem" + "/?ltik=" + this.ltiKey, {
          problem: this.problem,
          lessonId: this.lesson.lessonId
        }, {
          withCredentials: true
        }).then(response => {
          let problem = {
            problemId: response.data.problemId,
            problemMessage: this.problem,
            lessonId: this.lesson.lessonId,
            answers: []
          }
          this.$store.commit('addProblem', problem)
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Das Problem konnte leider nicht übermittelt werden."
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
    }
  }
}
</script>
<style>
@import "../../assets/cssVariables.css";

.doneIcon {
  color: var(--dark-green);
}

.title > h1 {
  display: inline-block;
  padding: 18px;
}

.title {
  height: 80px;
  position: relative;
  text-align: center;
  background-color: var(--white);
  margin-bottom: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.helperButtons, .resetButton {
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

.helpIcon, .resetIcon, .reportIcon {
  width: 30px;
  height: 30px;
  margin-left: 3px;
}

.helperButtons:hover, .resetButton:hover {
  cursor: pointer;
}

.resetText {
  display: block;
  margin-right: auto;
  margin-left: auto;
  text-align: center;
}

.problemArea {
  width: 300px;
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>