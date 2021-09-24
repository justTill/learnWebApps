import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userName: "", //TODO: reset to "default"
        ltiKey: "",
        notes: [],
        problems: [],
        chapters: [],
        difficultyLevel: "ALL",
        codeHelp: true,
        codeTheme: "LIGHT",
        errorMessage: "",
    },
    mutations: {
        setErrorMessage(state, message) {
            state.errorMessage = message
        },
        codeHelp(state, bool) {
            state.codeHelp = bool
        },
        setDifficultyLevel(state, level) {
            state.difficultyLevel = level
        },
        setCodeTheme(state, theme) {
            state.codeTheme = theme
        },
        setUserName(state, name) {
            state.userName = name
        },
        setLtiKey(state, key) {
            state.ltiKey = key
        },
        setNotes(state, notes) {
            state.notes = notes
        },
        setProblems(state, problems) {
            state.problems = problems
        },
        addProblem(state, problem) {
            state.problems.unshift(problem)
        },
        deleteProblem(state, problem) {
            state.problems.splice(state.problems.indexOf(problem), 1)
        },
        addAnswerToProblem(state, payload) {
            let index = state.problems.indexOf(payload.problem)
            state.problems[index].answers.push(payload.toBeAddedAnswer)
        },
        setChapters(state, chapters) {
            state.chapters = chapters
        },
        addNotes(state, note) {
            state.notes.push(note)
        },
        changeNote(state, payload) {
            state.notes[payload.index].note = payload.noteText
        },
        addNoteAtIndex(state, payload) {
            state.notes.splice(payload.index, 0, payload.note)
        },
        deleteNote(state, note) {
            state.notes.splice(state.notes.indexOf(note), 1)
        },
        updateLessonDone(state, payload) {
            if (payload.lessonIndex !== -1) {
                state.chapters[payload.chapterIndex]
                    .sections[payload.sectionIndex]
                    .lessons[payload.lessonIndex].done = payload.solved
                if (payload.userCode) {
                    state.chapters[payload.chapterIndex]
                        .sections[payload.sectionIndex]
                        .lessons[payload.lessonIndex].userCode = payload.userCode
                }
            }
        }
    },
    getters: {
        user: state => {
            return {
                userName: store.state.userName,
                isDefault: store.state.userName === "default"
            }
        },
        ltiKey: state => {
            return store.state.ltiKey
        },
        chapters: state => {
            return store.state.chapters
        },
        codeHelp: state => {
            return store.state.codeHelp
        },
        problems: state => {
            return store.state.problems
        },
        notes: state => {
            return store.state.notes
        },
        difficultyLevel: state => {
            return store.state.difficultyLevel
        },
        codeTheme: state => {
            return store.state.codeTheme
        },
        codeMirrorTheme: state => {
            return store.state.codeTheme
        },
        errorMessage: state => {
            return store.state.errorMessage
        }
    }
})