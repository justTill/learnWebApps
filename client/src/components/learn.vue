<template>
  <div class="content">
    <div id="createNotes" class="createNotes" v-on:click="saveMarkedTextAsNotes"> Notiz erstellen</div>
    <div id="notesSaved" class="noteSaved" v-if="showSaveNote"> Notiz gespeichert &#10003;</div>
    <button class="min-nav-button" v-on:click="openOrCloseChapterNavigation" ref="navigationMenu"> Menu</button>
    <div class="chapterNavigation" ref="chapterNavigation">
      <div class="closeNavigationButton" v-on:click="openOrCloseChapterNavigation">&#10005;</div>
      <nav-button :onClickFunction="() => changeChapterAndSectionOnNavigationClick(null,null)"
                  class="navigationButton"
                  :name="'Home'"
                  ref="homeBtn">
      </nav-button>
      <div v-for="chapter in chapters" :key="chapter.chapterId">
        <nav-button class="navigationButton"
                    :onClickFunction="() => changeChapterAndSectionOnNavigationClick(chapter,null)"
                    :name="chapter.chapterName"
                    :ref="'chapter-'+chapter.chapterId"
                    :chapter="chapter">
        </nav-button>
        <nav-button class="navigationSectionButton"
                    :onClickFunction="() => changeChapterAndSectionOnNavigationClick(chapter,section)"
                    :name="section.sectionName"
                    v-if="selectedChapter && selectedChapter.chapterId === chapter.chapterId"
                    v-for="section in chapter.sections"
                    :ref="'section-'+section.sectionId"
                    :section="section">
        </nav-button>
      </div>
    </div>

    <chapter-overview class="chapterContent"
                      v-if="selectedChapter && !selectedSection && !selectedLesson"
                      :chapter="selectedChapter"
                      :goToSection="goToSection"
                      :goToChapter="goToChapter"
                      :resetChapter="resetChapterLessons">
    </chapter-overview>

    <section-overview class="chapterContent"
                      v-else-if="selectedSection && !selectedLesson"
                      :section="selectedSection"
                      :goToLesson="goToLesson">
    </section-overview>
    <lesson-view class="chapterContent"
                 v-else-if="selectedLesson"
                 :lesson="selectedLesson"
                 :previousLesson="previousLesson"
                 :currentLessonIndex="currentLessonIndex"
                 :numberOfLessons="numberOfLessons"
                 :nextLesson="nextLesson"
                 :goToLesson="goToLesson"
                 :goToLessonOverview="goToSection"
                 :lessonSolvedHandler="lessonSolvedHandlerForCurrentChapter">

    </lesson-view>
    <home v-else class="chapterContent" :resetAllLessons="resetLessonsSolved"></home>
    <div v-else class="chapterContent">
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChapterOverview from "@/components/learn/chapterOverview";
import SectionOverview from "@/components/learn/sectionOverview";
import Home from "@/components/learn/home";
import NavButton from "@/components/utils/navButton";
import LessonView from "@/components/learn/lessonView";
import {backEndUrl} from "@/envVariables";
import TitleHeader from "@/components/learn/titleHeader";
import utils from '../shared/utils'

