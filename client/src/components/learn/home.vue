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
      Wenn du in der Kapitel oder Unterthemaansicht bist kann du mit den Buttons
      (
      <img src="../../assets/skip-prev.svg" style="padding-bottom: 5px"> /
      <img src="../../assets/skip-next.svg" style="padding-bottom: 5px">
      )
      zum vorherigen oder nächsten Kapitel/Unterthema
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
        </li>
        <div class="selectCodeTheme">
          <select v-model="theme">
            <option value="LIGHT">Hell</option>
            <option value="DARK">Dunkel</option>
          </select>
        </div>
        <ul>
          <li>
            Sollen dir beim schreiben von Code mögliche vorschläge gemacht werden?
            <toggle-button :labels="{checked: 'On'}" :value="codeHelp" @change="changeCodeHelp"/>
          </li>
        </ul>
        <li><b>Code ergänzungsaufgaben:</b> Ergänze vorgegeben Code anhand deines Wissens</li>
        <li><b>Lückentextaufgaben:</b> Ziehe die richtigen Lösungen mit Drag&Drop in die richtigen Lücken</li>
      </ul>
      <b>Schwierigkeistgrad</b>
      <br>
      Du willst nur Schwere oder Leichte Aufgaben ? Dann stelle hier den Schwierigkeistgrad ein!
      <div class="selectDifficulty">
        <select v-model="levelOfDifficulty">
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
      (<img title="Hilfe" alt="Hilfe" src="../../assets/hints.svg" height="24px" width="24px"
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
      <div class="startFirstChapter">
        <button v-on:click="goToFirstChapter()"> Schon kanns los gehen: Jetzt Zum ersten Kapitel</button>
      </div>
    </div>
  </div>
</template>
<script>
import TitleHeader from "@/components/learn/titleHeader";
import {mapGetters} from "vuex";

export default {
  name: 'home',
  components: {TitleHeader},
  props: {
    resetAllLessons: Function,
    goToFirstChapter: Function
  },
  computed: {
    ...mapGetters([
      'codeHelp',
      'codeTheme',
      'difficultyLevel',
    ]),
    levelOfDifficulty: {
      get() {
        return this.difficultyLevel
      },
      set(value) {
        this.$store.commit('setDifficultyLevel', value)
      }
    },
    theme: {
      get() {
        return this.codeTheme
      },
      set(value) {
        this.$store.commit('setCodeTheme', value)
      }
    },
  },
  methods: {
    changeCodeHelp(state) {
      this.$store.commit('setCodeHelp', state.value)
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

.startFirstChapter {
  text-align: center;
}

.startFirstChapter > button {
  padding: 2px;
  border-radius: 10px;
  background-color: transparent;
  border: 3px solid var(--dark-sky-blue);
}

.startFirstChapter > button:hover {
  border: 3px solid var(--dark-blue);
}

.instructionBlock {
  margin-bottom: 30px;
}
</style>