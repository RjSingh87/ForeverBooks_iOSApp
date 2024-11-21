import React from 'react';
import Store from './Store';
import MainRoot from './MainRoot';
import {Provider} from 'react-redux';
import MyStore from './screens/reduxTookit/MyStore';
const App = () => {
 return (
    <>
    <Store>
      <Provider store={MyStore}>
        <MainRoot/>
      </Provider>
    </Store>
    </>
  )
}
export default App;

