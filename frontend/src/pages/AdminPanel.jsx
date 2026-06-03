import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import FormViewer from '../components/FormViewer';

export default function AdminPanel() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nombre: '', apellidos: '', email: '', password: '', rol: 'basico' });
  const authHeaders = { 'x-auth-token': token || localStorage.getItem('token') };

  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users', { headers: { 'x-auth-token': token || localStorage.getItem('token') } });
      setUsers(res.data);
    } catch (e) {
      console.error(e);
    }
  }, [token]);

  useEffect(() => {
    const load = async () => { await fetchUsers(); };
    load();
  }, [fetchUsers]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/api/admin/users', newUser, {
      headers: authHeaders
    });
    fetchUsers();
    setNewUser({ nombre: '', apellidos: '', email: '', password: '', rol: 'basico' });
  };

  const handleRoleChange = async (userId, newRole) => {
    await axios.put(`http://localhost:5000/api/admin/users/${userId}/role`, { rol: newRole }, {
      headers: authHeaders
    });
    fetchUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Eliminar usuario?')) {
      await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, {
        headers: authHeaders
      });
      fetchUsers();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Panel de Administración</h1>

      {/* Formulario creación de usuarios */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Crear nuevo usuario</h2>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Nombre" value={newUser.nombre} onChange={e => setNewUser({...newUser, nombre: e.target.value})} required className="border rounded px-3 py-2" />
          <input type="text" placeholder="Apellidos" value={newUser.apellidos} onChange={e => setNewUser({...newUser, apellidos: e.target.value})} required className="border rounded px-3 py-2" />
          <input type="email" placeholder="Email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required className="border rounded px-3 py-2" />
          <input type="password" placeholder="Contraseña" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required className="border rounded px-3 py-2" />
          <select value={newUser.rol} onChange={e => setNewUser({...newUser, rol: e.target.value})} className="border rounded px-3 py-2">
            <option value="basico">Básico</option>
            <option value="contador">Contador</option>
            <option value="abogado">Abogado</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit" className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700">Crear usuario</button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Gestión de usuarios</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead><tr className="bg-gray-100"><th>Nombre</th><th>Email</th><th>Matrícula</th><th>Rol</th><th>Acciones</th></tr></thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b">
                  <td className="py-2 px-4">{user.nombre} {user.apellidos}</td>
                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.matricula}</td>
                  <td className="py-2 px-4">
                    <select value={user.rol} onChange={(e) => handleRoleChange(user._id, e.target.value)} className="border rounded p-1">
                      <option value="basico">Básico</option>
                      <option value="contador">Contador</option>
                      <option value="abogado">Abogado</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="py-2 px-4">
                    <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-800">🗑️ Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualización de formularios (solo diseño) */}
      <FormViewer />
    </div>
  );
}