import Mock from 'mockjs'

const tree_data = require('./data/file_tree.json')
const user_data = require('./data/file_detail.json')

Mock.mock("/api/user/1/project/1", tree_data)
Mock.mock("/api/user/1/project/1/src/a.cpp", user_data)