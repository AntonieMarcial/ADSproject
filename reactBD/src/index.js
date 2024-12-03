import React from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import Home from "./components/home";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/styles.css"
import Login from "./components/login"
import Info from "./components/info"
import Editar from "./components/editar";
import Nueva from "./components/nueva";
import Eliminar from "./components/eliminar";

const App = () => {
    return (
        <div>
            <Switch>
                <Route exact path="/Proyecto">
                    <Login />
                </Route>
                <Route exact path="/Proyecto/home">
                    <Home />
                </Route>

                <Route exact path="/Proyecto/info"> 
                    <Info />
                </Route>
                <Route exact path="/Proyecto/editar">
                    <Editar />
                </Route>
                <Route exact path="/Proyecto/nueva">
                    <Nueva />
                </Route>
                <Route exact path="/Proyecto/eliminar">
                    <Eliminar />
                </Route>
      
                <Route path="*" render={() => <h1>RECURSO NO ENCONTRADO</h1>} />
            </Switch>
        </div>
    );
}
export default App;