import React, { useState } from 'react';
import axios from 'axios';
import {
     useHistory
} from "react-router-dom";

import { MiInput, MiLabel, MiBoton } from './Componentes';
import { Container, Form, Row, Modal, Button } from 'react-bootstrap';

import { useDispatch } from 'react-redux';
import {abrirLogin} from './actions/loginAction';

export const LoginUsuario = (props) => {
    const dispatch = useDispatch();
    
    let history = useHistory();

    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");


    const [Nombres, setNombres] = useState("");
    const [Apellidos, setApellidos] = useState("");


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    let baseUrl = 'http://127.0.0.1:8000/api/auth/';

    const enviarLogin = (e) => {
        const remember_me = true;
        e.preventDefault();
        const Login = {
            email,
            password,
            remember_me
        };
        axios.post("http://127.0.0.1:8000/api/auth/login", Login)
            .then(response => {
                if (response.data.res === true) {
                    localStorage.setItem('TokkenUsuario', response.data.access_token);
                    dispatch(abrirLogin())
                    history.push('/Empleos')
                    TraerUsuario()
                } else {
                    alert(response.data.message);
                }
            })
    }

    const enviarUsuario = (e) => {
        const Rol = 0;
        e.preventDefault();
        const Usuario = {
            Nombres,
            Apellidos,
            email,
            password,
            Rol
        };
        axios.post("http://127.0.0.1:8000/api/User", Usuario)
            .then(response => {
                if (response.data.res === true) {
                    alert('Usuario Creado');
                    handleClose()
                } else {
                    alert('Hubo un error al Crear');
                }
            })
    }

    const abrirFormularioLogin = () => {
        setpassword("")
        setemail("")
        setNombres("")
        handleShow()
    }

    const TraerUsuario = () => {
        const user = localStorage.getItem('TokkenUsuario');
        return new Promise((resolve, reject) => {
            const instance = axios.create({
                baseURL: baseUrl,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + user
                }
            });
            instance.get('user/', {})
                .then(r => {
                    if (r.data.res == true) {
                        localStorage.setItem('idUsuario', r.data.data.id);
                        localStorage.setItem('RolUsuario', r.data.data.Rol);
                    } else {
                        alert('Hubo un error al Traer Tu usuario');
                    }
                }).catch(e => {
                    console.log(e);
                    reject(e.response);
                });
        });
    };



    return (
        <Container>
            <Form id="Form_Login" onSubmit={enviarLogin}>
                <Container>
                    <MiLabel className="form-group">Email:</MiLabel>
                    <MiInput type="Email" className="form-control" id="Email" value={email} onChange={(event) => { setemail(event.target.value) }} />

                    <MiLabel className="form-group">Password:</MiLabel>
                    <MiInput type="Password" className="form-control" id="password" value={password} onChange={(event) => { setpassword(event.target.value) }} />

                    <MiBoton className="btn btn-primary">Loguear</MiBoton>
                </Container>
            </Form>
            
            <Row>
            <a id="btn_Crear_Cuenta"  href="#" onClick={() => { abrirFormularioLogin() }}>Crear Cuenta</a>
            </Row>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                

            >
                <Modal.Header closeButton>
                    <Modal.Title>Creacion de una Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="Formulario-Cuenta" onSubmit={enviarUsuario}>
                        <Container>
                            <MiLabel className="form-group">Nombre:</MiLabel>
                            <MiInput type="text" className="form-control" id="Nombre" value={Nombres} onChange={(event) => { setNombres(event.target.value) }} />

                            <MiLabel className="form-group">Apellido:</MiLabel>
                            <MiInput type="text" className="form-control" id="Apellido" value={Apellidos} onChange={(event) => { setApellidos(event.target.value) }} />

                            <MiLabel className="form-group">Email:</MiLabel>
                            <MiInput type="Email" className="form-control" id="Email" value={email} onChange={(event) => { setemail(event.target.value) }} />

                            <MiLabel className="form-group">Password:</MiLabel>
                            <MiInput type="Password" className="form-control" id="Password" value={password} onChange={(event) => { setpassword(event.target.value) }} />
                        </Container>
                        <MiBoton className="btn btn-primary">Guardar Cuenta</MiBoton>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )

}