export default {
  name: 'learn',
  components: {TitleHeader, LessonView, ChapterOverview, SectionOverview, NavButton, Home},
  data: function () {
    return {
      selectedChapter: null,
      selectedSection: null,
      selectedLesson: null,
      previousLesson: null,
      currentLessonIndex: null,
      numberOfLessons: null,
      nextLesson: null,
      selectedText: "",
      showNote: false,
    }
  },
  computed: {
    ...mapGetters([
      'chapters',
      'user',
      'notes',
      'ltiKey',
      'codeMirrorTheme',
      'difficultyLevel'
    ]),
    showSaveNote() {
      return this.showNote
    }
  },
  mounted() {
    this.$refs.homeBtn.isActive = true
    document.addEventListener('mouseup', event => {
      this.$el.querySelector('#createNotes').style.display = "none";
      let isHomePage = this.selectedSection === null && this.selectedChapter === null && this.selectedLesson === null
      if (window.getSelection().toString() !== '' && this.$route.path.includes('') && !this.user.isDefault && !isHomePage) {
        let classNames = window.getSelection().anchorNode.parentElement.className
        if (!classNames.includes('CodeMirror')) {
          let element = this.$el.querySelector('#createNotes')
          element.style.display = "inline-block";
          element.style.left = event.pageX + "px"
          element.style.top = event.pageY - 100 + "px"
          this.selectedText = window.getSelection().toString();
        }
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
        this.$http.post(backEndUrl + "/api/v1/users/notes/note/" + "?ltik=" + this.ltiKey, {note: this.selectedText}, {
          withCredentials: true
        }).then(res => {
          note.notesId = res.data.id
          this.$store.commit('addNotes', note)
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Die Notiz konnte leider nicht dauerhaft sondern nur temporär gespeichert werden, bitte versuchen Sie es später erneut"
          this.$store.commit('setErrorMessage', errorMessage)
          this.$store.commit('addNotes', note)
        })
      } else {
        this.$store.commit('addNotes', note)
      }
      this.showNote = true
      setTimeout(() => {
        this.showNote = false
      }, 4000)
      this.selectedText = "";
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
    goToChapter(chapter) {
      this.changeChapterAndSectionOnNavigationClick(chapter, null)
      this.$refs['chapter-' + chapter.chapterId][0].isActive = true;
    },
    goToSection(section) {
      if (section === null) {
        section = this.selectedSection
      }
      this.changeChapterAndSectionOnNavigationClick(this.selectedChapter, section)
      this.$refs['section-' + section.sectionId][0].isActive = true;
    },
    goToLesson(updatedLesson) {
      this.previousLesson = null;
      this.nextLesson = null;
      let filteredLessons = utils.lessonsForDifficulty.bind(this)(this.selectedSection)
      this.numberOfLessons = filteredLessons.length
      this.currentLessonIndex = filteredLessons.indexOf(updatedLesson)
      this.nextLesson = filteredLessons[this.currentLessonIndex + 1]
      this.previousLesson = filteredLessons[this.currentLessonIndex - 1]
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
      if (!this.user.isDefault) {
        this.$http.delete(backEndUrl + "/api/v1/lessons/lesson/solved/" + "?ltik=" + this.ltiKey, {
          withCredentials: true
        }).then(response => {
          return
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Alle Kapitel konnte nur bis zu einem neuen laden der Seite zurückgesetzt werden. Versuchen Sie bitte später erneut die Kapitel zurückzusetzten"
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
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
    },
    resetChapterLessons() {
      if (!this.user.isDefault) {
        this.$http.delete(backEndUrl + "/api/v1/lessons/lesson/solved/" + this.selectedChapter.chapterId + "/" + "?ltik=" + this.ltiKey, {
          withCredentials: true
        }).then(response => {
          return
        }).catch(err => {
          let errorMessage = "Es ist ein unerwarteter Fehler aufgetreten. Das Kapitel konnte nur bis zu einem neuen laden der Seite zurückgesetzt werden. Versuchen Sie bitte später erneut das Kapitel zurückzusetzten"
          this.$store.commit('setErrorMessage', errorMessage)
        })
      }
      let chapterIndex = this.chapters.indexOf(this.selectedChapter)
      for (let sectionIndex = 0; sectionIndex < this.chapters[chapterIndex].sections.length; sectionIndex++) {
        for (let lessonIndex = 0; lessonIndex < this.selectedChapter.sections[sectionIndex].lessons.length; lessonIndex++) {
          let payload = {
            lessonIndex: lessonIndex,
            chapterIndex: chapterIndex,
            sectionIndex: sectionIndex,
            solved: false
          }
          this.$store.commit('updateLessonDone', payload)
        }
      }
    }
  }
}
</script>
<style>
@import "../assets/cssVariables.css";

.createNotes {
  position: absolute;
  z-index: 9999;
  display: none;
  margin: 40px;
  padding: 20px;
  background-color: var(--davys-grey);
  text-decoration: underline;
  color: var(--white);
  border-radius: 5px;
}

.noteSaved {
  position: absolute;
  z-index: 9999;
  color: var(--white);
  border-radius: 5px;
  bottom: 5px;
  padding: 10px;
  margin: 8px;
  width: 200px;
  text-align: center;
  background-color: var(--davys-grey);
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
  background-color: var(--darker-blue);
  overflow: auto;
}

.navigationButton, .navigationSectionButton {
  display: block;
  cursor: pointer;
  padding: 0px 24px 0;
  margin-top: 5px;
  min-height: 35px;
  font-size: large;
  overflow-wrap: break-word;
}

.navigationSectionButton {
  margin-left: 20px;
  font-size: medium;
}

.chapterContent {
  overflow: auto;
  height: 90%;
  width: 100%;
}

.navigationButton:hover, .navigationSectionButton:hover {
  color: var(--white);
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
    color: var(--white) !important;
  }

  .closeNavigationButton {
    display: inline-block;
    cursor: pointer;
    color: var(--white);
    text-align: center;
    padding-bottom: 5px;
    font-size: 20px;
    float: right;
    margin: 20px;
    width: 30px;
    height: 30px;
    border: 2px solid var(--white);
  }

  .min-nav-button {
    display: inline;
    border: 2px solid black;
    margin: 20px auto;
    min-width: 400px;
    height: 30px;
    background-color: var(--beige);
    transition-duration: 0.4s;
    border-radius: 8px;
  }

  .min-nav-button:hover {
    cursor: pointer;
    background-color: var(--platinum);
  }

  .content {
    flex-direction: column;
  }
}
</style>