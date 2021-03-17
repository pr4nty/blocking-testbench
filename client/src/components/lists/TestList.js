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
            <DateField source='date' showTime />
            <TextField label="Test ID" source='testId' />
            {permissions === 'coach' &&
              <DeleteButton basePath='/tests/' />}
        </Datagrid>
      </List>
    )
}