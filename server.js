// server.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');
const resolvers = require('./resolvers');
const CodeSnippet = require('./models/codeSnippet');
const Tag = require('./models/tag');

const app = express();

// RESTful API endpoints
app.use(express.json());

// CodeSnippet endpoints
app.get('/api/code-snippets', async (req, res) => {
    const { tag } = req.query;
    try {
        const codeSnippets = await CodeSnippet.all();
        if (tag) {
            const filteredSnippets = await Promise.all(codeSnippets.map(async snippet => {
                const tags = await Tag.allByCodeSnippetId(snippet.id);
                snippet.tags = tags;
                return snippet;
            }));
            const filteredByTag = filteredSnippets.filter(snippet => snippet.tags.some(t => t.name === tag));
            res.json(filteredByTag);
        } else {
            res.json(codeSnippets);
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// TODO Add other CRUD endpoints for CodeSnippet (POST, PUT, DELETE)

// Tag endpoints
app.get('/api/tags', async (req, res) => {
    try {
        const tags = await Tag.all();
        res.json(tags);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// TODO Add other CRUD endpoints for Tag (POST, PUT, DELETE)

// Create tables
CodeSnippet.createTable();
Tag.createTable();

const app = express();

app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
