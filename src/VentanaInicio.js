import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Link
} from "react-router-dom";
import { Container, Row, Card, Button } from 'react-bootstrap';

import './VentanaInicio.css';


export const ListaEmpleosInicio = (props) => {


    const [ListaEmpleos, setListaEmpleos] = useState([]);

    const [EmpleoBuscar, setEmpleoBuscar] = useState("");
    

    useEffect(() => {
        traerEmpleos()
    }, [])

    const traerEmpleos = (event) => {
        axios.get('http://127.0.0.1:8000/api/Empleo')
            .then(response => {
                if (response.data.res == true) {
                    setListaEmpleos(response.data.Empleos)
                } else {
                    console.log("Error traer Empleos")
                }
            });
    }

    const BuscarEmpleo = () => {
       
        const Nombre = {
            EmpleoBuscar
        };
        axios.post('http://127.0.0.1:8000/api/EmpleoNombre',Nombre)
            .then(response => {
                if (response.data.res == true) {
                    setListaEmpleos(response.data.Empleos)
                } else {
                    console.log("Error traer Empleos")
                }
            });
    }




    return (
        <Container fluid>

            <Row><h1>Estos son los trabajos</h1></Row>

            <input type="search" name="Search" id="search" placeholder="Buscador" value={EmpleoBuscar} onChange={(event) => { setEmpleoBuscar(event.target.value) }}></input>
            <a href="#"><Button  variant="dark" id="BotonBuscador" onClick={() => { BuscarEmpleo()}} >Buscar</Button></a>

            <Row>
                
                {ListaEmpleos?.map(item =>
                    <Card id="CardDeTrabajos"  key={"Empleo_id-" + item.id} >
                        <Card.Img variant="top" src={process.env.PUBLIC_URL + '/ImagenesDeCartasTrabajo.jpg'} />
                        <Card.Body>
                            <Card.Title>{item.Titulo}</Card.Title>
                            <Card.Text>
                                {item.Descripcion}
                            </Card.Text>
                            <Button variant="dark"><Link to={"/DetalleEmpleo/" + item.id}>Detalle Empleo</Link></Button>
                        </Card.Body>
                    </Card>
                )}
              
            </Row>

        </Container>
    )
}