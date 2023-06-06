import Mock from 'mockjs'

const problem_data = require('./data/project_problems.json')
const tree_data = require('./data/file_tree.json')
const user_data = require('./data/file_detail.json')
const playground_data = require('./data/playground.json')

Mock.mock("/api/user/1/project/1", tree_data)
Mock.mock("/api/user/1/project/1/problem", problem_data)
Mock.mock("/api/user/1/project/1/file", user_data)
Mock.mock("/api/playground/test", playground_data)