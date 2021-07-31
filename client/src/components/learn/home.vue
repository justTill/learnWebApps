<template>
  <div>
    <title-header title="Informationen" :reset-chapter="resetAllLessons"
                  resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    <div class="Was kann man machen">
      <h1> What</h1>
      Eine Lernumgebung zum üben was man im Praktium und in der Vorlesung gelernt hat
      <br>
      kann auch zu klausirvorbereitung benutzt werden
      GIF wie man Notizen macht
      GIF Auf Probelme Antworten ??
      Muss sonst noch was erklärt werden ?
    </div>
    <div class="settings">
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
    <div class="hints">
      <h1> Hinweise</h1>
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

</style>