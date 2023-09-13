import SortMenuUsers from '../components/Users/SortMenuUsers'
import UserCard from '../components/Users/UserCard';
import EmptyCard from '../components/EmptyCard';
import CreateButton from '../assets/svg/CreateButtonLogo.svg';
import CreateSingleUserPopup from '../components/Users/CreateSingleUserPopup';
import FilterSelector from '../components/Users/FilterSelector';
import { useSelector, useDispatch } from 'react-redux';
import { createSinglerUserPopupToggler, createBulkUserPopupToggler, subCreatePopupToggler, filterPopupToggler } from '../store';
import CreateBulkUserPopup from '../components/Users/CreateBulkUserPopup';
import { useEffect, useState } from 'react';
import { fetchUserThunk } from '../store/slices/userSlice';
import { fetchRoleThunk } from '../store/slices/roleSlice';
import { width } from '@mui/system';
import { useApiErrorHandler } from '../helpers/hooks/useApiErrorHandler';
import { LoginRoute } from '../constants/constants';
import AppSwitcher from '../components/AppSwitcher';
import LoadingCard from '../components/LoadingCard';

function Users() {
    const dispatch = useDispatch();
    const errorHandler = useApiErrorHandler(LoginRoute);
    const openForm = () => dispatch(subCreatePopupToggler());
    const { userArray, createSingleUserPopupVis, createBulkUserPopupVis, subCreatePopupVis, filterPopupVis, isLoading } = useSelector((state) => state.user);
    const { accessToken, appId } = useSelector((state) => state.auth)
    const [filterRoles, setFilterRoles] = useState([]);
    const [filterFirstName, setFilterFirstName] = useState("");
    const [filterLastName, setFilterLastName] = useState("");
    const [filterEmail, setFilterEmail] = useState("");
    const [userData, setUserData] = useState([]);
    const sortByOptions = ['Last Login', 'Name'];
    const queryParams = new URLSearchParams(location.search);
    const roleFilter = [queryParams.get('role')];
    useEffect(() => {
        if (roleFilter && roleFilter[0] !== null) {
            handleFilterSubmit(roleFilter);
        } else {
            setUserData(userArray);
            setFilterRoles([]);
        }
    }, [userArray]);

    useEffect(() => {
        dispatch(fetchRoleThunk(accessToken, appId, errorHandler));
        dispatch(fetchUserThunk(accessToken, appId, errorHandler));
        const queryParams = new URLSearchParams(location.search);
        const roleFilter = [queryParams.get('role')];
        if (roleFilter && roleFilter[0] !== null) {
            handleFilterSubmit(roleFilter);
        }
    }, [appId]);

    const openSingleUser = () => {
        dispatch(createSinglerUserPopupToggler());
    };

    const openMultipleUsers = () => {
        dispatch(createBulkUserPopupToggler());
    };

    const openFilterSelector = () => {
        dispatch(filterPopupToggler());
    }

    const closeFilterSelector = () => {
        dispatch(filterPopupToggler());
    }

    const clearUrl = () => {
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }

    const handleFilterSubmit = (firstName, lastName, emailAdd, filterRoles) => {
        firstName = firstName.toLowerCase();
        lastName = lastName.toLowerCase();
        emailAdd = emailAdd.toLowerCase();
        setFilterFirstName(firstName);
        setFilterLastName(lastName);
        setFilterEmail(emailAdd);

        setFilterRoles(filterRoles);

        let userArrayNew = [];
        userArray.forEach(data => {
            let val = true;
            for (let i = 0; i < filterRoles.length; i++) {
                if (!data.roles.includes(filterRoles[i])) { val = false; }
            }

            if (data.firstname !== null) {
                if (!data.firstname.toLowerCase().includes(firstName)) { val = false; }
            } else {
                if (firstName.trim() !== "") { val = false; }
            }

            if (data.lastname !== null) {
                if (!data.lastname.toLowerCase().includes(lastName)) { val = false; }
            } else {
                if (lastName.trim() !== "") { val = false; }
            }

            if (data.email !== null) {
                if (!data.email.toLowerCase().includes(emailAdd)) { val = false; }
            } else {
                if (emailAdd.trim() !== "") { val = false; }
            }

            if (val) {
                userArrayNew.push(data);
            }
        });
        setUserData(userArrayNew);
        if (filterPopupVis) closeFilterSelector();
    };

    const handleFilterReset = () => {
        clearUrl();
        handleFilterSubmit("", "", "", []);
    };

    const handleSort = (option) => {
        handleFilterReset();
        setUserData(userArray);
        let sortedUserData;
        switch (option) {
            case "Last Login":
                setUserData(userArray);
                break;
            case "Name":

                sortedUserData = [...userData].sort((a, b) => {
                    if (a.firstname && b.firstname) {
                        return a.firstname.localeCompare(b.firstname);
                    } else {
                        return 0;
                    }
                });
                setUserData(sortedUserData);
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
                            Users
                        </div>
                        <div className='mt-[40px] px-5 flex flex-row'>
                            <AppSwitcher />
                            {/* This div is intentionally added to defer position the app switcher to slight left*/}
                            <div className='w-[10vw] h-[10px]'></div>
                        </div>
                        <div>
                            <img src={CreateButton} onClick={openForm} className="rounded-lg cursor-pointer" alt='Create Button Logo'></img>
                            {subCreatePopupVis &&
                                <div className='absolute top-[66px] right-[20px] w-[280px] h-[108px] bg-white rounded-lg shadow-[0_4px_12px_rgba(0,0,0,0.16)]'>
                                    <h1 className='px-5 mt-5 text-[14px] leading-5 text-[#4B4B4B] font-[400] hover:font-[600] hover:text-[#823598] cursor-pointer' onClick={openSingleUser}>Single User Creation</h1>
                                    {createSingleUserPopupVis &&
                                        <div >
                                            <CreateSingleUserPopup />
                                        </div>
                                    }
                                    {createBulkUserPopupVis &&
                                        <div >
                                            <CreateBulkUserPopup />
                                        </div>
                                    }
                                    <div className='w-[240px] m-3 mx-5 border border-solid border-[#D9D7DA]'></div>
                                    <h1 className='px-5 mt-3 text-[14px] leading-5 text-[#4B4B4B] font-[400] hover:font-[600] hover:text-[#823598] cursor-pointer' onClick={openMultipleUsers}>Bulk User Upload</h1>
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="filterMenu bg-background_light filterMenu rounded-lg my-2 ease-in duration-300 hover:shadow-md">
                    <SortMenuUsers sortByOptions={sortByOptions} onFilterClick={openFilterSelector} onChange={handleSort} />
                    {filterRoles.length > 0 || filterFirstName.trim() !== "" || filterLastName.trim() !== "" || filterEmail.trim() !== "" ?
                        <button className={`mx-2 text-button bg-[#edc3f9] p-1 px-3 rounded-md hover:bg-primary_light absolute top-[95px] right-[130px] text-[#833598] ${width < 1000 ? 'right-[100px]' : ''} `} onClick={handleFilterReset}>Reset</button> : <></>}
                    {filterPopupVis && <div onClick={clearUrl}>
                        <FilterSelector onSubmit={handleFilterSubmit} onCancel={closeFilterSelector} selectedRoles={filterRoles} value={{firstName:filterFirstName, lastName:filterLastName, email:filterEmail}} handleFilterReset={handleFilterReset} /></div>}
                </div>

                <div className="columnLegends bg-[#e586ff10] h-[60px] rounded-lg flex flex-row items-center px-6 py-4 my-2">
                    <h3 className="w-[12%] pr-2 text-button text-[#434343]">First Name</h3>
                    <h3 className="w-[12%] pr-2 text-button text-[#434343]">Last Name</h3>
                    <h3 className="w-[26%] pr-2 text-button text-[#434343]">Email</h3>
                    <h3 className="w-[14%] pr-2 text-button text-[#434343]">Phone</h3>
                    <h3 className="w-[16%] pr-2 text-button text-[#434343]">Role</h3>
                    <h3 className="w-[20%] pr-2 text-button text-[#434343]">Last Login</h3>
                    <h3 className="w-[22px] pr-2 "></h3>
                </div>

                <div className="cards rounded-lg flex flex-col">
                    {isLoading ? <LoadingCard pageName="users" /> : <>{userData.length > 0 ?
                        userData.map((cardData) => (
                            <UserCard key={cardData.id} id={cardData.id} firstname={cardData.firstname} lastname={cardData.lastname} email={cardData.email} phone={cardData.phone} roles={cardData.roles} lastLoginTime={cardData.lastLoginTime} />
                        )) : <EmptyCard onClick={handleFilterReset} buttonName= "Reset filters" />}</>}
                </div>
            </div>
        </div>
    );
}
export default Users;