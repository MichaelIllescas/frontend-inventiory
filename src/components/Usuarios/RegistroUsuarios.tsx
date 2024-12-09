import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import Footer from "../Index/Footer";

const RegistrarUsuario: React.FC = () => {
  const [roles, setRoles] = useState<string[]>([]); // Roles disponibles
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
  }); // Estado del formulario
  const [passwordRepeat, setPasswordRepeat] = useState(""); // Estado para repetir contraseña
  const [mensaje, setMensaje] = useState(""); // Mensaje para éxito o error
  const [tipoMensaje, setTipoMensaje] = useState<"exito" | "error" | "">(""); // Tipo de mensaje

  // Obtener roles desde el backend
  useEffect(() => {
    const obtenerRoles = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/roles/obtenerRoles",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRoles(response.data); // Guardar los roles en el estado
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };

    obtenerRoles();
  }, []);

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "clave_repeat") {
      setPasswordRepeat(value); // Actualizar contraseña repetida
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario

    // Validar que las contraseñas coincidan
    if (formData.password !== passwordRepeat) {
      setMensaje("Las contraseñas no coinciden");
      setTipoMensaje("error");
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/auth/register", // Endpoint del registro
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Mostrar mensaje de éxito y limpiar el formulario
      setMensaje("Usuario registrado con éxito");
      setTipoMensaje("exito");
      setFormData({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        role: "",
      });
      setPasswordRepeat(""); // Limpiar la contraseña repetida
    } catch (error: any) {
      // Manejo de errores
      if (error.response) {
        const mensajeError = error.response.data?.error || "Debe completar los campos correctamente";
        setMensaje(mensajeError);
      } else {
        setMensaje("Hubo un problema al registrar el usuario");
      }
      setTipoMensaje("error");
    }
  };

  return (
    <div className="content" id="page-top">
      <Navbar />
      <div className="typing-container titulo-main pb-0">
        <h1 className="typing-text text-center">Registrar Usuario</h1>
      </div>
      <div className="d-flex align-items-center justify-content-center mb-5 pb-5">
        <div
          className="container p-4 bg-light text-dark rounded shadow-lg"
          style={{ maxWidth: "700px" }}
        >
          <form onSubmit={handleSubmit}>
            {/* Nombre y apellido */}
            <div className="row g-3 mt-3 mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="firstname">Nombre:</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    id="firstname"
                    name="firstname"
                    placeholder="Ingrese el nombre del usuario"
                    value={formData.firstname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="lastname">Apellido:</label>
                  <input
                    type="text"
                    className="form-control form-control-md"
                    id="lastname"
                    name="lastname"
                    placeholder="Ingrese el apellido del usuario"
                    value={formData.lastname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Email y Rol */}
            <div className="row g-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    className="form-control form-control-md"
                    id="email"
                    name="email"
                    placeholder="Ingrese el email del usuario"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="rol">Rol:</label>
                  <select
                    className="form-control form-control-sm form-select"
                    id="rol"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="" disabled>
                      Seleccionar un rol
                    </option>
                    {roles.map((rol) => (
                      <option key={rol} value={rol}>
                        {rol}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Contraseña y Repetir Contraseña */}
            <div className="row g-3 mt-3">
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="password">Contraseña:</label>
                  <input
                    type="password"
                    className="form-control form-control-md"
                    id="password"
                    name="password"
                    placeholder="Ingrese la contraseña"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label htmlFor="clave_repeat">Repetir Contraseña:</label>
                  <input
                    type="password"
                    className="form-control form-control-md"
                    id="clave_repeat"
                    name="clave_repeat"
                    placeholder="Repita la contraseña"
                    value={passwordRepeat}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Mensaje de confirmación o error */}
            {mensaje && (
              <div
                className={`alert mt-4 d-flex align-items-center justify-content-center ${
                  tipoMensaje === "exito" ? "alert-success" : "alert-danger"
                }`}
                role="alert"
              >
                <i
                  className={`bi ${
                    tipoMensaje === "exito"
                      ? "bi-check-circle-fill"
                      : "bi-exclamation-triangle-fill"
                  } me-2`}
                ></i>
                <div>{mensaje}</div>
              </div>
            )}

            {/* Botón Guardar */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-success btn-md w-50">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      <a className="scroll-to-top rounded" href="#page-top">
        <i className="fas fa-angle-up"></i>
      </a>
    </div>
  );
};

export default RegistrarUsuario;
