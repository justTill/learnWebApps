<template>
  <div>
    <title-header :title="titleText">
    </title-header>
    <div class="notesContainer">
      <div class="note hoverEffect" v-for="(note, index) in notes"
           @mouseover="onHover(index)"
           @mouseleave="onHoverLeave(index)">
        {{ note.note }}
        <div class="changeNoteArea" v-if="changeAreaIndex === index">
          <div class="changeNoteButton" v-on:click="showChangeNoteModal(note)">
            <img src="../assets/edit.png" alt="Notiz Bearbeiten" title="Bearbeiten" v-b-tooltip.hover.lefttop>
          </div>
          <div class="changeNoteButton deleteNote" v-on:click="deleteNote(note)">
            <img src="../assets/delete.png" alt="Notiz Löschen" title="Löschen" v-b-tooltip.hover.lefttop>
          </div>
        </div>
      </div>
      <b-modal ref="editNote-modal" id="modal-center-editNote" centered title="Notiz bearbeiten"
               hide-header-close
               ok-variant="success"
               ok-title="Speichern"
               @ok="saveNoteChanges"
               cancel-title="Abbruch" cancel-variant="danger">
        <textarea class="editNoteArea" v-model="currentNote.note"></textarea>
      </b-modal>
    </div>
    <div id="revertNoteDelete" class="noteDeleted">Gelöscht
      <span class="revertDelete" v-on:click="revertDeleteNote">
        Rückgängig machen
    </span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import TitleHeader from "@/components/learn/titleHeader";
import {backEndUrl} from "@/envVariables";

export default {
  name: 'notes',
  components: {TitleHeader},
  data: function () {
    return {
      changeAreaIndex: -1,
      lastDeletedNote: {},
      lastDeletedNoteIndex: -1,
      currentNote: {note: ""},
      currentNoteIndex: -1,
    }
  },
  computed: {
    ...mapGetters([
      'notes',
      'user',
      'errorMessage'
    ]),
    titleText() {
      if (this.user.isDefault) {
        return "Deine Notizen"
      } else {
        return this.user.userName + "'s persönliche Notizen"
      }
    },
  },
  methods: {
    onHover(index) {
      this.changeAreaIndex = index
    },
    onHoverLeave(index) {
      this.changeAreaIndex = -1
    },
    deleteNote(note) {
      if (!this.user.isDefault) {
        this.$http.delete(backEndUrl + "/api/v1/users/notes/" + note.notesId, {
          withCredentials: true
        }).then(response => {
          this.lastDeletedNote = note
          this.lastDeletedNoteIndex = this.notes.indexOf(note)
          this.$store.commit('deleteNote', note)
          this.$el.querySelector('#revertNoteDelete').style.display = "block"
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Die Notiz konnte nicht gelöscht werden, bitte versuchen Sie es später erneut."
          this.$store.commit('setErrorMessage', errorMessage)
        })
      } else {
        this.lastDeletedNote = note
        this.lastDeletedNoteIndex = this.notes.indexOf(note)
        this.$store.commit('deleteNote', note)
        this.$el.querySelector('#revertNoteDelete').style.display = "block"
      }
    },
    revertDeleteNote() {
      this.$el.querySelector('#revertNoteDelete').style.display = "none"
      let payload = {
        index: this.lastDeletedNoteIndex,
        note: this.lastDeletedNote
      }
      this.updateNoteBackend(this.lastDeletedNote)
      this.lastDeletedNote = -1
      this.lastDeletedNoteIndex = null
      this.$store.commit('addNoteAtIndex', payload)
    },
    showChangeNoteModal(note) {
      this.$refs['editNote-modal'].show()
      this.currentNote = note
      this.currentNoteIndex = this.notes.indexOf(note)
    },
    saveNoteChanges() {
      let storePayload = {
        index: this.currentNoteIndex,
        noteText: this.currentNote.note
      }
      this.updateNoteBackend(this.currentNote)
      this.$store.commit('changeNote', storePayload)
    },
    updateNoteBackend(note) {
      if (!this.user.isDefault && note.notesId !== -1) {
        let payload = {
          note: note.note,
        }
        this.$http.post(backEndUrl + "/api/v1/users/notes/note/" + note.notesId, payload, {
          withCredentials: true
        }).then(response => {
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Die Notiz konnte leider nicht permanent gespeichert werden."
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
    }
  },
}
</script>
<style>
@import "../assets/cssVariables.css";

.notesContainer {
}

@media only screen and (max-width: 400px) {
  .note {
    min-width: 100px !important;
  }
}

.changeNoteButton {
  display: inline-block;
  margin-right: 10px;
}

.changeNoteButton:hover {
  cursor: pointer;
}

.changeNoteButton > img {
  width: 25px;
  height: 25px;
}

.changeNoteArea {
  display: inline-block;
  position: absolute;
  right: 10px;
}

.note {
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

.revertDelete {
  font-weight: bold;
  text-decoration: underline;
  color: var(--dark-sky-blue);
}

.revertDelete:hover {
  cursor: pointer;
}

.noteDeleted {
  position: absolute;
  display: none;
  z-index: 9999;
  color: var(--white);
  border-radius: 5px;
  bottom: 5px;
  padding: 15px;
  margin: 8px;
  width: 300px;
  text-align: center;
  background-color: var(--davys-grey);
}

.editNoteArea {
  width: 300px;
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>