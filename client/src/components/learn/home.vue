<template>
  <div class="homeContainer">
    <title-header title="Informationen" :reset-chapter="resetAllLessons"
                  resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    <div class="explanation homeSection hoverEffect">
      <h1> Web Apps Lernen</h1>
      Mit dieser Anwendung kannst du die Konzepte, die dir in der Vorlesung "WebApps" vorgestellt wurden vertiefen und
      üben.
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
      <h1> Benutzung</h1>
      Ihr könnt verschiedenen Kapitel bearbeiten. (rechts in der Navigationsleiste zu sehen)
      <br>
      Jedes Kapitel besitzt verschiedenen Unterthemen, die wiederum verschiedene Informationseinheiten
      (<img src="../../assets/info.png" style="padding-bottom: 5px">)
      sowie Aufgaben (<img src="../../assets/lessons.png" style="padding-bottom: 5px">) beinhalten.
      <br>
      <br>
      <b>Aufgaben</b>
      <br>
      Es gibt vier verschiedene Arten von Aufgaben
      <ul>
        <li><b>Single-Multiple-Choice-Aufgaben</b></li>
        <li><b>Code Aufgaben:</b> Hier kannst du mehere Zeilen Code schreiben, der auch ausgefphrt und anahnd von Tests
          überprüft wird
          <ul>
            <li> Das Textfeld in dem du dein Code schreibst soll im DarkMode sein? Hier kannst du es änderb</li>
          </ul>
          <div class="selectCodeTheme">
            <select v-model="codeMirrorMode" v-on:change="changeCodeMirrorTheme">
              <option value="LIGHT">Hell</option>
              <option value="DARK">Dunkel</option>
            </select>
          </div>
        </li>
        <li><b>Code ergänzungsaufgaben:</b> Ergänze vorgegeben Code anhand deines Wissens</li>
        <li><b>Lückentextaufgaben:</b> Ziehe die richtigen Lösungen mit Drag&Drop in die richtigen Lücken</li>
      </ul>
      <b>Schwierigkeistgrad</b>
      <br>
      Du willst nur Schwere oder Leichte Aufgaben ? Dann stelle hier den Schwierigkeistgrad ein!
      <div class="selectDifficulty">
        <select v-model="difficultyLevel" v-on:change="changeDifficultyLevel">
          <option value="ALL" selected>Alle</option>
          <option value="EASY">Leicht</option>
          <option value="MIDDLE">Mittel</option>
          <option value="HARD">Schwer</option>
        </select>
      </div>
      <b>Notizen & Probleme & Hilfe</b>
      <br>
      Du möchtest Inhalte als Notizen speichern? Dann kannst du innerhalb eines Kapitels, Unterthema,Aufgabe oder
      Informationseinheit den gewünschnten Text makieren und aus das "Notiz erstellen" pop Up klicken.
      <br>
      <br>
      <b>Probleme & Hilfe</b>
      <br>
      Falls du Hilfe bei einer Aufgabe braucht kannst du auf das Icon
      (<img title="Hilfe" alt="Hilfe" src="../../assets/help.png" height="24px" width="24px"
            style="padding-bottom: 4px">) klicken.
      <br>
      Funktionieren Aufgaben nicht oder es gibt andere Probleme kannst du dem Dozenten dieses Melden
      (<img title="Hilfe" alt="Hilfe" src="../../assets/report.png" height="24px" width="24px"
            style="padding-bottom: 4px">)
      <br>
      <br>
      <b>Fortschritt</b>
      <br>
      Es wird gespeichert ob du eine Aufgabe gelöst hast. Wenn du den den Kompletten Fortschritt oder den eines Kapitels
      zurücksetzen möchtest kannst du auf das
      (<img title="Hilfe" alt="Hilfe" src="../../assets/reset.png" height="24px" width="24px"
            style="padding-bottom: 4px">) Icon klicken.
      <br>
      <br>
      <button> Schon kanns los gehen: Jetzt Zum ersten Kapitel</button>
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