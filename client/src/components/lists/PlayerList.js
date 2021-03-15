import React from 'react'

import {
    List,
    Datagrid,
    TextField,
    DateField,
    EditButton,
    Edit,
    Create,
    DeleteButton,
    CreateButton,
    Filter,
    SelectInput, 
    TextInput,
    Show,
    SimpleShowLayout,
    ReferenceArrayField,
    SimpleForm,
    useListContext,
    TopToolbar,
    sanitizeListRestProps,
    PasswordInput,
    required,
    minLength,
    maxLength
} from 'react-admin'

// Generating the Player List
export const PlayerList = ({ permissions, ...props }) => {
  return (
    <List {...props} actions={<ListActions permissions={permissions} {...props} />} filters={<PostFilter/>} bulkActionButtons={false}>
      <Datagrid rowClick="show">
        <TextField source="lastName" />
        <TextField source="firstName" />
        <TextField source="position" />
        <TextField source='numberOfTests' />
        {permissions === 'coach' &&
        <EditButton basePath='/users' />}
        {permissions === 'coach' &&
        <DeleteButton basePath='/users' />}
      </Datagrid>
    </List>
  )
}

// Register User Button
const ListActions = ({ permissions, ...props }) => {
  const {
      className,
      exporter,
      filters,
      maxResults,
      ...rest
  } = props;
  const { basePath } = useListContext();
  return (
      <TopToolbar className={className} {...sanitizeListRestProps(rest)}>
        {permissions === 'coach' && <CreateButton basePath="users" label="Create a new Player" />}
      </TopToolbar>
  );
};

// The Post filter in the Player List
const PostFilter = (props) => (
  <Filter {...props}>
      <TextInput label="Search" source="q" alwaysOn />
  </Filter>
);

// Player Profile Title
const ProfileTitle = ({ record }) => {
  return <span>Profile of: {record ? `${record.firstName} ${record.lastName}` : ''}</span>;
};

// Edit Player
const choices = [
  { id: 'QB', name: 'Quarterback' },
  { id: 'RB', name: 'Running Back' },
  { id: 'FB', name: 'Fullback' },
  { id: 'WR', name: 'Wide Receiver' },
  { id: 'TE', name: 'Tight End' },
  { id: 'LT', name: 'Left Offensive Tackle' },
  { id: 'RT', name: 'Right Offensive Tackle' },
  { id: 'LG', name: 'Left Offensive Guard' },
  { id: 'RG', name: 'Right Offensive Guard' },
  { id: 'CE', name: 'Center' },
  { id: 'DT', name: 'Defensive Tackle' },
  { id: 'DE', name: 'Defensive End' },
  { id: 'MLB', name: 'Middle Linebacker' },
  { id: 'LOLB', name: 'Left Outside Linebacker' },
  { id: 'ROLB', name: 'Right Outside Linebacker' },
  { id: 'CB', name: 'Cornerback' },
  { id: 'FS', name: 'Free Safety' },
  { id: 'SS', name: 'Strong Safety' },
  { id: 'K', name: 'Kicker' },
  { id: 'P', name: 'Punter' },
  { id: 'LS', name: 'Long Snapper' },
  { id: 'H', name: 'Holder' },
];

export const PlayerEdit = ({ permissions, ...props }) => (
  <Edit title={<ProfileTitle />} {...props}>
      <SimpleForm>
          {permissions === 'coach' && <TextInput source="firstName" validate={validateFirstName}/>}
          {permissions === 'coach' && <TextInput source="lastName" validate={validateLastName}/> }
          {permissions === 'coach' && <TextInput source="username" validate={validateUsername}/> }
          {permissions === 'coach' && <SelectInput source="position" choices={choices} /> }
          {permissions === 'coach' && <SelectInput source="role" choices={[{ id: 'player', name: 'Player' },{ id: 'coach', name: 'Coach' }]} /> }
      </SimpleForm>
  </Edit>
);

// The Show field for every Player
export const PlayerProfile = props => (
  <Show title={<ProfileTitle />} {...props}>
      <SimpleShowLayout >
              <TextField label="Surname:"source="lastName" />
              <TextField label="First name:" source="firstName" />
              <TextField label="Position:" source="position" />                               
              <TextField source="numberOfTests" />
              <ReferenceArrayField label="List of Tests:" reference="tests" source="testId">
                  <Datagrid rowClick="show">
                      <TextField source="testId" />
                      <DateField source='date' showTime />
                  </Datagrid>
              </ReferenceArrayField>
      </SimpleShowLayout>
  </Show>
);

// Player validation
const validateFirstName = [required(), minLength(2), maxLength(15)];
const validateLastName = [required(), minLength(2), maxLength(15)];
const validateUsername = [required(), minLength(2), maxLength(15)];
const validatePassword = [required(), minLength(5), maxLength(30)];


// Create Player
export const PlayerCreate = ({ permissions, ...props }) => (
  <Create {...props}>
      <SimpleForm>
          {permissions === 'coach' && <TextInput source="firstName" validate={validateFirstName}/>}
          {permissions === 'coach' && <TextInput source="lastName" validate={validateLastName}/> }
          {permissions === 'coach' && <TextInput source="username" validate={validateUsername}/> }
          {permissions === 'coach' && <PasswordInput source="password" validate={validatePassword}/> }
          {permissions === 'coach' && <SelectInput source="position" choices={choices} /> }
          {permissions === 'coach' && <SelectInput source="role" choices={[{ id: 'player', name: 'Player' },{ id: 'coach', name: 'Coach' }]} /> }
      </SimpleForm>
  </Create>);