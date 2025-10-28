const db = require('../config/db');

// Helpers
const getConn = () => db.promise();

// POST http://localhost:3000/api/columns
// Crea una columna dentro de un proyecto. Body: { name, project_id }
exports.createColumn = async (req, res) => {
  try {
    const { name, project_id } = req.body;
    if (!name) return res.status(400).json({ message: 'name es requerido' });
    if (!project_id) return res.status(400).json({ message: 'project_id es requerido' });

    const [result] = await getConn().query(
      'INSERT INTO columns (name, project_id) VALUES (?, ?)',
      [name, project_id]
    );

    const [rows] = await getConn().query('SELECT * FROM columns WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('createColumn error:', err);
    res.status(500).json({ message: 'Error creando columna' });
  }
};

// GET http://localhost:3000/api/columns
// Opcionalmente filtrar por proyecto: /api/columns?project_id=123
// Nota: también existe GET /api/projects/:id/columns en projectController
exports.getColumns = async (req, res) => {
  try {
    const projectId = req.query.project_id || req.query.projectId || req.params.projectId;
    let rows;
    if (projectId) {
      [rows] = await getConn().query(
        'SELECT * FROM columns WHERE project_id = ? ORDER BY id ASC',
        [projectId]
      );
    } else {
      [rows] = await getConn().query('SELECT * FROM columns ORDER BY id ASC');
    }
    res.json(rows);
  } catch (err) {
    console.error('getColumns error:', err);
    res.status(500).json({ message: 'Error listando columnas' });
  }
};

// GET http://localhost:3000/api/columns/:id
// Obtiene una columna por su id
exports.getColumnById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await getConn().query('SELECT * FROM columns WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Columna no encontrada' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getColumnById error:', err);
    res.status(500).json({ message: 'Error obteniendo columna' });
  }
};

// PUT http://localhost:3000/api/columns/:id
// Actualiza campos (name) de una columna
exports.updateColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (name === undefined) return res.status(400).json({ message: 'Nada para actualizar' });

    const [result] = await getConn().query('UPDATE columns SET name = ? WHERE id = ?', [name, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Columna no encontrada' });

    const [rows] = await getConn().query('SELECT * FROM columns WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('updateColumn error:', err);
    res.status(500).json({ message: 'Error actualizando columna' });
  }
};

// DELETE http://localhost:3000/api/columns/:id
// Elimina una columna
exports.deleteColumn = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await getConn().query('DELETE FROM columns WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Columna no encontrada' });
    res.json({ message: 'Columna eliminada' });
  } catch (err) {
    console.error('deleteColumn error:', err);
    res.status(500).json({ message: 'Error eliminando columna' });
  }
};
