const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();
exports.findAdminByEmail = async function (email) {
    let query = "SELECT * FROM admins WHERE email = $1";
    let result = {}
    result = await pool.query(query, [email])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findAdminById = async function (id) {
    let query = "SELECT * FROM admins WHERE id = $1";
    let result = {}
    result = await pool.query(query, [id])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.saveAdmin = async function (email, hash, salt) {
    let query = "INSERT INTO admins (hash, salt, email) VALUES ($1, $2, $3)";
    await pool.query(query, [hash, salt, email])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
}

exports.findUserThatSolvedLesson = async function (lessonId) {
    let query = 'SELECT moodlename from "solvedLessons" sl JOIN "persons" p ON sl.moodleid = p.moodleid WHERE sl.lessonid=$1';
    let result = []
    result = await pool.query(query, [lessonId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findAllUsers = async function () {
    let query = 'SELECT * from "persons"';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.findAnsweredProblems = async function () {
    let query = 'select p.moodleid, p.message, p.createdat, ps.moodlename, n.answer, p.id as "problemid",n.id as notificationid,  l.id as "lessonid", l.name as "lessonname", n.sender as "sender", n.seen as "seen" from problems p join notifications n on n.problemid = p.id join lessons l on l.id = p.lessonid join persons ps on ps.moodleid = p.moodleid order by n.createdat ';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findUnansweredProblem = async function () {
    let query = 'select p.id ,p.moodleid,p.message ,p.createdat ,p.lessonid, ps.moodlename, l."name" as lessonname from problems p left outer join notifications n on p.id = n.problemid join persons ps on p.moodleid = ps.moodleid join lessons l on l.id = p.lessonid where n.id IS null';
    let result = []
    result = await pool.query(query, [])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteProblemById = async function (id) {
    let query = 'DELETE from problems WHERE id=$1';
    let result = []
    result = await pool.query(query, [id])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertOrUpdateUserNotifications = async function (id, moodleId, answer, problemId, sender, seen) {
    let result = []
    if (id) {
        let query = 'UPDATE notifications set moodleid=$1, answer=$2, problemid=$3, sender=$4::senderTyp, seen=$5 where id=$6';
        result = await pool.query(query, [moodleId, answer, problemId, sender, seen, id])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    } else {
        let query = 'INSERT INTO notifications (moodleid, answer, problemid, sender, seen) VALUES ($1, $2, $3, $4::senderTyp,$5)';
        result = await pool.query(query, [moodleId, answer, problemId, sender, seen])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    }
    return result
}
exports.findUserByMoodleIdAndMoodleName = async function (moodleId, moodleName) {
    let query = 'SELECT * from persons where moodleid=$1 and moodlename=$2';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.createPerson = async function (moodleId, moodleName) {
    let query = 'INSERT INTO persons (moodleid, moodlename) VALUES ($1, $2)';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findProblemsAndAnswersByUser = async function (moodleId, moodleName) {
    let query = 'select p.id,p.createdat, p.message, p.lessonid, n.answer, l."name", l.id as lessonid from problems p left join notifications n on p.id = n.problemid join persons pe on p.moodleid = pe.moodleid join lessons l on l.id = p.lessonid where p.moodleid=$1 and pe.moodlename=$2 order by p.createdat DESC  ';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertNotesForUser = async function (moodleId, note) {
    let query = 'INSERT INTO notes (moodleid, note) VALUES ($1, $2) RETURNING id';
    let result = []
    result = await pool.query(query, [moodleId, note])
        .then(res => {
            return res
        }).catch(err => {
            throw  err
        })
    return result
}
exports.findNotesByUser = async function (moodleId, moodleName) {
    let query = 'SELECT  n.moodleid, n.id, p.moodlename, n.note from notes n join persons p on p.moodleid = n.moodleid where n.moodleid=$1 and p.moodlename=$2 order by n.id';
    let result = []
    result = await pool.query(query, [moodleId, moodleName])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.insertOrUpdateSolvedLessonOnConflict = async function (lessonId, moodleId, userCode) {
    let result = []
    let query = 'INSERT INTO "solvedLessons" (moodleid, lessonid, code) VALUES ($1, $2, $3) ON CONFLICT ON CONSTRAINT "solvedlessons_un" DO update set code = $3 ';
    result = await pool.query(query, [moodleId, lessonId, userCode])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertProblemForUser = async function (moodleId, lessonId, problem) {
    let result = []
    let query = 'INSERT INTO "problems" (moodleid, lessonid, message, seen, sender) VALUES ($1, $2, $3, false, $4::sendertyp) RETURNING id';
    result = await pool.query(query, [moodleId, lessonId, problem, "STUDENT"])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteSolvedByMoodleId = async function (moodleId) {
    let result = []
    let query = 'DELETE from "solvedLessons" WHERE moodleId=$1';
    result = await pool.query(query, [moodleId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteSolvedByMoodleIdAndChapterId = async function (moodleId, chapterId) {
    let result = []
    let query = 'delete from "solvedLessons" sl using chapters c, sections s, lessons l where sl.lessonid = l.id and l.sectionId = s.id and c.id = s.chapterid and sl.moodleid= $1 and c.id = $2';
    result = await pool.query(query, [moodleId, chapterId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.deleteNoteForUser = async function (moodleId, moodleName, noteId) {
    let result = []
    let query = 'delete from "notes" n using persons p where p.moodleid = $1 and p.moodlename = $2 and n.id = $3';
    result = await pool.query(query, [moodleId, moodleName, noteId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertOrUpdateNote = async function (moodleId, noteText, noteId) {
    let result = []
    let query = 'Insert Into notes (id, moodleid, note) VALUES($1,$2,$3) ON CONFLICT ON CONSTRAINT "notes_pkey" DO UPDATE SET note=$3'
    result = await pool.query(query, [noteId, moodleId, noteText])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.insertAnswerForProblemAndUser = async function (problemId, moodleId, answer) {
    let result = []
    let query = 'Insert Into notifications (moodleid, problemid, answer, sender , seen) VALUES($1,$2,$3, $4::sendertyp, $5)'
    result = await pool.query(query, [moodleId, problemId, answer, "STUDENT", false])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}
exports.updateNotificationsSeenForProblem = async function (problemId, hasSeen) {
    let result = []
    let query = 'UPDATE notifications set seen=$1 where problemid=$2'
    result = await pool.query(query, [hasSeen, problemId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}

exports.getSessionForUserID = async function (userId) {
    let result = []
    let query = 'Select * from sessions where sid =$1'
    result = await pool.query(query, [userId])
        .then(res => {
            return res.rows
        }).catch(err => {
            throw  err
        })
    return result
}