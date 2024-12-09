import axios from "axios";

// URL base del backend
const BASE_URL = "http://localhost:5000/auth";

// Función para hacer login
export const login = async (email: string, password: string): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    });


    if (!response.data || !response.data.token) {
      throw new Error("No se recibió el token en la respuesta del backend.");
    }

    // Devuelve el token recibido desde el backend
    return response.data.token;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login fallido");
  }
};

