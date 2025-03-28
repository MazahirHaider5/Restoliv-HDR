import CloseIcon from '@mui/icons-material/Close'
import {
    Box,
    Button,
    Modal,
    Stack,
    TextField,
    Typography,
    styled,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { GoogleApi } from '../../../hooks/react-query/config/googleApi'
import MapComponent from './MapComponent'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    padding: '1rem',
    width: '845px',
    background: '#FFFFFF',
    borderRadius: '5px',
}
const CssTextField = styled(TextField)({
    '& label.Mui-focused': {
        color: '#00add4',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#00add4',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#00add4',
        },
        '&:hover fieldset': {
            borderColor: '#00add4',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#00add4',
        },
    },
})
const MapModal = ({ open, handleClose, latitude, longitude, address }) => {
    const { global } = useSelector((state) => state.globalSettings)

    const [searchKey, setSearchKey] = useState('')
    const [enabled, setEnabled] = useState(false)
    const [predictions, setPredictions] = useState([])
    const [placeDetailsEnabled, setPlaceDetailsEnabled] = useState(false)
    const [locationEnabled, setLocationEnabled] = useState(false)
    const [placeId, setPlaceId] = useState('')
    const [location, setLocation] = useState(global?.default_location)
    const [zoneId, setZoneId] = useState(undefined)
    const [isLoadingCurrentLocation, setLoadingCurrentLocation] =
        useState(false)
    const [currentLocation, setCurrentLocation] = useState(undefined)

    const {
        isLoading,
        data: places,
        isError,
        error,
        // refetch: placeApiRefetch,
    } = useQuery(
        ['places', searchKey],
        async () => GoogleApi.placeApiAutocomplete(searchKey),
        { enabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )
    if (error) {
        setPredictions([])
        setEnabled(false)
    }

    const {
        isLoading: isLoading2,
        data: placeDetails,
        isError: isErrorTwo,
        error: errorTwo,
        refetch: placeApiRefetchOne,
    } = useQuery(
        ['placeDetails', placeId],
        async () => GoogleApi.placeApiDetails(placeId),
        { enabled: placeDetailsEnabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )

    const {
        isLoading: locationLoading,
        data: zoneData,
        isError: isErrorLocation,
        error: errorLocation,
        refetch: locationRefetch,
    } = useQuery(
        ['zoneId', location],
        async () => GoogleApi.getZoneId(location),
        { enabled: locationEnabled },
        {
            retry: 1,
            // cacheTime: 0,
        }
    )

    if (isErrorLocation) {
    }

    // if (zoneData) {

    // }
    useEffect(() => {
        if (zoneData) {
            setZoneId(zoneData?.data?.zone_id)
            //  setLocation(undefined)
            setLocationEnabled(false)
        }
        if (!zoneData) {
            setZoneId(undefined)
        }
    }, [zoneData])
    useEffect(() => {
        if (placeDetails) {
            setLocation(placeDetails?.data?.result?.geometry?.location)
            setLocationEnabled(true)
        }
    }, [placeDetails])
    useEffect(() => {
        if (places) {
            setPredictions(places?.data?.predictions)
        }
    }, [places])
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (zoneId) {
                localStorage.setItem('zoneid', zoneId)
            }
        }
    }, [zoneId])

    const [isDisablePickButton, setDisablePickButton] = useState(false)
    const PrimaryButton = styled(Button)(({ theme }) => ({
        color: '#fff',
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        },
    }))

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            disableAutoFocus={true}
        >
            <Box sx={style} className="modalresposive">
                <Box
                    spacing={2}
                    className="mapsearch"
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <button onClick={handleClose} className="closebtn">
                        <CloseIcon sx={{ fontSize: '16px' }} />
                    </button>
                </Box>
                <Stack paddingTop>
                    <Typography align="center">{address}</Typography>
                </Stack>

                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <MapComponent latitude={latitude} longitude={longitude} />
                </Typography>
            </Box>
        </Modal>
    )
}

export default MapModal
