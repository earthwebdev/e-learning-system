import express, {Request, Response} from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import { dbConnection } from './config/db.config';
import hpp from 'hpp';

import indexRouter from './routes/index.router';

import 'dotenv/config';
import passport from 'passport';
import expressSession from 'express-session';
import {passportInitialize} from './middlewares/passport.middleware';
import initializeFirebaseApp from './firebase/initializeFirebase';
//socket io parts
import { Server, Server as SocketIOServer } from 'socket.io';
import http from 'http';

const app = express();

dbConnection();

initializeFirebaseApp();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('tiny'));
app.use(mongoSanitize());
app.use(helmet());

app.use(hpp());
app.use(cors());

//socket io start
const server = http.createServer(app);

const io: SocketIOServer = new Server(server, {
    cors: {
        origin: 'http://localhost:5173'
    }
})
io.on('connection', (socket) => {   
    console.log('User connected:', socket.id);

    //data refers to room id sent from frontend
    socket.on('join_room', (data) => {
        socket.join(data);
        console.log(`User with id ${socket.id} joined room ${data}`)
    });
// in this case, the data refers to message sent from client
    socket.on('send_message', (data) => {
        //database save message heres
        socket.to(data.room).emit('received_message', data);        
    })
    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
    });
  });

  
//socket io end
app.use(expressSession(
    { 
        secret: 'test123!@3',
        resave: false,
        saveUninitialized: true,
        cookie: {secure: true}
    }
));

passportInitialize();
app.use(passport.initialize());
app.use(passport.session());
/* app.get( '/', (req: Request, res: Response) => {
    res.send('E Learning System');
}) */


app.use(indexRouter);

const PORT = process.env.PORT || 8082;
/* app.listen(PORT, () => {
    console.log('App server is running at port '+ PORT);
}) */
server.listen(PORT, () => {
    console.log('App server is running at port '+ PORT);
  });