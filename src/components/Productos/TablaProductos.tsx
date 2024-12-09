import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import $ from "jquery";
import "datatables.net-bs4";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

interface Producto {
  id: number;
  nombre: string;
  marca: string;
  descripcion: string;
  categoria: string;
  stock: number;
  precio: number;
}

const TablaProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState<boolean>(true);

  
  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/productos/verProductos",{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Agregar el token aquí
          },

        });


 // Mapear los productos para transformar `categoria` en un string
 const productosFormateados = response.data.map((producto: any) => ({
  id: producto.id,
  nombre: producto.nombre,
  marca: producto.marca,
  descripcion: producto.descripcion,
  categoria: producto.categoria.descripcion, // Extraer el nombre de la categoría
  stock: producto.stock,
  precio: producto.precio,
}));

setProductos(productosFormateados); // Actualiza el estado con los datos formateados


        setCargando(false);
      } catch (error) {
        console.error("Error al obtener productos:", error);
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  // Configurar DataTable después de cargar los datos
  useEffect(() => {
    if (!cargando) {
      $(document).ready(function () {
        $("#dataTable").DataTable({
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
            zeroRecords: "No se encontraron registros",
            emptyTable: "No hay datos disponibles en la tabla",
            paginate: {
              previous: "Anterior",
              next: "Siguiente",
            },
            aria: {
              sortAscending: ": activar para ordenar la columna de manera ascendente",
              sortDescending: ": activar para ordenar la columna de manera descendente",
            },
          },
        });
      });
    }
  }, [cargando]);

  return (
    <div className="content">
      <div className="container mb-0 pb-2">
        <div className="cards shadow-sm bg-white p-2">
          <div className="card-header bg-primary text-white rounded-2">
            <h6 className="m-0 font-weight-bold">Productos Registrados</h6>
          </div>
          <div className="card-body">
            {cargando ? (
              <div className="text-center">Cargando productos...</div>
            ) : (
              <div className="table-responsive p-3">
                <table
                  id="dataTable"
                  className="table table-bordered table-hover text-center m-3 table-sm"
                >
                  <thead className="thead-dark">
                    <tr>
                      <th>ID</th>
                      <th>Nombre</th>
                      <th>Marca</th>
                      <th>Descripción</th>
                      <th>Categoría</th>
                      <th>Precio</th>
                      <th>Stock</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.map((producto) => (
                      <tr
                        key={producto.id}
                        className={producto.stock === 0 ? "table-danger" : ""}
                      >
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td>{producto.marca}</td>
                        <td>{producto.descripcion}</td>
                        <td>{producto.categoria}</td>
                        <td>{producto.precio}</td>
                        <td>{producto.stock}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            title="Editar Producto"
                            onClick={() =>
                              alert(`Editar producto ID: ${producto.id}`)
                            }
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colSpan={7} className="text-right">
                        Total de Productos:
                      </th>
                      <th>{productos.length}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaProductos;
