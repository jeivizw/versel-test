// =============================================================
// routes/produtos.js — Rotas de Produtos (CRUD Completo)
// =============================================================

const express = require('express');
const router = express.Router();
// CORREÇÃO 1: 'let db' alterado para 'const supabase'. O nome da variável 
// deve ser 'supabase' para bater com as chamadas abaixo, e usamos 'const' 
// porque a instância do banco não será reatribuída.
const supabase = require('../data/supabase'); 

// =============================================================
// ── AULA 6: ROTA ESPECIAL PARA TESTE DE ERRO ─────────────────
// =============================================================
router.get('/erro-teste', (req, res) => {
    throw new Error("O servidor do Haruy Sushi tropeçou!");
});

// =============================================================
// ── [GET] /api/produtos ───────────────────────────────────────
// =============================================================
router.get('/', async (req, res, next) => {
    try {
        // CORREÇÃO 2: Estava req.query (que pega todos os parâmetros). 
        // Agora pega especificamente o req.query.categoriaId
        const { categoriaId } = req.query; 
        
        let consulta = supabase.from('produtos').select('*');
        
        if (categoriaId) {
            consulta = consulta.eq('categoriaId', categoriaId);
        }
        
        // CORREÇÃO 3: '.ordem' corrigido para '.order'
        const { data, error } = await consulta.order('id', { ascending: true });
        
        if (error) throw error;
        
        res.json(data);
    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [GET] /api/produtos/:id ───────────────────────────────────
// =============================================================
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('id', id)
            .maybeSingle();
            
        if (error) throw error;
        
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ mensagem: 'Não encontrado.' });
        }
    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [POST] /api/produtos ──────────────────────────────────────
// =============================================================
router.post('/', async (req, res, next) => {
    try {
        // CORREÇÃO 4: Para o insert, req.body já é um objeto inteiro com os dados 
        // do produto. Inserimos ele diretamente dentro de um array.
        const { data, error } = await supabase
            .from('produtos')
            .insert([req.body]) 
            .select();
            
        if (error) throw error;
        
        res.status(201).json(data[0]);
    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [PUT] /api/produtos/:id ───────────────────────────────────
// =============================================================
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('produtos')
            .update(req.body) // O req.body aqui tem as parciais do produto (ex: só o preço)
            .eq('id', id)
            .select();

        if (error) throw error;
        
        if (data && data.length > 0) {
            res.json(data[0]);
        } else {
            res.status(404).json({ mensagem: 'Produto não encontrado ou não atualizado.' });
        }
    } catch (err) {
        next(err);
    }
});

// =============================================================
// ── [DELETE] /api/produtos/:id ────────────────────────────────
// =============================================================
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('produtos')
            .delete()
            .eq('id', id);

        if (error) throw error;
        
        res.json({ mensagem: 'Produto removido com sucesso.' });
    } catch (err) {
        next(err);
    }
});

// ─── Exportação do Router ─────────────────────────────────────
module.exports = router;