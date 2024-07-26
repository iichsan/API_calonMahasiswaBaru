require('dotenv').config();
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// Import routers
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const adminsRouter = require('./routes/admins');
const dokumensRouter = require('./routes/dokumens');
const calonMahasiswaBarusRouter = require('./routes/calonMahasiswaBarus');
const pendaftaransRouter = require('./routes/pendaftarans');

// Import models
const sequelize = require('./models/index');
const Admin = require('./models/admin');
const Dokumen = require('./models/Dokumen');
const CalonMahasiswaBaru = require('./models/CalonMahasiswaBaru');
const Pendaftaran = require('./models/Pendaftaran');
const User = require('./models/user');

const app = express();

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // atau 'jade' jika Anda menggunakan jade

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Router setup
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/admins', adminsRouter);
app.use('/dokumens', dokumensRouter);
app.use('/calon-mahasiswa-barus', calonMahasiswaBarusRouter);
app.use('/pendaftarans', pendaftaransRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Synchronize the database
sequelize.sync()
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Error synchronizing database:', err);
    });

module.exports = app;
