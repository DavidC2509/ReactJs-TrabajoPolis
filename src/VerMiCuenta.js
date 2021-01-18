// Comence hacer este codigo el dia 10 junio 

// Dia 13 No entiendo las funciones de HtmlDependiendoDelRol Solo Dios se acuerdo en este punto

//Dia 15 Inge cuando este queriendo leer este codigo seguro no va entender ,descuide a este punto yo tampoco.


// Dia 16 deje de hacer cambios en esta pagina solo falta hacerlo bonito y una imagen (Supuestamente ya esta todo las funcionalidades en todo Ok)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Link, useHistory
} from "react-router-dom";
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { MiInput, MiLabel, MiBoton } from './Componentes';
import { Table, Form, Container, Row, DropdownItem } from 'react-bootstrap';

import './VentanaVerCuenta.css';


import DropdownButton from 'react-bootstrap/DropdownButton'

export const VerMiCuenta = (props) => {

    const [TodasLasCiudades, setTodasLasCiudades] = useState([]);

    const user = localStorage.getItem('TokkenUsuario');

    let baseUrl = 'http://127.0.0.1:8000/api/auth/';

    let history = useHistory();

    useEffect(() => {
        TraerUsuario()
        TraerTodasLasCiudades()
    }, [])
    //Usuario
    const [email, setemail] = useState("");
    const [Nombres, setNombres] = useState("");
    const [Apellidos, setApellidos] = useState("");
    const [id, setid] = useState("");
    const [Rol, setRol] = useState("");
    const [CreacionCuenta, setCreacionCuenta] = useState("");
    const [password, setpassword] = useState("");

    const [RolUsuario, setRolUsuario] = useState("");



    // Ventana UsuarioUpdate
    const [VentanaUpdateUsuario, setVentanaUpdateUsuario] = useState(false);
    const CerrarVentanaUsuario = () => setVentanaUpdateUsuario(false);
    const AbrirVentanaUsario = () => setVentanaUpdateUsuario(true);

    const TraerUsuario = () => {
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
                        setemail(r.data.data.email)
                        setNombres(r.data.data.Nombres)
                        setApellidos(r.data.data.Apellidos)
                        setid(r.data.data.id)
                        setCreacionCuenta(r.data.data.created_at)
                        setRolUsuario(r.data.data.Rol)
                        if (r.data.data.Rol == 0) {
                            setRol('Solicitante')
                            TraerCosasDelSolicitante()
                        }
                        if (r.data.data.Rol == 1) {
                            setRol('Empleador')
                            traerEmpleosDelUsuario()
                        }
                        if (r.data.data.Rol == 2) {
                            setRol('Administrador')
                            TraerCosasDelAdmind()
                        }
                        localStorage.setItem('idUsuario', r.data.data.id);
                    } else {
                        alert('Hubo un error al Traer Tu usuario');
                    }
                }).catch(e => {
                    console.log(e);
                    reject(e.response);
                });
        });
    };

    const abriEditarUsuario = () => {
        AbrirVentanaUsario()
    }



    const enviarUsuario = (e) => {
        e.preventDefault();
        const Usuario = {
            Nombres,
            Apellidos,
            email,
            password
        };
        actulizarUsuario(id, Usuario);
    }

    const actulizarUsuario = (idUsuario, ProductoUsuario) => {
        axios.patch("http://127.0.0.1:8000/api/User/" + idUsuario, ProductoUsuario)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    alert('Usuario Actulizado');
                    CerrarVentanaUsuario()
                    TraerUsuario()
                } else {
                    alert('Hubo un error al Actulizar');
                }
            })
    }


    //Curriculum


    const [ListaCurriculum, setListaCurriculum] = useState([]);

    const [ListaDeLosEmpleoDelSolicitante, setListaDeLosEmpleoDelSolicitante] = useState([]);

    //Ventana Modal Del Modificar Curriculum
    const [VentanModificacionCurriculum, setVentanModificacionCurriculum] = useState(false);
    const CerrarVentanModificacionCurriculum = () => setVentanModificacionCurriculum(false);
    const AbrirVentanModificacionCurriculum = () => setVentanModificacionCurriculum(true);


    //Contaste que guardo del curriculum
    const [TrabajosAnteriores, setTrabajosAnteriores] = useState("");
    const [Logros, setLogros] = useState("");
    const [Profesion, setProfesion] = useState("");
    const [TelefonoContacto, setTelefonoContacto] = useState("");
    const [FechaDeNacimiento, setFechaDeNacimiento] = useState("");

    // Id que guardo
    const [CurriculumId, setCurriculumId] = useState("");
    const [Ciudad_id, setCiudad_id] = useState("");
    const [Usuario_id, setUsuario_id] = useState("");

    const abrirEditarCurriculum = (idCurriculum) => {
        axios.get("http://127.0.0.1:8000/api/CurriculumById/" + idCurriculum)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setCurriculumId(response.data.Curriculum.id)
                    setCiudad_id(response.data.Curriculum.Ciudad_id)
                    setUsuario_id(response.data.Curriculum.Usuario_id)
                    setTrabajosAnteriores(response.data.Curriculum.TrabajosAnteriores)
                    setLogros(response.data.Curriculum.Logros)
                    setApellidos(response.data.Curriculum.Apellidos)
                    setProfesion(response.data.Curriculum.Profesion)
                    setTelefonoContacto(response.data.Curriculum.TelefonoContacto)
                    setFechaDeNacimiento(response.data.Curriculum.FechaDeNacimiento)
                    AbrirVentanModificacionCurriculum()
                } else {
                    alert('Hubo un error al Traer Tu Curriculum');
                }
            })
    }

    const TraerTodasLasCiudades = () => {
        axios.get("http://127.0.0.1:8000/api/Ciudade/")
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setTodasLasCiudades(response.data.Ciudades)
                } else {
                    alert('Hubo un error al Traer Tus Ciudades');
                }
            })
    }

    const TraerCosasDelSolicitante = () => {
        TraerCurriculum()
        TraerEmpleoDelSolicitante()
    }


    const TraerCurriculum = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        axios.get("http://127.0.0.1:8000/api/Curriculum/" + idUsuario)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setListaCurriculum(response.data.Usuario.usuario_curriculum)
                } else {
                    alert('Hubo un error al Traer Tus Curriculum');
                }
            })
    }

    const TraerEmpleoDelSolicitante = () => {
        const idUsuario = localStorage.getItem('idUsuario');
        axios.get("http://127.0.0.1:8000/api/EmpleosDelSolicitante/" + idUsuario)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setListaDeLosEmpleoDelSolicitante(response.data.EmpleoDelUsuario)
                } else {
                    alert('Hubo un error al Traer Tus Curriculum');
                }
            })
    }

    const eleminarCurriculum = (idCurriculum) => {
        const confirmacion = window.confirm('Está seguro que desea eliminar?');
        if (!confirmacion) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/Curriculum/' + idCurriculum)
            .then(response => {
                if (response.data.res == true) {
                    TraerUsuario()
                } else {
                    alert('Hubo un error al eliminar');
                }
            });
    }


    const enviarCurriculum = (e) => {
        e.preventDefault();
        const Curriculum = {
            Usuario_id,
            Ciudad_id,
            TrabajosAnteriores,
            Logros,
            Profesion,
            TelefonoContacto,
            FechaDeNacimiento
        };
        actulizarCurriculum(CurriculumId, Curriculum);
    }

    const actulizarCurriculum = (idCurriculum, ProductoCurriculum) => {
        axios.patch("http://127.0.0.1:8000/api/Curriculum/" + idCurriculum, ProductoCurriculum)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    alert('Curriculum Actulizado');
                    CerrarVentanModificacionCurriculum()
                    TraerUsuario()
                } else {
                    alert('Hubo un error al Actulizar');
                }
            })
    }


    const CrearCurriculum = (e) => {
        e.preventDefault();
        const Usuario_id = localStorage.getItem('idUsuario');
        const Curriculum = {
            Usuario_id,
            Ciudad_id,
            TrabajosAnteriores,
            Logros,
            Profesion,
            TelefonoContacto,
            FechaDeNacimiento
        };
        axios.post("http://127.0.0.1:8000/api/Curriculum", Curriculum)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    alert('Curriculum Creado');
                    CerrarVentanaCreacionCurriculum()
                    TraerUsuario()
                } else {
                    alert('Hubo un error al Crear Tu Curriculum');
                }
            })
    }


    //Ventana Creacion Curriculum Model
    const [VentanaCreacionCurriculum, setVentanaCreacionCurriculum] = useState(false);
    const CerrarVentanaCreacionCurriculum = () => setVentanaCreacionCurriculum(false);
    const AbrirVentanaCreacionCurriculum = () => setVentanaCreacionCurriculum(true);

    const abrirCrearCurriculum = () => {
        setTrabajosAnteriores("")
        setLogros("")
        setProfesion("")
        setTelefonoContacto("")
        setFechaDeNacimiento("")
        AbrirVentanaCreacionCurriculum()
    }


    // ROl 1
    //Empleos

    const [Empleo_id, setEmpleo_id] = useState("");

    const [Titulo, setTitulo] = useState("");
    const [Descripcion, setDescripcion] = useState("");
    const [Empresa, setEmpresa] = useState("");
    const [FechaHoraPublicacion, setFechaHoraPublicacion] = useState("");
    //const [TelefonoContacto, setTelefonoContacto] = useState("");
    const [MailContacto, setMailContacto] = useState("");
    // const [Ciudad_id, setCiudad_id] = useState("");

    const [ListaEmpleosDelUsuario, setListaEmpleosDelUsuario] = useState([]);
    const [ListaUsuarioPidieronElEmpleo, setListaUsuarioPidieronElEmpleo] = useState([]);



    const [VentanaModificacionEmpleo, setVentanaModificacionEmpleo] = useState(false);
    const CerrarVentanaModificacionEmpleo = () => setVentanaModificacionEmpleo(false);
    const AbrirVentanaModificacionEmpleo = () => setVentanaModificacionEmpleo(true);

    // VentanaSolicitantes
    const [VentanSolicitantesDelEmpleo, setVentanSolicitantesDelEmpleo] = useState(false);
    const CerrarVentanSolicitantesDelEmpleo = () => setVentanSolicitantesDelEmpleo(false);
    const AbrirVentanSolicitantesDelEmpleo = () => setVentanSolicitantesDelEmpleo(true);


    const traerEmpleosDelUsuario = (event) => {
        const idUsuario = localStorage.getItem('idUsuario');
        axios.get('http://127.0.0.1:8000/api/EmpleoUsuario/' + idUsuario)
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setListaEmpleosDelUsuario(response.data.Usuario.usuario_empleador)
                    console.log("Trajo Todo Tus Empleos")

                } else {
                    console.log("Error traer Productos")
                }
            });
    }

    const VerSolicitantesDelEmpleo = (idEmpleo) => {
        axios.get('http://127.0.0.1:8000/api/EmpleoSolicitantes/' + idEmpleo)
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setListaUsuarioPidieronElEmpleo(response.data.UsuarioQuePidieronEmpleo)
                    AbrirVentanSolicitantesDelEmpleo()
                    console.log("Trajo Todo Tus Usuarios")
                } else {
                    console.log("Error traer Solicitantes")
                }
            });
    }

    const eleminarEmpleo = (idEmpleo) => {
        const confirmacion = window.confirm('Está seguro que desea eliminar?');
        if (!confirmacion) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/Empleo/' + idEmpleo)
            .then(response => {
                if (response.data.res == true) {
                    alert('Empleo Eleminado')
                    TraerUsuario()
                } else {
                    alert('Hubo un error al eliminar');
                }
            });
    }

    const abrirEditarEmpleo = (idEmpleo) => {
        axios.get("http://127.0.0.1:8000/api/EmpleoById/" + idEmpleo)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setEmpleo_id(response.data.Empleo.id)
                    setTitulo(response.data.Empleo.Titulo)
                    setDescripcion(response.data.Empleo.Descripcion)
                    setEmpresa(response.data.Empleo.Empresa)
                    setFechaHoraPublicacion(response.data.Empleo.FechaHoraPublicacion)
                    setTelefonoContacto(response.data.Empleo.TelefonoContacto)
                    setMailContacto(response.data.Empleo.MailContacto)
                    setUsuario_id(response.data.Empleo.Usuario_id)
                    setCiudad_id(response.data.Empleo.Ciudad_id)
                    AbrirVentanaModificacionEmpleo()
                } else {
                    alert('Hubo un error al Traer Tu Empleo');
                }
            })
    }


    const enviarEmpleo = (e) => {
        e.preventDefault();
        const Empleo = {
            Titulo,
            Descripcion,
            Empresa,
            FechaHoraPublicacion,
            TelefonoContacto,
            MailContacto,
            Usuario_id,
            Ciudad_id
        };
        actulizarEmpleo(Empleo_id, Empleo);
    }

    const actulizarEmpleo = (idEmpleo, ProductoEmpleo) => {
        axios.patch("http://127.0.0.1:8000/api/Empleo/" + idEmpleo, ProductoEmpleo)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    alert('Empleo Actulizado');
                    CerrarVentanaModificacionEmpleo()
                    TraerUsuario()
                } else {
                    alert('Hubo un error al Actulizar el Empleo');
                }
            })
    }

    // Ventana Creacion del Empleo
    const [VentanaCreacionNuevoEmpleo, setVentanaCreacionNuevoEmpleo] = useState(false);
    const CerrarVentanaCreacionNuevoEmpleo = () => setVentanaCreacionNuevoEmpleo(false);
    const AbrirVentanaCreacionNuevoEmpleo = () => setVentanaCreacionNuevoEmpleo(true);

    const abrirCrearEmpleo = () => {
        setTitulo("")
        setDescripcion("")
        setEmpresa("")
        setFechaHoraPublicacion("")
        setTelefonoContacto("")
        setMailContacto("")
        AbrirVentanaCreacionNuevoEmpleo()
    }

    const CrearEmpleo = (e) => {
        e.preventDefault();
        const Usuario_id = localStorage.getItem('idUsuario');
        const Empleo = {
            Titulo,
            Descripcion,
            Empresa,
            FechaHoraPublicacion,
            TelefonoContacto,
            MailContacto,
            Usuario_id,
            Ciudad_id
        };
        axios.post("http://127.0.0.1:8000/api/Empleo", Empleo)
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    alert('Empleo Creado');
                    CerrarVentanaCreacionNuevoEmpleo()
                    TraerUsuario()
                } else {
                    alert('Hubo un error al Crear Tu Empleo');
                }
            })
    }



    //Admind

    const [AdmindListaCategorias, setAdmindListaCategorias] = useState([]);
    const [AdmindListaCiudades, setAdmindListaCiudades] = useState([]);
    const [AdmindListaUsuarios, setAdmindListaUsuarios] = useState([]);
    const [AdmindListaEmpleos, setAdmindListaEmpleos] = useState([]);

    const TraerCosasDelAdmind = (event) => {
        TraerCategorias()
        TraerCiudades()
        TraerUsuarios()
        traerEmpleos()
    }

    const TraerCategorias = (event) => {
        axios.get('http://127.0.0.1:8000/api/Categoria')
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setAdmindListaCategorias(response.data.Categoria)
                } else {
                    console.log("Error traer Productos")
                }
            });
    }

    const TraerCiudades = (event) => {
        axios.get('http://127.0.0.1:8000/api/Ciudade')
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setAdmindListaCiudades(response.data.Ciudades)
                } else {
                    console.log("Error traer Productos")
                }
            });
    }

    const TraerUsuarios = (event) => {
        axios.get('http://127.0.0.1:8000/api/User')
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setAdmindListaUsuarios(response.data.Usuarios)
                } else {
                    console.log("Error traer Productos")
                }
            });
    }

    const traerEmpleos = (event) => {
        axios.get('http://127.0.0.1:8000/api/Empleo')
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setAdmindListaEmpleos(response.data.Empleos)
                } else {
                    console.log("Error traer Productos")
                }
            });
    }



    // Accion Categoria Edit and Delete And Create

    const [AdmindCategoria_id, setAdmindCategoria_id] = useState("");
    const [Nombre, setNombre] = useState("");

    const [VentanaUpdateCategoria, setVentanaUpdateCategoria] = useState(false);
    const CerrarVentanaUpdateCategoria = () => setVentanaUpdateCategoria(false);
    const AbrirVentanaUpdateCategoria = () => setVentanaUpdateCategoria(true);

    const eleminarCategoria = (idCategoria) => {
        const confirmacion = window.confirm('Está seguro que desea eliminar?');
        if (!confirmacion) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/Categoria/' + idCategoria)
            .then(response => {
                if (response.data.res == true) {
                    alert('Categoria Eleminada');
                    TraerUsuario()
                } else {
                    alert('Hubo un error al eliminar');
                }
            });
    }

    const abrirEditarCategoria = (idCategoria) => {
        axios.get("http://127.0.0.1:8000/api/Categoria/" + idCategoria + "/edit")
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setAdmindCategoria_id(response.data.Categoria.id)
                    setNombre(response.data.Categoria.Nombre)
                    AbrirVentanaUpdateCategoria()
                } else {
                    alert('Hubo un error al Traer Tu Categoria');
                }
            })
    }

    const actulizarCategoria = (e) => {
        e.preventDefault();
        const Categoria = {
            Nombre
        };
        if (AdmindCategoria_id != 0) {
            axios.patch("http://127.0.0.1:8000/api/Categoria/" + AdmindCategoria_id, Categoria)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Categoria Actulizado')
                        CerrarVentanaUpdateCategoria()
                        setAdmindCategoria_id(0)
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Actulizar la Categoria');
                    }
                })
        } else {
            axios.post("http://127.0.0.1:8000/api/Categoria", Categoria)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Categoria Creada');
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Crear la Categoria');
                    }
                })
        }
    }

    const abrirCrearCategoria = () => {
        setAdmindCategoria_id(0)
        setNombre("")
        AbrirVentanaUpdateCategoria()
    }


    // Ciudades Update Create and Destroy

    const [AdmindCiudad_id, setAdmindCiudad_id] = useState("");

    const [VentanaCiudad, setVentanaCiudad] = useState(false);
    const CerrarVentanaCiudad = () => setVentanaCiudad(false);
    const AbrirVentanaCiudad = () => setVentanaCiudad(true);

    const eleminarCiudad = (idCiudad) => {
        const confirmacion = window.confirm('Está seguro que desea eliminar?');
        if (!confirmacion) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/Ciudade/' + idCiudad)
            .then(response => {
                if (response.data.res == true) {
                    alert('Ciudad Eleminado');
                    TraerUsuario()
                } else {
                    alert('Hubo un error al eliminar');
                }
            });
    }

    const abrirEditarCiudad = (idCiudad) => {
        axios.get("http://127.0.0.1:8000/api/Ciudade/" + idCiudad + "/edit")
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setAdmindCiudad_id(response.data.Ciudad.id)
                    setNombre(response.data.Ciudad.Nombre)
                    AbrirVentanaCiudad()
                } else {
                    alert('Hubo un error al Traer Tu Categoria');
                }
            })
    }

    const CargaCiudad = (e) => {
        e.preventDefault();
        const Ciudad = {
            Nombre
        };
        if (AdmindCiudad_id != 0) {
            axios.patch("http://127.0.0.1:8000/api/Ciudade/" + AdmindCiudad_id, Ciudad)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Ciudad Actulizado');
                        setAdmindCiudad_id(0)
                        CerrarVentanaCiudad()
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Actulizar la Categoria');
                    }
                })
        } else {
            axios.post("http://127.0.0.1:8000/api/Ciudade", Ciudad)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Ciudad Creada');
                        CerrarVentanaCiudad()
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Crear la Categoria');
                    }
                })
        }
    }

    const abrirCrearCiudad = () => {
        setAdmindCiudad_id(0)
        setNombre("")
        AbrirVentanaCiudad()
    }

    // Usuario Admind
    const [IdUsuarioAModificar, setIdUsuarioAModificar] = useState("");


    const [show, setShow] = useState(false);
    const hanleclose = () => setShow(false);
    const openclose = () => setShow(true);

    const eleminarUsuario = (idUsuario) => {
        const confirmacion = window.confirm('Está seguro que desea eliminar?');
        if (!confirmacion) {
            return;
        }
        axios.delete('http://127.0.0.1:8000/api/User/' + idUsuario)
            .then(response => {
                if (response.data.res == true) {
                    alert('Usuario Eleminado')
                    TraerUsuario()
                } else {
                    alert('Hubo un error al eliminar');
                }
            });
    }

    const CreacionUsuario = () => {
        setIdUsuarioAModificar(0)
        setNombres("")
        setApellidos("")
        setemail("")
        setpassword("")
        openclose()
    }


    const abrirEditarUsuario = (idUsuario) => {
        axios.get("http://127.0.0.1:8000/api/User/" + idUsuario + "/edit")
            .then(response => {
                // console.log('datos actualizados', response.data);
                if (response.data.res == true) {
                    setIdUsuarioAModificar(response.data.Usuario.id)
                    setemail(response.data.Usuario.email)
                    setNombres(response.data.Usuario.Nombres)
                    setApellidos(response.data.Usuario.Apellidos)
                    setCreacionCuenta(response.data.Usuario.created_at)
                    setRol(response.data.Usuario.Rol)
                    openclose()
                } else {
                    alert('Hubo un error al Traer El Usuario');
                }
            })
    }

    const CargarUsuarioAdmind = (e) => {
        e.preventDefault();
        const Usuario = {
            Nombres,
            Apellidos,
            email,
            password,
            Rol
        };
        if (IdUsuarioAModificar != 0) {
            axios.patch("http://127.0.0.1:8000/api/User/" + IdUsuarioAModificar, Usuario)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Usuario Actulizado');
                        setIdUsuarioAModificar(0)
                        hanleclose()
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Actulizar el usuario');
                    }
                })
        } else {
            axios.post("http://127.0.0.1:8000/api/User", Usuario)
                .then(response => {
                    // console.log('datos actualizados', response.data);
                    if (response.data.res == true) {
                        alert('Usuario Creada');
                        hanleclose()
                        TraerUsuario()
                    } else {
                        alert('Hubo un error al Crear El Usuario');
                    }
                })
        }
    }



    //Html
    var HtmlDependiendoRol;
    if (RolUsuario == 0) {
        HtmlDependiendoRol =
            <Container fluid>
                <Row className="TituloAmdind">
                    <h3>Estos Son tu Curriculum</h3>
                </Row>
                <Row className="EnlaceCreacion">
                    <a className="Referencias" href="#" onClick={() => { abrirCrearCurriculum() }}>CrearCurriculum</a>
                </Row>
                <Row className="Row">
                    <Table responsive striped bordered hover>
                        <thead className="thead-dark">
                            <tr >
                                <th scope="col">Ciudad</th>
                                <th scope="col">Trabajos Anteriores</th>
                                <th scope="col">Logros</th>
                                <th scope="col">Profesion</th>
                                <th scope="col">TelefonoContacto</th>
                                <th scope="col">FechaNacimiento</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ListaCurriculum?.map(item =>
                                <tr key={"Curriculum_id-" + item.id}>
                                    <td >{item.curriculum_ciudad.Nombre}</td>
                                    <td >{item.TrabajosAnteriores}</td>
                                    <td>{item.Logros}</td>
                                    <td>{item.Profesion}</td>
                                    <td>{item.TelefonoContacto}</td>
                                    <td>{item.FechaDeNacimiento}</td>
                                    <td>
                                        <DropdownButton id="dropdown-basic-button" title="Acciones">
                                            <DropdownItem href="#" onClick={() => { eleminarCurriculum(item.id) }}>Eliminar</DropdownItem>
                                            <DropdownItem href="#" onClick={() => { abrirEditarCurriculum(item.id) }}>Editar Curriculum</DropdownItem>
                                        </DropdownButton>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>

                <Row className="Row">
                    <h3>Estos Son Los Empleos que has Solicitado</h3>
                    <Table responsive striped bordered hover>
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Titulo</th>
                                <th scope="col">Descripcion</th>
                                <th scope="col">Empresa</th>
                                <th scope="col">TelefonoContacto</th>
                                <th scope="col">MailContacto</th>
                                <th scope="col">Dia Que Pidio El Empleo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ListaDeLosEmpleoDelSolicitante?.map(item =>
                                <tr key={"EmpleoSolicitante-" + item.Titulo}>
                                    <td >{item.Titulo}</td>
                                    <td>{item.Descripcion}</td>
                                    <td>{item.Empresa}</td>
                                    <td>{item.TelefonoContacto}</td>
                                    <td>{item.MailContacto}</td>
                                    <td>{item.created_at}</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
    }

    if (RolUsuario == 1) {

        HtmlDependiendoRol =
            <Container fluid>
                <Row className="Titulo Empleador">
                    <h3>Estos Son tus Empleos Que Publicaste</h3>
                </Row>
                <Row>
                    <a className="Referencias" href="#" onClick={() => { abrirCrearEmpleo() }}>Crear Empleo</a>
                </Row>
                <Row className="Row">
                    <Table responsive striped bordered hover>
                        <thead className="thead-dark">
                            <tr >
                                <th scope="col">Titulo</th>
                                <th scope="col">Empresa</th>
                                <th scope="col">Ciudad</th>
                                <th scope="col">Categorias</th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {ListaEmpleosDelUsuario?.map(item =>
                                <tr key={"Empleo-" + item.id} className='Empleos-publicados'>
                                    <td >{item.Titulo}</td>
                                    <td>{item.Empresa}</td>
                                    <td>{item.empleo_ciudad.Nombre}</td>
                                    <td>
                                        {item.empleo_categorias?.map(item =>
                                            <p key={"Categoria-" + item.id}> {item.categoria.Nombre}</p>
                                        )}
                                    </td>
                                    <td>
                                        <DropdownButton id="dropdown-basic-button" title="Acciones">
                                            <DropdownItem href="#" onClick={() => { eleminarEmpleo(item.id) }}>Eliminar</DropdownItem>
                                            <DropdownItem href="#" onClick={() => { abrirEditarEmpleo(item.id) }}>Editar Empleo</DropdownItem>
                                            <DropdownItem href="#" onClick={() => { VerSolicitantesDelEmpleo(item.id) }}>Ver Quienes Han Solicitado el Empleo</DropdownItem>
                                        </DropdownButton>
                                    </td>
                                    <td><Link to={"/CategoriaEmpleo/" + item.id}>Ver Generos</Link></td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </Row>
            </Container>
    }

    if (RolUsuario == 2) {

        HtmlDependiendoRol = <Container fluid>
            <Row>
                <h3>Usted es el Admind y tiene el poder Sobre esto</h3>
            </Row>
            <Row className="TituloAmdind">
                <h4>Empleos</h4>
            </Row>
            <Row>
                <a className="Referencias" href="#" onClick={() => { abrirCrearEmpleo() }}>Crear Empleo</a>
            </Row>

            <Row className="Row">
                <Table responsive striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Titulo</th>
                            <th scope="col">Empresa</th>
                            <th scope="col">FechaHoraPublicacion</th>
                            <th scope="col">Telefono de Contacto</th>
                            <th scope="col">Ciudad</th>
                            <th scope="col">categoria</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {AdmindListaEmpleos?.map(item =>
                            <tr className="list-empleos"  key={"AdmindEmpleo-" + item.id}>
                                <td >{item.Titulo}</td>
                                <td>{item.Empresa}</td>
                                <td>{item.FechaHoraPublicacion}</td>
                                <td>{item.TelefonoContacto}</td>
                                <td>{item.empleo_ciudad.Nombre}</td>
                                <td>
                                    {item.empleo_categorias?.map(item =>
                                        <p key={"Categoria-" + item.id}>{item.categoria.Nombre}</p>
                                    )}
                                </td>
                                <td>
                                    <DropdownButton id="dropdown-basic-button" title="Acciones">
                                        <DropdownItem href="#" onClick={() => { eleminarEmpleo(item.id) }}>Eliminar</DropdownItem>
                                        <DropdownItem href="#" onClick={() => { abrirEditarEmpleo(item.id) }}>Editar Empleo</DropdownItem>
                                    </DropdownButton>
                                </td>

                            </tr>
                        )}
                    </tbody>
                </Table>

            </Row>

            <Row>
                <h4>Categorias</h4>
            </Row>
            <Row>
                <a className="Referencias" href="#" onClick={() => { abrirCrearCategoria() }}>Crear Categoria</a>
            </Row>
            <Row className="Row">
                <Table responsive striped bordered hover>
                    <thead className="thead-dark" >
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {AdmindListaCategorias?.map(item =>
                            <tr className="list-categorias" key={"Categoria-" + item.id}>
                                <td >{item.Nombre}</td>
                                <td><a href="#" onClick={() => { eleminarCategoria(item.id) }}>Eliminar</a></td>
                                <td><a href="#" onClick={() => { abrirEditarCategoria(item.id) }}>Editar Categoria</a></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>

            <Row>
                <h4>Ciudad</h4>
            </Row>
            <Row>
                <a className="Referencias" href="#" onClick={() => { abrirCrearCiudad() }}>Crear Ciudad</a>
            </Row>
            <Row className="Row">
                <Table responsive striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col"></th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {AdmindListaCiudades?.map(item =>
                            <tr className="list-ciudad"  key={"Categoria-" + item.id}>
                                <td >{item.Nombre}</td>
                                <td><a href="#" onClick={() => { eleminarCiudad(item.id) }}>Eliminar</a></td>
                                <td><a href="#" onClick={() => { abrirEditarCiudad(item.id) }}>Editar Ciudad</a></td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>

            <Row>
                <h4>Usuarios</h4>
            </Row>
            <Row>
                <a className="Referencias" href="#" onClick={() => { CreacionUsuario() }}>Crear Usuario</a>
            </Row>
            <Row className="Row">
                <Table responsive striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Creacion Cuenta</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {AdmindListaUsuarios?.map(item =>
                            <tr className="list-usuarios" key={"Empleo-" + item.id}>
                                <td >{item.Nombres}</td>
                                <td>{item.Apellidos}</td>
                                <td>{item.email}</td>
                                <td>{item.Rol}</td>
                                <td>{item.created_at}</td>
                                <td>
                                    <DropdownButton id="dropdown-basic-button" title="Acciones">
                                        <DropdownItem href="#" onClick={() => { eleminarUsuario(item.id) }}>Eliminar</DropdownItem>
                                        <DropdownItem href="#" onClick={() => { abrirEditarUsuario(item.id) }}>Editar Usuario</DropdownItem>
                                    </DropdownButton>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Row>
        </Container>
    }


    return (
        <Container fluid>
            <Row>
                <h2>Cuenta</h2>
            </Row>
            <Row>
                <Table responsive striped bordered hover>
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Apellido</th>
                            <th scope="col">Correo</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Creacion Cuenta</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td >{Nombres}</td>
                            <td >{Apellidos}</td>
                            <td >{email}</td>
                            <td >{Rol}</td>
                            <td >{CreacionCuenta}</td>
                            <td><a href="#" onClick={() => { abriEditarUsuario() }}>EditarCuenta</a></td>
                        </tr>
                    </tbody>
                </Table>
            </Row>


            <Modal
                show={VentanaUpdateUsuario}
                onHide={CerrarVentanaUsuario}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modificacion de tu Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form onSubmit={enviarUsuario}>
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
                        <MiBoton className="btn btn-primary">Actulizar Cuenta</MiBoton>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaUsuario}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>



            <Modal
                show={show}
                onHide={hanleclose}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modificacion de una Cuenta</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={CargarUsuarioAdmind}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Nombre:</MiLabel>
                            <MiInput type="text" className="form-control" id="Nombre" value={Nombres} onChange={(event) => { setNombres(event.target.value) }} />

                            <MiLabel className="form-group">Apellido:</MiLabel>
                            <MiInput type="text" className="form-control" id="Apellido" value={Apellidos} onChange={(event) => { setApellidos(event.target.value) }} />

                            <MiLabel className="form-group">Email:</MiLabel>
                            <MiInput type="Email" className="form-control" id="Email" value={email} onChange={(event) => { setemail(event.target.value) }} />

                            <MiLabel className="form-group">Password:</MiLabel>
                            <MiInput type="Password" className="form-control" id="Password" value={password} onChange={(event) => { setpassword(event.target.value) }} />

                            <MiLabel className="form-group">Rol:</MiLabel>
                            <MiInput type="number" className="form-control" id="Password" value={Rol} onChange={(event) => { setRol(event.target.value) }} />
                        </div>
                        <MiBoton className="btn btn-primary">Actulizar Usuario</MiBoton>
                    </Form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hanleclose}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>


            <Modal
                show={VentanModificacionCurriculum}
                onHide={CerrarVentanModificacionCurriculum}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modificacion de tu Curriculum</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={enviarCurriculum}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">TrabajosAnteriores:</MiLabel>
                            <MiInput type="text" className="form-control" id="TrabajosAnteriores" value={TrabajosAnteriores} onChange={(event) => { setTrabajosAnteriores(event.target.value) }} />

                            <MiLabel className="form-group">Logros:</MiLabel>
                            <MiInput type="text" className="form-control" id="Logros" value={Logros} onChange={(event) => { setLogros(event.target.value) }} />

                            <MiLabel className="form-group">Profesion:</MiLabel>
                            <MiInput type="text" className="form-control" id="Profesion" value={Profesion} onChange={(event) => { setProfesion(event.target.value) }} />

                            <MiLabel className="form-group">TelefonoContacto:</MiLabel>
                            <MiInput type="number" className="form-control" id="TelefonoContacto" value={TelefonoContacto} onChange={(event) => { setTelefonoContacto(event.target.value) }} />

                            <MiLabel className="form-group">FechaDeNacimiento:</MiLabel>
                            <MiInput type="date" className="form-control" id="FechaDeNacimiento" value={FechaDeNacimiento} onChange={(event) => { setFechaDeNacimiento(event.target.value) }} />
                        </div>
                        <MiBoton className="btn btn-primary">Actulizar Curriculum</MiBoton>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanModificacionCurriculum}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>



            <Modal
                show={VentanaCreacionCurriculum}
                onHide={CerrarVentanaCreacionCurriculum}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Creacion de tu Curriculum</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id='formCrearCurriculum' onSubmit={CrearCurriculum}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Ciudad:</MiLabel>
                            <select className="selectCiudad" onChange={(event) => { setCiudad_id(event.target.value) }}>
                            <option value="Vacio"></option>
                                {TodasLasCiudades?.map(item =>
                                    <option key={"Curriculum-" + item.id} value={item.id}>{item.Nombre}</option>
                                )}
                            </select>

                            <MiLabel className="form-group">TrabajosAnteriores:</MiLabel>
                            <MiInput type="text" className="form-control" id="TrabajosAnteriores" value={TrabajosAnteriores} onChange={(event) => { setTrabajosAnteriores(event.target.value) }} />

                            <MiLabel className="form-group">Logros:</MiLabel>
                            <MiInput type="text" className="form-control" id="Logros" value={Logros} onChange={(event) => { setLogros(event.target.value) }} />

                            <MiLabel className="form-group">Profesion:</MiLabel>
                            <MiInput type="text" className="form-control" id="Profesion" value={Profesion} onChange={(event) => { setProfesion(event.target.value) }} />

                            <MiLabel className="form-group">TelefonoContacto:</MiLabel>
                            <MiInput type="number" className="form-control" id="TelefonoContacto" value={TelefonoContacto} onChange={(event) => { setTelefonoContacto(event.target.value) }} />

                            <MiLabel className="form-group">FechaDeNacimiento:</MiLabel>
                            <MiInput type="date" className="form-control" id="FechaDeNacimiento" value={FechaDeNacimiento} onChange={(event) => { setFechaDeNacimiento(event.target.value) }} />
                        </div>
                        <MiBoton className="btn btn-primary">Crear Curriculum</MiBoton>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaCreacionCurriculum}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>


            <Modal
                show={VentanaModificacionEmpleo}
                onHide={CerrarVentanaModificacionEmpleo}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Modificacion Empleo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={enviarEmpleo}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Titulo:</MiLabel>
                            <MiInput type="text" className="form-control" id="Titulo" value={Titulo} onChange={(event) => { setTitulo(event.target.value) }} />

                            <MiLabel className="form-group">Descripcion:</MiLabel>
                            <MiInput type="text" className="form-control" id="Descripcion" value={Descripcion} onChange={(event) => { setDescripcion(event.target.value) }} />

                            <MiLabel className="form-group">Empresa:</MiLabel>
                            <MiInput type="text" className="form-control" id="Email" value={Empresa} onChange={(event) => { setEmpresa(event.target.value) }} />

                            <MiLabel className="form-group">FechaHoraPublicacion:</MiLabel>
                            <MiInput type="date" className="form-control" id="FechaHoraPublicacion" value={FechaHoraPublicacion} onChange={(event) => { setFechaHoraPublicacion(event.target.value) }} />

                            <MiLabel className="form-group">TelefonoContacto:</MiLabel>
                            <MiInput type="number" className="form-control" id="TelefonoContacto" value={TelefonoContacto} onChange={(event) => { setTelefonoContacto(event.target.value) }} />

                            <MiLabel className="form-group">MailContacto:</MiLabel>
                            <MiInput type="email" className="form-control" id="MailContacto" value={MailContacto} onChange={(event) => { setMailContacto(event.target.value) }} />

                            <MiLabel className="form-group">Ciudad:</MiLabel>
                            <select onChange={(event) => { setCiudad_id(event.target.value) }}>
                            <option value="Vacio"></option>
                                {TodasLasCiudades?.map(item =>
                                    <option key={"Curriculum-" + item.id} value={item.id}>{item.Nombre}</option>
                                )}
                            </select>
                        </div>
                        <MiBoton className="btn btn-primary">Guardar Empleo</MiBoton>
                    </form>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaModificacionEmpleo}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>


            <Modal
                show={VentanaCreacionNuevoEmpleo}
                onHide={CerrarVentanaCreacionNuevoEmpleo}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Crear Empleo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="form-crear-empleo" onSubmit={CrearEmpleo}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Titulo:</MiLabel>
                            <MiInput type="text" className="form-control" id="Titulo" value={Titulo} onChange={(event) => { setTitulo(event.target.value) }} />

                            <MiLabel className="form-group">Descripcion:</MiLabel>
                            <MiInput type="text" className="form-control" id="Descripcion" value={Descripcion} onChange={(event) => { setDescripcion(event.target.value) }} />

                            <MiLabel className="form-group">Empresa:</MiLabel>
                            <MiInput type="text" className="form-control" id="Empresa" value={Empresa} onChange={(event) => { setEmpresa(event.target.value) }} />

                            <MiLabel className="form-group">FechaHoraPublicacion:</MiLabel>
                            <MiInput type="date" className="form-control" id="FechaHoraPublicacion" value={FechaHoraPublicacion} onChange={(event) => { setFechaHoraPublicacion(event.target.value) }} />

                            <MiLabel className="form-group">TelefonoContacto:</MiLabel>
                            <MiInput type="number" className="form-control" id="TelefonoContacto" value={TelefonoContacto} onChange={(event) => { setTelefonoContacto(event.target.value) }} />

                            <MiLabel className="form-group">MailContacto:</MiLabel>
                            <MiInput type="email" className="form-control" id="MailContacto" value={MailContacto} onChange={(event) => { setMailContacto(event.target.value) }} />

                            <MiLabel className="form-group">Ciudad:</MiLabel>
                            <select  className="selectCiudad" onChange={(event) => { setCiudad_id(event.target.value) }}>
                            <option value="Vacio"></option>
                            {TodasLasCiudades?.map(item =>
                                    <option key={"Curriculum-" + item.id} value={item.id}>{item.Nombre}</option>
                                )}
                            </select>
                        </div>
                        <MiBoton className="btn btn-primary">Guardar Empleo</MiBoton>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaCreacionNuevoEmpleo}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>



            <Modal
                show={VentanaUpdateCategoria}
                onHide={CerrarVentanaUpdateCategoria}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Categoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="form-crear-categoria" onSubmit={actulizarCategoria}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Nombre:</MiLabel>
                            <MiInput type="text" className="form-control" id="Nombre" value={Nombre} onChange={(event) => { setNombre(event.target.value) }} />
                        </div>
                        <MiBoton className="btn btn-primary">Guardar Categoria</MiBoton>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaUpdateCategoria}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>


            <Modal
                show={VentanaCiudad}
                onHide={CerrarVentanaCiudad}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Ciudad</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form id="form-crear-ciudad" onSubmit={CargaCiudad}>
                        <div className="form-group mt-5">
                            <MiLabel className="form-group">Nombre:</MiLabel>
                            <MiInput type="text" className="form-control" id="Nombre" value={Nombre} onChange={(event) => { setNombre(event.target.value) }} />
                        </div>
                        <MiBoton className="btn btn-primary">Guardar Ciudad</MiBoton>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanaCiudad}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>



            <Modal
                show={VentanSolicitantesDelEmpleo}
                onHide={CerrarVentanSolicitantesDelEmpleo}
                backdrop="static"
                keyboard={false}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Solicitantes</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {ListaUsuarioPidieronElEmpleo?.map(item =>
                        <div key={"Usuario-" + item.id}>
                            <a>Nombre</a>: {item.Nombres} {item.Apellidos}

                            <br />
                            <a>Correo</a>: {item.Email}

                            <br />
                            <a>Logros</a>: {item.Logros}

                            <br />
                            <a>Profesion</a>: {item.Profesion}

                            <br />
                            <a>Telefono</a>: {item.TelefonoContacto}

                            <br />
                        </div>
                    )}

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={CerrarVentanSolicitantesDelEmpleo}>
                        Close
          </Button>
                </Modal.Footer>
            </Modal>

            <Row>
                {HtmlDependiendoRol}
            </Row>
        </Container>
    )
}
