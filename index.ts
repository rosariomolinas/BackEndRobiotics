
import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import { AddressInfo } from 'net';

import allRoutes from './src/routes/index';
import dbMongo from './src/db/dbconnect';

// Campos propios que guardás en la sesión
declare module 'express-session' {
  interface SessionData {
    sessuser: any;
    sessprofile: string;
  }
}

const app = express();

// CORS con credenciales (necesario para que la cookie de sesión viaje desde React en :3000)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // reemplaza a body-parser

// Conexión a Mongo
dbMongo()
  .then(() => console.log('Conectado a la base'))
  .catch((err: unknown) => console.error('Error al conectar a la base', err));

app.use('/robiotics', allRoutes);
app.use('/public', express.static(path.join(__dirname, 'public')));

const views = path.join(__dirname, 'src', 'views');

app.get('/', (req: Request, res: Response) => {
  console.log('usuario loggeado ', req.session.sessuser);
  if (req.session.sessuser) {
    res.sendFile(path.join(views, 'main.html'));
  } else {
    res.sendFile(path.join(views, 'login.html'));
  }
});

app.get('/chglogin', (req: Request, res: Response) => {
  console.log('cambio de password', req.session.sessuser);
  res.sendFile(path.join(views, 'chglogin.html'));
});

app.get('/pacientes', (req: Request, res: Response) => {
  console.log('usuario loggeado pacientes', req.session.sessuser);
  res.sendFile(path.join(views, 'pacientes.html'));
});

app.get('/doctores', (_req: Request, res: Response) => {
  res.sendFile(path.join(views, 'doctores.html'));
});

app.get('/organos', (_req: Request, res: Response) => {
  res.sendFile(path.join(views, 'organos.html'));
});

app.get('/intervenciones', (_req: Request, res: Response) => {
  res.sendFile(path.join(views, 'intervenciones.html'));
});

app.get('/header', (_req: Request, res: Response) => {
  res.sendFile(path.join(views, 'header.html'));
});

app.get('/menu', (req: Request, res: Response) => {
  const perfil = req.session.sessprofile;
  console.log('menu=>', perfil);

  if (perfil === 'admin') {
    res.sendFile(path.join(views, 'menu-admin.html'));
  } else if (perfil === 'user') {
    res.sendFile(path.join(views, 'menu-user.html'));
  } else {
    res.status(401).send('No autorizado');
  }
});

const server = app.listen(process.env.PORT || 3001, () => {
  const { port } = server.address() as AddressInfo;
  console.log('App now running on port', port);
});


/*

import express from "express";
const cors = require('cors');
cors. SupportsCredentials = true;
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var app = express(); 
app.use(cors());

require('dotenv').config();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));



 const allRoutes = require("./src/routes/index.ts")

const dbMongo = require("./src/db/dbconnect.ts")
class DBServer {
  constructor()
    { 
       this.dbConn()
    }
    async dbConn()
    {
      await dbMongo()
    }

}

const dbServ = new DBServer()

dbServ.dbConn;
// connectDB;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/robiotics', allRoutes);


app.use('/public', express.static(path.join(__dirname, 'public')))


var server = app.listen(process.env.PORT || process.env.port, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

 
 app.get('/', function(req, res) {
    console.log("usuario loggeado ", req.session.sessuser );
    
    if (req.session.sessuser )
    {
      res.sendFile(path.join(__dirname, '/src/views/main.html'));
    }
    else 
    {
      res.sendFile(path.join(__dirname, '/src/views/login.html'));
    }
  });
  app.get('/chglogin', function(req, res) {
    console.log("cambio de password", req.session.sessuser );
   res.sendFile(path.join(__dirname, '/src/views/chglogin.html'));
 });
  app.get('/pacientes', function(req, res) {
    console.log("usuario loggeado pacientes", req.session.sessuser );
   res.sendFile(path.join(__dirname, '/src/views/pacientes.html'));
 });
 app.get('/doctores', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/doctores.html'));
 });
 app.get('/organos', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/organos.html'));
 });
 app.get('/intervenciones', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/intervenciones.html'));
 });

  app.get('/header', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/header.html'));
 });
 app.get('/menu', function(req, res) {
  console.log("menu=>", req.session.sessprofile)
  if (req.session.sessprofile != null)
  {
    if (  !  req.session.sessprofile.localeCompare('admin')  )
      { 
        console.log("ADMIN");
          res.sendFile(path.join(__dirname, '/src/views/menu-admin.html'));
      } 
      if (! req.session.sessprofile.localeCompare('user') )
        {  
          console.log("USER");
            res.sendFile(path.join(__dirname, '/src/views/menu-user.html'));
        } 
    } 
});


*/