import { EmployeeDto } from "./model/dto/EmployeeDto";
import moment from 'moment';


// expected csv file type
export const csvFileType = 'text/csv';

// check for valid csv file type
export const isCsvFileFormat = (fileType: string) => fileType === csvFileType;

// parserOptions
export const parserOptions = {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  transformHeader: (header: string) => header.toLowerCase().replace(/\W/g, "_")
};

// calculate working Days
const getDaysWorked = (
  dateFrom1: Date, 
  dateTo1: Date, 
  dateFrom2: Date, 
  dateTo2: Date
) => {
  const maximum_min = moment(dateFrom1).isAfter(dateFrom2) ? dateFrom1 : dateFrom2; 
  const minimum_max = moment(dateTo1).isBefore(dateTo2) ? dateTo1 : dateTo2; 

  if (minimum_max > maximum_min) {
    const difference = moment(minimum_max).diff(maximum_min);
    return Math.ceil(difference / (1000 * 60 * 60 * 24));
  }

  return 0;
};

// reformat data Array<EmployeeDto>
const formatDatagrid = (data: { code: Array<EmployeeDto> }) => {
  const datagrid: Array<EmployeeDto> = [];

  Object.values(data).forEach((project: any) => {
    datagrid.push(...project);
  });
  
  // return format employee id #1, employee id #2, project Id, days worked
  return datagrid;
}

export const calculatePairOfEmployeesWorkedAsTeamLongest = (employees: Array<EmployeeDto>):Array<EmployeeDto> => {
  if (!employees.length) return [];

  // group employees by project id
  const groupEmployeesByProjectId = employees
    .reduce((curr: any, acc: EmployeeDto) => ({ 
      ...curr, 
      [acc.project_id]: curr[acc.project_id] ? 
        [...curr[acc.project_id], acc].map((emp: EmployeeDto) => ({ 
          ...emp, 
          days_worked: getDaysWorked(
            moment(emp.date_from).toDate(),
            moment(emp.date_to).isValid() ? moment(emp.date_to).toDate() : moment().toDate(), 
            moment(acc.date_from).toDate(), 
            moment(acc.date_to).isValid() ? moment(acc.date_to).toDate() : moment().toDate()
          ),
          partner_id: acc.emp_id
        })) 
        : [{ ...acc, days_worked: 0, partner_id: 0 }] 
      }),
    {})


  return formatDatagrid(groupEmployeesByProjectId)
    .filter((data) => data.days_worked && data.emp_id !== data.partner_id)
    .sort((a, b) => a.days_worked > b.days_worked ? -1 : 1);
}