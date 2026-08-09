import { cn } from '@/lib/utils';
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { LatLng } from 'leaflet';
import { Loader2 } from 'lucide-react';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { GeocodeHit } from '../types/index';

import { getDisplayName } from '@/lib/utils';

interface AddressComBoxProps {
    initialAddress: string | null;
    position: LatLng;
    selectedAddress: string | null;
    setPosition: React.Dispatch<SetStateAction<LatLng>>;
    setSelectedAddress: React.Dispatch<SetStateAction<string | null>>;
    submit: () => void;
    loading?: boolean;
}

const API_KEY = '0ff16599-5a92-4b5a-8bed-d051d277d043';

const findAddress = async (query: string): Promise<GeocodeHit[]> => {
    try {
        const { data } = await axios.get(`https://graphhopper.com/api/1/geocode`, { params: { q: query, limit: 5, key: API_KEY } });
        return data.hits;
    } catch (error) {
        console.error('Geocoding failed:', error);
        return [];
    }
};

export default function AddressComboBox({ initialAddress, position, selectedAddress, setSelectedAddress, setPosition, submit, loading = false }: AddressComBoxProps) {
    const { props } = usePage<{ location_type: string }>();

    const [query, setQuery] = useState('');
    const [addressList, setAddressList] = useState<GeocodeHit[]>([]);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (query.length <= 5) {
            setAddressList([]);
            setSearching(false);
            return;
        }

        setSearching(true);
        const handler = setTimeout(async () => {
            const results = await findAddress(query);
            setAddressList(results);
            setSearching(false);
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        if (selectedAddress && position) {
            submit();
        }
    }, [selectedAddress]);

    const handleSelect = (value: { selectedAddress: string | null; position: LatLng } | null) => {
        if (!value || !value.selectedAddress) return;

        setSelectedAddress(value.selectedAddress);
        setPosition(value.position);
    };

    const isLoading = loading || searching;

    return (
        <Combobox value={{ selectedAddress, position }} onChange={handleSelect}>
            <div className="relative flex gap-2">
                <ComboboxInput
                    className={cn(
                        'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
                        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
                        'shadow-none focus-visible:ring-[0px]',
                        isLoading && 'pr-9',
                    )}
                    placeholder={isLoading ? 'Resolving address...' : `Enter ${props.location_type ?? 'pickup'} address`}
                    displayValue={(item: { selectedAddress: string | null; position: LatLng } | null) => item?.selectedAddress ?? ''}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {isLoading && (
                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            <ComboboxOptions className="absolute top-[100px] z-99 mt-1 max-h-96 w-full overflow-auto rounded-md border bg-white shadow-lg">
                {addressList.map((address, index) => (
                    <ComboboxOption
                        key={index}
                        value={{
                            selectedAddress: getDisplayName(address),
                            position: address.point,
                        }}
                        className="cursor-pointer px-4 py-2 data-[focus]:bg-blue-100"
                    >
                        <div>
                            {address.name} <br />
                            <span className="text-xs">{getDisplayName(address)}</span>
                        </div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
}
