const {Router} = require('express')
// const Card = require('../models/card')
const Course = require('../models/course')
const router = Router()

function mapCardItems(card) {
    return card.items.map(c => ({
        ...c.courseId._doc,
        count: c.count,
        id: c.courseId.id
    }))
}

function computePrice(courses) {
    return courses.reduce((total, course) => {
        return total += course.price * course.count
    }, 0)
}

router.post('/add', async (req, res) => {
    const course = await Course.findById(req.body.id)
    // await Card.add(course)
    await req.user.addToCart(course)
    res.redirect('/card')
})

router.delete('/remove/:id', async (req, res) => {
    // const card = await Card.remove(req.params.id)
    await req.user.removeFromCard(req.params.id)
    const user = await req.user.populate('card.items.courseId').execPopulate()
    const courses = mapCardItems(user.card)
    const card = {
        courses,
        price: computePrice(courses)
    }
    res.status(200).json(card)
})

router.get('/', async (req, res) => {
    // const card = await Card.fetch()
    const user = await req.user.populate('card.items.courseId').execPopulate()
    const courses = mapCardItems(user.card)
    res.render('card', {
        title: 'Basket',
        isCard: true,
        courses: courses,
        price: computePrice(courses)
    })
})

module.exports = router