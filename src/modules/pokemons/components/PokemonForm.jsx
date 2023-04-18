import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { Button, Col, Row, Form, Modal, FormControl } from "react-bootstrap";
import * as yup from "yup";
import AxiosClient from "./../../../shared/plugins/axios";
import FeatherIcon from "feather-icons-react";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../shared/plugins/alert";

export const PokemonForm = ({ isOpen, setPokemons, onClose }) => {
  const [selectedSpecies, setSelectedSpecies] = useState("");

  //Especies
  const [especies, setEspecies] = useState([]);
  //Origenes
  const [origins, setOrigins] = useState([]);
  //Tipos

  //Combinaciones
  const [Combinaciones, setCombinaciones] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  //Obtener las especies
  const getEspecies = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/species/",
      });
      console.log("Especies", data.data);
      if (!data.error) setEspecies(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEspecies();
  }, []);

  //Obtener los Origenes
  const getOrigenes = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/origin/",
      });
      console.log("Origenes", data.data);
      if (!data.error) setOrigins(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrigenes();
  }, []);

  //Obtener las combinaciones
  const getCombinaciones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/combination/",
      });
      console.log("Combinaciones", data.data);
      if (!data.error) setCombinaciones(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCombinaciones();
  }, []);

  const form = useFormik({
    initialValues: {
      name: "",
      age: "",
      description: "",
      species: {
        id: 0,
        species: "",
      },
      origin: {
        id: 0,
        origin: "",
      },
      combination: {
        id: 0,
        combination: "",
      },
    },
    onSubmit: async (values) => {
      Alert.fire({
        title: confirmTitle,
        text: confirmMsg,
        icon: "warning",
        confirmButtonColor: "#009574",
        confirmButtonText: "Aceptar",
        cancelButtonColor: "#DD6B55",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
        backdrop: true,
        showCancelButton: true,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !Alert.isLoading,
        preConfirm: async () => {
          console.log(values);
          try {
            const response = await AxiosClient({
              method: "POST",
              url: "/pokemon/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setPokemons((pokemons) => [response.data, ...pokemons]);
              Alert.fire({
                title: successTitle,
                text: successMsg,
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Aceptar",
              }).then((result) => {
                if (result.isConfirmed) {
                  handleClose();
                }
              });
            }
            return response;
          } catch (error) {
            Alert.fire({
              title: errorTitle,
              text: errorMsg,
              icon: "error",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
            }).then((result) => {
              if (result.isConfirmed) {
                handleClose();
              }
            });
          }
        },
      });
    },
  });

  const handleClose = () => {
    form.resetForm();
    onClose();
  };

  return (
    <Modal
      backdrop="static"
      keyboard={false}
      show={isOpen}
      onHide={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Registrar Pokemon</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <FormControl
              required
              name="name"
              placeholder="Nombre del Pokemon"
              value={form.values.name}
              onChange={form.handleChange}
            />
            {form.errors.name && (
              <span className="error-text">{form.errors.name}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Edad</Form.Label>
            <FormControl
              required
              name="age"
              placeholder="Edad del pokemon"
              value={form.values.age}
              onChange={form.handleChange}
            />
            {form.errors.age && (
              <span className="error-text">{form.errors.age}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <FormControl
              required
              name="description"
              placeholder="Descipción"
              value={form.values.description}
              onChange={form.handleChange}
            />
            {form.errors.description && (
              <span className="error-text">{form.errors.description}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Especie</Form.Label>
            <Form.Control
              as="select"
              name="species.id"
              value={form.values.species.id}
              onChange={(event) => {
                form.handleChange(event);
                const selectedRol = especies.find(
                  (especie) => especie.id === event.target.value
                );
                form.setFieldValue("species.species", selectedRol.species);
              }}
            >
              {especies.map((especie) => (
                <option key={especie.id} value={especie.id}>
                  {especie.species}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="species.species"
              value={form.values.species.species}
              onChange={form.handleChange}
              style={{ display: "none" }}
            >
              <option>Nombre de la espcie</option>
              {especies.map((espcie) => (
                <option key={espcie.species} value={espcie.species}>
                  {espcie.species}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Region</Form.Label>
            <Form.Control
              as="select"
              name="origin.id"
              value={form.values.origin.id}
              onChange={(event) => {
                form.handleChange(event);
                const selectedRol = origins.find(
                  (origin) => origin.id === event.target.value
                );
                form.setFieldValue("origin.origin", selectedRol.origin);
              }}
            >
              {origins.map((origin) => (
                <option key={origin.id} value={origin.id}>
                  {origin.origin}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="origin.origin"
              value={form.values.origin.origin}
              onChange={form.handleChange}
              style={{ display: "none" }}
            >
              <option>Nombre del origen</option>
              {origins.map((origin) => (
                <option key={origin.origin} value={origin.origin}>
                  {origin.origin}
                </option>
              ))}
            </Form.Control>
          </Form.Group>


          <Form.Group className="mb-3">
            <Form.Label>Combinacion</Form.Label>
            <Form.Control
              as="select"
              name="combination.id"
              value={form.values.combination.id}
              onChange={(event) => {
                form.handleChange(event);
                const selectedRol = Combinaciones.find(
                  (combinacion) => combinacion.id === event.target.value
                );
                form.setFieldValue("combination.combination", selectedRol.combination);
              }}
            >
              {Combinaciones.map((combinacion) => (
                <option key={combinacion.id} value={combinacion.id}>
                  {combinacion.combination}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="combination.combination"
              value={form.values.combination.combination}
              onChange={form.handleChange}
              style={{ display: "none" }}
            >
              <option>Nombre del origen</option>
              {Combinaciones.map((combinacion) => (
                <option key={combinacion.combination} value={combinacion.combination}>
                  {combinacion.combination}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col className="text-end">
                <Button
                  className="me-2"
                  variant="outline-danger"
                  onClick={handleClose}
                >
                  <FeatherIcon icon="x" />
                  &nbsp;Cerrar
                </Button>
                <Button type="submit" variant="outline-success">
                  <FeatherIcon icon="check" />
                  &nbsp;Guardar
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};
export default PokemonForm;
