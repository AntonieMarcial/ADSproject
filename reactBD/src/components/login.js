import React from "react";
import { Redirect } from "react-router-dom"


class Login extends React.Component {
  constructor()
  {
    super();
    this.state = {condition: false}
 }

      validar=(usuario,password) =>{
        //fetch('http://localhost:8080/Proyecto/Login?User='+usuario+'&password='+password+'')
        fetch('Login?User='+usuario+'&password='+password+'')
        .then(response => response.text())
        .then(usuario =>{
          let ret=usuario.includes("yes");

          if(ret)
          {
          this.setState({ condition: true });          
          alert("USUARIO VALIDO");          
          }
          else          
          {
          this.setState({ condition: false });                    
          alert("USUARIO NO VALIDO");                    
          }
        })
     
    }
    render() {
      const styles = {
          padding : '5px'
      }

      const { condition } = this.state;

      if (condition) {
        return <Redirect to='/Proyecto/home'/>;
      }

      return(
        
            <div className = "center-container" style={styles} id="equis">
               <h1 className="AlignCenter" > LOGIN </h1>
            <div class="form-group">
                <label class="form-label" for="User">Usuario</label>
                <input placeholder="Ingrese el usuario" type="text" id="User" class="form-control" />
            </div>
            <div class="form-group"><label class="form-label" for="password">Password</label>
                 <input placeholder="Ingrese su contraseña" type="password" id="password" class="form-control" />
            </div>
            <button className="btn btn-primary" onClick={() => this.validar(document.getElementById("User").value,document.getElementById("password").value)}>
                Submit
              </button>
            </div>        )    
  }
}
export default Login; 