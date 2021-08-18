<template>
  <div class="homeContainer">
    <title-header title="Informationen" :reset-chapter="resetAllLessons"
                  resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    <div class="explanation homeSection hoverEffect">
      <h1> Learn Web Apps</h1>
      Ist einer Interaktive Lernandwendung, mithilfe der du, die Konzepte die dir in der Vorlesung "WebApps" vorgestellt
      bekommen wurden vertiefen und üben kannst.
      <br>
      <br>
      Die Konzepte bilden die Grundlage zur Umsetzung komplexer clientseitiger Logik für WebApps. Daher ist es wichtig
      diese zu verstehen und anwenden zu können.
      <br>
      <br>
      Die Anwendung kannst du außerdem gut für die Klausur & Praktikums vorbereitung nutzen. Denn hier werden neben
      angeboteten Übungen, wichtige Inhalte nochmal erläuter.
      <br>
      <br>

      <div class="instructionBlock">
        <img class="gif" src="../../assets/instructions.gif" alt="Instruktions Gif">
      </div>
    </div>
    <div class="settings homeSection hoverEffect">
      <h1> Settings</h1>
      Für jeden Interessierten gibt es Lerneinheiten. Egal ob du schon fortgeschritten bist oder gerade anfängst die
      Konzepte zu lernen und zu verstehen. Daher kannst du hier die Schwierigkeit einstellen.
      <div class="selectDifficulty">
        <select v-model="difficultyLevel" v-on:change="changeDifficultyLevel">
          <option value="ALL" selected>Alle</option>
          <option value="EASY">Leicht</option>
          <option value="MIDDLE">Mittel</option>
          <option value="HARD">Schwer</option>
        </select>
      </div>
      Du möchstes bei Programmieraufgaben den code lieber im Darkmode schreiben? Dann kannst du das hier ändern!
      <div class="selectCodeTheme">
        <select v-model="codeMirrorMode" v-on:change="changeCodeMirrorTheme">
          <option value="LIGHT">Hell</option>
          <option value="DARK">Dunkel</option>
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
      codeMirrorMode: "LIGHT"
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
  padding: 10px 30px 10px;
  margin: 5px auto;
}

.selectDifficulty, .selectCodeTheme {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 20px;
}

.selectDifficulty > select, .selectCodeTheme > select {
  width: 150px;
}

.gif {
  width: 700px;
  height: auto;
}

.instructionBlock {
  margin-bottom: 30px;
}
</style>