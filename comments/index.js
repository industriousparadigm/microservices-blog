const express = require('express')
const { randomBytes } = require('crypto')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(express.json())
app.use(cors())

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
  res.send(commentsByPostId[req.params.id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex')
  const postId = req.params.id
  const { content } = req.body

  const comments = commentsByPostId[postId] || []

  const newComment = { id: commentId, content, status: 'pending' }

  comments.push(newComment)

  commentsByPostId[postId] = comments

  await axios.post('http://event-bus-srv:4005/events', {
    type: 'CommentCreated',
    data: {
      ...newComment,
      postId,
    },
  })

  res.status(201).send(comments)
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body
  if (type === 'CommentModerated') {
    const { postId, id, status, content } = data
    const comments = commentsByPostId[postId]
    const comment = comments.find((comment) => comment.id === id)

    comment.status = status

    await axios.post('http://event-bus-srv:4005/events', {
      type: 'CommentUpdated',
      data: {
        id,
        content,
        status,
        postId,
      },
    })
  }

  res.send({})
})

app.listen(4001, () => {
  console.log('Comments service - listening on 4001...')
})
