import React, { useState } from "react";
import "/src/styles/LoginForm.css";
import "/src/styles/stylesGeneral.css";

import Footer from "../src/components/Index/Footer";
import { useNavigate } from "react-router-dom";
import { login } from "../src/servicios/authService"; 



import "/src/styles/LoginForm.css";


const LoginForm: React.FC = () => {
  const [email, setEmail] = useState(""); // Estado para email
  const [password, setPassword] = useState(""); // Estado para password
  const [error, setError] = useState(""); // Estado para mostrar errores
  const navigate = useNavigate(); // Hook para redirección

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir recarga de página
    setError(""); // Limpiar cualquier error previo

    try {
      const token = await login(email, password); // Llamar al servicio de login
      console.log("Token recibido:", token); // Depuración: Verifica el token recibido
      sessionStorage.setItem("token", token); // Guardar el token en sessionStorage
      console.log("Token guardado en sessionStorage:", sessionStorage.getItem("token")); // Verifica que se guardó
      navigate("/index"); // Redirigir al index
    } catch (err: any) {
      console.error("Error en el login:", err.message); // Log de error
      setError(err.message || "Error al iniciar sesión. Verifica tus credenciales."); // Manejar errores
    }
  };

  return (
    <div className="login-wrapper mt-1 content">
      <div className="d-flex align-items-center justify-content-around w-75 flex-wrap m-5">
        <div className="typing-container d-flex align-items-center justify-content-center w-auto pb-0 mb-0 h-auto">
          <h1 className="typing-text pt-5">Bienvenid@ a</h1>
          <h1 className="typing-text">Inventiory!</h1>
        </div>

        <div>
          {/* Formulario */}
          <form className="form" onSubmit={handleLogin}>
            <p id="heading">Inicio de Sesión</p>
            <div className="field">
              <input
                autoComplete="off"
                placeholder="Email"
                className="input-field"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="field">
              <input
                placeholder="Clave"
                className="input-field"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="btn">
              <button type="submit" className="button1">Ingresar</button>
              <button className="button2" type="button">Registrarse</button>
            </div>
            <button type="button" className="button3">¿Olvidaste tu Contraseña?</button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>} {/* Mostrar error */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginForm;
