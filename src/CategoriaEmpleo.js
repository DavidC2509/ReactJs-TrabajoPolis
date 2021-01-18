import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    useHistory
} from "react-router-dom";
import { Container, Table } from 'react-bootstrap';


export const ListaEmpleosCategoria = (props) => {


    const [ListaEmpleosConCategoria, setListaEmpleosConCategoria] = useState([]);
    const [ListaEmpleosSinCategoria, setListaEmpleosSinCategoria] = useState([]);

    let { idEmpleo } = props.match ? props.match.params : { idEmpleo: 0 };


    const idUsuario = localStorage.getItem('idUsuario');

    let history = useHistory();

    useEffect(() => {
        VerficarQueEmpleoSeaDelUsuario()
    }, [])

    const traerEmpleosCategorias = () => {
        axios.get('http://127.0.0.1:8000/api/EmpleosSusCategorias/' + idEmpleo)
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    setListaEmpleosConCategoria(response.data.EmpleoConCategoria)
                    setListaEmpleosSinCategoria(response.data.EmpleoSinCategoria)

                } else {
                    console.log("Error traer Productos")
                }
            });
    }

    const eleminarCategoriaDelEmpleo = (idCateogiraEmpleo) => {
        axios.delete('http://127.0.0.1:8000/api/EmpleoCategoria/' + idCateogiraEmpleo)
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    traerEmpleosCategorias()

                } else {
                    console.log("Error Al Eleminar La Categoria")
                }
            });
    }

    const AñadirCategoriaAlEmpleo = (idCategoria, idEmpleo) => {
        axios.post('http://127.0.0.1:8000/api/EmpleoCategorias/' + idEmpleo + '/' + idCategoria)
            .then(response => {
                console.log(response.data)
                if (response.data.res == true) {
                    traerEmpleosCategorias()
                } else {
                    console.log("Error Al Añadir La Categoria")
                }
            });
    }
    const VerficarQueEmpleoSeaDelUsuario = () => {
        axios.get('http://127.0.0.1:8000/api/EmpleoCuentaUsuario/' + idEmpleo + '/' + idUsuario)
            .then(response => {
                console.log(response.data)
                if (response.data.res === true) {
                    traerEmpleosCategorias()
                } else {
                    history.push('/Empleos')
                }
            });
    }


    return (
        <Container>
            <h4>El empleo tiene estas Categorias</h4>
            <Table  responsive striped bordered hover>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {ListaEmpleosConCategoria?.map(item =>
                        <tr className="Empleo-categorias" key={"Categoria_Empleo_id-" + item.id}>
                            <td >{item.Nombre}</td>
                            <td><a href="#" onClick={() => { eleminarCategoriaDelEmpleo(item.id) }}>Eliminar</a></td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <h4>El Empleo No tiene estas Categorias</h4>
            <Table  responsive striped bordered hover>
                <thead className="thead-dark">
                    <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col"></th>
                    </tr>
                </thead>
                <tbody>
                    {ListaEmpleosSinCategoria?.map(item =>
                        <tr className="No-Empleo-categorias" key={"Categoria_id-" + item.id}>
                            <td >{item.Nombre}</td>
                            <td><a href="#" onClick={() => { AñadirCategoriaAlEmpleo(item.id, idEmpleo) }}>Añadir</a></td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}