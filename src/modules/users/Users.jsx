import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../shared/plugins/axios";
import { ButtonCircle } from "./../../shared/components/ButtonCircle";
import { Loading } from "./../../shared/components/Loading";
import { FilterComponent } from "./../../shared/components/FilterComponent";
import { EditUserForm } from "./components/EditUserForm";
import {UserForm} from './components/UserForm'

import BorrarUser from "./components/BorrarUser";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

const Users = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarios, setSelectedUsuarios] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeliting, setIsDeliting] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredUsuarios = usuarios.filter(
    (usuarios) =>
      usuarios.username && usuarios.username.toLowerCase().includes(filterText.toLowerCase())
  );

  const getUsuarios = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/user/" });
      console.log("Usuarios", data.data);
      if (!data.error) setUsuarios(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getUsuarios();
  }, []);


  const headerComponent = React.useMemo(() => {
    const handleClear = () => {
      if (filterText) setFilterText("");
    };
    return (
      <FilterComponent
        onFilter={(e) => setFilterText(e.target.value)}
        onClear={handleClear}
        filterText={filterText}
      />
    );
  }, [filterText]);

  const columns = React.useMemo(() => [
    {
      name: "Id de Usuario",
      cell: (row) => <div>{row.id}</div>,
      sortable: true,
      selector: (row) => row.id,
    },
    {
      name: "Username",
      cell: (row) => <div>{row.username}</div>,
      sortable: true,
      selector: (row) => row.username,
    },
    {
      name: "Contraseña",
      cell: (row) => <div>{row.password}</div>,
      sortable: true,
      selector: (row) => row.password,
    },
    {
      name: "Rol de usuario",
      cell: (row) => <div>{row.rol.name}</div>,
      sortable: true,
      selector: (row) => row.rol.name,
    },
    {
        name: "Acciones",
        cell: (row) => (
          <>
            <ButtonCircle
              icon="edit"
              type={"btn btn-outline-warning btn-circle"}
              size={16}
              onClick={() => {
                setIsEditing(true);
                setSelectedUsuarios(row);
              }}
            ></ButtonCircle>
             <ButtonCircle
              icon="trash-2"
              type={"btn btn-outline-danger btn-circle"}
              size={16}
              onClick={() => {
                setIsDeliting(true);
                setSelectedUsuarios(row);
              }}
            ></ButtonCircle>
            
            
          </>
        ), //fragment
      },
  ], []);
  

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>Usuarios</Col>
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
            <UserForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setUsuarios={setUsuarios}
            />
            {selectedUsuarios && (
              <EditUserForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                setUsuarios={setUsuarios}
                usuarios={selectedUsuarios}
              />
            )}
            {selectedUsuarios && (
              <BorrarUser
                isOpen={isDeliting}
                onClose={() => setIsDeliting(false)}
                setUsuarios={setUsuarios}
                usuarios={selectedUsuarios}
              />
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={filteredUsuarios}
          progressPending={isLoading}
          progressComponent={<Loading />}
          noDataComponent={"Sin registros"}
          pagination
          paginationComponentOptions={options}
          subHeader
          subHeaderComponent={headerComponent}
          persistTableHead
          striped={true}
          highlightOnHover={true}
        />
      </Card.Body>
    </Card>
  );
};

export default Users;
