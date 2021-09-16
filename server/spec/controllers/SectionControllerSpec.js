var sectionRoutes = require("../../controller/SectionController")
var chapterRoutes = require("../../controller/ChapterController")
var firstChapter = require('../support/cannedData').firstChpater
var firstSectionToChapterOne = require('../support/cannedData').firstSectionToChapterOne
var secondSectionToChapterOne = require('../support/cannedData').secondSectionToChapterOne
var secondChapter = require('../support/cannedData').secondChapter

describe("SectionController: ", function () {
    it("Sections can be edited with correct data (editSection)", async function () {
        let request = {
            params: {
                chapterId: firstSectionToChapterOne.chapterId,
                sectionId: firstSectionToChapterOne.id
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
        await sectionRoutes.editSection(request, response)
        expect(response.viewName).toBe("sections/editSection");
        expect(response.data.section.name).toEqual(firstSectionToChapterOne.name);
        expect(response.data.codingLessons).not.toEqual(undefined);
        expect(response.data.fillTheBlankLessons).not.toEqual(undefined);
        expect(response.data.codeExtensionLessons).not.toEqual(undefined);
        expect(response.data.singleMultipleChoiceLessons).not.toEqual(undefined);
        expect(response.data.files[0].path).toEqual("myImagePath");
    });
    it("Section can be created and Deleted (saveNewSection / deleteSection )", async function () {
        let request = {
            body: {
                chapterId: firstSectionToChapterOne.id,
                sectionName: "Neuer name",
                information: "Neue Informationen",
                sectionNumber: firstSectionToChapterOne.sectionnumber,
            }
        };
        let response = {
            viewName: ""
            , data: {}
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        //create section with error
        await sectionRoutes.saveNewSection(request, response)
        expect(response.data.error).toContain('Unterthemanummer ist schon vergeben');
        //create section without error
        request.body.sectionNumber = 10 //definitely free
        await sectionRoutes.saveNewSection(request, response)
        expect(response.path).toContain('/chapter/' + firstSectionToChapterOne.chapterId);
        //section was created
        request.params = {}
        request.params.id = firstSectionToChapterOne.chapterId
        await chapterRoutes.editChapter(request, response)
        expect(response.data.sections.length).toEqual(3);

        //delete created chapter
        request.params.sectionId = response.data.sections[2].id
        request.params.chapterId = response.data.sections[2].chapterId
        await sectionRoutes.deleteSection(request, response)
        await chapterRoutes.editChapter(request, response)
        expect(response.data.sections.length).toEqual(2);

    });
    it("Sections can be edited and saved (saveEditedSection)", async function () {
        let request = {
            body: {
                sectionName: firstSectionToChapterOne.name,
                information: firstSectionToChapterOne.information,
                sectionNumber: firstSectionToChapterOne.sectionnumber,
                updatedSectionNumber: firstSectionToChapterOne.sectionnumber,
                chapterId: firstSectionToChapterOne.chapterId,
                currentChapterId: firstSectionToChapterOne.chapterId,
                sectionId: firstSectionToChapterOne.id,
            }
        };
        let response = {
            viewName: ""
            , data: {},
            path: ""
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        //Change sectionNumber
        request.body.updatedSectionNumber = 12 //definitely free
        await sectionRoutes.saveEditedSection(request, response)
        expect(response.path).toBe("/chapter/" + firstChapter.id);
        //check if section number changed
        request.params = {}
        request.params.chapterId = firstSectionToChapterOne.chapterId
        request.params.sectionId = firstSectionToChapterOne.id
        await sectionRoutes.editSection(request, response)
        expect(response.data.section.sectionnumber).toBe(request.body.updatedSectionNumber);
        expect(response.viewName).toBe('sections/editSection');
        response.path = ""
        response.data = {}

        //TODO
        //change chapter with Section updated Number
        request.body.chapterId = secondChapter.id
        await sectionRoutes.saveEditedSection(request, response)
        expect(response.path).toBe("/chapter/" + secondChapter.id);
        response.path = ""
        //check if section is in different chapter
        request.params.chapterId = secondChapter.chapterId
        request.params.sectionId = firstSectionToChapterOne.id
        await sectionRoutes.editSection(request, response)

        expect(response.data.section.chapterid).toBe(secondChapter.id);
        expect(response.viewName).toBe('sections/editSection');

        //change everything back
        request.body.updatedSectionNumber = firstSectionToChapterOne.sectionnumber //definitely free for chapter two
        request.body.chapterId = firstChapter.id
        await sectionRoutes.saveEditedSection(request, response)
        expect(response.path).toBe("/chapter/" + firstChapter.id);

    });
    it("Saving Edited section with invalid data shows errors (saveEditedChapter)", async function () {
        let request = {
            body: {
                sectionName: firstSectionToChapterOne.name,
                information: firstSectionToChapterOne.information,
                sectionNumber: firstSectionToChapterOne.sectionnumber,
                updatedSectionNumber: firstSectionToChapterOne.sectionnumber,
                chapterId: firstSectionToChapterOne.chapterId,
                currentChapterId: firstSectionToChapterOne.chapterId,
                sectionId: firstSectionToChapterOne.id,
            }
        };
        let response = {
            viewName: ""
            , data: {},
            path: ""
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        //section number in same Chapter is already taken
        request.body.updatedSectionNumber = secondSectionToChapterOne.sectionnumber
        await sectionRoutes.saveEditedSection(request, response)
        expect(response.viewName).toContain('sections/editSection');
        expect(response.data.error).toContain('Unterthemanummer ist schon vergeben');
        //change request do default
        request.body.updatedSectionNumber = firstSectionToChapterOne.sectionnumber
        response.path = null
        response.data = null

        //change chapter where section number is already taken
        request.body.chapterId = secondChapter.id;
        await sectionRoutes.saveEditedSection(request, response)
        expect(response.viewName).toContain('sections/editSection');
        expect(response.data.error).toContain('Unterthemanummer ist schon vergeben');

    });
});