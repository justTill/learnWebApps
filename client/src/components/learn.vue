<template>
  <div class="content">
    <button class="min-nav-button" v-on:click="openOrCloseChapterNavigation" ref="navigationMenu"> Menu</button>
    <div class="chapterNavigation" ref="chapterNavigation">
      <div class="closeNavigationButton" v-on:click="openOrCloseChapterNavigation">&#10005;</div>
      <nav-button :onClickFunction="() => changeChapterAndSectionOnNavigationClick(null,null)"
                  class="navigationButton"
                  :name="'Home'">
      </nav-button>
      <div v-for="chapter in chapters" :key="chapter.chapterId">
        <nav-button class="navigationButton"
                    :onClickFunction="() => changeChapterAndSectionOnNavigationClick(chapter,null)"
                    :name="chapter.chapterName">
        </nav-button>
        <nav-button class="navigationSectionButton"
                    :onClickFunction="() => changeChapterAndSectionOnNavigationClick(chapter,section)"
                    :name="section.sectionName"
                    v-if="selectedChapter && selectedChapter.chapterId === chapter.chapterId"
                    v-for="section in chapter.sections"
                    :ref="'section-'+section.sectionId ">
        </nav-button>
      </div>
    </div>

    <chapter-overview class="chapterContent"
                      v-if="selectedChapter && !selectedSection"
                      :chapter="selectedChapter"
                      :go-to-section="goToSection">
    </chapter-overview>

    <section-overview class="chapterContent"
                      v-else-if="selectedSection"
                      :section="selectedSection"
                      :gotToLesson="goToLesson">
    </section-overview>

    <div v-else class="chapterContent">
      <h1> Default Informationen</h1>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChapterOverview from "@/components/learn/chapterOverview";
import SectionOverview from "@/components/learn/sectionOverview";
import NavButton from "@/components/utils/navButton";

export default {
  name: 'learn',
  components: {ChapterOverview, SectionOverview, NavButton},
  data: function () {
    return {
      selectedChapter: null,
      selectedSection: null,
    }
  },
  computed: {
    ...mapGetters([
      'chapters'
    ])
  },
  methods: {
    changeCurrentChapter(chapter) {
      this.selectedChapter = chapter
    },
    changeCurrentSection(section) {
      this.selectedSection = section
    },
    changeChapterAndSectionOnNavigationClick(chapter, section) {
      this.inactiveAllButtons()
      this.changeCurrentSection(section)
      this.changeCurrentChapter(chapter)
    },
    inactiveAllButtons() {
      let buttons = this.$children.filter(c => {
        return c.hasOwnProperty('isActive')
      })
      for (let button of buttons) {
        button.isActive = false;
      }
    },
    openOrCloseChapterNavigation() {
      if (this.$refs['chapterNavigation'].style.display === 'none' || this.$refs['chapterNavigation'].style.display === '') {
        this.$refs['navigationMenu'].style.display = 'none'
        this.$refs['chapterNavigation'].style.display = 'inline-block'
      } else {
        this.$refs['navigationMenu'].style.display = 'block'
        this.$refs['chapterNavigation'].style.display = 'none'
      }
    },
    goToSection(section) {
      this.changeChapterAndSectionOnNavigationClick(this.selectedChapter, section)
      this.$refs['section-' + section.sectionId][0].isActive = true;
    },
    goToLesson(lesson) {
      console.log(lesson)
    }
  }
}
</script>

<style>
.content {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
}

.chapterNavigation {
  flex-basis: 250px;
  flex-shrink: 0;
  height: 90%;
  background-color: #1a152d;
  overflow: auto;
}

.navigationButton, .navigationSectionButton {
  display: block;
  cursor: pointer;
  padding: 0px 24px 0;
  margin-top: 5px;
  min-height: 35px;
  color: #e0e0e0;
  font-size: large;
  overflow-wrap: break-word;
}

.navigationSectionButton {
  margin-left: 10px;
  font-size: medium;
}

.chapterContent {
  overflow: auto;
  height: 90%;
}

.navigationButton:hover, .navigationSectionButton:hover {
  color: white;
}

.min-nav-button {
  display: none;
}

.closeNavigationButton {
  display: none;
}

@media only screen and (min-width: 1000px) {
  .min-nav-button {
    display: none;
  }
}

@media only screen and (max-width: 1000px) {
  .chapterNavigation {
    display: none;
    height: 500px;

  }

  .navigationButton:hover, .navigationSectionButton:hover {
    color: white !important;
  }

  .closeNavigationButton {
    display: inline-block;
    cursor: pointer;
    color: white;
    text-align: center;
    padding-bottom: 5px;
    font-size: 20px;
    float: right;
    margin: 20px;
    width: 25px;
    height: 20px;
    border: 2px solid white;
  }

  .min-nav-button {
    display: inline;
    border: 2px solid black;
    margin-top: 20px;
    margin-left: auto;
    margin-right: auto;
    min-width: 400px;
    height: 30px;
    background-color: #f7f3eb;
    transition-duration: 0.4s;
    border-radius: 8px;
  }

  .min-nav-button:hover {
    cursor: pointer;
    background-color: #dee3e2;
  }

  .content {
    flex-direction: column;
  }
}
</style>