import { useState } from 'react';
import DataTable from 'react-data-table-component';
import { FormControl, Row, Col, Container } from 'react-bootstrap';

const UserTable = ({ user }) => {
    const [filters, setFilters] = useState({
        name: '',
        email: '',
        address: '',
        userrole: '',
    });

    // Filter the user data based on filters
    const filteredData = user.filter((u) =>
        u.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        u.address.toLowerCase().includes(filters.address.toLowerCase()) &&
        u.userrole.toLowerCase().includes(filters.userrole.toLowerCase())
    );

    const columns = [
        {
            name: "Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: "Address",
            selector: (row) => row.address,
            sortable: true,
        },
        {
            name: "User Role",
            selector: (row) => row.userrole,
            sortable: true,
        },
    ];

    return (
        <div className="p-3">
            <Container className="mb-3">
                <Row>
                    <Col>
                        <FormControl
                            placeholder="Filter by Name"
                            value={filters.name}
                            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <FormControl
                            placeholder="Filter by Email"
                            value={filters.email}
                            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <FormControl
                            placeholder="Filter by Address"
                            value={filters.address}
                            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
                        />
                    </Col>
                    <Col>
                        <FormControl
                            placeholder="Filter by Role"
                            value={filters.userrole}
                            onChange={(e) => setFilters({ ...filters, userrole: e.target.value })}
                        />
                    </Col>
                </Row>
            </Container>

            <DataTable
                columns={columns}
                data={filteredData}
                responsive
                bordered
                striped
                pagination
                highlightOnHover
            />
        </div>
    );
};

export default UserTable;
