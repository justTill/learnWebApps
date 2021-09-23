<template>
  <div class="chapterOverviewContainer">
    <title-header :title="chapter.chapterName" :lesson="null" resetText="Fortschritt dieses Kapitel zurücksetzen ?"
                  :resetChapter="resetChapter">
    </title-header>
    <div class="chapterArrangement">
      <div class="navigateToChapter hoverEffect" v-if="hasPrevChapter">
        <img src="../../assets/skip-prev.svg" width="30px" height="30px" v-b-tooltip.hover.lefttop
             title="zum vorherigen Kapitel" v-on:click="prevChapter">
      </div>
      <div class="chapterContentOverview">
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
      <div class="navigateToChapter hoverEffect" v-if="hasNextChapter">
        <img src="../../assets/skip-next.svg" width="30px" height="30px" v-b-tooltip.hover.lefttop
             title="zum nächsten Kapitel" v-on:click="nextChapter">
      </div>
    </div>
  </div>
</template>

<script>

import SectionTile from "@/components/learn/sectionTile";
import TitleHeader from "@/components/learn/titleHeader";
import DOMPurify from "dompurify";
import {mapGetters} from "vuex";

export default {
  name: 'chapterOverview',
  props: {
    chapter: Object,
    goToSection: Function,
    goToChapter: Function,
    resetChapter: Function,
  },
  components: {TitleHeader, SectionTile},
  computed: {
    ...mapGetters([
      'chapters'
    ]),
    sanitizedChapterOverview() {
      return DOMPurify.sanitize(this.chapter.overview)
    },
    hasPrevChapter() {
      let index = this.chapters.indexOf(this.chapter)
      return this.chapters[index - 1]

    },
    hasNextChapter() {
      let index = this.chapters.indexOf(this.chapter)
      return this.chapters[index + 1]
    }
  },
  methods: {
    nextChapter() {
      this.goToChapter(this.chapters[this.chapters.indexOf(this.chapter) + 1])
    },
    prevChapter() {
      this.goToChapter(this.chapters[this.chapters.indexOf(this.chapter) - 1])
    },
  },
}
</script>
<style>
@import "../../assets/cssVariables.css";

.chapterOverviewContainer {
  display: flex;
  align-content: center;
  flex-direction: column;
  overflow: scroll;
}

.chapterArrangement {
  align-items: center;
  display: flex;
  align-content: center;
  flex-direction: row;
  margin-left: auto;
  margin-right: auto;
}

.navigateToChapter {
  margin: 10px;
  display: block;
  width: 30px;
  height: 30px;
  background-color: var(--white);
  border: 1px solid black;
}

.chapterContentOverview {
  display: flex;
  align-content: center;
  flex-direction: column;
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