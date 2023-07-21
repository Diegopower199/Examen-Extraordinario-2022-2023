import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

type GetEvento = {
  id: string;
  title: string;
  date: Date;
  init: number;
  end: number;
  participants: string[];
};

const days = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const Events = () => {
  const router = useRouter();
  const [data, setData] = useState<GetEvento[]>([]);
  const [errorBack, setErrorBack] = useState<{ error: string | undefined }>({
    error: undefined,
  });
  const [auxDate, setAuxDate] = useState<Date>(new Date());

  const removeEvent = async (idRemove: string) => {
    try {
      const requestOptions = {
        method: "DELETE",
      };
      //console.log( "requestOptions: ", requestOptions, "\nId remove: ", idRemove);

      const response = await fetch(
        `http://localhost:4000/deleteEvent/${idRemove}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.text();
        console.log("Resultado", result);

        setErrorBack({ error: undefined });
      } else {
        const result = await response.text();
        setErrorBack({ error: result });
        console.log("Error", result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const allEvents = async () => {
    try {
      const requestOptions = {
        method: "GET",
      };
      console.log("AUXDATE: ", auxDate);
      const response = await fetch(
        `http://localhost:4000/events?date=${auxDate}`,
        requestOptions
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);

        setData(result); // Esto es asi porque no devolvemos un JSON, si lo devolvemos debemos poner '.' y la variable que pongamos
        //console.log("Informacion de result", result);
        setErrorBack({ error: undefined });
      } else {
        const result = await response.text();
        //console.log("Error", result);
        setErrorBack({ error: result });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    allEvents();
    console.log("fecha de hoy: ", new Date());
    console.log(
      "Año: ",
      auxDate.getFullYear(),
      "\nMes: ",
      auxDate.getMonth() + 1,
      "\nDia: ",
      auxDate.getDate()
    );
    
  }, []);

  useEffect(() => {
    console.log("Estoy aqui ");
    allEvents();
  }, [auxDate]);

  return (
    <>
      <DivBotones>
        <InputSubmit
          type="submit"
          value={"Dia anterior"}
          onClick={() => {
            let numericDay = auxDate.getDate() - 1;
            let numericMonth = auxDate.getMonth() + 1;
            let numericYear = auxDate.getFullYear();
            console.log(numericMonth)

            let primerDia = new Date(numericYear, numericMonth - 1, 1);
            let ultimoDia = new Date(numericYear, numericMonth, 0);
            console.log("Primer dia mes: ", primerDia, "\nUltimo dia mes: ", ultimoDia)
            console.log("Ultimo dia: ", ultimoDia.getDate())
            // Verificar si es necesario actualizar el mes y el año
            console.log("hola", numericMonth)
            
            if (numericDay < 1) {
              numericDay = ultimoDia.getDate();
              numericMonth = numericMonth - 1;
              
              if (numericMonth > 12) {
                numericMonth = 1;
                numericYear = numericYear + 1;
              }
            }

            console.log("Mes: ", numericMonth)
            setAuxDate(new Date(`${numericYear}/${numericMonth}/${numericDay}`));
          }}
        ></InputSubmit>
        <InputSubmit
          type="submit"
          value={"Dia siguiente"}
          onClick={() => {
            let numericDay = auxDate.getDate() + 1;
            let numericMonth = auxDate.getMonth() + 1;
            let numericYear = auxDate.getFullYear();
            console.log(numericMonth)

            let primerDia = new Date(numericYear, numericMonth - 1, 1);
            let ultimoDia = new Date(numericYear, numericMonth, 0);
            console.log("Primer dia mes: ", primerDia, "\nUltimo dia mes: ", ultimoDia)
            console.log("Ultimo dia: ", ultimoDia.getDate())
            // Verificar si es necesario actualizar el mes y el año
            console.log("hola", numericMonth)
            if (numericDay > ultimoDia.getDate()) {
              numericDay = 1;
              numericMonth = numericMonth + 1;
              if (numericMonth > 12) {
                numericMonth = 1;
                numericYear = numericYear + 1;
              }
            }
            else if (numericDay < 1) {
              numericDay = ultimoDia.getDate();
              numericMonth = numericMonth - 1;
              //console.log("hola", numericMonth, "   ", numericDay)
              if (numericMonth > 12) {
                numericMonth = 1;
                numericYear = numericYear + 1;
              }
            }

            
            setAuxDate(new Date(`${numericYear}/${numericMonth}/${numericDay}`));
          }}
        ></InputSubmit>{" "}
        <InputSubmit
          type="submit"
          value={"Añadir nuevo evento"}
          onClick={async () => {
            router.push(`./createEvent`);
          }}
        ></InputSubmit>
      </DivBotones>
      <GreenBorderMenu>
        <H1Titulo>
          Events del dia {"  "}
            {days[auxDate.getDay()] +
              ", " +
              auxDate.getDate() +
              " de " +
              months[auxDate.getMonth()] +
              " de " +
              auxDate.getFullYear()}
          
        </H1Titulo>

        {errorBack.error !== undefined ? (
          <>
            <ErrorMessage>{errorBack.error}</ErrorMessage>
          </>
        ) : (
          <>
            {!data || data.length === 0 ? (
              <>
                <h1>No hay eventos con la fecha de hoy</h1>
              </>
            ) : (
              <>
                {data.map((event) => {
                  return (
                    <>
                      <DivElementosSlot>
                        <DivElemento>
                          <ParrafoTitulo>Title</ParrafoTitulo>
                          <ParrafoValores>{event.title}</ParrafoValores>
                        </DivElemento>

                        <DivElemento>
                          <ParrafoTitulo>Date</ParrafoTitulo>
                          <ParrafoValores>
                            {event.date.toString().substring(0, 10)}
                          </ParrafoValores>
                        </DivElemento>

                        <DivElemento>
                          <ParrafoTitulo>Init</ParrafoTitulo>
                          <ParrafoValores>{event.init}</ParrafoValores>
                        </DivElemento>

                        <DivElemento>
                          <ParrafoTitulo>End</ParrafoTitulo>
                          <ParrafoValores>{event.end}</ParrafoValores>
                        </DivElemento>

                        <DivElemento>
                          <ParrafoTitulo>Invitados</ParrafoTitulo>
                          <ParrafoValores>
                            {event.participants.toString()}
                          </ParrafoValores>
                        </DivElemento>

                        <BotonBorrar
                          onClick={async () => {
                            await removeEvent(event.id);

                            await allEvents();
                          }}
                        >
                          <ParrafoValores>Borrar</ParrafoValores>
                        </BotonBorrar>
                      </DivElementosSlot>
                    </>
                  );
                })}
              </>
            )}
          </>
        )}
      </GreenBorderMenu>
    </>
  );
};

