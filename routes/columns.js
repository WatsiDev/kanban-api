const express = require('express');
const router = express.Router();
const controller = require('../controllers/columnController');

// Columns routes
// POST /api/columns -> crear columna dentro de un proyecto (body debe incluir project_id)
router.post('/', controller.createColumn);

// GET /api/columns -> listar columnas (opcional: ?project_id=123 para filtrar por proyecto)
router.get('/', controller.getColumns);

// GET /api/columns/:id -> obtener columna por id
router.get('/:id', controller.getColumnById);

// PUT /api/columns/:id -> actualizar columna (name)
router.put('/:id', controller.updateColumn);

// DELETE /api/columns/:id -> eliminar columna
router.delete('/:id', controller.deleteColumn);

module.exports = router;
