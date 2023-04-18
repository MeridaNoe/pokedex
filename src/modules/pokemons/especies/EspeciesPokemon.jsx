import React, { useEffect, useState } from "react";
import Typing from "react-typing-effect";

import { Card, Col, Row, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import EspecieForm from "./components/EspecieForm";
import EditEspecieForm from "./components/EditEspecieForm";
import BorrarEspecie from "./components/BorrarEspecie";
import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../../shared/plugins/alert";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};
const EspeciesPokemon = () => {
  const [especies, setEspecies] = useState([]);
  const [selectedEspecies, setSelectedEspecies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const[isDeliting, setIsDeliting] = useState(false)
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const filteredEspecies = especies.filter(
    (especie) =>
      especie.species &&
      especie.species.toLowerCase().includes(filterText.toLowerCase())
  );

  const getEspecies = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/species/" });
      if (!data.error) setEspecies(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getEspecies();
  }, []);
  /*Recibe una dependencia, si está vacío solo se renderiza una vez, si no, se ejecuta cada que haya un cambio en la dependencia*/


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
        name: "Especie",
        cell: (row) => <div>{row.species}</div>,
        sortable: true,
        selector: (row) => row.species,
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
                setSelectedEspecies(row);
              }}
            ></ButtonCircle>

            <ButtonCircle
              icon="dash-2"
              type={"btn btn-outline-danger btn-circle"}
              size={16}
              onClick={() => {
                setIsDeliting(true);
                setSelectedEspecies(row);
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
                <h4>Especies de Pokemon</h4>
              </Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-outline-success"}
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  size={16}
                />
                <EspecieForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  setAreas={setEspecies}
                />
                <EditEspecieForm
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  setEspecies={setEspecies}
                  especie={selectedEspecies}
                />
                <BorrarEspecie
                  isOpen={isDeliting}
                  onClose={() => setIsDeliting(false)}
                  setEspecies={setEspecies}
                  especie={selectedEspecies}
                  />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTable
              columns={columns}
              data={filteredEspecies}
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

export default EspeciesPokemon;
