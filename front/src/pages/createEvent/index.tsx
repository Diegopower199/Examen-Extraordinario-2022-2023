import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

/*type AddEventResponse = {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: Date;
  inicio: number;
  fin: number;
  invitados: string[];
};*/

type AddEventResponse = {
  id: string;
  title: string;
  date: Date;
  init: number;
  end: number;
  participants: string[];
};

const AddEvent = () => {
  const router = useRouter();
  const [responseAddEvent, setResponseAddEvent] = useState<AddEventResponse>();
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [init, setInit] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [participant, setParticipant] = useState<string>("");

  const [auxDate, setAuxDate] = useState<Date>(new Date());

  const [errorBackCreateEvent, setErrorBackCreateEvent] = useState<{
    error: string | undefined;
  }>({
    error: undefined,
  });

  const createEvent = async () => {
    try {
      const objetoFecha = new Date(date);
      console.log(objetoFecha);
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // <-- Importante el encabezado
        },
        body: JSON.stringify({
          title: title,
          date: objetoFecha,
          init: parseInt(init),
          end: parseInt(end),
          participants: participants,
        }),
      };

      console.log("requestOptions: ", requestOptions);

      const response = await fetch(
        "http://localhost:4000/addEvent",
        requestOptions
      );

      console.log("aqui llega");

      if (response.ok) {
        const result = await response.json();
        setResponseAddEvent(result);
        console.log(result);
        setErrorBackCreateEvent({ error: undefined });
      } else {
        const result = await response.json();
        setErrorBackCreateEvent({ error: result.message }); // Esto es porque esta así en el back, un json con una variable que es message
        console.log("Error", result);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setDate(
      `${auxDate.getFullYear()}-${(auxDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${auxDate.getDate().toString().padStart(2, "0")}`
    );
    setInit(String(auxDate.getHours()));
    setEnd(String(auxDate.getHours() + 1));
  }, []);

  return (
    <>
      <PurpleBorderMenu>
        <H1Titulo>Add Event</H1Titulo>
        <DivFormulario>
          <DivBotones>
            <InputSubmit
              type="submit"
              value={"Añadir"}
              onClick={async () => {
                try {
                  await createEvent();

                  setTitle("");
                  setDate(
                    `${auxDate.getFullYear()}-${(auxDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${auxDate
                      .getDate()
                      .toString()
                      .padStart(2, "0")}`
                  );
                  setInit(String(auxDate.getHours()));
                  setEnd(String(auxDate.getHours() + 1));
                  setParticipants([""]);
                  setParticipant("");
                } catch {}
              }}
            ></InputSubmit>
            <InputSubmit
              type="submit"
              value={"Cancelar"}
              onClick={async () => {
                router.push(`./`);
              }}
            ></InputSubmit>
          </DivBotones>
          <p>Los campos que tengan * son obligatorios</p>
          <DivElementoFormulario>
            <LabelIdentificar>Title *: </LabelIdentificar>
            <InputValores
              type="text"
              value={title}
              placeholder="Titulo"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            ></InputValores>
          </DivElementoFormulario>
          <DivElementoFormulario>
            <LabelIdentificar>Date *: </LabelIdentificar>
            <InputValores
              type="date"
              value={date}
              placeholder="Date"
              onChange={(e) => {
                setDate(e.target.value);
              }}
            ></InputValores>
          </DivElementoFormulario>

          <DivElementoFormulario>
            <LabelIdentificar>Init *: </LabelIdentificar>
            <InputValores
              type="number"
              value={init}
              placeholder="Init"
              onChange={(e) => {
                console.log(Number(e.target.value));
                if (e.target.value.includes("-")) {
                  e.target.value = "";
                } else if (Number(e.target.value) >= 25) {
                  e.target.value = e.target.value.slice(0, 2);
                  if (Number(e.target.value) > 24) {
                    e.target.value = e.target.value.slice(0, 1);
                  }
                  console.log("Cambio de valor", e.target.value);
                } else {
                  setInit(e.target.value);
                }
              }}
            ></InputValores>
          </DivElementoFormulario>
          <DivElementoFormulario>
            <LabelIdentificar>End *:</LabelIdentificar>
            <InputValores
              type="number"
              value={end}
              placeholder="End"
              onChange={(e) => {
                console.log(Number(e.target.value));
                if (e.target.value.includes("-")) {
                  e.target.value = "";
                } else if (Number(e.target.value) >= 25) {
                  e.target.value = e.target.value.slice(0, 2);
                  if (Number(e.target.value) > 24) {
                    e.target.value = e.target.value.slice(0, 1);
                  }
                  console.log("Cambio de valor", e.target.value);
                } else {
                  setEnd(e.target.value);
                }
              }}
            ></InputValores>
          </DivElementoFormulario>
          <LabelIdentificar>Participantes: </LabelIdentificar>
          <ul>
            {participants.map((participante) => {
              return (
                <>
                  <li>{participante}</li>
                </>
              );
            })}
          </ul>
          <DivElementoFormulario>
            <InputValores
              type="text"
              value={participant}
              placeholder="Invitados"
              onChange={(e) => {
                setParticipant(e.target.value);
              }}
            ></InputValores>
            <button
              onClick={(e) => {
                setParticipants([...participants, participant]);
                setParticipant("");
                /*console.log("Invitados", participants);
                const strings = participants.toString().split(",");
                setParticipants(
                  strings.map((invitado: string) => invitado.trim())
                );*/
              }}
            >
              Añadir participante
            </button>
          </DivElementoFormulario>

          {participants.toString()}
          {errorBackCreateEvent.error !== undefined ? (
            <>
              <ParrafoErrores>{errorBackCreateEvent.error}</ParrafoErrores>
            </>
          ) : (
            <></>
          )}
        </DivFormulario>
      </PurpleBorderMenu>
    </>
  );
};

export default AddEvent;

const PurpleBorderMenu = styled.div`
  font-weight: 600;
  font-size: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
  padding-left: 100px;
  padding-right: 100px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  overflow: hidden;
  white-space: nowrap;
  border: 7px solid #733bf6;
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
  display: flex;
  justify-content: flex-start;
  align-items: center;

  border: 1px solid #2e518b; /*anchura, estilo y color borde*/
  padding: 10px; /*espacio alrededor texto*/
  background-color: #2e518b; /*color botón*/
  color: #ffffff; /*color texto*/
  text-decoration: none; /*decoración texto*/
  text-transform: uppercase; /*capitalización texto*/
  font-family: "Helvetica", sans-serif; /*tipografía texto*/
  border-radius: 50px; /*bordes redondos*/
  width: 225px;

  :hover {
    cursor: pointer;
  }
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
