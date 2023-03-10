import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';



// Actions
import { setCountriesError, startCreateCountry } from '../../../actions/countries';
import { setBreadcrumb } from '../../../actions/ui';



// Components
import Form from '../../../components/form/Form';
import Input from '../../../components/form/Input';
import LoadingResponse from '../../../components/ui/spinners/LoadingResponse';
import Select from '../../../components/form/Select';



// Helpers
import { handleInvalidName } from '../../../helpers/validations';



// Data
import locales from '../../../data/locales.json';



const CountriesCreate = () => {

   const dispatch = useDispatch();

   const navigate = useNavigate();

   const { nameError, localeError, phoneExtensionError, loadingCreate } = useSelector(state => state.countries);

   const [name, setName] = useState('');
   const [phoneExtension, setPhoneExtension] = useState('');
   const [locale, setLocale] = useState('');

   useEffect(() => {
      dispatch(setBreadcrumb([
         {
            link: '/',
            text: 'Dashboard'
         },
         {
            link: '/countries',
            text: 'Países'
         },
         {
            text: 'Crear'
         }
      ]));
   }, [dispatch]);

   useEffect(() => {
      return () => {
         setName('');
         setPhoneExtension('');
         setLocale('');
         
         dispatch(setCountriesError('name', null));
         dispatch(setCountriesError('locale', null));
         dispatch(setCountriesError('phoneExtension', null));
         
         dispatch(setBreadcrumb([]));
      }
   }, [dispatch]);

   // Errors and valids
   const handleInvalidLocale = (locale) => {
      if (locale === '') {
         return 'El código local es obligatorio';
      } else {
         return null;
      }
   }

   const handleInvalidPhoneExtension = (phoneExtension) => {
      if (phoneExtension.trim().length === 0) {
         return 'La extensión telefónica es obligatoria';
      } else if (!/^\+([0-9]+$)/.test(phoneExtension)) {
         return 'El formato es inválido. Ejemplo: +58'
      } else {
         return null;
      }
   }

   // Handlers
   const handleName = (value) => {
      const nameE = handleInvalidName(value);
      dispatch(setCountriesError('name', nameE));

      setName(value);
   }

   const handleLocale = (value) => {
      const localeE = handleInvalidLocale(value);
      dispatch(setCountriesError('locale', localeE));

      setLocale(value);
   }

   const handlePhoneExtension = (value) => {
      const phoneExtensionE = handleInvalidPhoneExtension(value);
      dispatch(setCountriesError('phoneExtension', phoneExtensionE));

      setPhoneExtension(value);
   }

   // Submit
   const handleSubmit = (e) => {
      e.preventDefault();

      const nameE = handleInvalidName(name);
      dispatch(setCountriesError('name', nameE));

      const localeE = handleInvalidLocale(locale);
      dispatch(setCountriesError('locale', localeE));

      const phoneExtensionE = handleInvalidPhoneExtension(phoneExtension);
      dispatch(setCountriesError('phoneExtension', phoneExtensionE));

      if (!nameE && !localeE && !phoneExtensionE) {
         dispatch(startCreateCountry({name, locale, phoneExtension}, navigate));
      }
   }

   // Reset form
   const handleDiscard = () => {
      setName('');
      setPhoneExtension('');
      setLocale('');
      
      dispatch(setCountriesError('name', null));
      dispatch(setCountriesError('locale', null));
      dispatch(setCountriesError('phoneExtension', null));
   }

   return (
      <>
         <div className='row invoice-preview mt-2'>
            <div className='col-xl-9 col-md-8 col-12'>
               <Form
                  title='Crear país'
                  handleSubmit={handleSubmit}
                  handleDiscard={handleDiscard}
               >
                  <div className='card-body invoice-padding py-0'>
                     <div className='row'>
                        <Input
                           value={name}
                           setValue={handleName}
                           title={'Nombre'}
                           placeholder='Ingrese el nombre del país'
                           containerClass='col-md-4 col-12 mb-1'
                           error={nameError}
                        />

                        <Select
                           value={locale}
                           setValue={handleLocale}
                           title='Código local'
                           name='locale'
                           placeholder='Seleccione un código'
                           options={locales.map(loc => ({ value: loc, text: loc}))}
                           containerClass='col-md-4 col-12 mb-1'
                           error={localeError}
                        />

                        <Input
                           value={phoneExtension}
                           setValue={handlePhoneExtension}
                           title={'Extensión telefónica'}
                           placeholder='Ingrese la extensión telefónica. Ejemplo: +58'
                           containerClass='col-md-4 col-12 mb-1'
                           error={phoneExtensionError}
                        />
                     </div>
                  </div>
               </Form>
            </div>
            
            <div className='col-xl-3 col-md-4 col-12 invoice-actions mt-md-0 mt-2'>
               <div className='card'>
                  <div className='card-body'>
                     <Link
                        to='/countries'
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



export default CountriesCreate;