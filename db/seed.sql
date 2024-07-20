-- Connect to the database
\c employees

INSERT INTO department
    (name)
VALUES
    ('Human Resources'),
    ('Production'),
    ('Ops'),
    ('Sales');

INSERT INTO role
    (title, department_id, salary)
VALUES
    ('HR Manager', 1, 6500),
    ('Recruiter', 1, 5000),
    ('Producer', 2, 5000),
    ('Art Director', 2, 4500),
    ('Ops Coordinator', 3, 6000),
    ('Project Manager', 3, 6000),
    ('Sales Representative', 4, 7000),
    ('Sales Manager', 4, 8000);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Arturo', 'Mendez', 1, 1),
    ('Fernando', 'Garcia', 2, 1),
    ('Elias', 'Torres', 3, NULL),
    ('Sandra', 'Becerril', 4, NULL),
    ('Carla', 'Estrada', 5, 5),
    ('Benjamin', 'Gaia', 6, 5),
    ('Mariana', 'Ortega', 7, NULL),
    ('Barbara', 'Diaz', 8, NULL);


