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
            <img src="../assets/reset.png" alt="Notiz Bearbeiten" title="Bearbeiten" v-b-tooltip.hover.lefttop>
          </div>
          <div class="changeNoteButton deleteNote" v-on:click="deleteNote(note)">
            <img src="../assets/reset.png" alt="Notiz Löschen" title="Löschen" v-b-tooltip.hover.lefttop>
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
    <div v-if="lastDeletedNote !== null && lastDeletedNoteIndex !== -1" class="noteDeleted">Gelöscht <span
        class="revertDelete" v-on:click="revertDeleteNote">Rückgängig machen</span></div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex'
import TitleHeader from "@/components/learn/titleHeader";
import {backEndHost, backEndPort} from "@/envVariables";

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
      deleteReverted: false
    }
  },
  computed: {
    ...mapGetters([
      'notes',
      'user'
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
      this.lastDeletedNote = note
      this.lastDeletedNoteIndex = this.notes.indexOf(note)
      this.$store.commit('deleteNote', note)
      setTimeout(() => {
        if (!this.user.isDefault && !this.deleteReverted) {
          this.$http.delete("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/notes/" + this.user.userId + "/" + this.user.userName + "/" + note.notesId)
              .then(response => {
              })
              .catch(err => {
              })
        }
        this.lastDeletedNoteIndex = null
        this.lastDeletedNote = -1
        this.deleteReverted = false
      }, 4000)
    },
    revertDeleteNote() {
      console.log("revertDelete")
      this.deleteReverted = true;
      let payload = {
        index: this.lastDeletedNoteIndex,
        note: this.lastDeletedNote
      }
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
      if (!this.user.isDefault) {
        let payload = {
          moodleId: this.user.userId,
          moodleName: this.user.userName,
          updatedNoteText: this.currentNote.note,
          noteId: this.currentNote.notesId
        }
        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/notes/note", payload)
            .then(response => {
            })
            .catch(err => {
              //error Could not save Note
            })
      }
      this.$store.commit('changeNote', storePayload)
    },
  },
}
</script>
<style>
.notesContainer {
}

@media only screen and (max-width: 400px) {
  .note {
    min-width: 100px !important;
  }
}

.deleteNote {
  background-color: red;
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
  right: 10px
}

.note {
  position: relative;
  display: block;
  max-width: 600px;
  min-width: 400px;
  background-color: white;
  margin: 5px auto 5px;
  padding: 5px 10px 5px;
  border: 1px solid black;
  border-radius: 5px;

}

.revertDelete {
  font-weight: bold;
  text-decoration: underline;
  color: lightskyblue;
}

.revertDelete:hover {
  cursor: pointer;
}

.noteDeleted {
  position: absolute;
  z-index: 9999;
  color: white;
  border-radius: 5px;
  bottom: 5px;
  padding: 15px;
  margin: 8px;
  width: 300px;
  text-align: center;
  background-color: rgb(48, 48, 48);
}

.editNoteArea {
  width: 300px;
  height: 200px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>