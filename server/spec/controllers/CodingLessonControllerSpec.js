var sectionRoutes = require("../../controller/SectionController")
var chapterRoutes = require("../../controller/ChapterController")
var codingLessonRoutes = require("../../controller/CodingLessonController")
var firstChapter = require('../support/cannedData').firstChpater
var firstSectionToChapterOne = require('../support/cannedData').firstSectionToChapterOne
var secondSectionToChapterOne = require('../support/cannedData').secondSectionToChapterOne
var classSectionOneLessonOne = require('../support/cannedData').classSectionOneLessonOne
var classSectionOneLessonTwo = require('../support/cannedData').classSectionOneLessonTwo
var classSectionTwoLessonOne = require('../support/cannedData').classSectionTwoLessonOne
var secondChapter = require('../support/cannedData').secondChapter

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

describe("CodingLessonController: ", function () {
    it("Lessons can be edited with correct data (editSection)", async function () {
        let request = {
            params: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid,
                lessonId: classSectionOneLessonOne.id
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
        await codingLessonRoutes.editCodingLesson(request, response)
        expect(response.viewName).toEqual("lessons/editCodingLesson")
        expect(response.data.codingLesson.name).toEqual(classSectionOneLessonOne.name)
        expect(response.data.chapterId).toEqual(firstSectionToChapterOne.chapterId)
        expect(response.data.sectionId).toEqual(classSectionOneLessonOne.sectionid)
    });
    it("Lessons can be created and Deleted (saveNewSection / deleteSection )", async function () {
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid,
                lessonId: classSectionOneLessonOne.id,
                lessonName: "Neuer Name",
                lessonNumber: 12,
                lessonInformation: "Informationen",
                verificationtype: "SELF",
                examplesolution: "Solution",
                verificationCode: "Code",
                verificationInformation: "Informationen für den Nutzer, was geprüft wird",
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
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.codingLessons.length).toEqual(1)

        await codingLessonRoutes.saveCreateCodingLesson(request, response)
        expect(response.path).toEqual('/section/' + firstSectionToChapterOne.chapterId + '/' + classSectionOneLessonOne.sectionid)

        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.codingLessons.length).toEqual(2)

        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        request.params.lessonId = response.data.codingLessons[1].lessonid
        await codingLessonRoutes.deleteLesson(request, response)

        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        await sectionRoutes.editSection(request, response)
        expect(response.data.codingLessons.length).toEqual(1)
    });
    it("Creating Lessons with an existing lessonnumber throws an error (saveNewSection)", async function () {
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid,
                lessonId: classSectionOneLessonOne.id,
                lessonName: "Neuer Name",
                lessonNumber: classSectionOneLessonTwo.lessonnumber,
                lessonInformation: "Informationen",
                verificationtype: "SELF",
                examplesolution: "Solution",
                verificationCode: "Code",
                verificationInformation: "Informationen für den Nutzer, was geprüft wird",
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
        await codingLessonRoutes.saveCreateCodingLesson(request, response)
        expect(response.data.error).toContain('Aufgaben Nummer ist schon vergeben')

    });
    it("Saving an edited Lesson with different lessonnumber works and shows correct data", async function () {
        let codingLessonRequest = {
            params: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid
            }
        }
        let codingLessonResponse = {
            viewName: ""
            , data: {}
            , path: ""
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        }
        await sectionRoutes.editSection(codingLessonRequest, codingLessonResponse)
        let codingLessonId = codingLessonResponse.data.codingLessons[0].id
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid,
                updatedSectionId: classSectionOneLessonOne.sectionid,
                lessonId: classSectionOneLessonOne.id, //
                codingLessonId: codingLessonId,
                lessonName: classSectionOneLessonOne.name,
                updatedLessonNumber: 12,
                lessonNumber: classSectionOneLessonOne.lessonnumber,
                lessonInformation: "neue Informationen",
                verificationType: classSectionOneLessonOne.verificationtype,
                exampleSolution: classSectionOneLessonOne.examplsolution,
                verificationCode: classSectionOneLessonOne.verificationcode,
                verificationInformation: classSectionOneLessonOne.verificationinformation,
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
        await codingLessonRoutes.saveEditCodingLesson(request, response)
        expect(response.path).toEqual('/section/' + firstSectionToChapterOne.chapterId + '/' + classSectionOneLessonOne.sectionid)
        //check if data changed
        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = classSectionOneLessonOne.sectionid
        request.params.lessonId = classSectionOneLessonOne.id
        await codingLessonRoutes.editCodingLesson(request, response)
        expect(response.data.codingLesson.lessonnumber).toEqual(12)
        expect(response.data.codingLesson.information).toEqual("neue Informationen")
        //change back
        let requestChangeBack = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: response.data.codingLesson.sectionid,
                updatedSectionId: response.data.codingLesson.sectionid,
                lessonId: response.data.codingLesson.lessonid, //
                codingLessonId: response.data.codingLesson.id,
                lessonName: response.data.codingLesson.name,
                updatedLessonNumber: classSectionOneLessonOne.lessonnumber,
                lessonNumber: response.data.codingLesson.lessonnumber,
                lessonInformation: classSectionOneLessonOne.information,
                verificationType: response.data.codingLesson.verificationtype,
                exampleSolution: response.data.codingLesson.examplesolution,
                verificationCode: response.data.codingLesson.verificationcode,
                verificationInformation: response.data.codingLesson.verificationinformation,
            }
        };
        response = {
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
        await codingLessonRoutes.saveEditCodingLesson(requestChangeBack, response)
        requestChangeBack.body = {}
        requestChangeBack.params = {}
        requestChangeBack.params.chapterId = firstSectionToChapterOne.chapterId
        requestChangeBack.params.sectionId = classSectionOneLessonOne.sectionid
        requestChangeBack.params.lessonId = classSectionOneLessonOne.id
        response = {
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
        await sleep(1000)
        await codingLessonRoutes.editCodingLesson(requestChangeBack, response)
        expect(response.data.codingLesson.lessonnumber).toEqual(classSectionOneLessonOne.lessonnumber)
        expect(response.data.codingLesson.information).toEqual(classSectionOneLessonOne.information)
    });
    it("Trying so save an edited Lesson to different Section with lessonnumber taken shows an error", async function () {
        let codingLessonRequest = {
            params: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid
            }
        }
        let codingLessonResponse = {
            viewName: ""
            , data: {}
            , path: ""
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        }
        await sectionRoutes.editSection(codingLessonRequest, codingLessonResponse)
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: classSectionOneLessonOne.sectionid,
                lessonId: classSectionOneLessonOne.id,
                updatedSectionId: classSectionTwoLessonOne.sectionid,
                codingLessonId: codingLessonResponse.data.codingLessons[0].id,
                lessonName: classSectionOneLessonOne.name,
                updatedLessonNumber: classSectionOneLessonOne.lessonnumber,
                lessonNumber: classSectionOneLessonOne.lessonnumber,
                lessonInformation: classSectionOneLessonOne.information,
                verificationType: classSectionOneLessonOne.verificationtype,
                exampleSolution: classSectionOneLessonOne.examplsolution,
                verificationCode: classSectionOneLessonOne.verificationcode,
                verificationInformation: classSectionOneLessonOne.verificationinformation,
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
        await codingLessonRoutes.saveEditCodingLesson(request, response)
        expect(response.viewName).toEqual("lessons/editCodingLesson")
        expect(response.data.error).toContain("Aufgabennummer ist schon vergeben")
        response.viewName = ""
        response.data = {}
        //correct section id
        request.body.updatedSectionId = classSectionOneLessonOne.sectionid
        request.body.updatedLessonNumber = classSectionOneLessonTwo.lessonnumber
        await codingLessonRoutes.saveEditCodingLesson(request, response)
        expect(response.viewName).toEqual("lessons/editCodingLesson")
        expect(response.data.error).toContain("Aufgabennummer ist schon vergeben")

    });
});