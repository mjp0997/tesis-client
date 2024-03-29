import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



// Actions
import { setClientsError, startCreateClient } from '../../../actions/clients';
import { setCitiesList, startGetCitiesList } from '../../../actions/cities';
import { setStatesList, startGetStatesList } from '../../../actions/states';
import { setCountriesList, startGetCountriesList } from '../../../actions/countries';
import { setBreadcrumb } from '../../../actions/ui';



// Components
import Form from '../../../components/form/Form';
import Input from '../../../components/form/Input';
import LoadingResponse from '../../../components/ui/spinners/LoadingResponse';
import Select from '../../../components/form/Select';
import TextArea from '../../../components/form/TextArea';



// Custom hooks
import { usePermission } from '../../../hooks/usePermission';



// Helpers
import { handleInvalidEmail, handleInvalidName, handleInvalidPhone, handleInvalidRut } from '../../../helpers/validations';
import InputPhone from '../../../components/form/InputPhone';



const ClientsCreate = () => {

   usePermission({section: 'companies', permission: 'create', onlyAdmin: true});

   const dispatch = useDispatch();

   const navigate = useNavigate();

   const {
      nameError, addressError, emailError, phoneError, rutError, cityIdError, stateIdError,
      loadingCreate
   } = useSelector(state => state.clients);

   const { citiesList, loadingList: loadingCitiesList } = useSelector(state => state.cities);
   const { statesList, loadingList: loadingStatesList } = useSelector(state => state.states);

   const [name, setName] = useState('');
   const [address, setAddress] = useState('');
   const [email, setEmail] = useState('');
   const [phone, setPhone] = useState('');
   const [rut, setRut] = useState('');
   const [cityId, setCityId] = useState('');
   const [stateId, setStateId] = useState('');

   const [filteredCities, setFilteredCities] = useState([]);

   useEffect(() => {
      dispatch(startGetCitiesList());
      dispatch(startGetStatesList());
      dispatch(startGetCountriesList());
   }, [dispatch]);

   useEffect(() => {
      dispatch(setBreadcrumb([
         {
            link: '/',
            text: 'Dashboard'
         },
         {
            link: '/clients',
            text: 'Clientes'
         },
         {
            text: 'Crear'
         }
      ]));
   }, [dispatch]);

   useEffect(() => {
      return () => {
         setName('');
         setAddress('');
         setEmail('');
         setPhone('');
         setRut('');
         setCityId('');
         setStateId('');

         setFilteredCities([]);

         dispatch(setClientsError(('name', null)));
         dispatch(setClientsError(('address', null)));
         dispatch(setClientsError(('email', null)));
         dispatch(setClientsError(('phone', null)));
         dispatch(setClientsError(('rut', null)));
         dispatch(setClientsError(('cityId', null)));
         dispatch(setClientsError(('stateId', null)));
         dispatch(setClientsError(('countryId', null)));

         dispatch(setCitiesList([]));
         dispatch(setStatesList([]));
         dispatch(setCountriesList([]));
         
         dispatch(setBreadcrumb([]));
      }
   }, [dispatch]);

   useEffect(() => {
      setFilteredCities(citiesList.filter(city => city.stateId === Number(stateId)));
   }, [citiesList, stateId]);

   // Errors and valids
   const handleInvalidAddress = (address) => {
      if (address.trim().length === 0) {
         return 'La dirección es obligatoria';
      } else {
         return null;
      }
   }

   const handleInvalidStateId = (stateId) => {
      if (stateId === '') {
         return 'El estado es obligatorio';
      } else if (!citiesList.find(city => city.stateId === Number(stateId))) {
         return 'Este estado no posee ciudades asociadas';
      } else {
         return null;
      }
   }

   const handleInvalidCityId = (cityId) => {
      if (cityId === '') {
         return 'La ciudad es obligatoria';
      } else {
         return null;
      }
   }

   // Handlers
   const handleName = (value) => {
      const nameE = handleInvalidName(value);
      dispatch(setClientsError('name', nameE));

      setName(value);
   }

   const handleEmail = (value) => {
      const emailE = handleInvalidEmail(value);
      dispatch(setClientsError('email', emailE));

      setEmail(value);
   }

   const handlePhone = (value) => {
      const phoneE = handleInvalidPhone(value);
      dispatch(setClientsError('phone', phoneE));

      setPhone(value);
   }

   const handleRut = (value) => {
      const rutE = handleInvalidRut(value);
      dispatch(setClientsError('rut', rutE));

      setRut(value);
   }

   const handleAddress = (value) => {
      const addressE = handleInvalidAddress(value);
      dispatch(setClientsError('address', addressE));

      setAddress(value);
   }

   const handleCityId = (value) => {
      const cityIdE = handleInvalidCityId(value);
      dispatch(setClientsError('cityId', cityIdE));

      setCityId(value);
   }

   const handleStateId = (value) => {
      const stateIdE = handleInvalidStateId(value);
      dispatch(setClientsError('stateId', stateIdE));

      setStateId(value);
      setCityId('');
   }

   // Submit
   const handleSubmit = (e) => {
      e.preventDefault();

      const nameE = handleInvalidName(name);
      dispatch(setClientsError('name', nameE));

      const emailE = handleInvalidEmail(email);
      dispatch(setClientsError('email', emailE));

      const phoneE = handleInvalidPhone(phone);
      dispatch(setClientsError('phone', phoneE));

      const rutE = handleInvalidRut(rut);
      dispatch(setClientsError('rut', rutE));

      const addressE = handleInvalidAddress(address);
      dispatch(setClientsError('address', addressE));

      const cityE = handleInvalidCityId(cityId);
      dispatch(setClientsError('cityId', cityE));

      if (!nameE && !emailE && !phoneE && !rutE && !addressE && !cityE) {
         dispatch(startCreateClient({name, address, email, cityId, phone, rut}, navigate));
      }
   }

   // Reset form
   const handleDiscard = () => {
      setName('');
      setAddress('');
      setEmail('');
      setPhone('');
      setRut('');
      setCityId('');
      setStateId('');

      setFilteredCities([]);

      dispatch(setClientsError('name', null));
      dispatch(setClientsError('address', null));
      dispatch(setClientsError('email', null));
      dispatch(setClientsError('phone', null));
      dispatch(setClientsError('rut', null));
      dispatch(setClientsError('cityId', null));
      dispatch(setClientsError('stateId', null));
      dispatch(setClientsError('countryId', null));
   }

   return (
      <>
         <div className='row invoice-preview mt-2'>
            <div className='col-xl-9 col-md-8 col-12'>
               <Form
                  title={'Crear cliente'}
                  handleSubmit={handleSubmit}
                  handleDiscard={handleDiscard}
               >
                  <div className='card-body invoice-padding py-0'>
                     <div className='row'>
                        <Input
                           value={name}
                           setValue={handleName}
                           title={'Nombre'}
                           placeholder='Ingrese el nombre de la ciudad'
                           containerClass='col-md-6 col-12 mb-1'
                           error={nameError}
                        />

                        <Input
                           value={email}
                           setValue={handleEmail}
                           title={'Correo'}
                           placeholder='Ingrese el correo del cliente'
                           containerClass='col-md-6 col-12 mb-1'
                           error={emailError}
                        />

                        <InputPhone
                           value={phone}
                           setValue={handlePhone}
                           title={'Teléfono'}
                           placeholder='Ingrese el teléfono del cliente'
                           containerClass='col-md-6 col-12 mb-1'
                           error={phoneError}
                        />

                        <Input
                           value={rut}
                           setValue={handleRut}
                           title={'Número de identificación'}
                           placeholder='Ingrese el número de identificación del cliente'
                           containerClass='col-md-6 col-12 mb-1'
                           error={rutError}
                        />

                        <Select
                           value={stateId}
                           setValue={handleStateId}
                           title='Estado'
                           name='state'
                           placeholder='Seleccione un estado'
                           options={statesList}
                           containerClass='col-md-6 col-12 mb-1'
                           error={stateIdError}
                           disabled={loadingStatesList || loadingCitiesList}
                        />

                        <Select
                           value={cityId}
                           setValue={handleCityId}
                           title='Ciudad'
                           name='city'
                           placeholder='Seleccione una ciudad'
                           options={filteredCities}
                           containerClass='col-md-6 col-12 mb-1'
                           error={cityIdError}
                           disabled={filteredCities.length === 0 || stateId === ''}
                        />

                        <TextArea
                           value={address}
                           setValue={handleAddress}
                           title={'Dirección'}
                           placeholder='Ingrese la dirección del cliente'
                           containerClass='col-12 mb-1'
                           error={addressError}
                        />
                     </div>
                  </div>
               </Form>
            </div>
            
            <div className='col-xl-3 col-md-4 col-12 invoice-actions mt-md-0 mt-2'>
               <div className='card'>
                  <div className='card-body'>
                     <Link
                        to='/clients'
                        className='btn btn-outline-secondary w-100 waves-effect waves-float waves-light'
                     >Volver a listado</Link>
                  </div>
               </div>
            </div>
         </div>

         <LoadingResponse state={loadingCreate} />
      </>
   );
}



export default ClientsCreate;