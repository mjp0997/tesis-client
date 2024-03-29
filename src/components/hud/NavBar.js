import { useDispatch, useSelector } from 'react-redux';



// Actions
import { startSetTheme, toggleSidebar } from '../../actions/ui';



// Components
import Icon from '../ui/Icon';
import UserNavBarDropdown from '../ui/UserNavBarDropdown';



const NavBar = () => {

   const dispatch = useDispatch();

   const { sidebar, theme } = useSelector(state => state.ui);

   const handleClick = (e) => {
      e.preventDefault();

      dispatch(toggleSidebar(!sidebar));
   }

   const handleTheme = (e) => {
      e.preventDefault();

      dispatch(startSetTheme(!theme));
   }

   return (
      <nav className={`header-navbar navbar navbar-expand-lg align-items-center floating-nav navbar-shadow container-xxl ${theme ? 'navbar-dark' : 'navbar-light'}`}>
         <div className='navbar-container d-flex content'>
            <div className='bookmark-wrapper d-flex align-items-center'>
               <ul className='nav navbar-nav d-xl-none'>
                  <li className='nav-item'>
                     <a
                        className='nav-link menu-toggle'
                        href='/#'
                        onClick={handleClick}
                     >
                        <Icon icon='Menu' />
                     </a>
                  </li>
               </ul>

               <ul className='nav navbar-nav'>
                  <li className='nav-item d-none d-lg-block'>
                     <a className='nav-link nav-link-style' href='/#' onClick={handleTheme}>
                        <Icon icon={theme ? 'Sun' : 'Moon'} />
                     </a>
                  </li>
               </ul>
            </div>

            <ul className='nav navbar-nav align-items-center ms-auto'>
               <UserNavBarDropdown />
            </ul>
         </div>
      </nav>
   );
}



export default NavBar;