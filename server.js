const { prompt } = require('inquirer');
const db = require('./db');

init();

// load initial prompts
function init() {
  loadMainPrompts();
}

function loadMainPrompts() {
  prompt([
    {
      type: 'list',
      name: 'choice',
      message: 'What do you need to do today?',
      choices: [
        {
          name: 'View All Departments',
          value: 'VIEW_DEPARTMENTS',
        },
        {
          name: 'View All Roles',
          value: 'VIEW_ROLES',
        },
        {
          name: 'View All Employees',
          value: 'VIEW_EMPLOYEES',
        },
        {
          name: 'Add Department',
          value: 'ADD_DEPARTMENT',
        },
        {
          name: 'Add Role',
          value: 'ADD_ROLE',
        },
        {
          name: 'Add Employee',
          value: 'ADD_EMPLOYEE',
        },
        {
          name: 'Update Employee Role',
          value: 'UPDATE_EMPLOYEE_ROLE',
        },
        {
          name: 'Remove Employee',
          value: 'REMOVE_EMPLOYEE',
        },
        {
          name: 'View Total Utilized Budget By Department',
          value: 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT',
        },
        {
          name: 'Quit',
          value: 'QUIT',
        },
      ],
    },
  ]).then((res) => {
    let choice = res.choice;
    switch (choice) {
      case 'VIEW_DEPARTMENTS':
        viewDepartments();
        break;
      case 'VIEW_ROLES':
        viewRoles();
        break;
      case 'VIEW_EMPLOYEES':
        viewEmployees();
        break;
      case 'ADD_DEPARTMENT':
        addDepartment();
        break;
      case 'ADD_ROLE':
        addRole();
        break;
      case 'ADD_EMPLOYEE':
        addEmployee();
        break;
      case 'UPDATE_EMPLOYEE_ROLE':
        updateEmployeeRole();
        break;
      case 'REMOVE_EMPLOYEE':
        removeEmployee();
        break;
      case 'VIEW_UTILIZED_BUDGET_BY_DEPARTMENT':
        viewUtilizedBudgetByDepartment();
        break;
      default:
        quit();
    }
  });
}
// view all deparments
function viewDepartments() {
  db.findAllDepartments()
    .then(({ rows }) => {
      let departments = rows;
      console.log('\n');
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
// view all roles
function viewRoles() {
  db.findAllRoles()
    .then(({ rows }) => {
      let roles = rows;
      console.log('\n');
      console.table(roles);
    })
    .then(() => loadMainPrompts());
}
// view all employees
function viewEmployees() {
  db.findAllEmployees()
    .then(({ rows }) => {
      let employees = rows;
      console.log('\n');
      console.table(employees);
    })
    .then(() => loadMainPrompts());
}
// add a department
function addDepartment() {
  prompt([
    {
      name: 'name',
      message: 'Write the name of the new department: ',
    },
  ]).then((res) => {
    let name = res;
    db.createDepartment(name)
      .then(() => console.log(`The new department ${name.name} has beed added`))
      .then(() => loadMainPrompts());
  });
}
// add a role
function addRole() {
  db.findAllDepartments().then(({ rows }) => {
    let departments = rows;
    const departmentChoices = departments.map(({ id, name }) => ({
      name: name,
      value: id,
    }));

    prompt([
      {
        name: 'title',
        message: 'Write the name for the new role: ',
      },
      {
        name: 'salary',
        message: 'Add a salary for this new role: ',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Choose the department of this role: ',
        choices: departmentChoices,
      },
    ]).then((role) => {
      db.createRole(role)
        .then(() => console.log(`The new role ${role.title} has been added`))
        .then(() => loadMainPrompts());
    });
  });
}
// add an employee
function addEmployee() {
  prompt([
    {
      name: 'first_name',
      message: "Add the employee's first name: ",
    },
    {
      name: 'last_name',
      message: "Add the employee's last name: ",
    },
  ]).then((res) => {
    let firstName = res.first_name;
    let lastName = res.last_name;

    db.findAllRoles().then(({ rows }) => {
      let roles = rows;
      const roleChoices = roles.map(({ id, title }) => ({
        name: title,
        value: id,
      }));

      prompt({
        type: 'list',
        name: 'roleId',
        message: "Choose the employee's role: ",
        choices: roleChoices,
      }).then((res) => {
        let roleId = res.roleId;

        db.findAllEmployees().then(({ rows }) => {
          let employees = rows;
          const managerChoices = employees.map(
            ({ id, first_name, last_name }) => ({
              name: `${first_name} ${last_name}`,
              value: id,
            })
          );

          managerChoices.unshift({ name: 'None', value: null });

          prompt({
            type: 'list',
            name: 'managerId',
            message: "Choose the new employee's manager: ",
            choices: managerChoices,
          })
            .then((res) => {
              let employee = {
                manager_id: res.managerId,
                role_id: roleId,
                first_name: firstName,
                last_name: lastName,
              };

              db.createEmployee(employee);
            })
            .then(() =>
              console.log(`The new employee ${firstName} ${lastName} has been added`)
            )
            .then(() => loadMainPrompts());
        });
      });
    });
  });
}
// update an employee role
function updateEmployeeRole() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: "Choose the employee you need to update:",
        choices: employeeChoices,
      },
    ]).then((res) => {
      let employeeId = res.employeeId;
      db.findAllRoles().then(({ rows }) => {
        let roles = rows;
        const roleChoices = roles.map(({ id, title }) => ({
          name: title,
          value: id,
        }));

        prompt([
          {
            type: 'list',
            name: 'roleId',
            message: 'Choose the updated role for this employee:',
            choices: roleChoices,
          },
        ])
          .then((res) => db.updateEmployeeRole(employeeId, res.roleId))
          .then(() => console.log("Employee's role has been updated"))
          .then(() => loadMainPrompts());
      });
    });
  });
}
// delete an employee
function removeEmployee() {
  db.findAllEmployees().then(({ rows }) => {
    let employees = rows;
    const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    }));

    prompt([
      {
        type: 'list',
        name: 'employeeId',
        message: 'Choose the employee you need to remove',
        choices: employeeChoices,
      },
    ])
      .then((res) => db.removeEmployee(res.employeeId))
      .then(() => console.log('Former employee is long gone now, best wishes!'))
      .then(() => loadMainPrompts());
  });
}
// view the total utilized budget of a department
function viewUtilizedBudgetByDepartment() {
  db.viewDepartmentBudgets()
    .then(({ rows }) => {
      let departments = rows;
      console.log('\n');
      console.table(departments);
    })
    .then(() => loadMainPrompts());
}
// Quit
function quit() {
  console.log('See you next time!');
  process.exit();
}
