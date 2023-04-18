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

export const UserForm = ({ isOpen, setUsuarios, onClose }) => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //Obtener las roles
  const getRoles = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({
        url: "/roles/",
      });
      console.log(data.data);
      if (!data.error) setRoles(data.data);
    } catch (error) {
      //alerta de erro
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  const form = useFormik({
    initialValues: {
      username: "",
      password: "",
      rol: {
        id: 0,
        name: "",
      },
    },
    validationSchema: yup.object().shape({
      username: yup
        .string()
        .required("Campo obligatorio")
        .min(4, "Mínimo 4 caracteres"),
    }),
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
              url: "/user/",
              data: JSON.stringify(values),
            });
            if (!response.error) {
              setUsuarios((usuarios) => [response.data, ...usuarios]);
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
        <Modal.Title>Registrar Usuarios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={form.handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <FormControl
              name="username"
              placeholder="Username"
              value={form.values.username}
              onChange={form.handleChange}
            />
            {form.errors.username && (
              <span className="error-text">{form.errors.username}</span>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <FormControl
              name="password"
              placeholder="Password"
              value={form.values.password}
              onChange={form.handleChange}
            />
            {form.errors.password && (
              <span className="error-text">{form.errors.password}</span>
            )}
          </Form.Group>
          {/* Seleccion de Rol */}
          <Form.Group className="mb-3">
            <Form.Label>Rol de usuario</Form.Label>
            <Form.Control
              as="select"
              name="rol.id"
              value={form.values.rol.id}
              onChange={(event) => {
                form.handleChange(event);
                const selectedRol = roles.find(
                  (rol) => rol.id === event.target.value
                );
                form.setFieldValue("rol.name", selectedRol.name);
              }}
            >
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              as="select"
              name="rol.name"
              value={form.values.rol.name}
              onChange={form.handleChange}
              style={{ display: "none" }}
            >
              <option>Nombre del Rol</option>
              {roles.map((rol) => (
                <option key={rol.name} value={rol.name}>
                  {rol.name}
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
export default UserForm;
