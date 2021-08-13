<template>
  <div class="chapterOverviewContainer">
    <title-header :title="chapter.chapterName" :lesson="null" resetText="Fortschritt dieses Kapitel zurücksetzen ?"
                  :resetChapter="resetChapter">
    </title-header>
    <div class="textContainer" ref="overViewText">
      <div class="overviewText" v-html="sanitizedChapterOverview">
      </div>
    </div>
    <div class="sections">
      <section-tile class="section hoverEffect" v-on:click.native="goToSection(section)"
                    v-for="section in chapter.sections"
                    :section="section"
                    :key="section.sectionId">
      </section-tile>
    </div>
  </div>
</template>

<script>

import SectionTile from "@/components/learn/sectionTile";
import TitleHeader from "@/components/learn/titleHeader";
import DOMPurify from "dompurify";

export default {
  name: 'chapterOverview',
  props: {
    chapter: Object,
    goToSection: Function,
    resetChapter: Function
  },
  components: {TitleHeader, SectionTile},
  computed: {
    sanitizedChapterOverview() {
      return DOMPurify.sanitize(this.chapter.overview)
    }
  },
  methods: {},
}
</script>
<style>
@import "../../assets/cssVariables.css";

.chapterOverviewContainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  margin-right: auto;
  margin-left: auto;
  overflow: scroll;
}

.overviewText img {
  max-width: 600px;
  max-height: 600px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  padding-top: 20px;
  padding-bottom: 20px;
}

.sections {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  flex-wrap: wrap;
}

.section:hover {
  cursor: pointer;
}

.section {
  position: relative;
  margin: 10px;
  display: block;
  min-height: 150px;
  max-height: 150px;
  min-width: 400px;
  width: 100px;
  background-color: var(--white);
  border: 1px solid black;
}

.textContainer {
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.overviewText {
  display: block;
  min-width: 700px;
  max-width: 1300px;
  background-color: var(--white);
  border: 1px solid black;
  border-radius: 2px;
  padding: 10px 10px 5px;
}
</style>