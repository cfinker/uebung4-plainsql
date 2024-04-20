// resolvers.js
const CodeSnippet = require('./models/codeSnippet');
const Tag = require('./models/tag');

const resolvers = {
    // CodeSnippet Resolvers
    getCodeSnippet: async ({ id }) => {
        const codeSnippet = await CodeSnippet.find(id);
        if (codeSnippet) {
            const tags = await Tag.allByCodeSnippetId(id);
            codeSnippet.tags = tags;
            return codeSnippet;
        }
        return null;
    },
    getAllCodeSnippets: async ({ tag }) => {
        const codeSnippets = await CodeSnippet.all();
        if (tag) {
            const filteredSnippets = codeSnippets.filter(async snippet => {
                const tags = await Tag.allByCodeSnippetId(snippet.id);
                return tags.some(t => t.name === tag);
            });
            for(let i = 0; i < filteredSnippets.length; i++){
                filteredSnippets[i].tags = await Tag.allByCodeSnippetId(filteredSnippets[i].id);
            }
            return filteredSnippets;
        }
        return codeSnippets;
    },
    createCodeSnippet: async ({ input }) => {
        const id = await CodeSnippet.create(input);
        const codeSnippet = await CodeSnippet.find(id);
        const tags = await Promise.all(input.tags.map(tag => Tag.createIfNotExists(tag)));
        await CodeSnippet.attachTags(id, tags);
        codeSnippet.tags = tags;
        return codeSnippet;
    },
    updateCodeSnippet: async ({ id, input }) => {
        await CodeSnippet.update(id, input);
        const codeSnippet = await CodeSnippet.find(id);
        const tags = await Promise.all(input.tags.map(tag => Tag.createIfNotExists(tag)));
        await CodeSnippet.attachTags(id, tags);
        codeSnippet.tags = tags;
        return codeSnippet;
    },
    deleteCodeSnippet: async ({ id }) => {
        const codeSnippet = await CodeSnippet.find(id);
        await CodeSnippet.delete(id);
        return codeSnippet;
    },

    // Tag Resolvers
    getTag: async ({ id }) => {
        return await Tag.find(id);
    },
    getAllTags: async () => {
        return await Tag.all();
    },
    createTag: async ({ input }) => {
        return await Tag.create(input);
    },
    updateTag: async ({ id, input }) => {
        await Tag.update(id, input);
        return await Tag.find(id);
    },
    deleteTag: async ({ id }) => {
        const tag = await Tag.find(id);
        await Tag.delete(id);
        return tag;
    },
};

module.exports = resolvers;
