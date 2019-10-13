import React, { useReducer } from 'react';
import uuid from 'uuid';
import ContactContext from './contactContext';
import contactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CURRENT,
  UPDATE_CONTACT,
  FILTER_CONTACTS,
  CLEAR_FILTER
} from '../types';

// Setting Initial State
const ContactState = props => {
  const initialState = {
    contacts: [
      {
        id: 1,
        name: 'Matthew Weaber',
        email: 'mpw@email.com',
        phone: '111-111-1111',
        type: 'personal'
      },
      {
        id: 2,
        name: 'Rebecca Olson',
        email: 'rmo@email.com',
        phone: '222-222-2222',
        type: 'professional'
      },
      {
        id: 3,
        name: 'Scarlet Marie',
        email: 'doggo@doggo.com',
        phone: '333-333-3333',
        type: 'personal'
      }
    ]
  };

  // Next Step is to pull out state and dispatch from our reducer by using the useReducer hooks.

  // State allows us to acess anything in our state.
  // Dispatch allows us to dispatch objects to the reducer.
  const [state, dispatch] = useReducer(contactReducer, initialState);

  // --- Here we will have all of our actions: ---

  // Add_Contact
  const addContact = contact => {
    contact.id = uuid.v4();
    dispatch({ type: ADD_CONTACT, payload: contact});
  };

  // Delete_Contact

  // Set_Current_Contact

  // Clear_Current_Contact

  // Update_Contact

  // Filter_Contacts

  // Clear_Filter


  // Returning provider so that we can wrap our entire application with the context. Inside the ContactContext.Provider is where we will provide the values.

  return (
      <ContactContext.Provider
      value = {{
          contacts: state.contacts,
          addContact
      }}>
          { props.children }
      </ContactContext.Provider>
  )

};

export default ContactState;
