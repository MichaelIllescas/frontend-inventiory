import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import $ from "jquery";
import "datatables.net-bs4";
import Navbar from "../Navbar/Navbar";
import Footer from "../Index/Footer";
import axios from "axios";

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  fechaRegistro: string;
  estado: boolean;
}

const UsuariosRegistrados: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/usuarios/verUsuarios",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const usuariosFormateados = response.data.map((usuario: any) => ({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,
          fechaRegistro: usuario.fechaRegistro,
          estado: usuario.estado,
        }));

        setUsuarios(usuariosFormateados);
        setCargando(false);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
        setCargando(false);
      }
    };

    obtenerUsuarios();
  }, []);

  useEffect(() => {
    if (!cargando && usuarios.length > 0) {
      const table = $("#tablaUsuarios").DataTable({
        paging: true,
        searching: true,
        ordering: true,
        destroy: true,
        language: {
          processing: "Procesando...",
          search: "Buscar:",
          lengthMenu: "Mostrar _MENU_ registros",
          info: "Mostrando de _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Mostrando 0 registros",
          infoFiltered: "(filtrado de _MAX_ registros en total)",
          loadingRecords: "Cargando registros...",
          zeroRecords: "No se encontraron registros",
          emptyTable: "No hay datos disponibles en la tabla",
          paginate: {
            previous: "Anterior",
            next: "Siguiente",
          },
        },
      });

      return () => {
        table.destroy();
      };
    }
  }, [usuarios, cargando]);

  return (
    <div className="content">
      <Navbar />
      <div className="container text-dark mt-4 pb-4">
        <div className="typing-container titulo-main">
          <h1 className="typing-text text-center">Usuarios Registrados</h1>
        </div>
        <section>
          <div className="bg-light p-2 rounded shadow-sm">
            <div className="card-header bg-primary text-white rounded-2">
              <h6 className="m-0 font-weight-bold">Clientes Registrados</h6>
            </div>
            <div className="table-responsive p-3">
              <table
                id="tablaUsuarios"
                className="table table-bordered table-sm table-hover m-3 table-striped text-black-50"
                width="100%"
                cellSpacing="0"
              >
                <thead className="thead-dark">
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha de Registro</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td>{usuario.email}</td>
                      <td>{usuario.rol}</td>
                      <td>{usuario.fechaRegistro}</td>
                      <td>{usuario.estado ? "Activo" : "Inactivo"}</td>
                      <td>
                        <button className="btn btn-sm btn-primary rounded-circle">
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger rounded-circle ml-2">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default UsuariosRegistrados;
