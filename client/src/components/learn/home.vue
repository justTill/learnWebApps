<template>
  <div class="homeContainer">
    <title-header title="Informationen" :reset-chapter="resetAllLessons"
                  resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    <div class="explanation homeSection hoverEffect">
      <h1> Web-Apps lernen</h1>
      Mit dieser Anwendung kannst du die Konzepte, die dir in der Vorlesung "Web-Apps" vorgestellt wurden, vertiefen und
      üben. Die Konzepte bilden die Grundlage zur Umsetzung komplexer, clientseitiger Logik für Web-Apps. Daher ist es
      wichtig, diese zu verstehen und anwenden zu können. Die Anwendung kannst du außerdem gut für die Klausur- und
      Praktikumsvorbereitung nutzen. Denn hier werden neben
      angebotenen Übungen wichtige Inhalte nochmal erläutert.
      <br>
      <br>
      <div class="instructionBlock">
        <img class="gif" src="../../assets/instructions.gif" alt="Instruktions Gif">
      </div>
    </div>
    <div class="settings homeSection hoverEffect">
      <h1> Benutzung</h1>
      Du kannst verschiedene Kapitel bearbeiten (links in der Navigationsleiste zu sehen).
      <br>
      Jedes Kapitel besitzt verschiedene Unterthemen, die wiederum verschiedene Informationseinheiten
      (<img src="../../assets/info.png" style="padding-bottom: 5px">)
      sowie Aufgaben (<img src="../../assets/lessons.png" style="padding-bottom: 5px">) beinhalten.
      <br>
      Ist in der Navigationsleiste ein (<span style="color: var(--dark-green)">&#x2713;</span>) zu sehen, bedeutet dies,
      dass du alle Aufgaben in dem Kapitel / Unterthema gelöst hast.
      <br>
      Der Pfeil (&#8592;) zeigt dir an, in welchem Kapitel / Unterthema du dich gerade befindest.
      <br>
      Wenn du in der Kapitel- oder Unterthemenansicht bist, kannst du mit den Buttons
      (
      <img src="../../assets/skip-prev.svg" style="padding-bottom: 5px"> /
      <img src="../../assets/skip-next.svg" style="padding-bottom: 5px">
      )
      zum vorherigen oder nächsten Kapitel / Unterthema springen.
      <br>
      <br>
      <b>Aufgaben</b>
      <br>
      Es gibt vier verschiedene Arten von Aufgaben.
      <ul>
        <li><b>Single- und Multiple-Choice-Aufgaben:</b> Wähle die richtige bzw. richtigen Lösungen aus den vorgebenen
          Antworten aus.

        </li>
        <li><b>Code Aufgaben:</b> Hier kannst du mehrere Zeilen Code schreiben, der auch ausgeführt und anhand von Tests
          überprüft wird.
          <ul>
            <li> Das Textfeld, in dem du deinen Code schreibst, soll im Darkmode sein? Hier kannst du es ändern.</li>
          </ul>
        </li>
        <div class="selectCodeTheme">
          <select v-model="theme">
            <option value="LIGHT">Helle IDE</option>
            <option value="DARK">Dunkle IDE</option>
          </select>
        </div>
        <ul>
          <li>
            Sollen dir beim Schreiben von Code mögliche Vorschläge gemacht werden?
            <toggle-button :labels="{checked: 'On'}" :value="codeHelp" @change="changeCodeHelp"/>
          </li>
        </ul>
        <li><b>Codeergänzungsaufgaben:</b> Ergänze vorgegeben Code anhand deines Wissens.</li>
        <li><b>Lückentextaufgaben:</b> Ziehe die richtigen Lösungen mit Drag&Drop in die Lücken.</li>
      </ul>
      <b>Schwierigkeitsgrad</b>
      <br>
      Du willst nur schwere oder leichte Aufgaben? Dann stelle hier den Schwierigkeitsgrad ein!
      <div class="selectDifficulty">
        <select v-model="levelOfDifficulty">
          <option value="ALL" selected>Alle</option>
          <option value="EASY">Leicht</option>
          <option value="MIDDLE">Mittel</option>
          <option value="HARD">Schwer</option>
        </select>
      </div>
      <b>Notizen</b>
      <br>
      Du möchtest Inhalte als Notizen speichern? Dann kannst du innerhalb eines Kapitels, eines Unterthemas, einer
      Aufgabe oder einer Informationseinheit den gewünschten Text markieren und auf das "Notiz erstellen" Pop-up
      klicken. Die Notizen kannst du dir über den Reiter "Meine Notizen" in der horizontalen Navigationsleite anschauen.
      <br>
      <br>
      <b>Probleme & Hilfe</b>
      <br>
      Falls du Hilfe bei einer Aufgabe brauchst, kannst du auf das Icon
      (<img title="Hilfe" alt="Hilfe" src="../../assets/hints.svg" height="24px" width="24px"
            style="padding-bottom: 4px">) klicken, um dir Hinweise anzeigen zu lassen.
      <br>
      Falls Aufgaben nicht funktionieren oder es andere Probleme gibt, kannst du dies dem Dozenten melden
      (<img title="Hilfe" alt="Hilfe" src="../../assets/report.png" height="24px" width="24px"
            style="padding-bottom: 4px">). Deine gemeldeten Probleme und Antworten kannst du dir über den Reiter
      "Gemeldete Probleme" anschauen.
      <br>
      <br>
      <b>Fortschritt</b>
      <br>
      Es wird gespeichert, ob du eine Aufgabe gelöst hast. Wenn du deinen kompletten Fortschritt oder den eines
      Kapitels zurücksetzen möchtest, kannst du auf das
      (<img title="Hilfe" alt="Hilfe" src="../../assets/reset.png" height="24px" width="24px"
            style="padding-bottom: 4px">) Icon klicken.
      <br>
      <br>
      <div class="startFirstChapter">
        <button v-on:click="goToFirstChapter()"> Schon kann's los gehen: Zum ersten Kapitel</button>
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