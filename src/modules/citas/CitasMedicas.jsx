import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../shared/plugins/axios";
import { ButtonCircle } from "./../../shared/components/ButtonCircle";
import { Loading } from "./../../shared/components/Loading";
import { FilterComponent } from "./../../shared/components/FilterComponent";

const options = {
  rowsPerPageText: "Registros por página",
  rangeSeparatorText: "de",
};

const CitasMedicas = () => {
  const [citas, setCitas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCitas = citas.filter(
    (citas) =>
      citas.medicalConsultation && citas.medicalConsultation.toLowerCase().includes(filterText.toLowerCase())
  );

  const getCitas = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/consultation/" });
      console.log("Pokemons", data.data);
      if (!data.error) setCitas(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getCitas();
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
      name: "#",
      cell: (row, index) => <div style={{ width: '50px', padding: '5px' }}>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Cita Medica",
      cell: (row) => <div>{row.medicalConsultation}</div>,
      sortable: true,
      selector: (row) => row.medicalConsultation,
    },
    {
      name: "Padeimiento",
      cell: (row) => <div>{row.suffering}</div>,
      sortable: true,
      selector: (row) => row.suffering,
    },
    {
      name: "Pokemon",
      cell: (row) => <div>{row.pokemon.name}</div>,
      sortable: true,
      selector: (row) => row.pokemon.name,
    },
  ], []);
  

  return (
    <Card>
      <Card.Header>
        <Row>
          <Col>Citas Medicas</Col>
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
          
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={filteredCitas}
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

export default CitasMedicas;
