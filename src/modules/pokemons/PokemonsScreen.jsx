import React, { useEffect, useState } from "react";
import { Card, Col, Row, Badge } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AxiosClient from "./../../shared/plugins/axios";
import { ButtonCircle } from "./../../shared/components/ButtonCircle";
import { Loading } from "./../../shared/components/Loading";
import { FilterComponent } from "./../../shared/components/FilterComponent";
import { PokemonForm } from "./components/PokemonForm";
import { EditPokemonForm } from "./components/EditPokemonForm";

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

const PokemonsScreen = () => {
  const [pokemons, setPokemons] = useState([]);
  const [selectedPokemons, setSelectedPokemons] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [filterText, setFilterText] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredPokemons = pokemons.filter(
    (pokemons) =>
      pokemons.name && pokemons.name.toLowerCase().includes(filterText.toLowerCase())
  );

  const getPokemons = async () => {
    try {
      setIsLoading(true);
      const data = await AxiosClient({ url: "/pokemon/" });
      console.log("Pokemons", data.data);
      if (!data.error) setPokemons(data.data);
    } catch (error) {
      //poner alerta de error
    } finally {
      setIsLoading(false);
    }
  };
  //Se ejecuta después del return
  useEffect(() => {
    getPokemons();
  }, []);

  const enableOrDisable = (row) => {
    console.log("Row", row);
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
        console.log("Row", row);
        try {
          const response = await AxiosClient({
            method: "PATCH",
            url: "/pokemon/",
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
          console.log("response", response);
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
          getPokemons();
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

  const columns = React.useMemo(() => [
    {
      name: "#",
      cell: (row, index) => <div style={{ width: '50px', padding: '5px' }}>{index + 1}</div>,
      sortable: true,
    },
    {
      name: "Nombre",
      cell: (row) => <div>{row.name}</div>,
      sortable: true,
      selector: (row) => row.name,
    },
    {
      name: "Edad",
      cell: (row) => <div>{row.age}</div>,
      sortable: true,
      selector: (row) => row.age,
    },
    {
      name: "Descripción",
      cell: (row) => <div>{row.description}</div>,
      sortable: true,
      selector: (row) => row.description,
    },
    {
      name: "Especie",
      cell: (row) => <div>{row.species.species}</div>,
      sortable: true,
      selector: (row) => row.species.species,
    },
    {
      name: "Region",
      cell: (row) => <div>{row.origin.origin}</div>,
      sortable: true,
      selector: (row) => row.origin.origin,
    },
    {
      name: "Combinación",
      cell: (row) => <div>{row.combination.combination}</div>,
      sortable: true,
      selector: (row) => row.combination.combination,
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
                setSelectedPokemons(row);
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
          <Col>Pokemons</Col>
          <Col className="text-end">
            <ButtonCircle
              type={"btn btn-outline-success"}
              onClick={() => setIsOpen(true)}
              icon="plus"
              size={16}
            />
            <PokemonForm
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              setPokemons={setPokemons}
            />
            {selectedPokemons && (
              <EditPokemonForm
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                setPokemons={setPokemons}
                pokemons={selectedPokemons}
              />
            )}
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        <DataTable
          columns={columns}
          data={filteredPokemons}
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

export default PokemonsScreen;
