import { arrayErrorToast, simpleConfirmDialog, simpleSuccessToast } from '../helpers/alerts';
import { capitalizeAllWords } from '../helpers/format';
import { getPaginationQuery } from '../helpers/pagination';
import { request } from '../helpers/request';
import { types } from '../reducers/countriesReducer';



// Actions

export const setLoading = (key, state) => ({
   type: types.SET_LOADING,
   payload: { key, state }
});

export const setCountriesError = (key, error) => ({
   type: types.SET_ERROR,
   payload: { key, error }
});

export const startCreateCountry = ({ name, locale, phoneExtension }, navigate) => {
   return async dispatch => {
      dispatch(setLoading('create', true));

      try {
         const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

         const response = await request({
            path: '/countries',
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'x-token': token
            },
            body: {
               name, locale, phoneExtension
            }
         });

         const { id, name: createdName } = response.data;

         const countryName = capitalizeAllWords(createdName);

         simpleSuccessToast(`El país: ${countryName}, fue creado satisfactoriamente`);

         navigate(`/countries/${id}`);
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         dispatch(setCountriesError('name', errors.find(err => err.param === 'name')?.msg || null));
         dispatch(setCountriesError('locale', errors.find(err => err.param === 'locale')?.msg || null));
         dispatch(setCountriesError('phoneExtension', errors.find(err => err.param === 'phoneExtension')?.msg || null));

         const unhandledErrors = errors.filter(error => !['name', 'locale', 'phoneExtension'].includes(error.param));

         if (unhandledErrors.length > 0) {
            arrayErrorToast(unhandledErrors.map(error => error.msg));
         }
      }

      dispatch(setLoading('create', false));
   }
}

export const setCountries = (rows, count, pages) => ({
   type: types.SET_COUNTRIES,
   payload: { rows, count, pages }
});

export const startGetCountries = (page, perPage) => {
   return async dispatch => {
      dispatch(setLoading('table', true));

      try {
         const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

         const response = await request({
            path: `/countries?${getPaginationQuery(page, perPage)}`,
            headers: {
               'Content-Type': 'application/json',
               'x-token': token
            }
         });

         const { rows, count, pages } = response.data;

         const mappedRows = rows.map(row => ({
            ...row,
            name: capitalizeAllWords(row.name)
         }));

         dispatch(setCountries(mappedRows, count, pages));
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         arrayErrorToast(errors.map(error => error.msg));
      }
      
      dispatch(setLoading('table', false));
   }
}

export const startDeleteCountry = (id, { page, perPage, navigate }) => {
   return async dispatch => {
      try {
         const { isConfirmed } = await simpleConfirmDialog('warning', '¿Está seguro?', '¿Desea eliminar el país seleccionado?');

         if (isConfirmed) {
            dispatch(setLoading('delete', true));

            const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

            const response = await request({
               path: `/countries/${id}`,
               method: 'DELETE',
               headers: {
                  'Content-Type': 'application/json',
                  'x-token': token
               }
            });

            const { name } = response.data;

            const countryName = capitalizeAllWords(name);

            simpleSuccessToast(`El país: ${countryName}, fue eliminado satisfactoriamente`);

            if (!navigate) {
               dispatch(startGetCountries(page, perPage));
            } else {
               navigate('/countries');
            }
         }
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         arrayErrorToast(errors.map(error => error.msg));
      }

      dispatch(setLoading('delete', false));
   }
}

export const setCountry = (country) => ({
   type: types.SET_COUNTRY_DATA,
   payload: country
});

export const startGetCountry = (id) => {
   return async dispatch => {
      dispatch(setLoading('detail', true));

      try {
         const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

         const response = await request({
            path: `/countries/${id}`,
            headers: {
               'Content-Type': 'application/json',
               'x-token': token
            }
         });

         const country = response.data;

         country.name = capitalizeAllWords(country.name);

         dispatch(setCountry(country));
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         arrayErrorToast(errors.map(error => error.msg));
      }
      
      dispatch(setLoading('detail', false));
   }
}

export const startUpdateCountry = (id, { name, locale, phoneExtension }) => {
   return async dispatch => {
      dispatch(setLoading('update', true));

      try {
         const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

         const response = await request({
            path: `/countries/${id}`,
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               'x-token': token
            },
            body: { name, locale, phoneExtension }
         });

         const country = response.data;

         const countryName = capitalizeAllWords(country.name);

         simpleSuccessToast(`El país: ${countryName}, fue actualizado satisfactoriamente`);

         dispatch(setCountry(country));
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         dispatch(setCountriesError('name', errors.find(err => err.param === 'name')?.msg || null));
         dispatch(setCountriesError('locale', errors.find(err => err.param === 'locale')?.msg || null));
         dispatch(setCountriesError('phoneExtension', errors.find(err => err.param === 'phoneExtension')?.msg || null));

         const unhandledErrors = errors.filter(error => !['name', 'locale', 'phoneExtension'].includes(error.param));

         if (unhandledErrors.length > 0) {
            arrayErrorToast(unhandledErrors.map(error => error.msg));
         }
      }

      dispatch(setLoading('update', false));
   }
}

export const setCountriesList = (rows) => ({
   type: types.SET_COUNTRIES_LIST,
   payload: rows
});

export const startGetCountriesList = () => {
   return async dispatch => {
      dispatch(setLoading('list', true));

      try {
         const token = localStorage.getItem('x-token') || sessionStorage.getItem('x-token');

         const response = await request({
            path: '/countries',
            headers: {
               'Content-Type': 'application/json',
               'x-token': token
            }
         });

         const rows = response.data;

         const mappedRows = rows.map(row => ({
            text: capitalizeAllWords(row.name),
            value: row.id,
            locale: row.locale,
            phoneExtension: row.phoneExtension
         }));

         dispatch(setCountriesList(mappedRows));
      } catch (error) {
         console.log(error);

         const { errors } = error.response.data;

         arrayErrorToast(errors.map(error => error.msg));
      }
      
      dispatch(setLoading('list', false));
   }
}