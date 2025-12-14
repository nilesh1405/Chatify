import express from 'express';

const router = express.Router();

router.get('/m1',(req,res)=>{
    res.send('Message route 1');
})

router.get('/m2',(req,res)=>{
    res.send('Message route 2');
})

export default router;