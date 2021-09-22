<template>
  <div>
    <title-header title="Deine Nachrichten"></title-header>
    <div class="messageContainer">
      <div v-for="(problem, index) in problems">
        <div class="problem hoverEffect"
             @mouseover="onHover(index)"
             @mouseleave="onHoverLeave(index)">
          <span class="problemLessonName"><b>Aufgabe:</b> {{ problem.lessonName }}</span>
          <span class="problemMessage"><b>Problem:</b> <pre class="problemPre">{{ problem.problemMessage }}</pre></span>
          <div class="deleteProblem" v-if="problemAreaIndex === index" v-on:click="openDeleteProblemModal(problem)">
            <img src="../assets/delete.png" alt="Problem Löschen" title="Löschen" v-b-tooltip.hover.lefttop>
          </div>
          <div class="displayAnswers" :ref="'showAnswer-'+index" v-on:click="toggleAnswerShow(index)">
            {{ index === displayAnswerIndex ? "Antwort ausblenden" : "Antworten anzeigen" }}
          </div>
          <div v-if="displayAnswerIndex === index ">
            <div v-if="problem.answers.length !== 0">
                <pre class="problemPre answer" v-for="answer in problem.answers">
                 {{ answer }}
                </pre>
            </div>
            <div v-else class="answer">
              Es gibt noch keine Antworten
            </div>
            <div v-if="problem.answers.length !== 0">
              <pre class="problemPre answerTextarea">
                <textarea v-model="answer" placeholder="Antwort schreiben"></textarea>
              </pre>
            </div>
            <div class="addAnswer" v-on:click="answerOnProblem(problem)" v-if="problem.answers.length !== 0">
              Antworten
            </div>
          </div>
        </div>
      </div>
      <b-modal ref="deleteProblem-modal" id="modal-center-deleteProblem" centered title="Problem Löschen" ok-only
               ok-variant="danger"
               @ok="deleteProblem"
               ok-title="Problem unwiederruflich Löschen"
               hide-header-close>
        <div class="resetText">Das Löschen kann nicht rückgängig gemacht werden</div>
      </b-modal>
    </div>
  </div>
</template>

<script>
import TitleHeader from "@/components/learn/titleHeader";
import {mapGetters} from "vuex";
import {backEndUrl} from "@/envVariables";

export default {
  name: 'notes',
  components: {TitleHeader},
  data: function () {
    return {
      answer: "",
      problemAreaIndex: -1,
      displayAnswerIndex: -1,
      currentProblem: {},
    }
  },
  computed: {
    ...mapGetters([
      'problems',
      'user',
      'ltiKey'
    ]),
  }, methods: {
    answerOnProblem(problem) {
      this.currentProblem = problem
      let payload = {
        problem: this.currentProblem,
        toBeAddedAnswer: this.answer
      }
      if (this.answer === "") {
        let errorMessage = "Es dürfen keine leeren Antworten gesendet werden"
        this.$store.commit('setErrorMessage', errorMessage)
        return
      }
      if (!this.user.isDefault) {
        let requestPayload = {
          answer: this.answer,
          problemId: this.currentProblem.problemId
        }
        this.$http.post(backEndUrl + "/api/v1/users/problems/answer/" + "?ltik=" + this.ltiKey, requestPayload, {
          withCredentials: true
        }).then(response => {
          this.$store.commit('addAnswerToProblem', payload)
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Die Antwort konnte nicht daher gespeichert werden, bitte versuchen Sie es später erneut."
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
      this.answer = ""
    },
    onHover(index) {
      this.problemAreaIndex = index
    },
    onHoverLeave(index) {
      this.problemAreaIndex = -1
    },
    deleteProblem() {
      if (!this.user.isDefault) {
        this.$http.delete(backEndUrl + "/api/v1/users/problems/" + this.currentProblem.problemId + "?ltik=" + this.ltiKey, {
          withCredentials: true
        }).then(response => {
          this.$store.commit('deleteProblem', this.currentProblem)
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Das Problem konnte nicht daher gelöscht werden, bitte versuchen Sie es später erneut."
          this.$store.commit('setErrorMessage', errorMessage)
        })
      } else {
        this.$store.commit('deleteProblem', this.currentProblem)
      }
    },
    openDeleteProblemModal(problem) {
      this.currentProblem = problem
      this.$refs['deleteProblem-modal'].show()
    },
    toggleAnswerShow(index) {
      this.displayAnswerIndex = index === this.displayAnswerIndex ? -1 : index
    }
  },
}
</script>
<style>
@import "../assets/cssVariables.css";

.problem {
  position: relative;
  display: block;
  max-width: 600px;
  min-width: 400px;
  background-color: var(--white);
  margin: 10px auto 10px;
  padding: 5px 10px 5px;
  border: 1px solid black;
  border-radius: 5px;
}

.answer {
  border-left: 1px solid var(--davys-grey);
  border-bottom: 1px solid var(--davys-grey);
  margin-left: 30px;
  background-color: var(--light-gray) !important;
  margin-bottom: 10px !important;
  margin-right: 30px;
  padding-left: 10px;
}

.answerTextarea {
  margin-right: 30px;
  padding-left: 0px;
  margin-left: 30px;
}

.answerTextarea > textarea {
  width: 400px;
  height: 80px !important;
}

.problemPre {
  white-space: pre-line;
  background-color: var(--white);
  margin-bottom: 5px;
  border-radius: 0px;
}

.deleteProblem {
  cursor: pointer;
  display: inline-block;
  position: absolute;
  right: 10px;
  top: 3px;
}

.problemLessonName, .problemMessage {
  display: block;
  margin: 5px 5px 5px;
}

.deleteProblem > img {
  width: 25px;
  height: 25px;
}

.displayAnswers {
  text-decoration: underline;
  margin-left: 30px;
  padding-left: 10px;
  font-size: small;
  margin-bottom: 5px;
  color: var(--blue);
}

.displayAnswers:hover {
  cursor: pointer;
}

.addAnswer:hover {
  cursor: pointer;
  background-color: darkgreen;
}

.addAnswer {
  margin-left: 30px;
  margin-top: 5px;
  margin-bottom: 5px;
  padding: 10px;
  color: var(--white);
  display: inline-block;
  background-color: var(--dark-green);
  border-radius: 5px;
}

.answerArea {
  width: 300px;
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
