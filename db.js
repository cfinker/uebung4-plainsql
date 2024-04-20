const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

const createTables = () => {
    const sql = `
    CREATE TABLE IF NOT EXISTS code_snippet_tags (
      code_snippet_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY(code_snippet_id) REFERENCES code_snippets(id),
      FOREIGN KEY(tag_id) REFERENCES tags(id),
      PRIMARY KEY(code_snippet_id, tag_id)
    )
  `;
    return db.run(sql);
};
createTables();

module.exports = db;
