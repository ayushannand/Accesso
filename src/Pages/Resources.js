import SortMenu from '../components/SortMenu'
import ResourceCard from '../components/Resources/ResourceCard';
import CreateButton from '../assets/svg/CreateButtonLogo.svg';
import CreateResourcePopup from '../components/Resources/CreateResourcePopup';
import { useSelector, useDispatch } from 'react-redux';
import { createResourcePopupToggler } from '../store';
import { fetchResourcesThunk } from '../store/slices/resourceSlice';
import { useEffect, useState } from 'react';
import { useApiErrorHandler } from '../helpers/hooks/useApiErrorHandler';
import { LoginRoute } from '../constants/constants';
import AppSwitcher from '../components/AppSwitcher';
import LoadingCard from '../components/LoadingCard';
function Resources() {
    const sortByOptions = ['Date Created', 'Name'];
    const { resourcesArray, isLoading } = useSelector((state) => state.resource);
    const [resourcesData, setResourcesData] = useState([]);
    const { accessToken, appId } = useSelector((state) => state.auth)
    const createResourcePopupVis = useSelector((state) => state.resource.createResourcePopupVis);
    const dispatch = useDispatch();
    const errorHandler = useApiErrorHandler(LoginRoute);
    const openForm = () => dispatch(createResourcePopupToggler());

    useEffect(() => {
        setResourcesData(resourcesArray);
    }, [resourcesArray]);

    useEffect(() => {
        dispatch(fetchResourcesThunk(accessToken, appId, errorHandler));
    }, [appId]);

    const handleSort = (option) => {
        let sortedResourcesData;
        switch (option) {
            case "Date Created":
                setResourcesData(resourcesArray);
                break;
            case "Name":
                sortedResourcesData = [...resourcesData].sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.localeCompare(b.name);
                    } else {
                        return 0;
                    }
                });
                setResourcesData(sortedResourcesData);
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
                            Resources
                        </div>
                        <div className='mt-[40px] px-5 flex flex-row'>
                            <AppSwitcher />
                            {/* This div is intentionally added to defer position the app switcher to slight left*/}
                            <div className='w-[10vw] h-[10px]'></div>
                        </div>
                        <div>
                            <img src={CreateButton} onClick={openForm} className="rounded-lg cursor-pointer" alt='Create Button Logo'></img>
                            {createResourcePopupVis &&
                                <CreateResourcePopup />
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

                <div className="columnLegends bg-[#e586ff10] h-[60px] rounded-lg flex flex-row items-center px-6 py-4 my-2">
                    <h3 className="w-[25%] pr-2 text-button text-[#434343]">Resource</h3>
                    <h3 className="w-[24%] pr-2 text-button text-[#434343]">Created By</h3>
                    <h3 className="w-[14%] pr-2 text-button text-[#434343]">Created On</h3>
                    <h3 className="w-[32%] pr-2 text-button text-[#434343]">Metadata</h3>
                </div>

                <div className="cards rounded-lg flex flex-col">
                    {isLoading ? <>
                        <LoadingCard pageName="resource"/>
                        </> : <>
                        {resourcesData.length > 0 && resourcesData.map((cardData) => (<ResourceCard key={cardData.id} id={cardData.id} name={cardData.name} metadata={cardData.metadata == null ? {} : cardData.metadata} createdAt={cardData.createdAt} createdBy={cardData.createdBy} />))}</>}
                </div>
            </div>
        </div>

    );
}

export default Resources;