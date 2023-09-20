import express from 'express'

import { config } from 'dotenv'
import path from 'path'
config({ path: path.resolve('./config/config.env') })
import { initiateApp } from './src/initiateApp.js'

const app = express()
initiateApp(express, app)
