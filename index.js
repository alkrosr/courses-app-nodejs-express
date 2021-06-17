const express = require('express')
const exphbs = require('express-handlebars')
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const path = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')(session)
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const ordersRoutes = require('./routes/orders')
const coursesRoutes = require('./routes/courses')
const authRoutes = require('./routes/auth')
const User = require('./models/user')
const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')

const MONGODB_URL = 'mongodb+srv://idv1cher:IWQQZAtc2L23ON11@cluster0.4qn42.mongodb.net/shop'

const app = express()

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

const store = new MongoStore({
    collection: 'sessions',
    uri: MONGODB_URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session({
    secret: 'some secret value',
    resave: false,
    saveUninitialized: false,
    store
}))

app.use(varMiddleware)
app.use(userMiddleware)


app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)
app.use('/orders', ordersRoutes)
app.use('/auth', authRoutes)

const PORT = process.env.PORT || 3000

async function start() {
    try {
        await mongoose.connect(MONGODB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })

        app.listen(PORT, () => {
            console.log(`Сервер успешно запущен на ${PORT} порту`)
        })
    } catch (e) {
        console.log(e)
    }

}

start()

const password = 'IWQQZAtc2L23ON11'
const ip = '37.76.135.22'

