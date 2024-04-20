// schema.js
const { buildSchema } = require('graphql');

const schema = buildSchema(`
  type Tag {
    id: Int!
    name: String!
    description: String
  }

  type CodeSnippet {
    id: Int!
    name: String!
    description: String
    author: String!
    code: String!
    tags: [Tag]
  }

  input TagInput {
    name: String!
    description: String
  }

  input CodeSnippetInput {
    name: String!
    description: String
    author: String!
    code: String!
    tags: [TagInput]
  }

  type Query {
    getCodeSnippet(id: Int!): CodeSnippet
    getAllCodeSnippets(tag: String): [CodeSnippet]
    getTag(id: Int!): Tag
    getAllTags: [Tag]
  }

  type Mutation {
    createCodeSnippet(input: CodeSnippetInput): CodeSnippet
    updateCodeSnippet(id: Int!, input: CodeSnippetInput): CodeSnippet
    deleteCodeSnippet(id: Int!): CodeSnippet
    createTag(input: TagInput): Tag
    updateTag(id: Int!, input: TagInput): Tag
    deleteTag(id: Int!): Tag
  }
`);

module.exports = schema;
