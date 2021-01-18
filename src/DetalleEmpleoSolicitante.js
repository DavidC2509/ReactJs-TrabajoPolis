import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Link, useHistory
} from "react-router-dom";
import {  MiBoton } from './Componentes';
import './DetalleEmpleoSolicitante.css';

import { Modal, Form, Container, Row, Col, Button } from 'react-bootstrap';


export const DetalleDelEmpleo = (props) => {


    let { idEmpleo } = props.match ? props.match.params : { idEmpleo: 0 };

    const idUsuario = localStorage.getItem('idUsuario');
    const RolUsuario = localStorage.getItem('RolUsuario');


    const [Curriculum, setCurriculum] = useState(false);
    const TieneCurricuum = () => setCurriculum(true);

    const [TrabajoDisponible, setTrabajoDisponible] = useState(false);
    const ActivarTrabajo = () => setTrabajoDisponible(true);

    const [ListaCurriculum, setListaCurriculum] = useState([]);


    const [Titulo, setTitulo] = useState("");
    const [Descripcion, setDescripcion] = useState("");
    const [Empresa, setEmpresa] = useState("");
    const [FechaHoraPublicacion, setFechaHoraPublicacion] = useState("");
    const [TelefonoContacto, setTelefonoContacto] = useState("");
    const [MailContacto, setMailContacto] = useState("");
    const [CiudadNombre, setCiudadNombre] = useState("");


    const [idCurriculum, setidCurriculum] = useState("");


    const [CategoriaEmpleo, setCategoriaEmpleo] = useState([]);




    const [VentanaPedirTrabajo, setVentanaPedirTrabajo] = useState(false);
    const CerrarVentanaPedirTrabajo = () => setVentanaPedirTrabajo(false);
    const AbrirVentanaPedirTrabajo = () => setVentanaPedirTrabajo(true);

    useEffect(() => {
        TraerElEmpleo()
        if (RolUsuario == 0) {
            TraerCurriculumUsuario()
            VerificacionSiYaTieneElTrabajo()
        }
    }, [])

    const TraerElEmpleo = () => {
        axios.get("http://127.0.0.1:8000/api/Empleo/" + idEmpleo)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setTitulo(response.data.Empleo.Titulo)
                    setDescripcion(response.data.Empleo.Descripcion)
                    setEmpresa(response.data.Empleo.Empresa)
                    setFechaHoraPublicacion(response.data.Empleo.FechaHoraPublicacion)
                    setTelefonoContacto(response.data.Empleo.TelefonoContacto)
                    setMailContacto(response.data.Empleo.MailContacto)
                    setCiudadNombre(response.data.Empleo.empleo_ciudad.Nombre)
                    setCategoriaEmpleo(response.data.Empleo.empleo_categorias)

                } else {
                    alert('Hubo un error al Traer Tus Curriculum');
                }
            })
    }

    const TraerCurriculumUsuario = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        axios.get("http://127.0.0.1:8000/api/Curriculum/" + idUsuario)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    if ( response.data.Usuario.usuario_curriculum.length > 0) {
                        setListaCurriculum(response.data.Usuario.usuario_curriculum)
                        TieneCurricuum()
                    }
                } else {
                    alert('Hubo un error al Traer Tus Curriculum');
                }
            })
    }


    const VerificacionSiYaTieneElTrabajo = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        axios.get("http://127.0.0.1:8000/api/VerificacionUsuarioTrabajo/" + idEmpleo + "/" + idUsuario)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    ActivarTrabajo()
                }
            })
    }

    const IngresarTrabajo = (e) => {
        e.preventDefault();
        if (idCurriculum != null) {
            debugger
            axios.post("http://127.0.0.1:8000/api/EmpleoCurriculumIngresar/" + idEmpleo + "/" + idCurriculum)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Empleo Solicitado')
                        CerrarVentanaPedirTrabajo()
                        ActivarTrabajo()
                    } else {
                        alert('Hubo un error al Traer Tus Curriculum');
                    }
                })
        }

    }



    var HtmlTrabajo;
    if (idUsuario != null) {
        if (RolUsuario == 0) {
            if (Curriculum == true) {

                if (TrabajoDisponible == false) {
                    HtmlTrabajo =
                        <Container>
                            <Button onClick={() => { AbrirVentanaPedirTrabajo() }}>Pedir Trabajo</Button>
                        </Container>
                } else {
                    HtmlTrabajo =
                        <Container>
                            <a>Usted Ya Pidio Este Trabajo</a>
                        </Container>
                }
            } else {
                HtmlTrabajo =
                    <Container>
                        <Link className="nav-link" to="/VerCuenta">Necesita Crear Curriculum</Link>
                    </Container>
            }
        } else {
            HtmlTrabajo =
                <Container>
                    <a>Usted no es solicitante</a>
                </Container>
        }
    }
    else {
        HtmlTrabajo =
            <Container>
                <Link className="nav-link" to="/LoginCuenta">Logear Cuenta</Link>
            </Container>
    }

    return (
        <Container fluid id="EmpleoById">
            <Row>
                <Col></Col>
                <Col></Col>
                <Col xs={{ order: 'last' }}>{HtmlTrabajo}</Col>
            </Row>
            <Row>
                <Col>
                    <img src={process.env.PUBLIC_URL + '/ImagenesDeCartasTrabajo.jpg'}></img>
                    <h3>Telefono Contacto</h3>
                    {TelefonoContacto}
                    <h3>Correo Empresa</h3>
                    {MailContacto}
                </Col>
                <Col><h1>Titulo</h1>
                    {Titulo}
                    <h2>Empresa</h2>
                    {Empresa}
                    <h3>Ciudad</h3>
                    {CiudadNombre}

                    <h3>Categorias</h3>
                    {CategoriaEmpleo?.map(item =>
                        <a key={"Empleo-" + item.Categoria_id}>{item.categoria.Nombre},</a>
                    )}
                </Col>
                <Col><h2>Descripcion</h2>
                    <Row>{Descripcion}</Row>
                </Col>
            </Row>



            <Modal
                show={VentanaPedirTrabajo}
                onHide={CerrarVentanaPedirTrabajo}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Pedir Trabajo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={IngresarTrabajo}>
                        <Container>
                            <Form.Label className="my-1 mr-2" htmlFor="inlineFormCustomSelectPref">
                                Escoga su Curriculum
                            </Form.Label>

                            <select   onChange={(event) => { setidCurriculum(event.target.value) }}>
                            <option value="Vacio"></option>
                            {ListaCurriculum?.map(item =>
                                    <option key={"Curriculum-" + item.id} value={item.id}>{item.Profesion}</option>
                                )}
                            </select>
                        </Container>
                        <MiBoton className="btn btn-primary">Ingresar Empleo</MiBoton>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaPedirTrabajo}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>

        </Container>

    )
}