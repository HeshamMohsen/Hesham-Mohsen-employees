import React, { useState } from 'react';
import CSVReader from 'react-csv-reader'

import './App.css';
import { EmployeeDto } from './model/dto/EmployeeDto';
import { FileInfoDto } from './model/dto/FileInfoDto';
import { calculatePairOfEmployeesWorkedAsTeamLongest, isCsvFileFormat, parserOptions } from './utils';

function App() {
  const [validCsv, setValidCsv] = useState(true);
  const [datagrid, setDatagrid] = useState([]);

  // on upload file handler
  const onUploadFile = (data: Array<EmployeeDto>, fileInfo: FileInfoDto) => {
    if (!isCsvFileFormat(fileInfo.type)) {
      return setValidCsv(false);
    }

    !validCsv && setValidCsv(true);
    setDatagrid(calculatePairOfEmployeesWorkedAsTeamLongest(data) as any);
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="container">
          <CSVReader
            cssClass="react-csv-input"
            label="Select CSV File"
            onFileLoaded={onUploadFile}
            parserOptions={parserOptions}
          />
        </div>
        {!validCsv && <div className="wrong-file">Please upload valid csv file!</div>}
        {!!datagrid.length && (
          <table>
            <thead>
              <tr>
                <th>Employee ID #1</th>
                <th>Employee ID #2</th>
                <th>Project ID</th>
                <th>Days Worked</th>
              </tr>
            </thead>
            <tbody>
              {datagrid.map((employee: EmployeeDto) => 
                <tr key={employee.emp_id}>
                  <td>{employee.emp_id}</td>
                  <td>{employee.partner_id}</td>
                  <td>{employee.project_id}</td>
                  <td>{employee.days_worked}</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </header>
    </div>
  );
}

export default App;
