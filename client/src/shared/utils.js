export default {
    lessonsForDifficulty: function (section) {
        return this.difficultyLevel === "ALL" || this.difficultyLevel === null ? section.lessons : section.lessons.filter(l => l.type === 'information' || l.difficultyLevel === this.difficultyLevel || l.difficultyLevel === 'ALL')

    }
}