import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



// Actions
import { setLoading, setCitiesError, setCity, startGetCity, startUpdateCity } from '../../../actions/cities';
import { setStatesList, startGetStatesList } from '../../../actions/states';
import { setCountriesList, startGetCountriesList } from '../../../actions/countries';
import { setBreadcrumb } from '../../../actions/ui';



// Components
import Input from '../../../components/form/Input';
import LoadingComponent from '../../../components/ui/spinners/LoadingComponent';
import LoadingResponse from '../../../components/ui/spinners/LoadingResponse';
import Select from '../../../components/form/Select';
import Form from '../../../components/form/Form';



// Helpers
import { handleInvalidName } from '../../../helpers/validations';



const CitiesEdit = () => {
   
   const dispatch = useDispatch();

   const { id } = useParams();

   const { nameError, stateIdError, countryIdError, loadingUpdate, loadingDetail, city } = useSelector(state => state.cities);

   const { statesList, loadingList: loadingStatesList } = useSelector(state => state.states);
   const { countriesList, loadingList: loadingCountriesList } = useSelector(state => state.countries);

   const [name, setName] = useState('');
   const [stateId, setStateId] = useState('');
   const [countryId, setCountryId] = useState('');

   const [filteredStates, setFilteredStates] = useState([]);

   useEffect(() => {
      dispatch(setLoading('detail', true));
      dispatch(startGetCity(id));
   }, [dispatch, id]);

   useEffect(() => {
      setName(city?.name || '');
      setStateId(city?.stateId || '');
      setCountryId(city?.state?.countryId || '');
   }, [city?.name, city?.stateId, city?.state?.countryId]);

   useEffect(() => {
      dispatch(startGetCountriesList());
      dispatch(startGetStatesList());
   }, [dispatch]);

   useEffect(() => {
      dispatch(setBreadcrumb([
         {
            link: '/',
            text: 'Dashboard'
         },
         {
            link: '/states',
            text: 'Estados'
         },
         {
            text: 'Editar'
         }
      ]));
   }, [dispatch]);

   useEffect(() => {
      return () => {
         setName('');
         setStateId('');
         setCountryId('');
         
         dispatch(setCitiesError('name', null));
         dispatch(setCitiesError('stateId', null));
         dispatch(setCitiesError('countryId', null));

         dispatch(setCity(null));

         dispatch(setStatesList([]));
         dispatch(setCountriesList([]));
         
         dispatch(setBreadcrumb([]));
      }
   }, [dispatch]);

   useEffect(() => {
      setFilteredStates(statesList.filter(state => state.countryId === Number(countryId)));
   }, [statesList, countryId]);

   // Errors and valids
   const handleInvalidCountryId = (countryId) => {
      if (countryId === '') {
         return 'El pa??s es obligatorio';
      } else if (!statesList.find(state => state.countryId === Number(countryId))) {
         return 'Este pa??s no posee estados asociados';
      } else {
         return null;
      }
   }

   const handleInvalidStateId = (stateId) => {
      if (stateId === '') {
         return 'El estado es obligatorio';
      } else {
         return null;
      }
   }

   // Handlers
   const handleName = (value) => {
      const nameE = handleInvalidName(value);
      dispatch(setCitiesError('name', nameE));

      setName(value);
   }

   const handleStateId = (value) => {
      const stateIdE = handleInvalidStateId(value);
      dispatch(setCitiesError('stateId', stateIdE));

      setStateId(value);
   }

   const handleCountryId = (value) => {
      const countryIdE = handleInvalidCountryId(value);
      dispatch(setCitiesError('countryId', countryIdE));

      setCountryId(value);
      setStateId('');
   }

   // Submit
   const handleSubmit = (e) => {
      e.preventDefault();

      const nameE = handleInvalidName(name);
      dispatch(setCitiesError('name', nameE));

      const stateIdE = handleInvalidStateId(stateId);
      dispatch(setCitiesError('stateId', stateIdE));

      if (!nameE && !stateIdE) {
         dispatch(startUpdateCity(city.id, {name, stateId}));
      }
   }

   // Reset form
   const handleDiscard = () => {
      setName(city?.name);
      setStateId(city?.stateId);
      setCountryId(city?.state?.countryId);
      
      dispatch(setCitiesError('name', null));
      dispatch(setCitiesError('countryId', null));
      dispatch(setCitiesError('stateId', null));
   }

   return (
      <>
         <div className='row invoice-preview mt-2'>
            <div className='col-xl-9 col-md-8 col-12 position-relative'>
               <Form
                  title='Editar ciudad'
                  id={city?.id}
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
                           containerClass='col-md-4 col-12 mb-1'
                           error={nameError}
                        />

                        <Select
                           value={countryId}
                           setValue={handleCountryId}
                           title='Pa??s'
                           name='country'
                           placeholder='Seleccione un pa??s'
                           options={countriesList}
                           containerClass='col-md-4 col-12 mb-1'
                           error={countryIdError}
                           disabled={loadingCountriesList || loadingStatesList}
                        />

                        <Select
                           value={stateId}
                           setValue={handleStateId}
                           title='Estado'
                           name='state'
                           placeholder='Seleccione un estado'
                           options={filteredStates}
                           containerClass='col-md-4 col-12 mb-1'
                           error={stateIdError}
                           disabled={filteredStates.length === 0 || countryId === ''}
                        />
                     </div>
                  </div>
               </Form>

               <LoadingComponent state={loadingDetail} isBlocking />
            </div>
            
            <div className='col-xl-3 col-md-4 col-12 invoice-actions mt-md-0 mt-2'>
               <div className='card'>
                  <div className='card-body'>
                     <Link
                        to='/states'
                        className='btn btn-outline-secondary w-100 waves-effect waves-float waves-light'
                     >Volver a listado</Link>
                  </div>
               </div>
            </div>
         </div>

         <LoadingResponse state={loadingUpdate} />
      </>
   );
}



export default CitiesEdit;