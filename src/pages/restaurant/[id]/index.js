import React, { useEffect, useState } from 'react'
import RestaurantDetails from '../../../components/restaurant-details/RestaurantDetails'
import Meta from '../../../components/Meta'
import MainApi from '../../../api/MainApi'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { CustomHeader } from '../../../api/Headers'
import { setGlobalSettings } from "@/redux/slices/global"

const index = ({ restaurantData, configData }) => {
    const { global } = useSelector((state) => state.globalSettings)
    const restaurantCoverUrl = global?.base_urls?.restaurant_cover_photo_url
    const restaurantCoverPhoto = `${restaurantCoverUrl}/${restaurantData?.cover_photo}`
    const router = useRouter();
    const dispatch = useDispatch();
    const { restaurant_zone_id } = router.query

    const [zoneId, setZoneId] = useState(undefined)

    // Get zoneId from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedZoneId = localStorage.getItem('zoneid');
                setZoneId(storedZoneId);
            } catch (error) {
                console.error('LocalStorage error:', error);
            }
        }
    }, []);

    // Set global settings
    useEffect(() => {
        if (configData) {
            dispatch(setGlobalSettings(configData))
        }
    }, [dispatch, configData]);

    // Handle maintenance mode
    useEffect(() => {
        if (configData?.maintenance_mode) {
            router.push('/maintenance');
        }
    }, [configData, router]);

    // Save zoneId in localStorage
    useEffect(() => {
        if (restaurant_zone_id && !zoneId) {
            localStorage.setItem('zoneid', JSON.stringify([Number(restaurant_zone_id)]))
        }
    }, [restaurant_zone_id, zoneId])

    // Handle missing data
    if (!restaurantData || !configData) return <div>Loading...</div>

    return (
        <>
            <Meta
                title={`${restaurantData?.meta_title ?? restaurantData?.name} - ${configData?.business_name}`}
                ogImage={`${configData?.base_urls?.restaurant_image_url}/${restaurantData?.meta_image}`}
                description={restaurantData?.meta_description}
            />
            <RestaurantDetails restaurantData={restaurantData} />
        </>
    )
}

export default index

// Fetch restaurant data on server-side
export const getServerSideProps = async (context) => {
    const id = context.query.id
    const { req } = context
    const language = req.cookies.languageSetting

    try {
        const data = await MainApi.get(`/api/v1/restaurants/details/${id}`)
        const configRes = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/config`,
            {
                method: 'GET',
                headers: {
                    'X-software-id': 33571750,
                    'X-server': 'server',
                    'X-localization': language,
                    origin: process.env.NEXT_CLIENT_HOST_URL,
                },
            }
        )
        const config = await configRes.json()

        return {
            props: {
                restaurantData: data.data,
                configData: config,
            },
        }
    } catch (error) {
        console.error("Data fetch error:", error)
        return {
            props: {
                restaurantData: null,
                configData: null,
            },
        }
    }
}