export default Events;

const GreenBorderMenu = styled.div`
  font-weight: 600;
  font-size: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 100px;
  padding-right: 100px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow: hidden;
  white-space: nowrap;
  border: 7px solid #43c54e;
  border-radius: 15px;
  margin: 10px;
`;

const H1Titulo = styled.h1`
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DivFormulario = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  background-color: #ffffff;
  padding: 20px;
  margin: 20px auto;
  width: 50%;
  box-shadow: 0px 0px 10px #aaaaaa;
`;

const DivElementoFormulario = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 3px;
`;

const InputSubmit = styled.input`
  border: none;
  padding: 10px 20px;
  color: white;
  font-size: 20px;
  background: #1a2537;
  //padding: 15px 20px;
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.3s;
  :hover {
    background: cadetblue;
  }
`;

const LabelIdentificar = styled.label`
  display: block;
  margin-bottom: 10px;
  color: #333333;
  font-weight: bold;
  margin: 2px;
`;
const InputValores = styled.input`
  padding: 15px;
  border: 1px solid #aaaaaa;
  border-radius: 5px;
  width: 100%;
  box-sizing: border-box;
  //margin-bottom: 20px;
`;

const ParrafoErrores = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px;
  font-size: 20px;
  color: red;
`;

const BotonMenuPrincipal = styled.div`
  border: 1px solid #2e518b; /*anchura, estilo y color borde*/
  padding: 10px; /*espacio alrededor texto*/
  background-color: #2e518b; /*color botón*/
  color: #ffffff; /*color texto*/
  text-decoration: none; /*decoración texto*/
  text-transform: uppercase; /*capitalización texto*/
  font-family: "Helvetica", sans-serif; /*tipografía texto*/
  border-radius: 50px; /*bordes redondos*/

  width: 180px;

  :hover {
    cursor: pointer;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: 600;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  width: 600px;
`;

const BotonBorrar = styled.button`
  font-weight: 600;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  transition: 0.3s;
`;

const DivElementosSlot = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: space-around;
  align-items: center;
  flex-direction: row;
  background-color: #424632;
  margin: 5px;
`;

const DivElemento = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: aqua;

  border: black 5px solid;
  height: 81px;
  width: 96px;
`;

const ParrafoTitulo = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  border: black 5px solid;
  width: 91px;
  height: 70px;
  margin: 0px;
  background-color: blueviolet;
`;

const ParrafoValores = styled.p`
  font-family: Arial, sans-serif;
  font-size: 18px;
  color: #333;
  line-height: 1.6em;
  text-align: justify;
  color: #2f2f2f;
  border-radius: 5px;
`;

const DivBotones = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;
