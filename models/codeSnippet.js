// models/codeSnippet.js
const db = require('../db');

class CodeSnippet {
    static createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS code_snippets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        author TEXT,
        code TEXT
      )
    `;
        return db.run(sql);
    }

    static all() {
        const sql = 'SELECT * FROM code_snippets';
        return new Promise((resolve, reject) => {
            db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static find(id) {
        const sql = 'SELECT * FROM code_snippets WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static create(data) {
        const sql = 'INSERT INTO code_snippets (name, description, author, code) VALUES (?, ?, ?, ?)';
        const { name, description, author, code } = data;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description, author, code], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    static update(id, data) {
        const sql = 'UPDATE code_snippets SET name = ?, description = ?, author = ?, code = ? WHERE id = ?';
        const { name, description, author, code } = data;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description, author, code, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    static delete(id) {
        const sql = 'DELETE FROM code_snippets WHERE id = ?';
        return new Promise((resolve, reject) => {
            db.run(sql, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    static async attachTags(codeSnippetId, tags) {
        const sql = 'INSERT INTO code_snippet_tags (code_snippet_id, tag_id) VALUES (?, ?)';
        const values = tags.map(tag => [codeSnippetId, tag.id]);

        return new Promise((resolve, reject) => {
            db.serialize(() => {
                db.run('BEGIN TRANSACTION');

                values.forEach(value => {
                    db.run(sql, value, function(err) {
                        if (err) {
                            db.run('ROLLBACK');
                            reject(err);
                        }
                    });
                });

                db.run('COMMIT', function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        });
    }
}

module.exports = CodeSnippet;
