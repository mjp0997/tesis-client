import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';



// Actions
import { setPerPage } from '../../actions/tables';
import { usePagination } from '../../hooks/usePagination';



const RowsQuantityPicker = ({className}) => {
   
   const dispatch = useDispatch();

   const { perPage } = useSelector(state => state.tables);

   const { handlePage } = usePagination();

   useEffect(() => {
      const storedQty = localStorage.getItem('per-page');

      const numberQty = Number(storedQty || 10);

      dispatch(setPerPage(numberQty));
   }, [dispatch]);

   const handleQuantity = (e) => {
      dispatch(setPerPage(Number(e.target.value)));

      localStorage.setItem('per-page', Number(e.target.value));

      handlePage(1);
   }

   return (
      <div className={`col-6 col-lg-2 ${className}`}>
         <div className='d-flex align-items-center gap-1'>
            <label>Mostrar</label>

            <select
               className='form-select'
               style={{minWidth: '5rem'}}
               value={perPage}
               onChange={handleQuantity}
            >
               <option value={10}>10</option>

               <option value={25}>25</option>

               <option value={50}>50</option>

               <option value={100}>100</option>
            </select>
         </div>
      </div>
   );
}



RowsQuantityPicker.propTypes = {
   className: PropTypes.string
}

RowsQuantityPicker.defaultProps = {
   className: ''
}



export default RowsQuantityPicker;