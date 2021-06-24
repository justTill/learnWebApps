//CANNED DATA
let classChapter = {id: 1, overview: "Übersicht über das class Kapitel", name: "ES6 Klassen", chapternumber: 1}
let asyncChapter = {id: 2, overview: "Async functions", name: "Async", chapternumber: 2}

let classSectionOne = {
    id: 1,
    chapterId: 1,
    name: "Konstruktoren",
    sectionnumber: 1,
    information: "Es gibt verschiedene Arten von Konstruktoren"
}
let classSectionTwo = {
    id: 2,
    chapterId: 1,
    name: "Konstruktoren 2",
    sectionnumber: 2,
    information: "Funktionskonstruktor"
}
let asyncSectionOne = {
    id: 3,
    chapterId: 2,
    name: "Promisses",
    sectionnumber: 1,
    information: "Was ist ein Promise Objekt"
}
let asyncSectionTwo = {
    id: 4,
    chapterId: 2,
    name: "Syntacticalsugar",
    sectionnumber: 2,
    information: "Vereinfachtes benutzen"
}

//async section One
let asyncCodeLesson = {
    id: 1,
    sectionid: 3,
    lessonnumber: 1,
    name: "Code Aufgabe Async",
    information: "Schreibe eine Funktion die...",
    verificationtype: "JASMINE",
    verificationcode: "hier ist der Code",
    examplsolution: "Lösung",
    verificationinformation: "Was wird geprüft",
    feedback: null,
    difficultylevel: 'EASY'
};
let asyncFillTheBlank = {
    id: 2,
    sectionid: 3,
    lessonnumber: 2,
    name: "Async Fill the Blank",
    information: "Ergänze die lücken",
    textwithblanks: "Text mit Lücken [input] [input]",
    markedanswers: " [X]Antwortmöglichkeit 1\n [X]Antwortmöglichkeit 2",
    feedback: null,
    difficultylevel: 'EASY'
};
//async section two
let asyncCodeExtensions = {
    id: 3,
    sectionid: 4,
    lessonnumber: 3,
    name: "Ergänze den Code",
    information: "Ergänze folgenden Code",
    unfinishedcode: "function ([input]) {\n return a+b \n}",
    answers: "a,b",
    feedback: null,
    difficultylevel: 'EASY'
};

//class section One
let classCodeLesson = {
    id: 4,
    sectionid: 1,
    lessonnumber: 1,
    name: "Code Aufgabe Class",
    information: "Schreibe eine Klassen Funktion die...",
    verificationtype: "SELF",
    verificationcode: "hier ist der Code",
    examplsolution: "Lösung",
    verificationinformation: "Was wird geprüft",
    feedback: null,
    difficultylevel: 'EASY'
};
let classFillTheBlank = {
    id: 5,
    sectionid: 1,
    lessonnumber: 2,
    name: "Class Fill the Blank",
    information: "Ergänze die lücken",
    textwithblanks: "Text mit Lücken [input] [input]",
    markedanswers: " [X]Antwortmöglichkeit 1\n [X]Antwortmöglichkeit 2",
    feedback: null,
    difficultylevel: 'EASY'
};
//class section two
let classCodeExtensions = {
    id: 6,
    sectionid: 2,
    lessonnumber: 1,
    name: "Ergänze den Code",
    information: "Ergänze folgenden Code",
    unfinishedcode: "function ([input]) {\n return a+b \n}",
    answers: "a,b",
    feedback: null,
    difficultylevel: 'EASY'
};

exports.firstChpater = classChapter;
exports.secondChapter = asyncChapter;

exports.firstSectionToChapterOne = classSectionOne;
exports.secondSectionToChapterOne = classSectionTwo;

exports.firstSectionToChapterTwo = asyncSectionOne;
exports.secondSectionToChapterTwo = asyncSectionTwo;

exports.asyncSectionOneLessonOne = asyncCodeLesson;
exports.asyncSectionOneLessonTwo = asyncFillTheBlank;
exports.asyncSectionTwoLessonOne = asyncCodeExtensions;

exports.classSectionOneLessonOne = classCodeLesson;
exports.classSectionOneLessonTwo = classFillTheBlank;
exports.classSectionTwoLessonOne = classCodeExtensions;


