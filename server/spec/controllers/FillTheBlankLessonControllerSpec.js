var sectionRoutes = require("../../controller/SectionController")
var fillTheBlankLessonRoutes = require("../../controller/FillTheBlankLessonController")
var firstSectionToChapterOne = require('../support/cannedData').firstSectionToChapterOne
var secondSectionToChapterOne = require('../support/cannedData').secondSectionToChapterOne
var classSectionOneLessonTwo = require('../support/cannedData').classSectionOneLessonTwo

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("FillTheBlank: ", function () {
    it("Lessons can be edited with correct data (editFillTheBlankLesson)", async function () {
        let request = {
            params: {
                chapterId: secondSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonTwo.sectionid,
                lessonId: classSectionOneLessonTwo.id
            }
        };
        let response = {
            viewName: ""
            , data: {}
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }
        };
        await fillTheBlankLessonRoutes.editFillTheBlankLesson(request, response)
        expect(response.viewName).toEqual("lessons/editFillTheBlankLesson")
        expect(response.data.fillTheBlankLesson.name).toEqual(classSectionOneLessonTwo.name)
        expect(response.data.chapterId).toEqual(secondSectionToChapterOne.chapterId)
        expect(response.data.sectionId).toEqual(classSectionOneLessonTwo.sectionid)
    });
    it("Lessons can be created and Deleted (saveNewFillTheBlankLesson / deleteFillTheBlankLesson )", async function () {
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonTwo.sectionid,
                lessonId: classSectionOneLessonTwo.id,
                lessonName: "Neuer Name",
                lessonNumber: 12,
                lessonInformation: "Informationen",
                textWithBlanks: "[input]",
                possibleAnswers: "first answer \n second answer",
                answers: "first answer",
            }
        };
        let response = {
            viewName: ""
            , data: {}
            , path: ""
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        request.params = {}
        request.params.chapterId = secondSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonTwo.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.fillTheBlankLessons.length).toEqual(1)
        response.data = {}
        response.viewName = ""
        response.path = ""
        await fillTheBlankLessonRoutes.saveCreateFillTheBlankLesson(request, response)
        expect(response.path).toEqual('/section/' + firstSectionToChapterOne.chapterId + '/' + classSectionOneLessonTwo.sectionid)
        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonTwo.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.fillTheBlankLessons.length).toEqual(2)
        /*

        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        request.params.lessonId = response.data.fillTheBlankLesson[1].lessonid
        await fillTheBlankLessonRoutes.deleteLesson(request, response)

        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.codingLessons.length).toEqual(1)*/
    });
});