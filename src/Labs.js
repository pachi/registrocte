/* -*- coding: utf-8 -*-

Copyright (c) 2018 Rafael Villar Burke <pachi@ietcc.csic.es>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Componente que muestra una tabla de laboratorios y un formulario de filtrado

import React, { Component } from "react";

const tablerow = (datum, idx) => (
  <tr className="entidadregistro" key={`row-${idx}`}>
    <td>
      {datum.web_url ? (
        <React.Fragment>
          <a href={datum.web_url} title={datum.web}>
            {datum.cod}
          </a>
        </React.Fragment>
      ) : (
        datum.cod
      )}
      <br />
      <span className="alta">ALTA: {datum.fecha_alta}</span>
    </td>
    <td>
      <b>{datum.empresa}</b>
    </td>
    <td>
      {datum.direccion}
      <br />
      {datum.cp} {datum.municipio} ({datum.provincia})
    </td>
    <td>
      {datum.telefono1 || datum.telefono2 ? (
        <React.Fragment>
          <span className="light">Tel.:</span> {datum.telefono1}
          {datum.telefono2 ? ", " + datum.telefono2 : ""}
          <br />
        </React.Fragment>
      ) : null}
      {datum.fax ? (
        <React.Fragment>
          <span className="light">Fax:</span> {datum.fax}
          <br />
        </React.Fragment>
      ) : null}
      {datum.email ? (
        <React.Fragment>
          <span className="light">email:</span>{" "}
          <a href={`mailto:${datum.email}`}>{datum.email}</a>
        </React.Fragment>
      ) : null}
    </td>
    <td>
      <span className="light">Dec.resp.:</span> {datum.declaraciones.join(", ")}
      <br />
      {datum.observaciones ? (
        <React.Fragment>
          <span className="light">Observaciones:</span> {datum.observaciones}
        </React.Fragment>
      ) : null}
    </td>
  </tr>
);

class LabsTable extends Component {
  render() {
    const { data } = this.props;
    return (
      <table id="registros">
        <caption>
          Tabla: Registro General de Laboratorios de ensayos para el control de
          calidad de la edificación-LEcce
        </caption>
        <colgroup>
          <col className="w10" />
          <col className="w20" />
          <col className="w20" />
          <col className="w20" />
          <col className="w30" />
        </colgroup>
        <thead>
          <tr>
            <th>Código</th>
            <th>Empresa / Organismo</th>
            <th>Dirección</th>
            <th>Contacto</th>
            <th>Declaraciones responsables y observaciones</th>
          </tr>
        </thead>
        <tbody>{data.map((val, idx) => tablerow(val, idx))}</tbody>
      </table>
    );
  }
}

class Labs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comunidadactiva: "TODAS",
      labs: [],
      comunidades: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const { url = "./data/datalabs.json" } = this.props;
    // https://www.robinwieruch.de/react-fetching-data/
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error al cargar los datos de laboratorios...");
        }
      })
      .then(data => {
        // Entidades que no se han dado de baja y lista de CCAA
        // Laboratorios que no se han dado de baja y lista de CCAA
        const labs = data.filter(l => l.baja === "");
        const comunidades = [...new Set(labs.map(d => d.comunidad))];
        this.setState({ labs, comunidades, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  render() {
    const { comunidadactiva, labs, comunidades, isLoading, error } = this.state;

    if (error) {
      return <p>{error.message}</p>;
    }

    if (isLoading) {
      return (
        <div>
          <p>Cargando datos...</p>
          <div class="spinner" />
        </div>
      );
    }

    const actlabs =
      comunidadactiva === "TODAS"
        ? labs
        : labs.filter(d => d.comunidad === comunidadactiva);

    return (
      <div id="labs">
        <p className="lead">
          Registro General de Laboratorios de ensayos para el control de calidad
          de la edificación-LEcce.
        </p>
        <form>
          <label>Comunidad: </label>
          <select
            name="Comunidad"
            onChange={e => this.setState({ comunidadactiva: e.target.value })}
          >
            <option value="TODAS">Todas</option>
            {comunidades.map((vv, ii) => (
              <option value={vv} key={`opt-${ii}`}>
                {vv}
              </option>
            ))}
          </select>{" "}
          ({actlabs.length} registros)
        </form>
        <LabsTable data={actlabs} />
      </div>
    );
  }
}

export default Labs;
