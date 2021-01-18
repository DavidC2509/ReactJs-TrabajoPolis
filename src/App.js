import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { ListaEmpleosInicio } from './VentanaInicio';
import { LoginUsuario } from './LoginUsuario';
import axios from 'axios';
import { VerMiCuenta } from './VerMiCuenta';
import { ListaEmpleosCategoria } from './CategoriaEmpleo';
import { DetalleDelEmpleo } from './DetalleEmpleoSolicitante';
import './DetalleEmpleoSolicitante.css';
import { Container, Row, Nav, Col } from 'react-bootstrap';
import './App.css';

import { useDispatch, useSelector } from 'react-redux';
import { cerrarLogin, abrirLogin } from './actions/loginAction';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'  
import { faYoutube } from '@fortawesome/free-brands-svg-icons'  
import { faFacebook } from '@fortawesome/free-brands-svg-icons'  



function App() {

  const sesionIniciada = useSelector(state => state.login.datosSesion.sesionIniciada);
  console.log('sesioniniciada', sesionIniciada)

  const dispatch = useDispatch();


  const user = localStorage.getItem('TokkenUsuario');
  console.log(localStorage.getItem('TokkenUsuario'))

  let baseUrl = 'http://127.0.0.1:8000/api/auth/';

  if (user && !sesionIniciada) {
    dispatch(abrirLogin());
  }

  const logOut = () => {
    return new Promise((resolve, reject) => {
      const instance = axios.create({
        baseURL: baseUrl,
        headers: {
          'Authorization': 'Bearer ' + user
        }
      });
      instance.get('logout/', {})
        .then(r => {
          if (r.data.res == true) {
            localStorage.removeItem('TokkenUsuario');
            localStorage.removeItem('idUsuario');
            localStorage.removeItem('RolUsuario');
            dispatch(cerrarLogin());
            resolve(r.data);
          } else {
            alert('Hubo un error al Salir');
          }
        }).catch(e => {
          console.log(e);
          reject(e.response);
        });
    });
  };

  var EnlaceCuenta;
  if (sesionIniciada == true) {
    EnlaceCuenta =
      <Row>
        <Col><Link className="nav-link" to="/VerCuenta">Ver Cuenta</Link></Col>
        <Col><Link className="nav-link" to="/Empleos" onClick={() => { logOut() }}>Salir Cuenta</Link></Col>
      </Row>
  } else {
    EnlaceCuenta = <Link className="nav-link" to="/LoginCuenta">Logear Cuenta</Link>
  }

  return (
    <Router>
      <Container fluid id="ContainerPadre">
        
        <Row id="ImagenesArriba">
          <Col className="polaroid"> <img src={process.env.PUBLIC_URL + '/ImagenTrabajo.jpg'} className="ImagenIzquierda" />
            <Row className="ContenedorLetra"><p>Comienza Tu Negocio</p></Row>
          </Col>
          <Col> <img src={process.env.PUBLIC_URL + '/ImagenMedio.jpg'} className="ImagenMedio" />
            <Row className="ContenedorLetra"><p>Encuentra Tu Talento</p></Row>
          </Col>
          <Col> <img src={process.env.PUBLIC_URL + '/ImagenDerecha.jpg'} className="ImagenDerecha" />
            <Row className="ContenedorLetra"><p>Unete a la mejor Comunidad</p></Row>
          </Col>
        </Row>
        <Row className="NavEnlace">
          <Nav as="ul">
            {EnlaceCuenta}
            <Link className="nav-link" to="/Empleos">Empleos</Link>
          </Nav>
        </Row>
        
       
        <Row id="ContenedorBody">
          <Switch>
            <Route exact path="/Empleos" component={ListaEmpleosInicio}>
            </Route>
            <Route exact path="/LoginCuenta">
              <LoginUsuario />
            </Route>
            <Route exact path="/VerCuenta">
              <VerMiCuenta />
            </Route>

            <Route exact path="/CategoriaEmpleo/:idEmpleo" component={ListaEmpleosCategoria}>
            </Route>


            <Route exact path="/DetalleEmpleo/:idEmpleo" component={DetalleDelEmpleo}>
            </Route>
          </Switch>
        </Row>
        <Row>
          <footer>
            <Container id="footer-contend">
              <p>
                &copy;
                Pagina Trabajp de YucaPolis
            </p>
              <p id="social-icons">
                <a href="#">
                <FontAwesomeIcon icon={faFacebook} />
                </a>
                <a href="#">
            
                <FontAwesomeIcon icon={faTwitter} />
          
                </a>
                <a href="#">
                <FontAwesomeIcon icon={faYoutube} />
                </a>
              </p>
              <ul id="menu-footer">
                <li><a href="#">Home</a></li>
                <li><a href="#">TrabajoPolisYuca</a></li>
                <li><a href="#">Empleos</a></li>
              </ul>

            </Container>
          </footer>
        </Row>

      </Container>
    </Router>
  );
}

export default App;
