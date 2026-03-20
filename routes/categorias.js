const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('categorias')
            .select('*')
            .order('id', { ascending: true }); // CORREÇÃO 1: 'order' em vez de 'ordem'

        if (error) {
            throw error;
        }
        
        res.json(data);
    } catch (err) {
        next(err);
    }
});

router.post('/', async (req, res, next) => {
    try {
        // Extraímos o 'nome' do corpo da requisição para evitar inserir um objeto inteiro
        const { nome } = req.body; 

        // Opcional: Validação básica
        if (!nome) {
            return res.status(400).json({ error: "O campo 'nome' é obrigatório." });
        }

        const { data, error } = await supabase
            .from('categorias')
            .insert([{ nome: nome }]) // CORREÇÃO 2: Usa apenas a string extraída
            .select();

        if (error) throw error;
        
        res.status(201).json(data[0]);
    } catch (err) {
        next(err);
    }
});

module.exports = router;