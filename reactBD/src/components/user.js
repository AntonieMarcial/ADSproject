import React, { Component } from "react";

class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            password: "",
        };
    }

    // Maneja los cambios en los inputs
    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    };

    // Maneja el envío del formulario
    handleSubmit = (e) => {
        e.preventDefault();
        const formData = new URLSearchParams(this.state).toString();

        fetch("/P7v1/nuser", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        })
            .then((res) => {
                if (res.ok) {
                    alert("Usuario agregado con éxito");
                    this.setState({ name: "", password: "" }); // Reiniciar el formulario
                } else {
                    alert("Error al agregar usuario");
                }
            })
            .catch((err) => console.error("Error:", err));
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <input
                    name="name"
                    value={this.state.name}
                    onChange={this.handleChange}
                    placeholder="Nombre"
                />
                <input
                    name="password"
                    value={this.state.password}
                    onChange={this.handleChange}
                    placeholder="Contraseña"
                    type="password"
                />
                <button type="submit">Agregar</button>
            </form>
        );
    }
}

export default User;
