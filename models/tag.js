// models/tag.js
const db = require('../db');

class Tag {
    static createTable() {
        const sql = `
      CREATE TABLE IF NOT EXISTS tags (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT
      )
    `;
        return db.run(sql);
    }

    static all() {
        const sql = 'SELECT * FROM tags';
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
        const sql = 'SELECT * FROM tags WHERE id = ?';
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
        const sql = 'INSERT INTO tags (name, description) VALUES (?, ?)';
        const { name, description } = data;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.lastID);
                }
            });
        });
    }

    static update(id, data) {
        const sql = 'UPDATE tags SET name = ?, description = ? WHERE id = ?';
        const { name, description } = data;
        return new Promise((resolve, reject) => {
            db.run(sql, [name, description, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes);
                }
            });
        });
    }

    static delete(id) {
        const sql = 'DELETE FROM tags WHERE id = ?';
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

    static findByName(name) {
        const sql = 'SELECT * FROM tags WHERE name = ?';
        return new Promise((resolve, reject) => {
            db.get(sql, [name], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    static async createIfNotExists(data) {
        const existingTag = await this.findByName(data.name);
        if (existingTag) {
            return existingTag;
        }
        const id = await this.create(data);
        return await this.find(id);
    }

    static async allByCodeSnippetId(codeSnippetId) {
        const sql = `
      SELECT tags.* FROM tags
      INNER JOIN code_snippet_tags ON tags.id = code_snippet_tags.tag_id
      WHERE code_snippet_tags.code_snippet_id = ?
    `;
        return new Promise((resolve, reject) => {
            db.all(sql, [codeSnippetId], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

module.exports = Tag;
