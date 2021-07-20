import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state: {
        userId: -1,
        userName: "default",
        notes: [],
        problems: [],
        chapters: []
    },
    mutations: {
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
        setChapters(state, chapters) {
            state.chapters = chapters
        },
        addNotes(state, note) {
            state.notes.push(note)
        },
        addProblem(state, problem) {
            state.problems.push(problem)
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
        }
    }
})