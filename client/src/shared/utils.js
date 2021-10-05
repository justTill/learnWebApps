import {backEndUrl} from "@/envVariables";

export default {
    lessonsForDifficulty: function (section) {
        return this.difficultyLevel === "ALL"
        || this.difficultyLevel === null ? section.lessons : section.lessons.filter(l => l.type === 'information' || l.difficultyLevel === this.difficultyLevel || l.difficultyLevel === 'ALL')

    },
    saveNote(text) {
        let note = {
            notesId: -1,
            note: text
        }
        if (!this.user.isDefault) {
            this.$http.post(backEndUrl + "/api/v1/users/notes/note/" + "?ltik=" + this.ltiKey, {note: text}, {
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
}