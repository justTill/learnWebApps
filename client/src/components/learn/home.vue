<template>
  <div class="homeContainer">
    <title-header title="Informationen" :reset-chapter="resetAllLessons"
                  resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    <div class="explanation homeSection hoverEffect">
      <h1> Learn Web Apps</h1>
      Ist einer Interaktive Lernandwendung, mithilfe der du, die Konzepte die dir in der Vorlesung "WebApp" vorgestellt
      bekommen wurden vertiefen und üben kannst.
      <br>
      <br>
      Die Anwendung kannst du außerdem gut für die Klausur & Praktikums vorbereitung nutzen. Denn hier werden neben
      angeboteten Übungen, wichtige Inhalte nochmal erläuter.
      <br>
      <br>
      <div class="instructionBlock">
        GIF mit Notizen machen und Code ausführen
      </div>
    </div>
    <div class="settings homeSection hoverEffect">
      <h1> Settings</h1>
      <div class="selectDifficulty">
        Es gibt verschiedene Schwierigkeistgerade
        <select v-model="difficultyLevel" v-on:change="changeDifficultyLevel">
          <option value="ALL" selected>Alle</option>
          <option value="EASY">Leicht</option>
          <option value="MIDDLE">Mittel</option>
          <option value="HARD">Schwer</option>
        </select>
      </div>
      <div class="selectDifficulty">
        Für Programmieraufgaben hellen oder Dunklen modus?
        <select v-model="codeMirrorMode" v-on:change="changeCodeMirrorTheme">
          <option value="DARK" selected>Dunkel</option>
          <option value="LIGHT">Hell</option>
        </select>
      </div>
    </div>
  </div>
</template>
<script>
import TitleHeader from "@/components/learn/titleHeader";

export default {
  name: 'home',
  components: {TitleHeader},
  props: {
    resetAllLessons: Function,

  },
  data: function () {
    return {
      difficultyLevel: "ALL",
      codeMirrorMode: "DARK"
    }
  },
  methods: {
    changeDifficultyLevel() {
      this.$store.commit('setDifficultyLevel', this.difficultyLevel)
    },
    changeCodeMirrorTheme() {
      this.$store.commit('setCodeMirrorTheme', this.codeMirrorMode)
    },
  }
}
</script>
<style>
.homeContainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;
  overflow: scroll;
}

.homeContainer h1 {
  text-align: center;
}

@media only screen and (min-width: 1250px) {
  .homeSection {
    min-width: 1000px;
    max-width: 1000px;
  }
}

@media only screen and (min-width: 1000px) and (max-width: 1249px) {
  .homeSection {
    min-width: 750px;
    max-width: 750px;
  }
}

@media only screen and (max-width: 1000px) {
  .homeSection {
    max-width: 700px;
  }

}

.instructionBlock {
  display: flex;
  justify-content: center;
}

.homeSection {
  display: block;
  background-color: var(--white);
  border: 1px solid black;
  border-radius: 2px;
  padding: 10px 10px 5px;
  margin: 5px auto;
}

</style>