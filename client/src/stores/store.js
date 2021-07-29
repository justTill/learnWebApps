import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userId: -1,
        userName: "default",
        notes: [],
        problems: [],
        chapters: [],
        difficultyLevel: "ALL",
        codeMirrorTheme: "DARK",
        errorMessage: "",
    },
    mutations: {
        setErrorMessage(state, message) {
            state.errorMessage = message
        },
        setDifficultyLevel(state, level) {
            state.difficultyLevel = level
        },
        setCodeMirrorTheme(state, theme) {
            state.codeMirrorTheme = theme
        },
        setUserId(state, id) {
            state.userId = id
        },
        setUserName(state, name) {
            state.userName = name
        },
        setNotes(state, notes) {
            state.notes = notes
        },
        setProblems(state, problems) {
            state.problems = problems
        },
        addProblem(state, problem) {
            state.problems.push(problem)
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
                userId: store.state.userId,
                userName: store.state.userName,
                isDefault: store.state.userId === -1 && store.state.userName === "default"
            }
        },
        chapters: state => {
            return store.state.chapters
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
        codeMirrorTheme: state => {
            return store.state.codeMirrorTheme
        },
        errorMessage: state => {
            return store.state.errorMessage
        }
    }
})