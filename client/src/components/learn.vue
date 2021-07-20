<template>
  <div class="content">
    <div id="createNotes" class="createNotes" v-on:click="saveMarkedTextAsNotes"> Notiz erstellen</div>
    <div id="notesSaved" class="noteSaved"> Notiz gespeichert &#10003;</div>
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
                      v-if="selectedChapter && !selectedSection && !selectedLesson"
                      :chapter="selectedChapter"
                      :go-to-section="goToSection"
                      :resetChapter="resetChapterLessons">
    </chapter-overview>

    <section-overview class="chapterContent"
                      v-else-if="selectedSection && !selectedLesson"
                      :section="selectedSection"
                      :gotToLesson="goToLesson">
    </section-overview>
    <lesson-view class="chapterContent"
                 v-else-if="selectedLesson"
                 :lesson="selectedLesson"
                 :previousLesson="previousLesson"
                 :nextLesson="nextLesson"
                 :goToLesson="goToLesson"
                 :lessonSolvedHandler="lessonSolvedHandlerForCurrentChapter">

    </lesson-view>
    <div v-else class="chapterContent">
      <title-header title="Informationen" :reset-chapter="resetLessonsSolved"
                    resetText="Alle Fortschritt zurücksetzen ?"></title-header>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChapterOverview from "@/components/learn/chapterOverview";
import SectionOverview from "@/components/learn/sectionOverview";
import NavButton from "@/components/utils/navButton";
import LessonView from "@/components/learn/lessonView";
import {backEndHost, backEndPort} from "@/envVariables";
import TitleHeader from "@/components/learn/titleHeader";

export default {
  name: 'learn',
  components: {TitleHeader, LessonView, ChapterOverview, SectionOverview, NavButton},
  data: function () {
    return {
      selectedChapter: null,
      selectedSection: null,
      selectedLesson: null,
      previousLesson: null,
      nextLesson: null,
      selectedText: ""
    }
  },
  computed: {
    ...mapGetters([
      'chapters',
      'user',
      'notes'
    ])
  },
  mounted() {
    document.addEventListener('mouseup', event => {
      this.$el.querySelector('#createNotes').style.display = "none";
      //check if in chapteroverview
      //or sectionor lessonview
      if (window.getSelection().toString() !== '' && this.$route.path.includes('learn')) {
        let element = this.$el.querySelector('#createNotes')
        element.style.display = "inline-block";
        element.style.left = event.pageX + "px"
        element.style.top = event.pageY - 100 + "px"
        this.selectedText = window.getSelection().toString();
      }
    })
  },
  methods: {
    saveMarkedTextAsNotes() {
      let note = {
        notesId: -1,
        note: this.selectedText
      }
      if (!this.user.isDefault) {
        this.$http.post("http://" + backEndHost + ":" + backEndPort + "/api/v1/users/notes/" + this.user.userId + "/" + this.user.userName, {note: this.selectedText})
            .then(res => {
              note.notesId = res.data.id
              this.$store.commit('addNotes', note)
            })
            .catch(err => {
              this.$store.commit('addNotes', note)
            })
      } else {
        this.$store.commit('addNotes', note)
      }
      this.displayNotesSaved();
      this.selectedText = "";
    },
    displayNotesSaved() {
      let element = this.$el.querySelector('#notesSaved')
      element.style.display = "block"
      setTimeout(() => {
        element.style.display = "none"
      }, 5000)
    },
    changeCurrentChapter(chapter) {
      this.selectedLesson = null
      this.selectedChapter = chapter
    },
    changeCurrentSection(section) {
      this.selectedLesson = null
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
    goToLesson(updatedLesson) {
      this.previousLesson = null;
      this.nextLesson = null;
      let currentLessonIndex = this.selectedSection.lessons.indexOf(updatedLesson)
      this.nextLesson = this.selectedSection.lessons[currentLessonIndex + 1]
      this.previousLesson = this.selectedSection.lessons[currentLessonIndex - 1]
      this.selectedLesson = updatedLesson
    },
    lessonSolvedHandlerForCurrentChapter(lessonId, solved, userCode) {
      let chapters = this.chapters
      let chapterIndex = chapters.indexOf(this.selectedChapter)
      let sectionIndex = chapters[chapterIndex].sections.indexOf(this.selectedSection)
      for (let i = 0; i < chapters[chapterIndex].sections[sectionIndex].lessons.length; i++) {
        if (lessonId) {
          if (chapters[chapterIndex].sections[sectionIndex].lessons[i].lessonId === lessonId) {
            let payload = {
              lessonIndex: i,
              chapterIndex: chapterIndex,
              sectionIndex: sectionIndex,
              solved: solved,
              userCode: userCode
            }
            this.$store.commit('updateLessonDone', payload)
          }
        } else {
          let payload = {
            lessonIndex: i,
            chapterIndex: chapterIndex,
            sectionIndex: sectionIndex,
            solved: solved
          }
          this.$store.commit('updateLessonDone', payload)
        }
      }
    },
    resetLessonsSolved() {
      if (this.user.isDefault) {
        for (let c = 0; c < this.chapters.length; c++) {
          for (let s = 0; s < this.chapters[c].sections.length; s++) {
            for (let l = 0; l < this.chapters[c].sections[s].lessons.length; l++) {
              this.$store.commit('updateLessonDone', {
                lessonIndex: l,
                chapterIndex: c,
                sectionIndex: s,
                solved: false
              })
            }
          }
        }
      } else {
        this.$http.delete("http://" + backEndHost + ":" + backEndPort + "/api/v1/lessons/lesson/solved/" + this.user.userId + "/" + this.user.userName)
            .then(response =>
                this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/chapters/")
                    .then(result => {
                      this.$store.commit("setChapters", result.data.chapters)
                    })
                    .catch(err => console.log(err)))
            .catch(err => console.log(err))
      }
    },
    resetChapterLessons() {
      if (this.user.isDefault) {
        this.lessonSolvedHandlerForCurrentChapter(null, false)
      } else {
        this.$http.delete("http://" + backEndHost + ":" + backEndPort + "/api/v1/lessons/lesson/solved/" + this.selectedChapter.chapterId + "/" + this.user.userId + "/" + this.user.userName)
            .then(response => {
              this.$http.get("http://" + backEndHost + ":" + backEndPort + "/api/v1/chapters/")
                  .then(result => {
                    this.selectedChapter = result.data.chapters.find(c => c.chapterId === this.selectedChapter.chapterId)
                    this.$store.commit("setChapters", result.data.chapters)
                  })
                  .catch(err => console.log(err))
            }).catch(err => console.log(err))
      }
    }
  }
}
</script>

<style>
.createNotes {
  position: absolute;
  z-index: 9999;
  display: none;
  margin: 40px;
  padding: 20px;
  background-color: #1a152d;
  color: white;
  border-radius: 5px;
}

.noteSaved {
  position: absolute;
  z-index: 9999;
  display: none;
  color: white;
  border-radius: 5px;
  bottom: 5px;
  padding: 10px;
  margin: 8px;
  width: 200px;
  text-align: center;
  background-color: rgb(48, 48, 48);
}

.createNotes:hover {
  cursor: pointer;
}

.content {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  height: 100%;
}

.chapterNavigation {
  flex-basis: 250px;
  flex-shrink: 0;
  height: 100%;
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
  width: 100%;
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
    display: none !important;
  }

  .chapterNavigation {
    display: block !important;
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
    width: 30px;
    height: 30px;
    border: 2px solid white;
  }

  .min-nav-button {
    display: inline;
    border: 2px solid black;
    margin: 20px auto;
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