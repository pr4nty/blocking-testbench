import React from 'react'

import {
    List,
    Datagrid,
    TextField,
    DateField,
    DeleteButton,
    ReferenceField,


} from 'react-admin'

export const TestList = ({ permissions, ...props }) => {
    return (
      <List {...props} bulkActionButtons={false}>
        <Datagrid rowClick="show">
            <TextField label="Test Nr." source='testId' />
            <ReferenceField label="Surname" source="testId" reference="users">
                <TextField source="lastName" />
            </ReferenceField>             
            <DateField source='date' showTime />
            {permissions === 'coach' &&
              <DeleteButton basePath='/tests/' />}
        </Datagrid>
      </List>
    )
}