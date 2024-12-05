import React from "react";
import { Redirect } from "react-router-dom";
import { Alert } from "react-bootstrap";

class Login extends React.Component { // Crear una clase llamada Login que extienda de React.Component 
  constructor() {  // Crear un constructor que inicialice el estado con las siguientes propiedades:
    super(); // Llamar al constructor de la clase padre con super() 
    this.state = { // Inicializar el estado con las siguientes propiedades
      condition: false,
      usuario: "",
      password: "",
      showAlert: false,
      alertVariant: "success",
      alertMessage: "",
      shouldRedirect: false
    };
  }

  handleInputChange = (e) => {  // Crear un método llamado handleInputChange que reciba un evento e y actualice el estado con el valor del input
    this.setState({  // Actualizar el estado con el valor del input 
      [e.target.name]: e.target.value 
    });
  }

  validar = () => { // Crear un método llamado validar que haga una petición fetch a la ruta Login con los parámetros User y password
    const { usuario, password } = this.state; // Obtener el usuario y la contraseña del estado 
    
    fetch('Login?User=' + usuario + '&password=' + password) // Hacer una petición fetch a la ruta Login con los parámetros User y password
      .then(response => response.text()) // Convertir la respuesta a texto 
      .then(usuario => { // Convertir la respuesta a texto 
        let ret = usuario.includes("yes");  // Verificar si el usuario es válido si la respuesta contiene la palabra yes

        if (ret) { // Si el usuario es válido redireccionar a la página de inicio
          this.setState({  // Actualizar el estado con la condición, showAlert, alertVariant y alertMessage
            condition: true,
            showAlert: true,
            alertVariant: "success",
            alertMessage: "USUARIO VÁLIDO"
          });
          
          // Esperar 1.5 segundos antes de redireccionar
          setTimeout(() => { 
            this.setState({ shouldRedirect: true });  // Redireccionar a la página de inicio
          }, 1500);
          
        } else { // Si el usuario no es válido mostrar una alerta con el mensaje USUARIO NO VÁLIDO
          this.setState({
            condition: false,
            showAlert: true,
            alertVariant: "danger",
            alertMessage: "USUARIO NO VÁLIDO",
            usuario: "",
            password: ""
          });
        }
      });
  }

  render() { // Crear un método render que retorne un div con la clase login-container 
    const {  // Obtener las propiedades del estado
      shouldRedirect, 
      usuario, 
      password, 
      showAlert, 
      alertVariant, 
      alertMessage 
    } = this.state;

    if (shouldRedirect) { // Si shouldRedirect es verdadero redireccionar a la página de inicio 
      return <Redirect to='/P7v1/home' />;
    }

    return (  // Retornar un div con la clase login-container y dentro un div con la clase login-content 
      <div className="login-container">
        <div className="login-content">
          <h1 className="AlignCenter">LOGIN</h1>
          
          {showAlert && (
            <Alert 
              variant={alertVariant} 
              onClose={() => this.setState({ showAlert: false })} 
              dismissible
            >
              {alertMessage}
            </Alert>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="usuario">Usuario</label>
            <input
              placeholder="Ingrese el usuario"
              type="text"
              name="usuario"
              value={usuario}
              onChange={this.handleInputChange} // Llamar al método handleInputChange cuando el input cambie 
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              placeholder="Ingrese su contraseña"
              type="password"
              name="password"
              value={password}
              onChange={this.handleInputChange} // Llamar al método handleInputChange cuando el input cambie
              className="form-control"
            />
          </div>

          <button 
            className="btn btn-primary"
            onClick={this.validar}  // Llamar al método validar cuando se haga click en el botón 
          >
            Submit
          </button>

          <div className="team-members">
            <h4>Integrantes del Equipo:</h4>
            <ul>
              <li>Gonzalez Garcia Alan Alberto</li>
              <li>Ortega Marcial Marco Antonio</li>
              <li>Rodríguez Ayala Braulio Emilio</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;