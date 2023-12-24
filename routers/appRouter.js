const router = require('express').Router()
const fs = require('fs')
const Project = require('../schemas/projectSchema')

router.get('/', async (req, res) => {
    const projects = await Project.find({email: req.user.email})
    res.render('app', {user: req.user, projects: projects, error: ""})
})

router.get('/:id', async (req, res) => {
    const {id} = req.params
    const foundProject = await Project.findOne({projectName: id})
    if (!foundProject) {
        return res.redirect('/app')
    } else {
        // project editing page coding stuff here
        res.render('project', {projectName: id})
    }
})

router.get('/:id/:id2', async(req, res) => {
    console.log(decodeURIComponent(req.params.id2))
})

router.post('/:id/new-page', async (req, res) => {
    const {pageName} = req.body
    const {id} = req.params
    const foundProject = await Project.findOne({projectName: id})
    if (!foundProject) return res.redirect('/app')
    if (foundProject.email !== req.user.email) return res.redirect('/app')
    const path = `./uploads/${encodeURIComponent(id)}/${encodeURIComponent(pageName)}`
    fs.access(path, async (error) => {
        if (error) {
            await fs.mkdir(path, async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("NEW DIR CREATED")
                    await fs.writeFile(path + '/index.js', '', (err) => {
                        if (err) throw err;
                        console.log('done')
                    })
                    await fs.writeFile(path + '/index.ejs', '', (err) => {
                        if (err) throw err;
                        console.log('done')
                    })
                    await fs.writeFile(path + '/styles.css', '', (err) => {
                        if (err) throw err;
                        console.log('done')
                    })
                }
            })
        } else {
            console.log("ALREADY EXISTS!")
        }
    })
})

router.post('/new-project', async (req, res) => {
    const {projectName} = req.body
    const foundProject = await Project.findOne({projectName: projectName})
    if (foundProject) {
        const projects = await Project.find({email: req.user.email})
        return res.render('app', {user: req.user, projects: projects, error: "A project exists with this name. Please use another name."})
    }
    const path = `./uploads/${encodeURIComponent(projectName)}`
    fs.access(path, (error) => {
        if (error) {
            fs.mkdir(path, async (err) => {
                if (err) {
                    console.log(err)
                } else {
                    const newProject = new Project({
                        email: req.user.email,
                        projectName: projectName
                    })
                    await newProject.save()
                    console.log("NEW DIR CREATED")
                }
            })
        } else {
            console.log("ALREADY EXISTS!")
        }
    })
})

module.exports = router