<template>
  <div class="title">
    <div class="headerButtons">
      <div title="Notiz erstellen" class="resetButton" v-if="this.$route.path ==='/notes'">
        <img alt="notiz erstellen" class="reset" src="../../assets/addnote.svg" height="50" width="50"
             v-on:click="openAddNoteModal">
        <b-modal ref="add-note-modal" id="modal-center-add-note" centered title="Notiz erstellen"
                 ok-variant="success"
                 ok-title="Erstellen"
                 @ok="addNote"
                 cancel-title="Abbruch"
                 cancel-variant="danger"
                 hide-header-close>
          <textarea class="problemArea" v-model="note"
                    placeholder="Notiz schreiben">
            </textarea>
        </b-modal>
      </div>
      <div title="Kapitel zurücksetzen" v-if="resetChapter" class="resetButton">
        <div title="Kapitel zurücksetzen" class="reset" v-on:click="openResetModal" v-b-modal.modal-center
             variant="info">
          <img title="Kapitel zurücksetzen" alt="Kapitel zurücksetzen" class="resetIcon" src="../../assets/reset.png"
               v-b-tooltip.hover.lefttop>
          <b-modal ref="reset-modal" id="modal-center-reset" centered title="Kapitel zurücksetzen"
                   ok-variant="success"
                   ok-title="Zurücksetzen"
                   @ok="resetChapter"
                   cancel-title="Abbruch"
                   cancel-variant="danger"
                   hide-header-close>
            <textarea class="problemArea" v-model="problem"
                      placeholder="Bitte beschreiben Sie das Problem für die aktuelle Aufgabe">

            </textarea>
          </b-modal>
        </div>
      </div>
      <div v-if="lesson" class="helperButtons">
        <div title="Hilfe" class="helpButton" v-on:click="openHelpModal" v-b-modal.modal-center
             variant="info" v-if="lesson.type !=='information'">
          <img title="Hilfe" alt="Hilfe" class="helpIcon" src="../../assets/help.png" v-b-tooltip.hover.lefttop>
          <b-modal ref="help-modal" id="modal-center-help" centered title="Hilfe" ok-variant="success"
                   cancel-title="Schließen"
                   cancel-variant="danger"
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
    <h1>
      <span class="doneIcon" v-if="lesson && lesson.type !== 'information' && lesson.done">&#10003;</span>
      {{ title }}
    </h1>
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
      note: "",
    }
  }, computed: {
    ...mapGetters([
      'user',
      'ltiKey'
    ]),
  },
  methods: {
    addNote() {
      let note = {
        notesId: -1,
        note: this.note
      }
      if (this.note) {
        if (!this.user.isDefault) {
          this.$http.post(backEndUrl + "/api/v1/users/notes/note/" + "?ltik=" + this.ltiKey, {note: this.selectedText}, {
            withCredentials: true
          }).then(res => {
            note.notesId = res.data.id
            this.$store.commit('addNotes', note)
          }).catch(err => {
            let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Die Notiz konnte leider nicht dauerhaft sondern nur temporär gespeichert werden, bitte versuchen Sie es später erneut"
            this.$store.commit('setErrorMessage', errorMessage)
            this.$store.commit('addNotes', note)
          })
        } else {
          this.$store.commit('addNotes', note)
        }
      }
    },
    openHelpModal() {
      this.$refs['help-modal'].show()
    },
    openAddNoteModal() {
      this.$refs['add-note-modal'].show()
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
  padding: 18px;
}

.headerButtons {
  display: inline-block;
  margin-right: 30px;
  float: right;
}

.title {
  min-height: 80px;
  text-align: center;
  background-color: var(--white);
  margin-bottom: 10px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
}

.helperButtons, .resetButton {
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