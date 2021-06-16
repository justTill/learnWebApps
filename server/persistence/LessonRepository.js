const DbConnector = require("./DbConnector");
const pool = DbConnector.getDBConnectionPool();


exports.deleteById = async function (id) {
    let query = "DELETE from lessons WHERE id=$1"
    return pool.query(query, [id])
        .then(res => res)
        .catch(err => {
            throw err
        })
}
exports.findCodeExtention = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "codeExtensionLessons" cel ON l.id = cel.lessonid ORDER BY lessonnumber'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findCoding = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "codingLessons" cl ON l.id = cl.lessonid ORDER BY lessonnumber'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}

exports.insertOrUpdateCodingLesson = async function (lessonId, codingLessonId, sectionId, lessonNumber, information, name, verificationType, verificationCode, exampleSolution, verificationInformation) {
    let result
    if (lessonId && codingLessonId) {
        result = pool.query('BEGIN', err => {
            let query = "UPDATE lessons SET sectionid=$1, lessonnumber=$2, information=$3, name=$4 WHERE id=$5";
            pool.query(query, [sectionId, lessonNumber, information, name, lessonId])
                .then(res => {
                    let childUpdate = 'UPDATE "codingLessons" SET verificationtype=$1::verificationtype, verificationcode=$2, examplesolution=$3, verificationinformation=$4 WHERE id=$5'
                    pool.query(childUpdate, [verificationType, verificationCode, exampleSolution, verificationInformation, codingLessonId])
                        .then(result => {
                            pool.query("COMMIT", err => {
                                if (err) {
                                    console.log("could not commit")
                                }
                            })
                        })
                        .catch(err => {
                            throw err
                        })
                })
                .catch(error => {
                    pool.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                    })
                })
        })
    } else {
        let insertLessonQuery = "INSERT INTO lessons (sectionid, lessonnumber, information, name) VALUES ($1, $2, $3, $4) RETURNING id"
        let insertCodingLessonQuery = 'INSERT INTO "codingLessons" (lessonid, verificationtype, verificationcode, examplesolution,verificationinformation)'
        let query = 'WITH new_lesson AS (' + insertLessonQuery + '),v (a,b,c,d) as (VALUES($5::verificationtype, $6, $7, $8))' + insertCodingLessonQuery + ' SELECT new_lesson.id, a,b,c,d from v, new_lesson;'
        result = pool.query(query, [sectionId, lessonNumber, information, name, verificationType.toUpperCase(), verificationCode, exampleSolution, verificationInformation])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    }
    return result
}

exports.insertOrUpdateCodeExtensionLesson = async function (lessonId, codingLessonId, sectionId, lessonNumber, information, name, unfinishedCode, answers) {
    let result
    if (lessonId && codingLessonId) {
        result = pool.query('BEGIN', err => {
            let query = "UPDATE lessons SET sectionid=$1, lessonnumber=$2, information=$3, name=$4 WHERE id=$5";
            pool.query(query, [sectionId, lessonNumber, information, name, lessonId])
                .then(res => {
                    let childUpdate = 'UPDATE "codingLessons" SET verificationtype=$1::verificationtype, verificationcode=$2, examplesolution=$3, verificationinformation=$4 WHERE id=$5'
                    pool.query(childUpdate, [])
                        .then(result => {
                            pool.query("COMMIT", err => {
                                if (err) {
                                    console.log("could not commit")
                                }
                            })
                        })
                        .catch(err => {
                            throw err
                        })
                })
                .catch(error => {
                    pool.query('ROLLBACK', err => {
                        if (err) {
                            console.error('Error rolling back client', err.stack)
                        }
                    })
                })
        })
    } else {
        let insertLessonQuery = "INSERT INTO lessons (sectionid, lessonnumber, information, name) VALUES ($1, $2, $3, $4) RETURNING id"
        let insertCodingLessonQuery = 'INSERT INTO "codeExtensionLessons" (lessonid, unfinishedcode, answers)'
        let query = 'WITH new_lesson AS (' + insertLessonQuery + '),v (a,b) as (VALUES($5, $6))' + insertCodingLessonQuery + ' SELECT new_lesson.id, a,b from v, new_lesson;'
        result = pool.query(query, [sectionId, lessonNumber, information, name, unfinishedCode, answers])
            .then(res => {
                return res
            }).catch(err => {
                throw  err
            })
    }
    return result
}

exports.findCodingByLessonNumber = async function (number) {
    let query = 'SELECT * from lessons l where l.lessonnumber=$1'
    let result = {}
    result = await pool.query(query, [number])
        .then(res => {
            if (res.rows[0]) {
                return res.rows[0]
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findCodingByLessonId = async function (id) {
    let query = 'SELECT * from lessons l INNER JOIN "codingLessons" cl ON l.id = cl.lessonid where l.id=$1 ORDER BY lessonnumber'
    let result = {}
    result = await pool.query(query, [id])
        .then(res => {
            if (res.rows[0]) {
                return res.rows[0]
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findFillTheBlank = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "fillTheBlankLessons" ftbl ON l.id = ftbl.lessonid ORDER BY lessonnumber'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result

}
exports.findSingleMultipleChoice = async function () {
    let query = 'SELECT * from lessons l INNER JOIN "singleMultipleChoiceLessons" smcl ON l.id = smcl.lessonid ORDER BY lessonnumber'
    let result = {}
    result = await pool.query(query, [])
        .then(res => {
            if (res.rows) {
                return res.rows
            }
            return result
        }).catch(err => {
            throw  err
        })
    return result
}