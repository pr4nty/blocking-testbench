import React from 'react'

import { Admin, Resource, Login } from 'react-admin'

// Data Provider
import dataProvider from './components/data/dataProvider'

// Auth Provider
import authProvider from './components/auth/authProvider';

// Icons/Theme
import UserIcon from '@material-ui/icons/Group';
import AssignmentSharpIcon from '@material-ui/icons/AssignmentSharp';
import { createMuiTheme } from '@material-ui/core/styles';
// Login BackgroundImage
import logInBackground from './images/background.jpg'

// Components
import { PlayerList, PlayerProfile, PlayerEdit, PlayerCreate} from './components/lists/PlayerList'
import { TestList } from './components/lists/TestList'
import Dashboard from './components/Dashboard';
import Charts from './components/chart/Charts';

// Dark Mode
const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});



// Custom Login Background
const MyLoginPage = () => ( <Login backgroundImage={logInBackground} /> );


function App() {
  return (
      <Admin theme={theme} title="Swarco Raiders" loginPage={MyLoginPage} dashboard={Dashboard} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name= 'users' list={PlayerList} show={PlayerProfile} edit={PlayerEdit} create={PlayerCreate} options={{ label: 'Player List' }} icon={UserIcon} /> 
        <Resource name= 'tests'list={TestList} show={Charts} icon={AssignmentSharpIcon} />  
      </Admin>
  );
}

export default App;
