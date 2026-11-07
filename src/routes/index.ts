import { Router as expressRouter } from "express";
const router = expressRouter();
// auth routes

/*
// antes
const express = require('express');
const Paciente = require('../models/paciente');

// después
import express from 'express';
import Paciente from '../models/paciente';*/


import pacRouter from './pacRoute';
import orgRouter from './orgRoute';
import medicaRouter from "./medicaRoute";
import docRouter from "./docRoute";
import usuRouter from "./usuRoute";
import intervRoute from "./intervRoute";


router.use("/pac", pacRouter);
router.use("/org", orgRouter);
router.use("/medica", medicaRouter);
router.use("/doctor", docRouter);
router.use("/usuarios", usuRouter);
router.use("/interv", intervRoute);

export default router;