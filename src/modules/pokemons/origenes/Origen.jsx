import React, { useEffect, useState } from "react";

import { Card, Col, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../../shared/plugins/axios";
import { ButtonCircle } from "./../../../shared/components/ButtonCircle";
import { Loading } from "./../../../shared/components/Loading";
import { FilterComponent } from "./../../../shared/components/FilterComponent";
import OrigenForm from "./components/OrigenForm";
import EditOrigenForm from "./components/EditOrigenForm";
import BorrarOrigin from "./components/BorrarOrigin";
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
const Origen = () => {
  const [origenes, setOrigenes] = useState([]);
  const [selectedOrigen, setSelectedOrigen] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeliting, setIsDeliting] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredOrigen = origenes.filter(
    (origen) =>
      origen.origin &&
      origen.origin.toLowerCase().includes(filterText.toLowerCase())
  );

  const getOrigenes = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/origin/" });
      if (!data.error) setOrigenes(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getOrigenes();
  }, []);
  /*Recibe una dependencia, si está vacío solo se renderiza una vez, si no, se ejecuta cada que haya un cambio en la dependencia*/

  const enableOrDisable = (row) => {
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
        row.status = !row.status;

        try {
          const response = await AxiosClient({
            method: "PATCH",
            url: "/origin/",
            data: JSON.stringify(row),
          });
          if (!response.error) {
            Alert.fire({
              title: successTitle,
              text: successMsg,
              icon: "success",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
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
          });
        } finally {
          getOrigenes();
        }
      },
    });
  };

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
        name: "Región",
        cell: (row) => <div>{row.origin}</div>,
        sortable: true,
        selector: (row) => row.origin,
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
                setSelectedOrigen(row);
              }}
            ></ButtonCircle>

            <ButtonCircle
              icon="bash-2"
              type={"btn btn-outline-danger btn-circle"}
              size={16}
              onClick={() => {
                setIsDeliting(true);
                setSelectedOrigen(row);
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
       <div className="container">
    <div className="row justify-content-center align-items-center my-4">
      <div className="col-lg-8">
      <Card className="w-75">
          <Card.Header>
            <Row>
              <Col className="text-center">
                <h4>Regiones Pokemon</h4>
              </Col>
              <Col className="text-end">
                <ButtonCircle
                  type={"btn btn-outline-success"}
                  onClick={() => setIsOpen(true)}
                  icon="plus"
                  size={16}
                />
                <OrigenForm
                  isOpen={isOpen}
                  onClose={() => setIsOpen(false)}
                  setAreas={setOrigenes}
                />
                <EditOrigenForm
                  isOpen={isEditing}
                  onClose={() => setIsEditing(false)}
                  setOrigenes={setOrigenes}
                  origen={selectedOrigen}
                />

                <BorrarOrigin
                  isOpen={isDeliting}
                  onClose={() => setIsDeliting(false)}
                  setOrigenes={setOrigenes}
                  origen={selectedOrigen}
                />
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <DataTable
              columns={columns}
              data={filteredOrigen}
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
    </div>
  </div>

      
    </>
  );
};

export default Origen;
