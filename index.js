const express = require("express")
const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

let notes = [
  { id: 1, content: "HTML is easy", date: "2019-05-30T17:30:31.098Z", important: true },
  { id: 2, content: "Browser can execute only Javascript", date: "2019-05-30T18:39:34.091Z", important: false },
  { id: 3, content: "GET and POST are the most important methods of HTTP protocol", date: "2019-05-30T19:20:14.298Z", important: true },
]

//////////////////////////////////////


///////////////////////////////////////
// GET HOME
app.get("/", (request, response) => {
  response.send("<h1>Hello World!!</h1>")
})

///////////////////////////////////////
// GET ALL
app.get("/api/notes", (request, response) => {
  response.json(notes)
})


/////////////////////////////////////////
//
app.get("/api/notes/:id", (request, response) => {
  const id = +request.params.id // this is the :id above inside request obj
  const note = notes.find((note) => note.id === id) // we find the requested note and send it to user

  if (!note) {
    response.statusMessage = "Current password does not match"
    response.status(404, "kek").end()
    return
  }
  response.json(note)
})



/////////////////////////////////////////
// Delete
app.delete("/api/notes/:id", (request, response) => {
  const id = +request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})




//////  POST  //
app.post("/api/notes", (request, response) => {
    const body = request.body

    if (!body.content) { //content is just a key inside json
        return response.status(400).json({ 
          error: 'content missing' 
        })
      }

    const maxId = notes.length > 0 ? Math.max(...notes.map(e=>e.id)) : 0
    const note = {
        id: maxId+1, // method not recommended, will be replaced soon
        content: body.content,
        important: body.important || false,
        date: new Date(),
    } 

    notes = notes.concat(note)
    response.json(note)
})



// NO HEROKU
// const PORT = 3001
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`)
// })

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


// HEROKU
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})