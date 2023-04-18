import React, { useEffect, useState } from "react";

import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../shared/plugins/axios";
import { ButtonCircle } from "./../../shared/components/ButtonCircle";
import { Loading } from "./../../shared/components/Loading";
import { FilterComponent } from "./../../shared/components/FilterComponent";

import EdItCombinacionForm from "./components/EdItCombinacionForm";
import CombinacionForm from "./components/CombinacionForm";
import BorrarCombinacion from "./components/BorrarCombinacion";

import Alert, {
  confirmMsg,
  confirmTitle,
  errorMsg,
  errorTitle,
  successMsg,
  successTitle,
} from "./../../shared/plugins/alert";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};
const CombinacionScreen = () => {
  const [combinaciones, setCombinaciones] = useState([]);
  const [selectedCombinaciones, setSelectedEspecies] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const[isDeliting, setIsDeliting] = useState(false)
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);

  const filteredCombinaciones = combinaciones.filter(
    (combinacion) =>
      combinacion.combination &&
      combinacion.combination.toLowerCase().includes(filterText.toLowerCase())
  );

  const getCombinaciones = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/combination/" });
      if (!data.error) setCombinaciones(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getCombinaciones();
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
        name: "Combinacion",
        cell: (row) => <div>{row.combination}</div>,
        sortable: true,
        selector: (row) => row.combination,
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
                <h4>Combinaciones de Pokemon</h4>
              </Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-outline-success"}
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  size={16}
                />
                <CombinacionForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  setCombinaciones={setCombinaciones}
                />
                <EdItCombinacionForm
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  setCombinaciones={setCombinaciones}
                  combinacion={selectedCombinaciones}
                />
                <BorrarCombinacion
                  isOpen={isDeliting}
                  onClose={() => setIsDeliting(false)}
                  setCombinaciones={selectedCombinaciones}
                  combinacion={selectedCombinaciones}
                  />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTable
              columns={columns}
              data={filteredCombinaciones}
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

export default CombinacionScreen;
