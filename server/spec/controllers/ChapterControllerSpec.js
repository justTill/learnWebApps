var chapterRoutes = require("../../controller/ChapterController")
var firstChapter = require('../support/cannedData').firstChpater
var secondChapter = require('../support/cannedData').secondChapter

describe("ChapterController: ", function () {
    it("Chapters will be Displayed (showChapterOverview)", async function () {
        let request = {};
        let response = {
            viewName: ""
            , data: {}
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }
        };
        await chapterRoutes.showChapterOverview(request, response)
        expect(response.viewName).toBe("chapters/chapter");
        expect(response.data.chapters.length).toEqual(2);
        expect(response.data.chapters[0].name).toEqual(firstChapter.name);
    });
    it("Create Chapter (saveNewChapter)", async function () {
        let request = {
            body: {
                chapterName: "neues Kapitel",
                overview: "overview",
                chapterNumber: 1,
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
        await chapterRoutes.saveNewChapter(request, response)
        expect(response.data.error).toContain('Kapitelnummer ist schon vergeben');
        request.body.chapterNumber = 7;
        await chapterRoutes.saveNewChapter(request, response)
        expect(response.path).toEqual('/chapter');

        await chapterRoutes.showChapterOverview(request, response)
        expect(response.data.chapters.length).toEqual(3);

        request = {
            params: {
                id: response.data.chapters[2].id,
            }
        };
        response = {
            viewName: ""
            , data: {}
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        await chapterRoutes.deleteChapter(request, response)
        expect(response.path).toEqual('/chapter');

        await chapterRoutes.showChapterOverview(request, response)
        expect(response.data.chapters.length).toEqual(2);
    });
    it("Sections and files are there when editing chapter (editChapter)", async function () {
        let request = {
            params: {
                id: 1,
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
        await chapterRoutes.editChapter(request, response)
        expect(response.viewName).toBe("chapters/editChapter");
        expect(response.data.sections.length).toEqual(2);
        expect(response.data.sections[0].name).toEqual("Konstruktoren");
        expect(response.data.files[0].path).toEqual("myImagePath");
    });

    it("Saving edited chapter works correctly (saveEditedChapter)", async function () {
        let request = {
            body: {
                chapterId: firstChapter.id,
                chapterName: "newName",
                overview: firstChapter.overview,
                chapterNumber: firstChapter.chapternumber,
                updatedChapterNumber: 11,
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
        //save new name and chapternumber
        await chapterRoutes.saveEditedChapter(request, response)
        expect(response.path).toBe("/chapter");

        //check if saved
        request.params = {}
        request.params.id = firstChapter.id
        await chapterRoutes.editChapter(request, response)
        expect(response.data.chapter.name).toEqual("newName");
        expect(response.data.chapter.chapternumber).toEqual(11);
        //change everything back
        request = {
            body: {
                chapterId: firstChapter.id,
                chapterName: firstChapter.name,
                overview: firstChapter.overview,
                chapterNumber: 11,
                updatedChapterNumber: firstChapter.chapternumber,
            }
        };
        response = {
            viewName: ""
            , data: {}
            , render: function (view, viewData) {
                this.viewName = view;
                this.data = viewData;
            }, redirect: function (path) {
                this.path = path;
            }
        };
        await chapterRoutes.saveEditedChapter(request, response)
        expect(response.path).toBe("/chapter");
        //check if changed back
        request.params = {}
        request.params.id = firstChapter.id
        await chapterRoutes.editChapter(request, response)
        expect(response.data.chapter.name).toEqual(firstChapter.name);
    });
    it("Try saving chapter with existing chapternumber results in error(saveEditedChapter)", async function () {
        let request = {
            body: {
                chapterId: firstChapter.id,
                chapterName: firstChapter.name,
                overview: firstChapter.overview,
                chapterNumber: firstChapter.chapternumber,
                updatedChapterNumber: secondChapter.chapternumber,
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
        await chapterRoutes.saveEditedChapter(request, response)
        expect(response.viewName).toBe("chapters/editChapter");
        expect(response.data.error).toContain("Kapitelnummer ist schon vergeben");

    });
});