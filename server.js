const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db/db')

const app = express()

// Parse incoming requests data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// get all items
app.get('/api/v1/todos', (req, res) => {
	res.status(200).send({
	  success: 'true',
	  message: 'todos retrieved successfully',
	  todos: db
	})
})

// get single item
app.get('/api/v1/todos/:id', (req, res) => {
	const id = parseInt(req.params.id, 10)
	db.todos.map((todo) => {
		if (todo.id === id) {
			return res.status(200).send({
				success: 'true',
				message: 'item retrieved successfully',
				todo
			})
		}
	})
	return res.status(404).send({
		success: 'false',
		message: 'item does not exist'
	})
})

// add new item
app.post('/api/v1/todos', (req, res) => {
	if (!req.body.title) {
		return res.status(400).send({
			success: 'false',
			message: 'title is required'
		})
	} else if (!req.body.description) {
		return res.status(400).send({
			success: 'false',
			message: 'description is required'
		})
	}
	const todo = {
		id: db.todos.length + 1,
		title: req.body.title,
		description: req.body.description
	}
	console.log(db.todos)
	db.todos.push(todo)
	return res.status(201).send({
		success: true,
		message: 'item added successfully',
		todo
	})
})

// delete item
app.delete('/api/v1/todos/:id', (req, res) => {
	const id = parseInt(req.params.id, 10)
	db.todos.map((todo, index) => {
		if (todo.id === id) {
			db.todos.splice(index, 1)
			return res.status(200).send({
				success: 'true',
				message: 'Todo deleted successfully'
			})
		}
	})
	return res.status(404).send({
		success: 'false',
		message: 'item not found'
	})
})

// update item
app.put('/api/v1/todos/:id', (req, res) => {
	const id = parseInt(req.params.id, 10)
	let todoFound
	let itemIndex
	db.todos.map((todo, index) => {
		if (todo.id === id) {
			todoFound = todo
			itemIndex = index
		}
	})
	if (!todoFound) {
		return res.status(404).send({
			success: 'false',
			message: 'item not found'
		})
	}
	if (!req.body.title) {
		return res.status(400).send({
			success: 'false',
			message: 'title is required'
		})
	}
	if (!req.body.description) {
		return res.status(400).send({
			success: 'false',
			message: 'description is required'
		})
	}
	const updatedTodo = {
		id: todoFound.id,
		title: req.body.title || todoFound.title,
		description: req.body.description || todoFound.description
	}

	db.todos.splice(itemIndex, 1, updatedTodo)

	return res.status(201).send({
		success: 'true',
		message: 'item updated successfully',
		updatedTodo
	})
})

const PORT = 5000

app.listen(PORT, () => {
	console.log(`server running on port ${PORT}`)
})