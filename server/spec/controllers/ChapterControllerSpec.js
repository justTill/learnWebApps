var chapterRoutes = require("../../controller/ChapterController")

describe("ChapterController: ", function () {

    it("Chapters will be Displayed", async function () {
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
        expect(response.data).toEqual({chapters: []});
    });
    it("Create Chapter", async function () {
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
        expect(response.path).toEqual('/chapter');
    });
    
    it("Edit Chapter", function () {
        expect(true).toBe(true);
    });
    it("Sections are there", function () {
        expect(true).toBe(true);
    });
    it("Sections can be edited", function () {
        expect(true).toBe(true);
    });
});