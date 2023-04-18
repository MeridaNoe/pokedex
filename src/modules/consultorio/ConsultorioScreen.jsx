import React, { useEffect, useState } from "react";

import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../shared/plugins/axios";
import { ButtonCircle } from "./../../shared/components/ButtonCircle";
import { Loading } from "./../../shared/components/Loading";
import { FilterComponent } from "./../../shared/components/FilterComponent";

import EdItConsultorioForm from "./components/EditConsultorioForm";
import ConsultorioForm from "./components/ConsultorioForm";
import BorrarConsultorio from "./components/BorrarConsultorio";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};
const ConsultorioScreen = () => {
  const [Consultorios, setConsultorios] = useState([]);
  const [selectedConsultorios, setSelectedConsultorios] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const[isDeliting, setIsDeliting] = useState(false)
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const filteredConsultorios = Consultorios.filter(
    (consultorio) =>
      consultorio.name &&
      consultorio.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getCosnultorios = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/clinic/" });
      if (!data.error) setConsultorios(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getCosnultorios();
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
        name: "Coonsultorio",
        cell: (row) => <div>{row.name}</div>,
        sortable: true,
        selector: (row) => row.name,
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
                setSelectedConsultorios(row);
              }}
            ></ButtonCircle>

            <ButtonCircle
              icon="dash-2"
              type={"btn btn-outline-danger btn-circle"}
              size={16}
              onClick={() => {
                setIsDeliting(true);
                setSelectedConsultorios(row);
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
                <h4>Consultorios Pokemon</h4>
              </Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-outline-success"}
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  size={16}
                />
                <ConsultorioForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  setConsultorios={setConsultorios}
                />
                <EdItConsultorioForm
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  setConsultorios={setConsultorios}
                  consultorio={selectedConsultorios}
                />
                <BorrarConsultorio
                  isOpen={isDeliting}
                  onClose={() => setIsDeliting(false)}
                  setConsultorios={selectedConsultorios}
                  consultorio={selectedConsultorios}
                  />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTable
              columns={columns}
              data={filteredConsultorios}
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

export default ConsultorioScreen;
