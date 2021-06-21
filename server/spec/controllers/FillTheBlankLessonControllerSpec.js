var sectionRoutes = require("../../controller/SectionController")
var fillTheBlankLessonRoutes = require("../../controller/FillTheBlankLessonController")
var firstSectionToChapterOne = require('../support/cannedData').firstSectionToChapterOne
var secondSectionToChapterOne = require('../support/cannedData').secondSectionToChapterOne
var classSectionTwoLessonOne = require('../support/cannedData').classSectionTwoLessonOne

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("FillTheBlank: ", function () {
    it("Lessons can be edited with correct data (editFillTheBlankLesson)", async function () {
    });
    it("Lessons can be created and Deleted (saveNewFillTheBlankLesson / deleteFillTheBlankLesson )", async function () {
    });
});