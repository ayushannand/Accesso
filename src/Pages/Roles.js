import SortMenu from '../components/SortMenu';
import CreateButton from '../assets/svg/CreateButtonLogo.svg';
import CreateRolePopup from '../components/Roles/CreateRolePopup';
import RolesCard from '../components/Roles/RolesCard';
import { useSelector, useDispatch } from 'react-redux';
import { createRolePopupToggler } from '../store';
import { useEffect, useState } from 'react';
import { fetchRoleThunk } from '../store/slices/roleSlice';
import { fetchPermissionThunk } from '../store/slices/permissionSlice';
import { fetchResourcesThunk } from '../store/slices/resourceSlice';
import { useApiErrorHandler } from '../helpers/hooks/useApiErrorHandler';
import { LoginRoute } from '../constants/constants';
import AppSwitcher from '../components/AppSwitcher';
import LoadingCard from '../components/LoadingCard';

function Roles() {
    const dispatch = useDispatch();
    const openForm = () => dispatch(createRolePopupToggler());
    const {rolesArray, createRolePopupVis, isLoading} = useSelector((state) => state.role);
    const [rolesData,setRolesData] = useState([]);
    const {accessToken, appId} = useSelector((state)=>state.auth)
    const sortByOptions = ['Date Created','Name'];
    const errorHandler = useApiErrorHandler(LoginRoute);

    useEffect(() => {
        setRolesData(rolesArray);
    }, [rolesArray]);

    useEffect(() => {
        dispatch(fetchPermissionThunk(accessToken, appId, errorHandler));
        dispatch(fetchResourcesThunk(accessToken, appId, errorHandler));
        dispatch(fetchRoleThunk(accessToken, appId, errorHandler));
    },  [appId]);

    const handleSort = (option) => {
        let sortedRolesData;
        switch (option) {
            case "Date Created":
                setRolesData(rolesArray);
                break;
            case "Name":
                sortedRolesData = [...rolesData].sort((a, b) => {
                    if (a.name && b.name) {
                      return a.name.localeCompare(b.name);
                    } else {
                      return 0;
                    }
                  });
                setRolesData(sortedRolesData);
                break;
            default:
                break;
        }
    }
    return (
        <div>
            <div className="flex flex-col px-4 pt-2 pb-4 h-[76px]">
            <div className="topBar">
                <div className="flex justify-between items-center h-[60px]">

                    <div className="text-subtitle1 leading-[30px] font-[500] pl-[24px]  text-black">
                        Roles
                    </div>
                    <div className='mt-[40px] px-5 flex flex-row'>
                                <AppSwitcher />
                                {/* This div is intentionally added to defer position the app switcher to slight left*/}
                                <div className='w-[10vw] h-[10px]'></div>
                    </div>
                    <div>
                        <img src={CreateButton} onClick={openForm} className="rounded-lg cursor-pointer" alt='Create Button Logo'></img>
                        {createRolePopupVis &&
                            <CreateRolePopup />
                        }
                    </div>
                </div>
            </div>

            <div className="filterMenu bg-background_light filterMenu rounded-lg my-2 ease-in duration-300 hover:shadow-md">
                <SortMenu
                    sortByOptions={sortByOptions}
                    onChange={handleSort}
                />

            </div>

            <div className="columnLegends bg-[#e586ff10] h-[60px] rounded-lg flex flex-row items-center px-6 py-4 my-2 justify-between">
                <h3 className="min-w-[15%] pr-2 text-button text-[#434343] overflow-hidden">Role</h3>
                <h3 className="min-w-[15%] pr-2 text-button text-[#434343]">Child Role</h3>
                <div className="flex flex-row w-[45%]">
                    <h3 className="w-[25%] xl:w-[22%] min-w-[80px] pr-2 text-button text-[#434343] overflow-hidden">Permissions</h3>
                    <h3 className="pr-2 text-button text-[#434343]">Resources</h3>
                </div>
                <div className='w-[230px]'></div>  
                {/* // div to take the place of card function buttons */}
            </div>

            <div className="cards rounded-lg flex flex-col">
                {isLoading ? 
                <LoadingCard pageName="roles" /> : <>{rolesData.length > 0 && rolesData.map((cardData) => (
                    <RolesCard key={cardData.id} id = {cardData.id} name = {cardData.name} permission = {cardData.permission} childrenRoles = {cardData.childrenRoles} metadata = {cardData.metadata == null ? {} : cardData.metadata} createdBy = {cardData.createdBy}/>
                ))}</>}
            </div>
        </div>
        </div>

    );
}

export default Roles;