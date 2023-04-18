import React, { useEffect, useState } from "react";

import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";

import RolesForm from "./components/RolesForm";
import BorrarRoles from "./components/BorrarRoles";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};
const RolesScreen = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const[isDeliting, setIsDeliting] = useState(false)
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredRoles = roles.filter(
    (rol) =>
      rol.name &&
      rol.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getRoles = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/roles/" });
      if (!data.error) setRoles(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getRoles();
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

  const columns = React.useMemo(
    () => [
      {
        name: "#",
        cell: (row, index) => <div>{index + 1}</div>,
        sortable: true,
      },
      {
        name: "Rol de Usuario",
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name,
      },
      {
        name: "Acciones",
        cell: (row) => (
          <>
            <ButtonCircle
              icon="dash-2"
              type={"btn btn-outline-danger btn-circle"}
              size={16}
              onClick={() => {
                setIsDeliting(true);
                setSelectedRoles(row);
              }}
            ></ButtonCircle>
          </>
        ), //fragment
      },
    ],
    []
  );

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "120vh" }}
      >
        <Card className="w-75">
          <Card.Header>
            <Row>
              <Col className="text-center">
                <h4>Roles de Usuarios</h4>
              </Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-outline-success"}
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  size={16}
                />
                <RolesForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  setRoles={setRoles}
                />
                <BorrarRoles
                  isOpen={isDeliting}
                  onClose={() => setIsDeliting(false)}
                  setRoles={selectedRoles}
                  roles={selectedRoles}
                  />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTable
              columns={columns}
              data={filteredRoles}
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
      </div>
    </>
  );
};

export default RolesScreen;
